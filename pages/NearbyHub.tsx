
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { findNearbyBanksOrAgents } from '../geminiService';

const NearbyHub: React.FC<{ user: User }> = ({ user }) => {
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [query, setQuery] = useState(`All banks in ${user.country}`);
  const [results, setResults] = useState<{ text: string, grounding: any } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => {
          // Fallback to capital city if location denied
          const fallbacks = {
            'Nigeria': { lat: 9.0765, lng: 7.3986 }, // Abuja
            'Ghana': { lat: 5.6037, lng: -0.1870 }, // Accra
            'Senegal': { lat: 14.7167, lng: -17.4677 } // Dakar
          };
          setLocation(fallbacks[user.country]);
          setError("Location access denied. Using capital city fallback.");
        }
      );
    }
  }, [user.country]);

  const handleSearch = async (specificQuery?: string) => {
    const searchQuery = specificQuery || query;
    if (!location) return setError("Acquiring location...");
    setLoading(true);
    setError(null);
    try {
      const res = await findNearbyBanksOrAgents(location, searchQuery);
      setResults(res);
    } catch (e) {
      setError("Failed to fetch nearby services.");
    } finally {
      setLoading(false);
    }
  };

  const QuickFilter: React.FC<{ label: string; q: string }> = ({ label, q }) => (
    <button 
      onClick={() => { setQuery(q); handleSearch(q); }}
      className="bg-white border border-slate-100 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:border-purple-600 hover:text-purple-600 transition-all"
    >
      {label}
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-300 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Nearby Finance Hub</h1>
          <p className="text-slate-500 font-medium">Find ATMs, agents, and branches near your current position in {user.country}.</p>
        </div>
      </header>

      <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl space-y-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <svg className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input 
              type="text" 
              placeholder="What are you looking for? (e.g. Zenith Bank branches)" 
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-16 pr-6 py-4 font-bold text-slate-700 focus:ring-2 focus:ring-purple-200 outline-none"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={() => handleSearch()}
            disabled={loading}
            className="bg-purple-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-purple-100 hover:bg-purple-700 transition-all disabled:bg-slate-200"
          >
            {loading ? 'Searching Maps...' : 'Find Services'}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
           <QuickFilter label="All Banks" q={`All banks in ${user.country}`} />
           <QuickFilter label="ATMs" q={`ATMs near me in ${user.country}`} />
           <QuickFilter label="POS Agents" q={`Mobile money agents near me in ${user.country}`} />
           <QuickFilter label="Ecobank" q={`Ecobank branches in ${user.country}`} />
           <QuickFilter label="UBA" q={`UBA branches in ${user.country}`} />
           <QuickFilter label="Stanbic" q={`Stanbic IBTC branches in ${user.country}`} />
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl font-bold text-sm flex items-center gap-3">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
             {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">AI Location Guide</h3>
            {results ? (
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">
                {results.text}
              </div>
            ) : (
              <div className="h-64 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-slate-300">
                 <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-4"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                 <p className="font-bold">Search results will appear here</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Verified Map Locations</h3>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {results?.grounding ? (
                results.grounding.map((chunk: any, i: number) => (
                  chunk.maps && (
                    <a 
                      key={i} 
                      href={chunk.maps.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-purple-300 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all">
                             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                          </div>
                          <div>
                            <p className="font-black text-slate-800">{chunk.maps.title || 'Location details'}</p>
                            <p className="text-[10px] text-purple-600 font-black uppercase tracking-widest mt-0.5">Open in Google Maps</p>
                          </div>
                        </div>
                        <svg className="text-slate-300 group-hover:text-purple-600 transition-colors" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      </div>
                    </a>
                  )
                ))
              ) : (
                <p className="text-center py-10 text-slate-300 font-bold italic">No verified map links yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NearbyHub;
