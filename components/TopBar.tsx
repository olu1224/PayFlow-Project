
import React, { useState } from 'react';
import { User, Country } from '../types';
import Logo from './Logo';
import { t } from '../localization';

interface TopBarProps {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
  onUpdateCountry: (c: Country) => void;
}

const TopBar: React.FC<TopBarProps> = ({ user, activeTab, setActiveTab, onOpenNotifications, onOpenSettings, onUpdateCountry }) => {
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showIDModal, setShowIDModal] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const countries: { name: Country; flag: string; code: string; currency: string; symbol: string }[] = [
    { name: 'Nigeria', flag: '🇳🇬', code: 'NG', currency: 'NGN', symbol: '₦' },
    { name: 'Ghana', flag: '🇬🇭', code: 'GH', currency: 'GHS', symbol: 'GH₵' },
    { name: 'Senegal', flag: '🇸🇳', code: 'SN', currency: 'XOF', symbol: 'CFA' },
  ];

  // Sections precisely matching the user's reference image
  const topSections = [
    { id: 'dashboard', label: 'HOME', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg> },
    { id: 'money-hub', label: 'MONEY HUB', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg> },
    { id: 'loans', label: 'LOANS', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/></svg> },
    { id: 'crypto', label: 'CRYPTO', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg> },
    { id: 'deal-forge', label: 'DEAL FORGE', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m12 12 8-4-8-4-8 4 8 4Z"/><path d="m20 12-8 4-8-4"/><path d="m20 16-8 4-8-4"/></svg> },
    { id: 'membership', label: 'ELITE PLAN', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg> },
    { id: 'history', label: 'HISTORY', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> }
  ];

  const currentCountry = countries.find(c => c.name === user.country);
  const idPayload = `${window.location.origin}${window.location.pathname}#/settle?node=${user.name.replace(/\s+/g, '+')}&country=${user.country}`;

  const handleShareNode = async () => {
    const shareData = { title: 'Zynctra Pro Node', text: `Connect on the Pan-African Grid: ${user.name}`, url: idPayload };
    if (navigator.share) {
      try { setIsSharing(true); await navigator.share(shareData); } catch (err) { console.error('Share failed', err); } finally { setIsSharing(false); }
    } else {
      navigator.clipboard.writeText(idPayload); alert('Node link copied');
    }
  };

  const isHome = activeTab === 'dashboard';

  return (
    <div className="bg-white border-b border-slate-50 z-[100] sticky top-0 flex flex-col">
      {/* TIER 1: BRAND & GLOBAL ACTIONS */}
      <div className="h-20 md:h-24 flex items-center justify-between px-4 md:px-12 bg-white">
        <div className="flex items-center gap-4 md:gap-8">
          {!isHome && (
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-900 active:scale-90 transition-all shadow-sm"
              aria-label="Go back to Home"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="m15 18-6-6 6-6"/></svg>
            </button>
          )}
          <div onClick={() => setActiveTab('dashboard')} className="scale-75 md:scale-90 cursor-pointer active:scale-95 transition-transform origin-left">
            <Logo size="md" />
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={() => setShowIDModal(true)}
            className="w-10 h-10 md:w-14 md:h-14 bg-slate-950 text-white rounded-[1rem] md:rounded-[1.2rem] flex items-center justify-center hover:bg-indigo-600 transition-all shadow-lg active:scale-90"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><rect width="7" height="7" x="7" y="7" rx="1"/><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/></svg>
          </button>

          <button 
            onClick={onOpenSettings}
            className={`w-10 h-10 md:w-14 md:h-14 rounded-[1rem] md:rounded-[1.2rem] flex items-center justify-center transition-all border active:scale-90 ${activeTab === 'settings' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white border-slate-100 text-slate-500'}`}
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1-2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </button>

          <div className="relative">
            <button 
              onClick={() => setShowCountryPicker(!showCountryPicker)}
              className="flex items-center gap-1.5 px-2 md:px-5 py-2 md:py-3.5 rounded-[1rem] md:rounded-[1.2rem] border border-slate-100 bg-white shadow-sm transition-all group shrink-0"
            >
              <span className="text-xl md:text-2xl group-hover:scale-110 transition-transform">{currentCountry?.flag}</span>
              <span className="hidden sm:inline text-slate-800 uppercase tracking-widest text-[10px] md:text-xs font-black">{currentCountry?.code}</span>
              <svg className={`w-3 h-3 md:w-4 md:h-4 text-slate-400 transition-transform ${showCountryPicker ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m6 9 6 6 6-6"/></svg>
            </button>

            {showCountryPicker && (
              <div className="absolute top-[calc(100%+12px)] right-0 w-60 bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-50 p-2 z-[100] animate-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-slate-50 mb-1">
                  <p className="text-[9px] font-black uppercase text-indigo-600 tracking-widest">Switch Grid Node</p>
                </div>
                <div className="space-y-1">
                  {countries.map(c => (
                    <button 
                      key={c.name}
                      onClick={() => { onUpdateCountry(c.name); setShowCountryPicker(false); }}
                      className={`w-full flex items-center justify-between px-4 py-3 text-[10px] font-black transition-all rounded-[1.2rem] group ${user.country === c.name ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl group-hover:scale-110 transition-transform">{c.flag}</span>
                        <p className="tracking-tight">{c.name}</p>
                      </div>
                      {user.country === c.name && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6 9 17l-5-5"/></svg>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TIER 2: NAVIGATION PILLS - Floating Slightly Above Content Area */}
      <div className="pb-4 pt-1 flex justify-center px-4 md:px-0 bg-slate-50/30">
        <div className="bg-white border border-slate-100 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.08)] rounded-full p-1.5 flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth max-w-full md:max-w-fit">
          {topSections.map((sec) => {
            const isActive = activeTab === sec.id;
            return (
              <button 
                key={sec.id} 
                onClick={() => setActiveTab(sec.id)}
                className={`flex items-center gap-2.5 px-5 md:px-8 py-3 md:py-4 rounded-full transition-all duration-300 active:scale-95 border border-transparent shrink-0 ${isActive ? 'bg-[#F2F4FF] border-[#E0E5FF] shadow-sm' : 'hover:bg-slate-50'}`}
              >
                <div className={`transition-all duration-300 ${isActive ? 'text-indigo-600' : 'text-[#8A92B3]'}`}>
                  {sec.icon}
                </div>
                <span className={`text-[10px] md:text-[11px] font-[1000] tracking-widest uppercase transition-colors ${isActive ? 'text-indigo-600' : 'text-[#58648E]'}`}>
                  {sec.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {showIDModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-sm rounded-[3rem] p-10 shadow-2xl border border-white animate-in zoom-in-95">
              <div className="flex justify-between items-center mb-8">
                 <div className="space-y-1">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Node ID</h3>
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Active Scanning</p>
                 </div>
                 <button onClick={() => setShowIDModal(false)} className="p-2 text-slate-400 hover:text-slate-900 transition-all"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
              </div>

              <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 flex flex-col items-center gap-6">
                 <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(idPayload)}`} alt="ID QR" className="w-44 h-44" />
                 </div>
                 <div className="text-center space-y-1">
                    <p className="font-black text-slate-800 text-lg leading-tight">{user.name}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{user.country} Node</p>
                 </div>
              </div>

              <div className="mt-8 space-y-3">
                <button 
                  onClick={handleShareNode}
                  disabled={isSharing}
                  className="w-full bg-slate-950 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all active:scale-95 shadow-xl"
                >
                  {/* Fixed duplicate x2 attribute in the line tag below */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                  Share My Node
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default TopBar;
