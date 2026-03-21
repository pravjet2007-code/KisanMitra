from fastapi import FastAPI, Depends, HTTPException, status, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import database
import models
import schemas
import auth
from typing import Optional

# Create the database tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="KisanMitra Backend", description="Serving the Farmer Dashboard")

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
