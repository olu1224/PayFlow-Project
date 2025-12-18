
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

  // Simplified Nav Items for Everyday Users - Restored Crypto
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg> },
    { id: 'history', label: 'History', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/></svg> },
    { id: 'loans', label: 'Loans', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"/><path d="M2 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-1"/></svg> },
    { id: 'crypto', label: 'Crypto', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg> },
    { id: 'investment-portfolio', label: 'Invest', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg> },
    { id: 'money-hub', label: 'Money Hub', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg> },
    { id: 'b2b', label: 'Business', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6z"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> },
    { id: 'nearby', label: 'Find Points', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg> },
  ];

  return (
    <div className="h-28 bg-white border-b-2 border-slate-100 flex items-center justify-between px-6 md:px-10 z-50 sticky top-0 shadow-2xl shadow-slate-100/50">
      <div className="flex items-center gap-8 flex-1">
        <Logo size="sm" />
        
        <nav className="hidden xl:flex items-center gap-1 p-1 bg-slate-50 rounded-2xl border border-slate-200">
           {navItems.map(item => (
             <button 
               key={item.id}
               onClick={() => setActiveTab(item.id)}
               className={`px-4 py-3 rounded-xl font-[900] text-[10px] uppercase tracking-[0.15em] transition-all flex items-center gap-2.5 group relative ${
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
      
      <div className="flex items-center gap-4">
        {/* The Elite Activation Navigation */}
        <button 
          onClick={() => setActiveTab('membership')} 
          className={`px-6 py-3.5 rounded-2xl font-[900] text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-2.5 shadow-xl border-2 ${
            activeTab === 'membership' 
              ? 'bg-indigo-600 text-white border-indigo-500 shadow-indigo-200' 
              : 'bg-white text-indigo-600 border-indigo-50 hover:bg-indigo-50 hover:border-indigo-100'
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="animate-pulse"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          {user.creditScore > 700 ? 'Elite Active' : 'Elite Plan'}
        </button>

        <div className="h-10 w-[2px] bg-slate-100 mx-1 hidden md:block"></div>

        <button 
          onClick={() => setShowCountryPicker(!showCountryPicker)}
          className="hidden sm:flex items-center gap-3 px-6 py-3.5 rounded-2xl border-2 border-slate-100 hover:border-purple-200 bg-white shadow-sm transition-all font-[900] text-sm group"
        >
          <span className="text-xl group-hover:scale-110 transition-transform">{currentCountry?.flag}</span>
          <span className="hidden lg:inline text-slate-800 uppercase tracking-widest text-[10px]">{currentCountry?.name}</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('settings')}
          className={`p-4 rounded-2xl transition-all shadow-xl ${activeTab === 'settings' ? 'bg-purple-600 text-white' : 'bg-slate-900 text-white hover:bg-purple-600'}`}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1-2 2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        </button>
      </div>

      {showCountryPicker && (
        <div className="absolute top-[110%] right-10 w-72 bg-white rounded-[3rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] border border-slate-100 py-6 z-[100] animate-in slide-in-from-top-4 duration-300 ring-4 ring-black/5">
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
