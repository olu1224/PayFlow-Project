
import React, { useState } from 'react';
import { User, Country } from '../types';
import Logo from './Logo';

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

  const countries: { name: Country; flag: string }[] = [
    { name: 'Nigeria', flag: '🇳🇬' },
    { name: 'Ghana', flag: '🇬🇭' },
    { name: 'Senegal', flag: '🇸🇳' },
  ];

  const currentCountry = countries.find(c => c.name === user.country);

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg> },
    { id: 'deal-forge', label: 'Deal Forge', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg> },
    { id: 'ai-gen', label: 'Smart Helpers', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg> },
    { id: 'history', label: 'History', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/></svg> },
    { id: 'loans', label: 'Loans', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"/><path d="M2 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-1"/></svg> },
    { id: 'crypto', label: 'Crypto', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg> },
    { id: 'money-hub', label: 'Money Hub', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg> },
    { id: 'b2b', label: 'Business', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6z"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> },
    { id: 'nearby', label: 'Find Points', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg> },
  ];

  return (
    <div className="h-20 md:h-28 bg-white border-b border-slate-100 flex items-center justify-between px-5 md:px-10 z-50 sticky top-0 shadow-2xl shadow-slate-100/30">
      <div className="flex items-center gap-4 md:gap-8 flex-1 min-w-0">
        <Logo size="sm" />
        
        <nav className="hidden xl:flex items-center gap-1 p-1 bg-slate-50 rounded-2xl border border-slate-200 overflow-x-auto no-scrollbar max-w-full">
           {navItems.map(item => (
             <button 
               key={item.id}
               onClick={() => setActiveTab(item.id)}
               className={`px-4 py-3 rounded-xl font-[900] text-[10px] uppercase tracking-[0.15em] transition-all flex items-center gap-2.5 group shrink-0 relative ${
                 activeTab === item.id 
                  ? 'text-purple-600 bg-white shadow-md ring-1 ring-black/5' 
                  : 'text-slate-400 hover:text-slate-900 hover:bg-white/50'
               }`}
             >
               <span className={`${activeTab === item.id ? 'text-purple-600' : 'text-slate-300 group-hover:text-purple-400'} transition-colors`}>
                 {item.icon}
               </span>
               {item.label}
             </button>
           ))}
        </nav>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <button 
          onClick={() => setActiveTab('membership')} 
          className={`px-4 md:px-6 py-3 rounded-xl md:rounded-2xl font-[900] text-[9px] md:text-[10px] uppercase tracking-[0.15em] md:tracking-[0.2em] transition-all flex items-center gap-2 shadow-lg border ${
            activeTab === 'membership' 
              ? 'bg-indigo-600 text-white border-indigo-500 shadow-indigo-200' 
              : 'bg-white text-indigo-600 border-indigo-50 hover:bg-indigo-50'
          }`}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="animate-pulse hidden sm:block"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          {user.creditScore > 700 ? 'Elite' : 'Elite Plan'}
        </button>

        <div className="h-8 w-[1px] bg-slate-100 mx-1 hidden lg:block"></div>

        <button 
          onClick={() => setShowCountryPicker(!showCountryPicker)}
          className="flex items-center gap-2 md:gap-3 px-3 md:px-5 py-3 rounded-xl md:rounded-2xl border border-slate-100 bg-white shadow-sm transition-all font-[900] group shrink-0"
        >
          <span className="text-lg md:text-xl group-hover:scale-110 transition-transform">{currentCountry?.flag}</span>
          <span className="hidden sm:inline text-slate-800 uppercase tracking-widest text-[9px] md:text-[10px]">{currentCountry?.name}</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('settings')}
          className={`p-3 md:p-4 rounded-xl md:rounded-2xl transition-all shadow-lg ${activeTab === 'settings' ? 'bg-purple-600 text-white' : 'bg-slate-900 text-white hover:bg-purple-600'}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1-2 2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        </button>
      </div>

      {showCountryPicker && (
        <div className="absolute top-[110%] right-5 w-72 bg-white rounded-[3rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] border border-slate-100 py-6 z-[100] animate-in slide-in-from-top-4 duration-300 ring-4 ring-black/5">
          <p className="px-8 pb-4 text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Select Settlement Grid</p>
          {countries.map(c => (
            <button 
              key={c.name}
              onClick={() => {
                onUpdateCountry(c.name);
                setShowCountryPicker(false);
              }}
              className={`w-full flex items-center justify-between px-8 py-5 text-sm font-[900] transition-colors border-l-4 ${
                user.country === c.name 
                  ? 'bg-purple-50 text-purple-600 border-purple-600' 
                  : 'text-slate-600 border-transparent hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{c.flag}</span>
                {c.name}
              </div>
              {user.country === c.name && <div className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></div>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopBar;
