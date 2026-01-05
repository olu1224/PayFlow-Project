
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

  const topSections = [
    { id: 'dashboard', label: 'HOME', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>, colorClass: 'text-indigo-600', bgClass: 'bg-white shadow-xl shadow-indigo-100/50 border-indigo-50' },
    { id: 'money-hub', label: 'MONEY HUB', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>, colorClass: 'text-rose-600', bgClass: 'bg-rose-50 border-rose-100' },
    { id: 'loans', label: 'LOANS', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"/></svg>, colorClass: 'text-blue-600', bgClass: 'bg-blue-50 border-blue-100' },
    { id: 'crypto', label: 'CRYPTO', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>, colorClass: 'text-amber-600', bgClass: 'bg-amber-50 border-amber-100' },
    { id: 'deal-forge', label: 'DEAL FORGE', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5"/></svg>, colorClass: 'text-emerald-600', bgClass: 'bg-emerald-50 border-emerald-100' },
    { id: 'membership', label: 'ELITE PLAN', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21"/></svg>, colorClass: 'text-violet-600', bgClass: 'bg-violet-50 border-violet-100' },
    { id: 'history', label: 'HISTORY', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/></svg>, colorClass: 'text-slate-600', bgClass: 'bg-slate-50 border-slate-100' }
  ];

  const currentCountry = countries.find(c => c.name === user.country);
  const idPayload = `${window.location.origin}${window.location.pathname}#/settle?node=${user.name.replace(/\s+/g, '+')}&country=${user.country}`;

  const handleShareNode = async () => {
    const shareData = { title: 'PayFlow Pro Identity', text: `Connect with me on the PayFlow node: ${user.name}`, url: idPayload };
    if (navigator.share) {
      try { setIsSharing(true); await navigator.share(shareData); } catch (err) { console.error('Share failed', err); } finally { setIsSharing(false); }
    } else {
      navigator.clipboard.writeText(idPayload); alert('Node Link copied to clipboard');
    }
  };

  return (
    <div className="h-20 md:h-32 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-12 z-50 sticky top-0 shadow-sm transition-all overflow-hidden">
      <div className="flex items-center gap-12 shrink-0">
        <div onClick={() => setActiveTab('dashboard')} className="scale-75 md:scale-100 cursor-pointer active:scale-95 transition-transform origin-left">
          <Logo size="lg" />
        </div>
      </div>

      {/* CENTER NAVIGATION PILL */}
      <div className="hidden xl:flex items-center">
        <div className="bg-white border border-slate-100 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] rounded-full p-1.5 flex items-center gap-1">
          {topSections.map((sec) => (
            <button 
              key={sec.id} 
              onClick={() => setActiveTab(sec.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-full transition-all duration-300 active:scale-95 group ${activeTab === sec.id ? sec.bgClass + ' border' : 'hover:bg-slate-50'}`}
            >
              <div className={`transition-all duration-300 ${activeTab === sec.id ? sec.colorClass : 'text-slate-300 group-hover:text-slate-600'}`}>
                {sec.icon}
              </div>
              <span className={`text-[10px] font-black tracking-widest uppercase transition-colors ${activeTab === sec.id ? sec.colorClass : 'text-slate-400 group-hover:text-slate-600'}`}>
                {sec.label}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <button 
          onClick={() => setShowIDModal(true)}
          className="w-10 h-10 md:w-14 md:h-14 bg-slate-900 text-white rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-indigo-600 transition-all shadow-lg active:scale-90"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><rect width="7" height="7" x="7" y="7" rx="1"/><path d="M17 17h.01"/><path d="M17 7h.01"/><path d="M7 17h.01"/></svg>
        </button>

        <button 
          onClick={onOpenSettings}
          className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center transition-all border md:border-2 active:scale-90 ${activeTab === 'settings' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'}`}
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1-2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        </button>

        <div className="relative">
          <button 
            onClick={() => setShowCountryPicker(!showCountryPicker)}
            className="flex items-center gap-1 md:gap-3 px-2 md:px-5 py-2 md:py-3.5 rounded-xl md:rounded-2xl border md:border-2 border-slate-100 bg-white shadow-sm transition-all group shrink-0"
          >
            <span className="text-xl md:text-2xl group-hover:scale-110 transition-transform">{currentCountry?.flag}</span>
            <span className="hidden sm:inline text-slate-800 uppercase tracking-widest text-[9px] md:text-[11px] font-black">{currentCountry?.code}</span>
            <svg className={`w-4 h-4 text-slate-400 transition-transform ${showCountryPicker ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m6 9 6 6 6-6"/></svg>
          </button>

          {showCountryPicker && (
            <div className="absolute top-[calc(100%+12px)] right-0 w-72 bg-white rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.15)] border border-slate-100 p-3 z-[100] animate-in slide-in-from-top-4 duration-300">
              <div className="px-5 py-4 border-b border-slate-50 mb-2">
                <p className="text-[10px] font-black uppercase text-indigo-600 tracking-[0.3em]">Switch Hub Node</p>
              </div>
              <div className="space-y-1.5">
                {countries.map(c => (
                  <button 
                    key={c.name}
                    onClick={() => { onUpdateCountry(c.name); setShowCountryPicker(false); }}
                    className={`w-full flex items-center justify-between px-5 py-4 text-[11px] font-black transition-all rounded-[1.8rem] group ${user.country === c.name ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50 hover:translate-x-1'}`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl group-hover:scale-110 transition-transform">{c.flag}</span>
                      <div className="text-left">
                        <p className="tracking-tight leading-none">{c.name}</p>
                        <p className={`text-[8px] font-black uppercase mt-1.5 ${user.country === c.name ? 'text-indigo-200' : 'text-slate-400'}`}>
                          {c.currency} • {c.symbol}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
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
                 <button onClick={() => setShowIDModal(false)} className="p-2 text-slate-400 hover:text-slate-900 transition-all"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
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
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all active:scale-95 shadow-xl"
                >
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
