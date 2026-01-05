
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

  const countries: { name: Country; flag: string; code: string }[] = [
    { name: 'Nigeria', flag: '🇳🇬', code: 'NG' },
    { name: 'Ghana', flag: '🇬🇭', code: 'GH' },
    { name: 'Senegal', flag: '🇸🇳', code: 'SN' },
  ];

  const currentCountry = countries.find(c => c.name === user.country);

  const navItems = [
    { id: 'dashboard', label: t('nav_home', user.country), icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg> },
    { id: 'money-hub', label: t('nav_money_hub', user.country), icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg> },
    { id: 'loans', label: t('nav_loans', user.country), icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"/><path d="M2 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-1"/></svg> },
    { id: 'crypto', label: t('nav_crypto', user.country), icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg> },
    { id: 'b2b', label: t('nav_work', user.country), icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="19" cy="11" r="2"/></svg> },
    { id: 'ai-gen', label: t('nav_helpers', user.country), icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><rect width="18" height="10" x="3" y="11" rx="2"/><path d="M12 11V7"/><rect width="12" height="5" x="6" y="2" rx="1"/></svg> },
  ];

  const idPayload = `${window.location.origin}${window.location.pathname}#/settle?node=${user.name.replace(/\s+/g, '+')}&country=${user.country}`;

  return (
    <div className="h-20 md:h-28 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-8 z-50 sticky top-0 shadow-sm transition-all">
      <div className="flex items-center gap-4 md:gap-10">
        <div onClick={() => setActiveTab('dashboard')} className="scale-75 md:scale-90 cursor-pointer active:scale-95 transition-transform shrink-0 origin-left">
          <Logo size="lg" />
        </div>
        
        <nav className="hidden xl:flex items-center gap-1 p-1 bg-slate-50 rounded-full border border-slate-100">
           {navItems.map(item => (
             <button 
               key={item.id}
               onClick={() => setActiveTab(item.id)}
               className={`px-5 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${
                 activeTab === item.id 
                  ? 'text-indigo-600 bg-white shadow-md' 
                  : 'text-slate-500 hover:text-slate-900'
               }`}
             >
               {item.icon}
               {item.label}
             </button>
           ))}
        </nav>
      </div>
      
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        <button 
          onClick={() => setShowIDModal(true)}
          className="w-10 h-10 md:w-12 md:h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-600 transition-all shadow-lg active:scale-90"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><rect width="7" height="7" x="7" y="7" rx="1"/><path d="M17 17h.01"/><path d="M17 7h.01"/><path d="M7 17h.01"/></svg>
        </button>

        <button 
          onClick={onOpenSettings}
          className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-all border-2 active:scale-90 ${activeTab === 'settings' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1-2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        </button>

        <button 
          onClick={() => setShowCountryPicker(!showCountryPicker)}
          className="flex items-center gap-2 px-3 py-2 rounded-2xl border border-slate-100 bg-white shadow-sm transition-all group shrink-0"
        >
          <span className="text-xl group-hover:scale-110 transition-transform">{currentCountry?.flag}</span>
          <span className="hidden sm:inline text-slate-800 uppercase tracking-widest text-[9px] font-black">{currentCountry?.code}</span>
        </button>
      </div>

      {showIDModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-sm rounded-[3rem] p-10 shadow-2xl border border-white animate-in zoom-in-95">
              <div className="flex justify-between items-center mb-8">
                 <div className="space-y-1">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Node ID</h3>
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Active Scan Mode</p>
                 </div>
                 <button onClick={() => setShowIDModal(false)} className="p-2 text-slate-400 hover:text-slate-900 transition-all"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
              </div>

              <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 flex flex-col items-center gap-6">
                 <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(idPayload)}`} alt="ID QR" className="w-44 h-44" />
                 </div>
                 <div className="text-center space-y-1">
                    <p className="font-black text-slate-800 text-lg leading-tight">{user.name}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{user.country} Financial Node</p>
                 </div>
              </div>
           </div>
        </div>
      )}

      {showCountryPicker && (
        <div className="absolute top-[100%] right-4 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 p-2 z-[100] animate-in slide-in-from-top-2">
          <p className="px-4 py-3 text-[9px] font-black uppercase text-indigo-600 tracking-widest">Network Region</p>
          <div className="space-y-1">
            {countries.map(c => (
              <button 
                key={c.name}
                onClick={() => { onUpdateCountry(c.name); setShowCountryPicker(false); }}
                className={`w-full flex items-center justify-between px-4 py-3 text-[11px] font-black transition-all rounded-2xl ${user.country === c.name ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-3">
                  <span>{c.flag}</span>
                  <span className="tracking-wide">{c.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopBar;
