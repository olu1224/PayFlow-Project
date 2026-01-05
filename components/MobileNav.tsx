
import React, { useState } from 'react';
import { Country } from '../types';
import { t } from '../localization';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  country?: Country;
}

const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab, country = 'Nigeria' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fix: Explicitly cast 'country' to 'Country' type to satisfy translation function signature
  const primaryItems = [
    { id: 'dashboard', label: t('nav_home', country as Country), icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
    { id: 'money-hub', label: t('nav_money_hub', country as Country), icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg> },
    { id: 'b2b', label: t('nav_work', country as Country), icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg> },
    { id: 'loans', label: t('nav_loans', country as Country), icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"/><path d="M2 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-1"/></svg> },
  ];

  // Fix: Explicitly cast 'country' to 'Country' type to satisfy translation function signature
  const menuItems = [
    { id: 'ai-gen', label: t('nav_helpers', country as Country), icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>, color: 'bg-purple-50 text-purple-600' },
    { id: 'deal-forge', label: t('nav_forge', country as Country), icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>, color: 'bg-amber-50 text-amber-600' },
    { id: 'crypto', label: t('nav_crypto', country as Country), icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>, color: 'bg-blue-50 text-blue-600' },
    { id: 'history', label: t('history', country as Country), icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/></svg>, color: 'bg-slate-50 text-slate-600' },
    { id: 'settings', label: t('nav_settings', country as Country), icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1-2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>, color: 'bg-indigo-50 text-indigo-600' },
    { id: 'membership', label: 'Plan', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>, color: 'bg-emerald-50 text-emerald-600' }
  ];

  const handleTabSelect = (id: string) => {
    setActiveTab(id);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Power Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[110] bg-slate-950/95 backdrop-blur-2xl animate-in fade-in duration-300 flex items-end">
          <div className="bg-white w-full rounded-t-[3.5rem] p-8 pb-32 animate-in slide-in-from-bottom-20 duration-500 shadow-[0_-20px_60px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-center mb-10">
               <div>
                 <h3 className="text-2xl font-[1000] text-slate-900 tracking-tight leading-none">Power Grid</h3>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2">All Hub Terminals</p>
               </div>
               <button 
                 onClick={() => setIsMenuOpen(false)}
                 className="w-14 h-14 bg-slate-50 text-slate-400 rounded-3xl flex items-center justify-center hover:bg-slate-100 transition-all border border-slate-100"
               >
                 <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12"/></svg>
               </button>
            </div>

            <div className="grid grid-cols-3 gap-6">
               {menuItems.map((item) => (
                 <button
                   key={item.id}
                   onClick={() => handleTabSelect(item.id)}
                   className="flex flex-col items-center gap-3 transition-all active:scale-90 group"
                 >
                   <div className={`w-16 h-16 rounded-[1.8rem] flex items-center justify-center shadow-sm transition-all group-hover:shadow-xl ${item.color}`}>
                     {item.icon}
                   </div>
                   <span className="text-[9px] font-[1000] text-slate-900 uppercase tracking-widest text-center">{item.label}</span>
                 </button>
               ))}
            </div>
            
            <div className="mt-12 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center leading-relaxed">
                 Accessing Secure Regional Node • NG-GH-SN Grid v2.5
               </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Bottom Nav Bar */}
      <nav className="xl:hidden fixed bottom-0 left-0 right-0 z-[120] bg-white/95 backdrop-blur-3xl border-t border-slate-100 shadow-[0_-15px_50px_rgba(0,0,0,0.08)] px-4 pb-8 pt-3">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {primaryItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabSelect(item.id)}
                className={`flex flex-col items-center gap-1.5 transition-all duration-300 relative px-3 py-2 rounded-2xl ${
                  isActive ? 'text-purple-600 scale-105' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <div className={`transition-all duration-300 flex items-center justify-center ${isActive ? 'scale-110' : ''}`}>
                  {item.icon}
                </div>
                <span className={`text-[8px] font-black uppercase tracking-wider transition-all ${
                  isActive ? 'opacity-100' : 'opacity-60'
                }`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute top-[-4px] left-1/2 -translate-x-1/2 w-6 h-1 bg-purple-600 rounded-full shadow-[0_0_10px_rgba(147,51,234,0.4)] animate-in fade-in zoom-in" />
                )}
              </button>
            );
          })}

          {/* More Menu Trigger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 px-3 py-2 rounded-2xl ${
              isMenuOpen ? 'text-purple-600 scale-105' : 'text-slate-400'
            }`}
          >
            <div className={`transition-all duration-300 ${isMenuOpen ? 'rotate-90 scale-110' : ''}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
            </div>
            <span className="text-[8px] font-black uppercase tracking-wider opacity-60">More</span>
            {isMenuOpen && (
               <div className="absolute top-[-4px] left-1/2 -translate-x-1/2 w-6 h-1 bg-purple-600 rounded-full shadow-[0_0_10px_rgba(147,51,234,0.4)] animate-in fade-in zoom-in" />
            )}
          </button>
        </div>
      </nav>
    </>
  );
};

export default MobileNav;
