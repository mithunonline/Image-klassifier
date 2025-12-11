export enum AppTab {
  CLASSIFIER = 'CLASSIFIER',
  CODE_GENERATOR = 'CODE_GENERATOR',
}

export enum MLFramework {
  PYTORCH = 'PyTorch',
  TENSORFLOW = 'TensorFlow/Keras',
  SCIKIT_LEARN = 'Scikit-Learn (Classic ML)',
}

export interface CodeGenPreferences {
  framework: MLFramework;
  datasetName: string;
  numClasses: number;
  imageSize: number;
  batchSize: number;
  epochs: number;
  useTransferLearning: boolean;
  baseModel: string;
}

export interface AnalysisResult {
  label: string;
  confidence: number;
  description: string;
  suggestedTags: string[];
}

export interface ImageAnalysisState {
  isLoading: boolean;
  result: AnalysisResult | null;
  error: string | null;
  imagePreview: string | null;
}
