
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { findNearbyBanksOrAgents } from '../geminiService';

const NearbyHub: React.FC<{ user: User }> = ({ user }) => {
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [query, setQuery] = useState(`All major commercial banks in ${user.country}`);
  const [results, setResults] = useState<{ text: string, grounding: any } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => {
          const fallbacks = {
            'Nigeria': { lat: 9.0765, lng: 7.3986 },
            'Ghana': { lat: 5.6037, lng: -0.1870 },
            'Senegal': { lat: 14.7167, lng: -17.4677 }
          };
          setLocation(fallbacks[user.country]);
          setError("Location access limited. Using capital city fallback nodes.");
        }
      );
    }
  }, [user.country]);

  const handleSearch = async (specificQuery?: string) => {
    const searchQuery = specificQuery || query;
    if (!location) return setError("Acquiring regional GPS coordinates...");
    setLoading(true);
    setError(null);
    try {
      const res = await findNearbyBanksOrAgents(location, searchQuery);
      setResults(res);
    } catch (e) {
      setError("Failed to fetch nearby network services.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-10 animate-in fade-in duration-500 pb-24 px-4 md:px-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-[900] text-slate-900 tracking-tight leading-none">Infrastructure Locator</h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-3">Verified Financial Grid Powered by Google Maps</p>
        </div>
        {error && (
          <div className="bg-amber-50 border border-amber-100 px-6 py-2 rounded-2xl flex items-center gap-3">
             <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
             <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">{error}</span>
          </div>
        )}
      </header>

      <div className="bg-white p-6 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl space-y-10">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 relative group">
            <svg className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-purple-600 transition-colors" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input 
              type="text" 
              placeholder="Search specific branches, ATMs, or PayFlow agents..." 
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-[2rem] pl-16 pr-6 py-6 font-black text-slate-700 focus:ring-8 focus:ring-purple-500/5 focus:border-purple-600 focus:bg-white outline-none transition-all placeholder-slate-300"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button 
            onClick={() => handleSearch()}
            disabled={loading}
            className="bg-slate-900 text-white px-12 py-6 rounded-[2rem] font-[900] shadow-2xl hover:bg-purple-600 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-xs"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Syncing Maps...
              </>
            ) : (
              <>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                Initialize Search
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
          <div className="xl:col-span-5 space-y-8">
            <div className="flex items-center justify-between px-2">
               <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">AI Synthesis</h3>
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            {results ? (
              <div className="bg-slate-950 p-10 rounded-[3rem] text-slate-300 font-medium leading-relaxed relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600 rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="relative z-10 text-lg whitespace-pre-wrap selection:bg-purple-500/30">
                  {results.text}
                </div>
                <div className="mt-10 pt-6 border-t border-white/5 flex gap-4">
                   <button onClick={() => setResults(null)} className="text-[10px] font-black uppercase text-slate-500 hover:text-white transition-colors">Terminate Context</button>
                </div>
              </div>
            ) : (
              <div className="h-80 border-4 border-dashed border-slate-50 rounded-[3.5rem] flex flex-col items-center justify-center text-center p-12 group hover:border-purple-100 transition-all duration-500">
                 <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 mb-6 group-hover:scale-110 group-hover:text-purple-200 transition-all duration-500">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="12" r="3"/></svg>
                 </div>
                 <p className="font-black text-slate-300 uppercase tracking-widest">Network Analysis Pending</p>
              </div>
            )}
          </div>

          <div className="xl:col-span-7 space-y-8">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] px-2">Verified Grid Entry Points</h3>
            <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
              {results?.grounding ? (
                results.grounding.map((chunk: any, i: number) => {
                  if (chunk.maps) {
                    return (
                      <div 
                        key={i} 
                        className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl hover:border-purple-600 hover:shadow-2xl hover:shadow-purple-500/10 transition-all group relative overflow-hidden animate-in slide-in-from-right-4"
                        style={{ transitionDelay: `${i * 100}ms` }}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                          <div className="flex items-start gap-6">
                            <div className="w-16 h-16 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center group-hover:bg-purple-600 group-hover:scale-110 transition-all duration-500 shrink-0 shadow-2xl">
                               <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 21h18"/><path d="M3 10h18"/><path d="M5 10V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3"/></svg>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <h4 className="font-[900] text-slate-900 text-2xl tracking-tighter leading-tight group-hover:text-purple-600 transition-colors">
                                  {chunk.maps.title || 'Regional Settlement Node'}
                                </h4>
                                <div className="w-4 h-4 bg-emerald-500 text-white rounded-full flex items-center justify-center shrink-0 shadow-lg" title="Verified Partner">
                                   <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6 9 17l-5-5"/></svg>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-slate-400">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/></svg>
                                <p className="text-sm font-bold truncate max-w-[280px]">Verified Branch Service Point</p>
                              </div>
                              <p className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.2em] bg-emerald-50 px-3 py-1 rounded-lg w-fit">Open Node: Settlements Ready</p>
                            </div>
                          </div>
                          
                          <a 
                            href={chunk.maps.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-purple-600 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 group/btn"
                          >
                            Get Directions
                            <svg className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                          </a>
                        </div>
                        {/* Decorative watermark icon */}
                        <div className="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700 rotate-12">
                           <svg width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })
              ) : (
                <div className="py-20 text-center space-y-4 opacity-30 grayscale">
                   <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
                   <p className="font-black text-xs uppercase tracking-[0.3em]">Ledger Display Restricted</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default NearbyHub;
