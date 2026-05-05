import os
import io
import numpy as np
import tensorflow as tf
import joblib
from fastapi import APIRouter, UploadFile, File, HTTPException
from PIL import Image

router = APIRouter()

@tf.keras.utils.register_keras_serializable(package='KisanMitra')
class SparseFocalLoss(tf.keras.losses.Loss):
    def __init__(self, gamma=2.0, alpha=0.25, name='sparse_focal_loss', **kwargs):
        super().__init__(name=name, **kwargs)
        self.gamma = gamma
        self.alpha = alpha

    def call(self, y_true, y_pred):
        y_true  = tf.cast(y_true, tf.int32)
        y_pred  = tf.clip_by_value(y_pred, 1e-7, 1.0)
        one_hot = tf.one_hot(y_true, depth=tf.shape(y_pred)[-1])
        ce      = -tf.reduce_sum(one_hot * tf.math.log(y_pred), axis=-1)
        p_t     = tf.reduce_sum(one_hot * y_pred, axis=-1)
        focal_weight = self.alpha * tf.pow(1.0 - p_t, self.gamma)
        return tf.reduce_mean(focal_weight * ce)

    def get_config(self):
        cfg = super().get_config()
        cfg.update({'gamma': self.gamma, 'alpha': self.alpha})
        return cfg

# Paths to the model and label encoder (relative to the root of the project)
MODEL_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../best_plant_model.keras"))
LABEL_ENCODER_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../label_encoder.pkl"))

# Global variables for the model and label encoder
model = None
label_encoder = None

def load_ml_resources():
    global model, label_encoder
    if model is None:
        if not os.path.exists(MODEL_PATH):
            print(f"Warning: Model not found at {MODEL_PATH}")
            return False
        # Inject custom loss class into custom_objects
        model = tf.keras.models.load_model(
            MODEL_PATH, 
            custom_objects={"SparseFocalLoss": SparseFocalLoss}
        )
        print(f"Successfully loaded ML model from {MODEL_PATH}")
    
    if label_encoder is None:
        if not os.path.exists(LABEL_ENCODER_PATH):
            print(f"Warning: Label encoder not found at {LABEL_ENCODER_PATH}")
            return False
        label_encoder = joblib.load(LABEL_ENCODER_PATH)
        print(f"Successfully loaded Label Encoder from {LABEL_ENCODER_PATH}")
    
    return True

# Load resources on startup
load_ml_resources()

def preprocess_image(image_bytes):
    """Preprocesses the uploaded image bytes for MobileNetV2."""
    img = Image.open(io.BytesIO(image_bytes))
    img = img.convert("RGB")
    img = img.resize((224, 224))
    
    img_array = np.array(img)
    # Preprocess for MobileNetV2: scale to [-1, 1]
    img_array = tf.keras.applications.mobilenet_v2.preprocess_input(img_array)
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

@router.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Predicts plant disease from an uploaded image.
    """
    if not load_ml_resources():
        raise HTTPException(status_code=500, detail="ML resources not available on server")

    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    try:
        contents = await file.read()
        img_array = preprocess_image(contents)
        
        predictions = model.predict(img_array, verbose=0)
        predicted_class_index = np.argmax(predictions, axis=1)[0]
        confidence = float(predictions[0][predicted_class_index]) * 100
        
        predicted_label = label_encoder.inverse_transform([predicted_class_index])[0]
        
        return {
            "success": True,
            "disease_name": predicted_label,
            "confidence": confidence
        }
    except Exception as e:
        print(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

