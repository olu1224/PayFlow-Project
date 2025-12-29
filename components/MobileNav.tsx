
import React from 'react';
import { Country } from '../types';
import { t } from '../localization';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  country?: Country; // Added country prop for localization
}

const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab, country = 'Nigeria' }) => {
  const navItems = [
    { id: 'dashboard', label: t('nav_home', country), icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg> },
    { id: 'history', label: t('history', country), icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/></svg> },
    { id: 'loans', label: t('nav_loans', country), icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"/><path d="M2 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-1"/></svg> },
    { id: 'crypto', label: t('nav_crypto', country), icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg> },
    { id: 'money-hub', label: t('finance', country), icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg> },
  ];

  return (
    <nav className="xl:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-2xl border-t border-slate-100 px-4 pb-8 pt-3 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 relative group px-3 py-1 ${
              activeTab === item.id ? 'text-purple-600 scale-110' : 'text-slate-400'
            }`}
          >
            <div className={`transition-transform duration-300 ${activeTab === item.id ? 'translate-y-[-2px]' : ''}`}>
              {item.icon}
            </div>
            <span className={`text-[9px] font-black uppercase tracking-widest transition-all ${
              activeTab === item.id ? 'opacity-100 translate-y-0' : 'opacity-60'
            }`}>
              {item.label}
            </span>
            {activeTab === item.id && (
              <div className="absolute top-[-12px] w-8 h-1 bg-purple-600 rounded-full shadow-[0_0_10px_rgba(147,51,234,0.5)]" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;
