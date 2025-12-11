import React, { useState } from 'react';
import { Code, Play, Copy, Check, Settings, Terminal } from 'lucide-react';
import { generatePythonCode } from '../services/geminiService';
import { CodeGenPreferences, MLFramework } from '../types';

const CodeGenerator: React.FC = () => {
  const [prefs, setPrefs] = useState<CodeGenPreferences>({
    framework: MLFramework.PYTORCH,
    datasetName: 'custom_dataset',
    numClasses: 2,
    imageSize: 224,
    batchSize: 32,
    epochs: 10,
    useTransferLearning: true,
    baseModel: 'ResNet50'
  });

  const [code, setCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const result = await generatePythonCode(prefs);
      // Clean up markdown code blocks if Gemini includes them despite prompt
      const cleanCode = result.replace(/^```python\n/, '').replace(/```$/, '');
      setCode(cleanCode);
    } catch (error) {
      console.error(error);
      setCode("# Error generating code. Please check API key and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (key: keyof CodeGenPreferences, value: any) => {
    setPrefs(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
      {/* Configuration Panel */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Settings className="w-5 h-5 text-brand-400" />
            Model Configuration
          </h2>

          <div className="space-y-5">
            {/* Framework */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Framework</label>
              <select 
                value={prefs.framework}
                onChange={(e) => handleChange('framework', e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
              >
                {Object.values(MLFramework).map(fw => (
                  <option key={fw} value={fw}>{fw}</option>
                ))}
              </select>
            </div>

            {/* Dataset Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Dataset Name</label>
                <input 
                  type="text" 
                  value={prefs.datasetName}
                  onChange={(e) => handleChange('datasetName', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Classes</label>
                <input 
                  type="number" 
                  value={prefs.numClasses}
                  onChange={(e) => handleChange('numClasses', parseInt(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
                  min={1}
                />
              </div>
            </div>

            {/* Hyperparameters */}
            <div className="grid grid-cols-3 gap-3">
               <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Img Size</label>
                <input 
                  type="number" 
                  value={prefs.imageSize}
                  onChange={(e) => handleChange('imageSize', parseInt(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-sm text-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Batch</label>
                <input 
                  type="number" 
                  value={prefs.batchSize}
                  onChange={(e) => handleChange('batchSize', parseInt(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-sm text-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Epochs</label>
                <input 
                  type="number" 
                  value={prefs.epochs}
                  onChange={(e) => handleChange('epochs', parseInt(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-sm text-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
            </div>

            {/* Transfer Learning */}
            <div className="pt-2 border-t border-slate-700">
              <div className="flex items-center gap-3 mb-3">
                <input 
                  type="checkbox" 
                  id="tl" 
                  checked={prefs.useTransferLearning}
                  onChange={(e) => handleChange('useTransferLearning', e.target.checked)}
                  className="w-4 h-4 rounded border-slate-600 text-brand-500 focus:ring-brand-500 bg-slate-900"
                />
                <label htmlFor="tl" className="text-sm text-slate-200">Use Transfer Learning</label>
              </div>
              
              {prefs.useTransferLearning && (
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Base Model</label>
                  <select 
                    value={prefs.baseModel}
                    onChange={(e) => handleChange('baseModel', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
                  >
                    <option value="ResNet50">ResNet50</option>
                    <option value="VGG16">VGG16</option>
                    <option value="MobileNetV2">MobileNetV2 (Efficient)</option>
                    <option value="EfficientNetB0">EfficientNetB0</option>
                  </select>
                </div>
              )}
            </div>

            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className={`
                w-full py-3 px-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 mt-4
                transition-all duration-200
                ${isLoading 
                  ? 'bg-slate-700 cursor-not-allowed opacity-70' 
                  : 'bg-brand-600 hover:bg-brand-500 hover:shadow-brand-500/25 active:transform active:scale-95'
                }
              `}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Code className="w-5 h-5" />
                  Generate Python Code
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Code Display Panel */}
      <div className="lg:col-span-8 h-full min-h-[500px]">
        <div className="bg-[#1e1e1e] rounded-2xl border border-slate-700 shadow-xl flex flex-col h-full overflow-hidden">
          <div className="bg-[#2d2d2d] px-4 py-3 flex items-center justify-between border-b border-black/20">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-mono text-slate-300">train_model.py</span>
            </div>
            {code && (
              <button 
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
            )}
          </div>
          
          <div className="relative flex-1 overflow-hidden group">
            <div className="absolute inset-0 overflow-auto p-6 font-mono text-sm leading-relaxed text-blue-100/90">
              {code ? (
                <pre>
                  <code>{code}</code>
                </pre>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600">
                  <Play className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-lg font-medium opacity-50">Ready to generate</p>
                  <p className="text-sm opacity-40 max-w-xs text-center mt-2">
                    Configure your model settings on the left and click "Generate" to create your training script.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeGenerator;
