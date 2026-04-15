import json
import os

notebook = {
 "cells": [
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "# End-to-End Plant Disease Classification Pipeline\n",
    "\n",
    "This notebook contains the complete pipeline for image classification using the PlantVillage dataset."
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## Phase 1: Exploratory Data Analysis (EDA) & Setup\n",
    "Here we map image paths to disease classes, check class distribution, and visualize."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": None,
   "metadata": {},
   "outputs": [],
   "source": [
    "import os\n",
    "import matplotlib.pyplot as plt\n",
    "import numpy as np\n",
    "import pandas as pd\n",
    "import cv2\n",
    "\n",
    "dataset_dir = r\"c:\\Users\\pravin sharma\\Documents\\GitHub\\KisanMitra\\PlantVillage\"\n",
    "\n",
    "# Map image paths to classes\n",
    "image_paths = []\n",
    "labels = []\n",
    "for folder in os.listdir(dataset_dir):\n",
    "    folder_path = os.path.join(dataset_dir, folder)\n",
    "    if os.path.isdir(folder_path):\n",
    "        for img in os.listdir(folder_path):\n",
    "            if img.lower().endswith(('.png', '.jpg', '.jpeg')):\n",
    "                image_paths.append(os.path.join(folder_path, img))\n",
    "                labels.append(folder)\n",
    "\n",
    "df = pd.DataFrame({'filepath': image_paths, 'label': labels})\n",
    "print(f\"Total images found: {len(df)}\")"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": None,
   "metadata": {},
   "outputs": [],
   "source": [
    "# Class distribution bar chart\n",
    "class_counts = df['label'].value_counts()\n",
    "plt.figure(figsize=(12, 6))\n",
    "class_counts.plot(kind='bar')\n",
    "plt.title('Class Distribution in PlantVillage Dataset')\n",
    "plt.xlabel('Disease Class')\n",
    "plt.ylabel('Number of Images')\n",
    "plt.xticks(rotation=90)\n",
    "plt.tight_layout()\n",
    "plt.show()"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": None,
   "metadata": {},
   "outputs": [],
   "source": [
    "# Sample image grid\n",
    "plt.figure(figsize=(10, 10))\n",
    "sample_df = df.groupby('label').apply(lambda x: x.sample(1)).reset_index(drop=True)\n",
    "for i, row in enumerate(sample_df.head(9).itertuples()):\n",
    "    plt.subplot(3, 3, i + 1)\n",
    "    img = cv2.imread(row.filepath)\n",
    "    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)\n",
    "    plt.imshow(img)\n",
    "    plt.title(row.label, fontsize=8)\n",
    "    plt.axis('off')\n",
    "plt.tight_layout()\n",
    "plt.show()"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## Phase 2: Stratified Data Splitting & Preprocessing\n",
    "We use scikit-learn for stratified splitting (70% train, 15% validation, 15% testing)."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": None,
   "metadata": {},
   "outputs": [],
   "source": [
    "from sklearn.model_selection import train_test_split\n",
    "from sklearn.utils.class_weight import compute_class_weight\n",
    "\n",
    "# 70% Train, 30% Temp (Val + Test)\n",
    "X_train, X_temp, y_train, y_temp = train_test_split(\n",
    "    df['filepath'], df['label'], test_size=0.30, stratify=df['label'], random_state=42\n",
    ")\n",
    "\n",
    "# Split Temp evenly into 15% Val and 15% Test\n",
    "X_val, X_test, y_val, y_test = train_test_split(\n",
    "    X_temp, y_temp, test_size=0.50, stratify=y_temp, random_state=42\n",
    ")\n",
    "\n",
    "print(f\"Train size: {len(X_train)} (70%)\")\n",
    "print(f\"Validation size: {len(X_val)} (15%)\")\n",
    "print(f\"Test size: {len(X_test)} (15%)\")\n",
    "\n",
    "# Calculate class weights\n",
    "classes = np.unique(y_train)\n",
    "weights = compute_class_weight(class_weight='balanced', classes=classes, y=y_train)\n",
    "class_weights = dict(zip(range(len(classes)), weights))\n",
    "print(\"Class weights calculated successfully.\")"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": None,
   "metadata": {},
   "outputs": [],
   "source": [
    "import tensorflow as tf\n",
    "from sklearn.preprocessing import LabelEncoder\n",
    "\n",
    "le = LabelEncoder()\n",
    "y_train_enc = le.fit_transform(y_train)\n",
    "y_val_enc = le.transform(y_val)\n",
    "y_test_enc = le.transform(y_test)\n",
    "num_classes = len(classes)\n",
    "\n",
    "def create_dataset(filepaths, labels, batch_size=32, is_training=False):\n",
    "    dataset = tf.data.Dataset.from_tensor_slices((filepaths, labels))\n",
    "    \n",
    "    def load_and_preprocess(filepath, label):\n",
    "        img = tf.io.read_file(filepath)\n",
    "        img = tf.image.decode_jpeg(img, channels=3)\n",
    "        img = tf.image.resize(img, [224, 224])\n",
    "        # MobileNetV2 uses specific preprocessing (e.g. range [-1, 1] mapped via preprocessing model)\n",
    "        img = tf.keras.applications.mobilenet_v2.preprocess_input(img)\n",
    "        return img, label\n",
    "\n",
    "    dataset = dataset.map(load_and_preprocess, num_parallel_calls=tf.data.AUTOTUNE)\n",
    "    \n",
    "    if is_training:\n",
    "        dataset = dataset.shuffle(buffer_size=1000)\n",
    "        \n",
    "    dataset = dataset.batch(batch_size).prefetch(buffer_size=tf.data.AUTOTUNE)\n",
    "    return dataset\n",
    "\n",
    "train_ds = create_dataset(X_train.values, y_train_enc, is_training=True)\n",
    "val_ds = create_dataset(X_val.values, y_val_enc)\n",
    "test_ds = create_dataset(X_test.values, y_test_enc)"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## Phase 3: Model Architecture (Transfer Learning)\n",
    "Using MobileNetV2 with an augmentation pipeline inside the model architecture."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": None,
   "metadata": {},
   "outputs": [],
   "source": [
    "from tensorflow.keras import layers, models, applications\n",
    "\n",
    "# Data Augmentation pipeline\n",
    "data_augmentation = tf.keras.Sequential([\n",
    "  layers.RandomFlip(\"horizontal_and_vertical\"),\n",
    "  layers.RandomRotation(0.2),\n",
    "  layers.RandomZoom(0.2),\n",
    "  layers.RandomContrast(0.2)\n",
    "])\n",
    "\n",
    "# Transfer learning logic\n",
    "base_model = applications.MobileNetV2(input_shape=(224, 224, 3),\n",
    "                                      include_top=False,\n",
    "                                      weights='imagenet')\n",
    "base_model.trainable = False  # Freeze base layers\n",
    "\n",
    "inputs = tf.keras.Input(shape=(224, 224, 3))\n",
    "x = data_augmentation(inputs)\n",
    "x = base_model(x, training=False)\n",
    "x = layers.GlobalAveragePooling2D()(x)\n",
    "x = layers.Dense(128, activation='relu')(x)\n",
    "x = layers.Dropout(0.5)(x)\n",
    "outputs = layers.Dense(num_classes, activation='softmax')(x)\n",
    "\n",
    "model = tf.keras.Model(inputs, outputs)\n",
    "model.summary()"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## Phase 4: Training & Optimization\n",
    "Compile and train the model with callbacks."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": None,
   "metadata": {},
   "outputs": [],
   "source": [
    "from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau\n",
    "\n",
    "model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),\n",
    "              loss='sparse_categorical_crossentropy',\n",
    "              metrics=['accuracy'])\n",
    "\n",
    "callbacks = [\n",
    "    ModelCheckpoint('best_plant_model.keras', save_best_only=True, monitor='val_accuracy', mode='max'),\n",
    "    EarlyStopping(monitor='val_accuracy', patience=5, restore_best_weights=True),\n",
    "    ReduceLROnPlateau(monitor='val_loss', factor=0.2, patience=3, min_lr=1e-6)\n",
    "]\n",
    "\n",
    "# Phase 1: Warmup base layers\n",
    "history = model.fit(\n",
    "    train_ds,\n",
    "    validation_data=val_ds,\n",
    "    epochs=10,\n",
    "    class_weight=class_weights,\n",
    "    callbacks=callbacks\n",
    ")"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": None,
   "metadata": {},
   "outputs": [],
   "source": [
    "# Phase 2: Fine-tuning top 20% of MobileNetV2\n",
    "base_model.trainable = True\n",
    "fine_tune_at = int(len(base_model.layers) * 0.8)\n",
    "\n",
    "for layer in base_model.layers[:fine_tune_at]:\n",
    "    layer.trainable = False\n",
    "\n",
    "model.compile(loss='sparse_categorical_crossentropy',\n",
    "              optimizer=tf.keras.optimizers.Adam(learning_rate=1e-5),\n",
    "              metrics=['accuracy'])\n",
    "\n",
    "history_fine = model.fit(\n",
    "    train_ds,\n",
    "    validation_data=val_ds,\n",
    "    epochs=10,\n",
    "    class_weight=class_weights,\n",
    "    callbacks=callbacks\n",
    ")"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## Phase 5: Evaluation & Inference\n",
    "Evaluate on unseen 15% Test Set and plot a confusion matrix."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": None,
   "metadata": {},
   "outputs": [],
   "source": [
    "from sklearn.metrics import classification_report, confusion_matrix\n",
    "import seaborn as sns\n",
    "\n",
    "# Load best model if stopped early\n",
    "model = tf.keras.models.load_model('best_plant_model.keras')\n",
    "\n",
    "# Evaluate on test set\n",
    "test_loss, test_acc = model.evaluate(test_ds)\n",
    "print(f\"Test Accuracy: {test_acc:.4f}\")\n",
    "\n",
    "# Extract true labels and predictions\n",
    "y_true = []\n",
    "y_pred = []\n",
    "\n",
    "for images, labels in test_ds:\n",
    "    preds = model.predict(images, verbose=0)\n",
    "    y_pred.extend(np.argmax(preds, axis=1))\n",
    "    y_true.extend(labels.numpy())\n",
    "\n",
    "print(\"\\nClassification Report:\")\n",
    "print(classification_report(y_true, y_pred, target_names=le.classes_))\n",
    "\n",
    "# Confusion Matrix\n",
    "cm = confusion_matrix(y_true, y_pred)\n",
    "plt.figure(figsize=(15, 12))\n",
    "sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=le.classes_, yticklabels=le.classes_)\n",
    "plt.title('Confusion Matrix on 15% Test Set')\n",
    "plt.ylabel('True Label')\n",
    "plt.xlabel('Predicted Label')\n",
    "plt.xticks(rotation=90)\n",
    "plt.tight_layout()\n",
    "plt.show()"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": None,
   "metadata": {},
   "outputs": [],
   "source": [
    "import joblib\n",
    "# Save label encoder for prediction script\n",
    "joblib.dump(le, 'label_encoder.pkl')\n",
    "print(\"Label encoder saved for standalone script!\")"
   ]
  }
 ],
 "metadata": {
  "kernelspec": {
   "display_name": "Python 3",
   "language": "python",
   "name": "python3"
  },
  "language_info": {
   "codemirror_mode": {
    "name": "ipython",
    "version": 3
   },
   "file_extension": ".py",
   "mimetype": "text/x-python",
   "name": "python",
   "nbconvert_exporter": "python",
   "pygments_lexer": "ipython3",
   "version": "3.8.0"
  }
 }
}

with open(r'c:\Users\pravin sharma\Documents\GitHub\KisanMitra\plant_disease_model.ipynb', 'w') as f:
    json.dump(notebook, f, indent=1)

print("plant_disease_model.ipynb has been generated successfully!")
