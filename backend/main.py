from fastapi import FastAPI, Depends, HTTPException, status, Header, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os
import joblib
import numpy as np
try:
    import tensorflow as tf
except ImportError:
    tf = None
import database
import models
import schemas
import auth
from typing import Optional

# Create the database tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="KisanMitra Backend", description="Serving the Farmer Dashboard")

# ML Models Globals
ml_model = None
label_encoder = None

def load_ml_models():
    global ml_model, label_encoder
    # Paths relative to the backend folder (assuming models are in the parent directory)
    model_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'best_plant_model.keras')
    le_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'label_encoder.pkl')
    
    if tf is not None and os.path.exists(model_path) and ml_model is None:
        try:
            # We use compile=False to avoid needing custom loss functions like SparseFocalLoss for pure inference
            ml_model = tf.keras.models.load_model(model_path, compile=False)
            print(f"Loaded ML model from {model_path}")
        except Exception as e:
            print(f"Error loading model: {e}")
            
    if os.path.exists(le_path) and label_encoder is None:
        try:
            label_encoder = joblib.load(le_path)
            print(f"Loaded Label Encoder from {le_path}")
        except Exception as e:
            print(f"Error loading label encoder: {e}")

@app.on_event("startup")
async def startup_event():
    load_ml_models()

# CORS Configuration for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to verify JWT
def get_current_user(authorization: Optional[str] = Header(None), db: Session = Depends(database.get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    token = authorization.split(" ")[1]
    payload = auth.decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token expired or invalid")
    
    user = db.query(models.User).filter(models.User.phone == payload.get("sub")).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.post("/api/auth/send-otp")
def send_otp(request: schemas.SendOTPRequest):
    # In a real app, integrate Twilio / MSG91 here.
    # For now, we mock the OTP as 123456
    print(f"DEBUG: Sending OTP 123456 to {request.phone}")
    return {"message": "OTP sent successfully"}

@app.post("/api/auth/verify-otp", response_model=schemas.Token)
def verify_otp(request: schemas.VerifyOTPRequest, db: Session = Depends(database.get_db)):
    print(f"DEBUG: Received OTP '{request.otp}' for phone {request.phone}")
    # Mock validation
    if request.otp != "123456":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OTP")
    
    user = db.query(models.User).filter(models.User.phone == request.phone).first()
    
    if not user:
        # Register new farmer
        user = models.User(phone=request.phone, role="farmer")
        db.add(user)
        db.commit()
        db.refresh(user)

    is_complete = bool(user.name and user.location and user.crop_type)
    
    access_token = auth.create_access_token(data={"sub": user.phone})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "is_profile_complete": is_complete
    }

@app.get("/api/user/profile", response_model=schemas.UserResponse)
def get_profile(current_user: models.User = Depends(get_current_user)):
    return current_user

@app.put("/api/user/profile", response_model=schemas.UserResponse)
def update_profile(profile: schemas.ProfileUpdate, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    current_user.name = profile.name
    current_user.location = profile.location
    current_user.farm_size = profile.farm_size
    current_user.crop_type = profile.crop_type
    current_user.preferred_language = profile.preferred_language
    
    db.commit()
    db.refresh(current_user)
    return current_user

@app.get("/")
def health_check():
    return {"status": "online", "message": "KisanMitra API is running"}

@app.post("/api/predict")
async def predict_disease(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image.")
        
    if ml_model is None or label_encoder is None:
        load_ml_models()
        if ml_model is None or label_encoder is None:
            raise HTTPException(status_code=503, detail="ML model is currently unavailable on the server.")
            
    try:
        contents = await file.read()
        
        # Preprocess the image directly from memory using TensorFlow
        img = tf.io.decode_image(contents, channels=3, expand_animations=False)
        img = tf.image.resize(img, [224, 224])
        
        # Apply MobileNetV2 normalizations
        img = tf.keras.applications.mobilenet_v2.preprocess_input(img)
        img_array = tf.expand_dims(img, 0)
        
        # Run inference
        predictions = ml_model.predict(img_array, verbose=0)
        predicted_class_index = np.argmax(predictions, axis=1)[0]
        confidence = float(predictions[0][predicted_class_index]) * 100
        
        predicted_label = label_encoder.inverse_transform([predicted_class_index])[0]
        
        return {
            "success": True,
            "disease_name": predicted_label,
            "confidence": confidence
        }
        
    except Exception as e:
        print(f"Inference error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to process image: {str(e)}")
