# NeuroCode - Python Vision Model Builder

NeuroCode is an interactive web application that helps developers and data scientists generate custom Python image classification code (PyTorch, TensorFlow, Scikit-Learn) and test computer vision concepts using Google's Gemini Vision API.

## Features

### 1. Vision Demo (Zero-Shot Classification)
- **Model:** Uses `gemini-2.5-flash` for multimodal analysis.
- **Functionality:** Upload any image to get an instant analysis including:
  - Predicted Label
  - Confidence Score
  - Visual Description
  - Suggested Dataset Tags
- **Use Case:** Great for auto-labeling datasets or testing model feasibility before training.

### 2. Python Code Generator
- **Model:** Uses `gemini-3-pro-preview` for high-quality code generation.
- **Functionality:** Configure your training parameters via the UI:
  - Framework Selection (PyTorch, TensorFlow/Keras, Scikit-Learn)
  - Dataset Parameters (Name, Classes, Image Size)
  - Training Hyperparameters (Batch Size, Epochs)
  - Transfer Learning Options (ResNet50, VGG16, MobileNetV2, etc.)
- **Output:** Generates a complete, runnable Python training script ready to copy-paste.

## Tech Stack

- **Frontend:** React 19, Tailwind CSS, Lucide React
- **AI Integration:** Google GenAI SDK (`@google/genai`)
- **Build:** ES Modules (No bundler required for dev, runs directly in browser via `esm.sh`)

## Setup

1. Clone the repository.
2. Ensure you have a Google Gemini API Key.
3. Serve the directory using a static server (e.g., Live Server, Python http.server, or Vite).
