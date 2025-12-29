
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

  const countries: { name: Country; flag: string; code: string }[] = [
    { name: 'Nigeria', flag: '🇳🇬', code: 'NG' },
    { name: 'Ghana', flag: '🇬🇭', code: 'GH' },
    { name: 'Senegal', flag: '🇸🇳', code: 'SN' },
  ];

  const currentCountry = countries.find(c => c.name === user.country);

  const navItems = [
    { id: 'dashboard', label: t('nav_home', user.country), icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg> },
    { id: 'money-hub', label: t('nav_money_hub', user.country), icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg> },
    { id: 'loans', label: t('nav_loans', user.country), icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"/><path d="M2 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-1"/></svg> },
    { id: 'crypto', label: t('nav_crypto', user.country), icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg> },
    { id: 'b2b', label: t('nav_work', user.country), icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="19" cy="11" r="2"/></svg> },
    { id: 'ai-gen', label: t('nav_helpers', user.country), icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg> },
    { id: 'deal-forge', label: t('nav_forge', user.country), icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg> },
    { id: 'settings', label: t('nav_settings', user.country), icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1-2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
  ];

  return (
    <div className="h-20 md:h-32 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-12 z-50 sticky top-0 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] transition-all">
      <div className="flex items-center gap-6 md:gap-10 flex-1 min-w-0">
        <Logo size="sm" />
        
        <nav className="hidden xl:flex items-center gap-2 p-1.5 bg-slate-50 rounded-full border border-slate-200 overflow-x-auto no-scrollbar">
           {navItems.map(item => (
             <button 
               key={item.id}
               onClick={() => setActiveTab(item.id)}
               className={`px-5 py-3 rounded-full font-black text-[11px] uppercase tracking-[0.15em] transition-all flex items-center gap-3 group shrink-0 relative ${
                 activeTab === item.id 
                  ? 'text-purple-600 bg-white shadow-xl ring-1 ring-black/5' 
                  : 'text-black hover:text-purple-700 hover:bg-white/50'
               }`}
             >
               <span className={`${activeTab === item.id ? 'text-purple-600 scale-110' : 'text-black group-hover:text-purple-600'} transition-all`}>
                 {item.icon}
               </span>
               {item.label}
             </button>
           ))}
        </nav>
      </div>
      
      <div className="flex items-center gap-3 md:gap-6 shrink-0 ml-4">
        <button 
          onClick={() => setActiveTab('membership')} 
          className={`px-5 md:px-8 py-3.5 md:py-4.5 rounded-full font-black text-[11px] md:text-[12px] uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-xl border-2 ${
            activeTab === 'membership' 
              ? 'bg-indigo-600 text-white border-indigo-400' 
              : 'bg-white text-indigo-700 border-indigo-100 hover:bg-indigo-50 hover:border-indigo-200'
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="animate-pulse hidden sm:block"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          {user.creditScore > 700 ? t('nav_elite', user.country) : t('nav_membership', user.country)}
        </button>

        <button 
          onClick={() => setShowCountryPicker(!showCountryPicker)}
          className="flex items-center gap-3 px-4 py-3.5 rounded-full border-2 border-slate-100 bg-white shadow-lg transition-all font-black group shrink-0 hover:border-purple-200"
        >
          <span className="text-xl md:text-2xl group-hover:scale-125 transition-transform">{currentCountry?.flag}</span>
          <span className="hidden sm:inline text-black uppercase tracking-[0.2em] text-[10px] md:text-[11px]">{currentCountry?.name}</span>
        </button>
      </div>

      {showCountryPicker && (
        <div className="absolute top-[110%] right-4 md:right-12 w-72 md:w-80 bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] border border-slate-100 py-6 z-[100] animate-in slide-in-from-top-4 duration-500 ring-4 ring-black/5 p-2">
          <p className="px-8 pb-4 text-[10px] font-black uppercase text-purple-600 tracking-[0.3em]">{t('select_grid', user.country)}</p>
          <div className="space-y-1.5">
            {countries.map(c => (
              <button 
                key={c.name}
                onClick={() => {
                  onUpdateCountry(c.name);
                  setShowCountryPicker(false);
                }}
                className={`w-full flex items-center justify-between px-8 py-5 text-sm font-black transition-all rounded-[2rem] group ${
                  user.country === c.name 
                    ? 'bg-purple-600 text-white shadow-2xl scale-[1.02]' 
                    : 'text-black hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-5">
                  <span className={`text-base font-black uppercase w-8 transition-colors ${user.country === c.name ? 'text-white' : 'text-purple-600'}`}>
                    {c.code}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl drop-shadow-md group-hover:scale-110 transition-transform">{c.flag}</span>
                    <span className="text-base tracking-tight">{c.name}</span>
                  </div>
                </div>
                {user.country === c.name && <div className="w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_10px_white]"></div>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopBar;
