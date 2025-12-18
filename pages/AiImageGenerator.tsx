
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { generateImage } from '../geminiService';

const AiImageGenerator: React.FC<{ user: User }> = ({ user }) => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<"1K" | "2K" | "4K">("1K");
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "16:9" | "9:16" | "4:3" | "3:4">("1:1");
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    checkApiKey();
  }, []);

  const checkApiKey = async () => {
    const selected = await window.aistudio.hasSelectedApiKey();
    setHasApiKey(selected);
  };

  const handleSelectKey = async () => {
    await window.aistudio.openSelectKey();
    setHasApiKey(true); // Proceed assuming success per instructions
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    try {
      const img = await generateImage(prompt, size, aspectRatio);
      setResultImage(img);
    } catch (error: any) {
      if (error.message?.includes("Requested entity was not found")) {
        setHasApiKey(false);
        alert("API Key error. Please re-select your key.");
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
      <div className="max-w-4xl mx-auto py-20 text-center space-y-8 animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-purple-100 rounded-[2.5rem] flex items-center justify-center mx-auto text-purple-600 shadow-xl">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7"/><path d="M16 11l2 2 4-4"/><circle cx="9" cy="10" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
        </div>
        <div className="max-w-md mx-auto space-y-4">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Pro Image Generation</h2>
          <p className="text-slate-500 font-medium">To use high-quality generation (2K/4K), you must select your own paid API key from a GCP project.</p>
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-purple-600 font-bold hover:underline block text-sm">Learn about billing</a>
        </div>
        <button 
          onClick={handleSelectKey}
          className="bg-slate-900 text-white px-12 py-5 rounded-[2rem] font-black shadow-2xl hover:scale-105 active:scale-95 transition-all"
        >
          Select API Key
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">AI Asset Generator</h1>
          <p className="text-slate-500 font-medium">Create high-resolution marketing assets with Gemini 3 Pro.</p>
        </div>
        <button onClick={() => setHasApiKey(false)} className="text-[10px] font-black uppercase text-slate-400 hover:text-purple-600 transition-colors">Change API Key</button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 space-y-8">
          <div className="space-y-4">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Generation Prompt</label>
            <textarea 
              className="w-full h-40 bg-slate-50 border border-slate-200 rounded-[2rem] p-8 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all resize-none"
              placeholder="e.g. 'A professional logo for a West African fintech app, purple and indigo theme, minimalist 3D icon, high-tech aesthetic'..."
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Resolution</label>
              <div className="flex gap-2">
                {(["1K", "2K", "4K"] as const).map(s => (
                  <button 
                    key={s} 
                    onClick={() => setSize(s)}
                    className={`flex-1 py-3 rounded-xl font-black text-xs transition-all ${size === s ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Aspect Ratio</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none"
                value={aspectRatio}
                onChange={e => setAspectRatio(e.target.value as any)}
              >
                <option value="1:1">1:1 Square</option>
                <option value="16:9">16:9 Cinema</option>
                <option value="9:16">9:16 Portrait</option>
                <option value="4:3">4:3 Standard</option>
                <option value="3:4">3:4 Classic</option>
              </select>
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Drafting Visualization...
              </>
            ) : (
              <>
                Generate Pro Asset
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
              </>
            )}
          </button>
        </div>

        <div className="space-y-6">
          {resultImage ? (
            <div className="bg-white p-4 rounded-[3.5rem] shadow-2xl border border-purple-100 relative overflow-hidden animate-in zoom-in-95 duration-500">
               <div className="absolute top-6 left-6 bg-purple-600 px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-widest z-10 shadow-lg animate-pulse">{size} Resolution</div>
               <img src={resultImage} alt="Generated" className="w-full h-auto rounded-[3rem] object-contain shadow-sm" />
               <div className="p-8 pt-4 flex gap-4">
                 <button 
                   onClick={() => {
                     const link = document.createElement('a');
                     link.href = resultImage;
                     link.download = `payflow_gen_${Date.now()}.png`;
                     link.click();
                   }}
                   className="flex-1 bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                 >
                   Download High-Res
                 </button>
                 <button 
                   onClick={() => setResultImage(null)}
                   className="px-8 bg-purple-50 text-purple-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-purple-100 transition-all border border-purple-100"
                 >
                   New Draft
                 </button>
               </div>
            </div>
          ) : (
            <div className="bg-slate-50/50 rounded-[3.5rem] border-4 border-dashed border-slate-200 h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12">
               <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center text-slate-200 mb-8 shadow-inner">
                 <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
               </div>
               <h3 className="text-2xl font-black text-slate-300">Ready for Creative Input</h3>
               <p className="text-slate-400 text-sm font-medium mt-3 max-w-xs mx-auto leading-relaxed">Gemini 3 Pro Image is ready to visualize your request. Enter a prompt to generate 1K, 2K, or 4K assets.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiImageGenerator;
