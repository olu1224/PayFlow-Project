
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { generateImage } from '../geminiService';
import { GoogleGenAI } from '@google/genai';

const AiImageGenerator: React.FC<{ user: User }> = ({ user }) => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<"1K" | "2K" | "4K">("1K");
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "16:9" | "9:16" | "4:3" | "3:4">("1:1");
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio && await window.aistudio.hasSelectedApiKey()) {
        setHasApiKey(true);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Assume success as per instructions
      setHasApiKey(true);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    try {
      // Re-initialize for every call to ensure latest key
      const img = await generateImage(prompt, size, aspectRatio);
      setResultImage(img);
    } catch (error: any) {
      if (error.message?.includes("Requested entity was not found")) {
        setHasApiKey(false);
        alert("Requested entity was not found. Please re-select your key.");
      } else {
        console.error(error);
        alert("Generation failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasApiKey) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-8 animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-purple-600 rounded-3xl flex items-center justify-center mx-auto text-white shadow-2xl shadow-purple-500/20">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Access Pro Visual Suite</h2>
          <p className="text-slate-500 font-medium">To generate high-resolution (2K/4K) assets using Gemini 3 Pro, you must select an authorized API key from a paid GCP project.</p>
          <div className="pt-4 flex flex-col items-center gap-3">
             <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-purple-600 font-black uppercase tracking-widest text-[10px] hover:underline">Billing Documentation</a>
             <button onClick={handleSelectKey} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all text-[11px] uppercase tracking-widest">Select Authorized Key</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="px-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">AI Asset Studio</h1>
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] opacity-80 mt-1">Gemini 3 Pro Image preview engine Active</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
           <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100 space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Visualization Prompt</label>
              <textarea 
                className="w-full h-32 bg-slate-50 border border-slate-100 rounded-2xl p-6 font-medium text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-600 transition-all resize-none shadow-inner text-sm"
                placeholder="e.g. 'A futuristic glass skyscraper in Lagos at night, cinematic lighting, 8k rendering'..."
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Native Res</label>
                <div className="flex gap-1 p-1 bg-slate-50 rounded-xl border border-slate-100">
                  {(["1K", "2K", "4K"] as const).map(s => (
                    <button 
                      key={s} 
                      onClick={() => setSize(s)}
                      className={`flex-1 py-2 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all ${size === s ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Proportion</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2 font-bold text-[10px] uppercase outline-none focus:ring-2 focus:ring-purple-600"
                  value={aspectRatio}
                  onChange={e => setAspectRatio(e.target.value as any)}
                >
                  <option value="1:1">Square (1:1)</option>
                  <option value="16:9">Wide (16:9)</option>
                  <option value="9:16">Portrait (9:16)</option>
                  <option value="4:3">Standard (4:3)</option>
                </select>
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              className="w-full bg-purple-600 text-white py-4 rounded-xl font-black shadow-lg shadow-purple-500/20 hover:scale-[1.02] hover:bg-purple-700 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3 group"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                <>
                  <span className="text-[10px] uppercase tracking-widest">Execute Gen-Script</span>
                  <svg className="group-hover:translate-x-1 transition-transform" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="lg:col-span-7">
          {resultImage ? (
            <div className="bg-white p-3 rounded-[2.5rem] shadow-2xl border border-purple-100 relative overflow-hidden animate-in zoom-in-95 duration-500">
               <div className="absolute top-6 left-6 bg-purple-600/90 backdrop-blur px-4 py-1.5 rounded-full text-[9px] font-black text-white uppercase tracking-widest z-10 shadow-xl">
                 Output: {size} • Pro Grid
               </div>
               <div className="rounded-[1.8rem] overflow-hidden bg-slate-50 aspect-square lg:aspect-auto min-h-[400px] flex items-center justify-center">
                  <img src={resultImage} alt="Generated Asset" className="w-full h-full object-contain" />
               </div>
               <div className="p-4 flex gap-3">
                 <button 
                   onClick={() => {
                     const link = document.createElement('a');
                     link.href = resultImage;
                     link.download = `payflow_pro_${Date.now()}.png`;
                     link.click();
                   }}
                   className="flex-1 bg-slate-900 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                 >
                   Download Pro Asset
                 </button>
                 <button onClick={() => setResultImage(null)} className="px-6 bg-purple-50 text-purple-600 rounded-xl font-black text-[10px] uppercase tracking-widest border border-purple-100 hover:bg-purple-100 transition-all">Clear</button>
               </div>
            </div>
          ) : (
            <div className="bg-slate-100/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 group">
               <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-200 mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500">
                 <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
               </div>
               <h3 className="text-xl font-black text-slate-400 tracking-tight">Studio Feed Idle</h3>
               <p className="text-slate-400 font-medium text-xs mt-2 max-w-xs mx-auto leading-relaxed">Describe your visual assets and specify resolution parameters to initialize the Gemini 3 engine.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiImageGenerator;
