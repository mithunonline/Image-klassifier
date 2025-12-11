import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Loader2, Tag, Info, AlertCircle, CheckCircle } from 'lucide-react';
import { fileToGenerativePart, classifyImageWithGemini } from '../services/geminiService';
import { AnalysisResult, ImageAnalysisState } from '../types';

const Classifier: React.FC = () => {
  const [state, setState] = useState<ImageAnalysisState>({
    isLoading: false,
    result: null,
    error: null,
    imagePreview: null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setState(prev => ({ ...prev, error: "Please upload a valid image file." }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null, result: null }));
      
      const base64Data = await fileToGenerativePart(file);
      const previewUrl = URL.createObjectURL(file);
      
      setState(prev => ({ ...prev, imagePreview: previewUrl }));

      const data = await classifyImageWithGemini(base64Data, file.type);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        result: data as AnalysisResult,
      }));

    } catch (err: any) {
      console.error(err);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: "Failed to analyze image. Please try again or check your API key.",
      }));
    }
  };

  const triggerUpload = () => fileInputRef.current?.click();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      {/* Left Column: Upload */}
      <div className="flex flex-col gap-6">
        <div 
          onClick={triggerUpload}
          className={`
            relative group cursor-pointer 
            border-2 border-dashed rounded-2xl 
            flex flex-col items-center justify-center 
            h-96 transition-all duration-300
            ${state.imagePreview ? 'border-brand-500 bg-slate-800/50' : 'border-slate-600 hover:border-brand-400 hover:bg-slate-800/30'}
          `}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*"
          />
          
          {state.imagePreview ? (
            <img 
              src={state.imagePreview} 
              alt="Preview" 
              className="h-full w-full object-contain rounded-xl p-2" 
            />
          ) : (
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8 text-slate-400 group-hover:text-brand-400" />
              </div>
              <p className="text-lg font-medium text-slate-200">Click to upload an image</p>
              <p className="text-sm text-slate-400 mt-2">Supports JPG, PNG, WEBP</p>
            </div>
          )}

          {state.isLoading && (
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl">
              <Loader2 className="w-10 h-10 text-brand-400 animate-spin mb-3" />
              <p className="text-brand-200 font-medium animate-pulse">Analyzing with Gemini Vision...</p>
            </div>
          )}
        </div>

        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-slate-300">
              Use this tool to test "Zero-Shot" classification. Gemini can identify objects without prior training. This helps in auto-labeling datasets for your Python model.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Results */}
      <div className="flex flex-col gap-6">
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 h-full shadow-xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-brand-400" />
            Analysis Results
          </h2>

          {!state.result && !state.error && (
            <div className="h-64 flex flex-col items-center justify-center text-slate-500 border border-dashed border-slate-700 rounded-xl bg-slate-800/30">
              <p>Upload an image to see classification details.</p>
            </div>
          )}

          {state.error && (
            <div className="bg-red-900/20 border border-red-500/50 p-4 rounded-xl flex items-center gap-3 text-red-200">
              <AlertCircle className="w-5 h-5" />
              <p>{state.error}</p>
            </div>
          )}

          {state.result && (
            <div className="space-y-6 animate-fade-in">
              {/* Main Classification */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 block">Predicted Label</label>
                <div className="flex items-center justify-between bg-slate-700/50 p-4 rounded-xl border border-slate-600">
                  <span className="text-2xl font-bold text-white capitalize">{state.result.label}</span>
                  <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 font-mono font-bold">{state.result.confidence}%</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 block">Visual Description</label>
                <p className="text-slate-300 leading-relaxed bg-slate-700/30 p-4 rounded-xl border border-slate-700/50">
                  {state.result.description}
                </p>
              </div>

              {/* Tags */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 block">Suggested Tags</label>
                <div className="flex flex-wrap gap-2">
                  {state.result.suggestedTags.map((tag, idx) => (
                    <span key={idx} className="flex items-center gap-1 bg-slate-700 text-brand-200 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-600 hover:border-brand-500/50 transition-colors">
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Classifier;
