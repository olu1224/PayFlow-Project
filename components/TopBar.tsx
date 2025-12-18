
import React, { useState } from 'react';
import { User } from '../types';

interface TopBarProps {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ user, activeTab, setActiveTab, onOpenNotifications, onOpenSettings }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const NavItem = ({ id, label, icon, hasDropdown }: { id: string; label: string; icon: React.ReactNode; hasDropdown?: boolean }) => {
    const isActive = activeTab === id || (hasDropdown && id === openDropdown);
    
    return (
      <div className="relative h-full flex items-center">
        <button 
          onClick={() => {
            if (hasDropdown) {
              setOpenDropdown(openDropdown === id ? null : id);
            } else {
              setActiveTab(id);
              setOpenDropdown(null);
            }
          }}
          onMouseEnter={() => hasDropdown && setOpenDropdown(id)}
          className={`flex items-center gap-2.5 px-4 py-2 rounded-xl transition-all duration-200 group ${
            isActive 
              ? 'bg-purple-600 text-white shadow-md' 
              : 'text-slate-500 hover:text-purple-600 hover:bg-slate-50'
          }`}
        >
          <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-purple-500'}>{icon}</span>
          <span className="text-[13px] font-bold">{label}</span>
          {hasDropdown && (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`ml-0.5 transition-transform ${openDropdown === id ? 'rotate-180' : ''}`}>
              <path d="m6 9 6 6 6-6"/>
            </svg>
          )}
        </button>

        {hasDropdown && openDropdown === id && (
          <div 
            className="absolute top-full left-0 mt-1 w-52 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-50 animate-in fade-in zoom-in-95 duration-200"
            onMouseLeave={() => setOpenDropdown(null)}
          >
            {id === 'finance' && (
              <>
                <DropdownLink icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"/><path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-5.4a2 2 0 0 0-3-2.7L15 13"/><path d="M2 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-1"/></svg>} label="Loans & Credit" onClick={() => {setActiveTab('loans'); setOpenDropdown(null);}} />
                <DropdownLink icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>} label="B2B Portal" onClick={() => {setActiveTab('b2b'); setOpenDropdown(null);}} />
                <DropdownLink icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>} label="Nearby Finance" onClick={() => {setActiveTab('nearby'); setOpenDropdown(null);}} />
              </>
            )}
            {id === 'invest' && (
              <>
                <DropdownLink icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>} label="Crypto Hub" onClick={() => {setActiveTab('crypto'); setOpenDropdown(null);}} />
                <DropdownLink icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>} label="Portfolio" onClick={() => {setActiveTab('investment-portfolio'); setOpenDropdown(null);}} />
              </>
            )}
            {id === 'ai' && (
              <>
                <DropdownLink icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/></svg>} label="AI Agents" onClick={() => {setActiveTab('ai-agents'); setOpenDropdown(null);}} />
                <DropdownLink icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>} label="Planning" onClick={() => {setActiveTab('ai-planning'); setOpenDropdown(null);}} />
                <DropdownLink icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>} label="Smart Categorize" onClick={() => {setActiveTab('auto-categorize'); setOpenDropdown(null);}} />
                <DropdownLink icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>} label="Analytics" onClick={() => {setActiveTab('analytics'); setOpenDropdown(null);}} />
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  const DropdownLink = ({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) => (
    <button 
      onClick={onClick}
      className="w-full flex items-center gap-3 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-purple-600 transition-colors"
    >
      <span className="text-slate-400 group-hover:text-purple-500">{icon}</span>
      {label}
    </button>
  );

  return (
    <div className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 z-50 sticky top-0 shadow-sm">
      <div className="flex items-center gap-2 h-full">
        <NavItem id="dashboard" label="Home" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>} />
        <NavItem id="recurring" label="Wallet" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>} />
        <NavItem id="history" label="History" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="14" x="3" y="5" rx="2"/><path d="M12 9v6"/><path d="M9 12h6"/></svg>} />
        <NavItem id="finance" label="Finance" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>} hasDropdown />
        <NavItem id="invest" label="Invest" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>} hasDropdown />
        <NavItem id="ai" label="AI" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>} hasDropdown />
        <NavItem id="beneficiaries" label="Contacts" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="19" cy="11" r="2"/></svg>} />
      </div>
      
      <div className="flex items-center gap-2">
        <div className="h-6 w-[1px] bg-slate-200 mx-4"></div>
        <button onClick={onOpenSettings} className={`p-2.5 rounded-xl transition-all ${activeTab === 'settings' ? 'text-purple-600 bg-purple-50' : 'text-slate-400 hover:text-purple-600 hover:bg-slate-50'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        </button>
        <button onClick={onOpenNotifications} className="p-2.5 text-slate-400 hover:text-purple-600 hover:bg-slate-50 rounded-xl transition-all relative">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-emerald-500 rounded-full border border-white"></span>
        </button>
        <button className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
        </button>
      </div>
    </div>
  );
};

export default TopBar;
