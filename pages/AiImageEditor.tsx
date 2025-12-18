
import React, { useState, useRef } from 'react';
import { User } from '../types';
import { editImage } from '../geminiService';

const AiImageEditor: React.FC<{ user: User }> = ({ user }) => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result as string);
        setEditedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!originalImage || !prompt) return;
    setIsLoading(true);
    try {
      const result = await editImage(originalImage, prompt);
      setEditedImage(result);
    } catch (error) {
      console.error("Failed to edit image:", error);
      alert("Something went wrong editing your image. Please try a different prompt.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">AI Visual Studio</h1>
          <p className="text-slate-500 font-medium italic">Powered by Gemini 2.5 Flash Image</p>
        </div>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="bg-slate-900 text-white px-8 py-3.5 rounded-[1.5rem] font-black shadow-xl shadow-slate-200 hover:scale-105 transition-all flex items-center gap-2"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
          Upload Asset
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange} 
        />
      </header>

      {!originalImage ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="bg-white rounded-[3rem] border-4 border-dashed border-slate-100 h-96 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 hover:border-purple-200 transition-all group"
        >
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 group-hover:scale-110 group-hover:text-purple-400 transition-all duration-500">
             <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
          </div>
          <div className="mt-6 space-y-1">
            <h3 className="text-xl font-black text-slate-800">No Asset Selected</h3>
            <p className="text-slate-400 font-medium">Upload a receipt, logo, or business card to start editing with AI.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-[2.5rem] shadow-xl border border-slate-100 relative overflow-hidden">
               <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-widest z-10">Source</div>
               <img src={originalImage} alt="Original" className="w-full h-auto rounded-[2rem] max-h-[500px] object-contain" />
            </div>
            
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-6">
               <h3 className="font-black text-slate-800 flex items-center gap-2">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="3"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                 Edit Instructions
               </h3>
               <textarea 
                 className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl p-6 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all resize-none"
                 placeholder="e.g. 'Add a retro cinematic filter', 'Remove the background and make it white', 'Change the blue colors to purple'..."
                 value={prompt}
                 onChange={e => setPrompt(e.target.value)}
               ></textarea>
               <button 
                 onClick={handleEdit}
                 disabled={isLoading || !prompt.trim()}
                 className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-5 rounded-2xl font-black shadow-xl shadow-purple-100 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
               >
                 {isLoading ? (
                   <>
                     <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                     Applying Magic...
                   </>
                 ) : (
                   <>
                     Apply Visual Transformation
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                   </>
                 )}
               </button>
            </div>
          </div>

          <div className="space-y-6">
            {editedImage ? (
               <div className="bg-white p-4 rounded-[2.5rem] shadow-2xl border border-purple-100 relative overflow-hidden animate-in zoom-in-95 duration-500">
                  <div className="absolute top-4 left-4 bg-purple-600 px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-widest z-10 shadow-lg animate-pulse">AI Result</div>
                  <img src={editedImage} alt="Edited" className="w-full h-auto rounded-[2rem] max-h-[500px] object-contain shadow-sm" />
                  <div className="p-6 pt-2 flex gap-4">
                    <button 
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = editedImage;
                        link.download = `payflow_asset_${Date.now()}.png`;
                        link.click();
                      }}
                      className="flex-1 bg-slate-900 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                      Download Asset
                    </button>
                    <button 
                      onClick={() => {
                        setOriginalImage(editedImage);
                        setEditedImage(null);
                        setPrompt('');
                      }}
                      className="flex-1 bg-purple-50 text-purple-600 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-purple-100 transition-all border border-purple-100"
                    >
                      Iterate Further
                    </button>
                  </div>
               </div>
            ) : (
              <div className="bg-slate-50/50 rounded-[2.5rem] border-4 border-dashed border-slate-200 h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12">
                 <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-200 mb-6">
                   <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                 </div>
                 <h3 className="text-xl font-black text-slate-300">Awaiting Generation</h3>
                 <p className="text-slate-400 text-sm font-medium mt-2 leading-relaxed">Enter an instruction on the left and click "Apply" to see your AI-transformed asset here.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AiImageEditor;
