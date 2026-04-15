import argparse
import numpy as np
import tensorflow as tf
import os
import joblib

def load_and_preprocess_image(filepath):
    """Loads and preprocesses an image for MobileNetV2."""
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Image not found at: {filepath}")
    
    # Read the image
    img = tf.io.read_file(filepath)
    img = tf.image.decode_jpeg(img, channels=3)
    
    # Resize to 224x224 as expected by the model
    img = tf.image.resize(img, [224, 224])
    
    # Preprocess for MobileNetV2
    img = tf.keras.applications.mobilenet_v2.preprocess_input(img)
    
    # Expand dimensions to create a batch of 1 (1, 224, 224, 3)
    img_array = tf.expand_dims(img, 0)
    return img_array

def predict_disease(image_path, model_path='best_plant_model.keras', label_encoder_path='label_encoder.pkl'):
    """Predicts the disease from an image."""
    
    print(f"Loading model from {model_path}...")
    if not os.path.exists(model_path):
        print(f"Error: Model not found at '{model_path}'. Did you train and save the model in the Jupyter Notebook first?")
        return
        
    try:
        model = tf.keras.models.load_model(model_path)
    except Exception as e:
        print(f"Error loading model: {e}")
        return

    print(f"Loading label encoder from {label_encoder_path}...")
    if not os.path.exists(label_encoder_path):
        print(f"Error: Label encoder not found at '{label_encoder_path}'. Ensure it was saved during training.")
        return
        
    try:
        le = joblib.load(label_encoder_path)
    except Exception as e:
        print(f"Error loading label encoder: {e}")
        return

    print("Preprocessing image...")
    try:
        img_array = load_and_preprocess_image(image_path)
    except FileNotFoundError as e:
        print(e)
        return
    except Exception as e:
        print(f"Error processing image: {e}")
        return

    print("Running inference...\n")
    predictions = model.predict(img_array, verbose=0)
    
    # Get the highest confidence prediction
    predicted_class_index = np.argmax(predictions, axis=1)[0]
    confidence = predictions[0][predicted_class_index] * 100
    
    # Decode the index to the actual string label
    predicted_label = le.inverse_transform([predicted_class_index])[0]
    
    print("="*50)
    print(f"Final Prediction: {predicted_label}")
    print(f"Confidence:       {confidence:.2f}%")
    print("="*50)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Predict Plant Disease from an Image.")
    parser.add_argument("image_path", type=str, help="Absolute or relative path to the leaf image.")
    args = parser.parse_args()
    
    predict_disease(args.image_path)
