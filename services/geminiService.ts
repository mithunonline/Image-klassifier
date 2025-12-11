import { GoogleGenAI, Type } from "@google/genai";
import { CodeGenPreferences, MLFramework } from "../types";

// Helper to convert file to base64
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g. "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const classifyImageWithGemini = async (base64Image: string, mimeType: string) => {
  const ai = getClient();
  
  // Using gemini-2.5-flash for multimodal analysis. 
  // gemini-2.5-flash-image is for image generation and does not support JSON mode.
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Image,
          },
        },
        {
          text: `Analyze this image for an image classification dataset. 
                 1. Identify the primary subject (the 'Label').
                 2. Estimate a confidence score (0-100) based on image clarity.
                 3. Provide a brief visual description useful for captioning.
                 4. Suggest 3-5 tags/keywords.
                 Return JSON.`
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          description: { type: Type.STRING },
          suggestedTags: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      }
    }
  });

  return response.text ? JSON.parse(response.text) : null;
};

export const generatePythonCode = async (prefs: CodeGenPreferences) => {
  const ai = getClient();

  const prompt = `
    Act as a senior Machine Learning Engineer.
    Write a complete, runnable Python script for training an image classification model.
    
    Specifications:
    - Framework: ${prefs.framework}
    - Dataset Name (simulated or folder path): "${prefs.datasetName}"
    - Number of Classes: ${prefs.numClasses}
    - Input Image Size: ${prefs.imageSize}x${prefs.imageSize}
    - Batch Size: ${prefs.batchSize}
    - Epochs: ${prefs.epochs}
    - Transfer Learning: ${prefs.useTransferLearning ? 'Yes' : 'No'}
    ${prefs.useTransferLearning ? `- Base Model: ${prefs.baseModel}` : '- Architecture: Custom CNN'}

    Requirements:
    1. Include necessary imports.
    2. Define data transformations/augmentations.
    3. Define the dataset and dataloader (assume a standard folder structure 'data/train' and 'data/val').
    4. Define the model architecture.
    5. Define the loss function and optimizer.
    6. Write the training loop with validation steps.
    7. Save the best model.
    8. Add comments explaining key sections.
    
    Output ONLY the Python code. Do not output markdown backticks at the start or end.
  `;

  // Using gemini-3-pro-preview for complex coding tasks
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
  });

  return response.text;
};