import React, { useState } from 'react';
import { BrainCircuit, Image as ImageIcon, Code, Github } from 'lucide-react';
import Classifier from './components/Classifier';
import CodeGenerator from './components/CodeGenerator';
import { AppTab } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.CLASSIFIER);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-brand-500/30">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">NeuroCode</h1>
              <p className="text-xs text-slate-400 font-medium">Python Vision Model Builder</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <nav className="flex items-center gap-1 bg-slate-800/50 p-1 rounded-xl border border-slate-700/50">
              <button
                onClick={() => setActiveTab(AppTab.CLASSIFIER)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${activeTab === AppTab.CLASSIFIER 
                    ? 'bg-slate-700 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }
                `}
              >
                <ImageIcon className="w-4 h-4" />
                Vision Demo
              </button>
              <button
                onClick={() => setActiveTab(AppTab.CODE_GENERATOR)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${activeTab === AppTab.CODE_GENERATOR 
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/20' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }
                `}
              >
                <Code className="w-4 h-4" />
                Python Generator
              </button>
            </nav>

            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-white transition-colors bg-slate-800/50 rounded-xl border border-slate-700/50 hover:bg-slate-800"
              title="View on GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-full">
           {activeTab === AppTab.CLASSIFIER ? <Classifier /> : <CodeGenerator />}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            Powered by Google Gemini 2.5 Flash & 3.0 Pro
          </p>
          <div className="flex items-center gap-4 text-sm text-slate-500">
             <span>v1.0.0</span>
             <a href="#" className="hover:text-brand-400 transition-colors">Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;