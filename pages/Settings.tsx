
import React, { useState } from 'react';
import { User, Country, Currency } from '../types';

interface SettingsProps {
  user: User;
  onUpdateCountry: (c: Country) => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onUpdateCountry }) => {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'security' | 'preferences'>('profile');

  const SectionTitle = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
    <div className="flex items-start gap-6 mb-10">
      <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-[1.4rem] flex items-center justify-center shrink-0 border border-purple-200">
        {icon}
      </div>
      <div>
        <h3 className="text-2xl font-[900] text-slate-900 tracking-tight leading-none">{title}</h3>
        <p className="text-sm text-slate-500 font-bold mt-2 opacity-80">{desc}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 animate-in fade-in duration-500 pb-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-4">
        <div className="space-y-2">
          <h1 className="text-5xl font-[900] text-slate-900 tracking-tight leading-none">Settings</h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs">Control & Customization Console</p>
        </div>
        <div className="flex bg-white/60 backdrop-blur-xl p-1.5 rounded-[2.2rem] shadow-xl border border-white">
           <button onClick={() => setActiveSubTab('profile')} className={`px-8 py-4 rounded-[1.8rem] font-black text-[10px] uppercase tracking-widest transition-all ${activeSubTab === 'profile' ? 'bg-slate-900 text-white shadow-2xl' : 'text-slate-400 hover:text-slate-900'}`}>Profile</button>
           <button onClick={() => setActiveSubTab('security')} className={`px-8 py-4 rounded-[1.8rem] font-black text-[10px] uppercase tracking-widest transition-all ${activeSubTab === 'security' ? 'bg-slate-900 text-white shadow-2xl' : 'text-slate-400 hover:text-slate-900'}`}>Security</button>
           <button onClick={() => setActiveSubTab('preferences')} className={`px-8 py-4 rounded-[1.8rem] font-black text-[10px] uppercase tracking-widest transition-all ${activeSubTab === 'preferences' ? 'bg-slate-900 text-white shadow-2xl' : 'text-slate-400 hover:text-slate-900'}`}>Preference</button>
        </div>
      </header>

      <div className="bg-white/50 backdrop-blur-sm rounded-[4rem] border-2 border-white shadow-2xl overflow-hidden min-h-[600px]">
        {activeSubTab === 'profile' && (
          <div className="p-12 md:p-20 animate-in slide-in-from-right-8 duration-500 space-y-12">
            <div className="flex flex-col md:flex-row items-center gap-12 border-b border-slate-100 pb-12">
              <div className="relative group">
                <div className="w-40 h-40 rounded-full bg-slate-100 border-8 border-white shadow-2xl flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <button className="absolute bottom-2 right-2 w-12 h-12 bg-purple-600 text-white rounded-full border-4 border-white flex items-center justify-center shadow-2xl hover:scale-110 transition-all">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
              </div>
              <div className="text-center md:text-left space-y-2">
                <h2 className="text-4xl font-[900] text-slate-900 tracking-tight">{user.name}</h2>
                <p className="text-slate-500 font-black uppercase tracking-[0.25em] text-xs">{user.email}</p>
                <div className="flex justify-center md:justify-start gap-3 mt-6">
                  <span className="bg-purple-600 text-white px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg">Tier 2 Elite</span>
                  <span className="bg-emerald-500 text-white px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg">Authenticated</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Regional Grid Access</label>
                <select className="w-full bg-white border-2 border-slate-100 rounded-[2.2rem] px-8 py-6 font-black text-slate-900 focus:border-purple-600 outline-none transition-all shadow-sm appearance-none" value={user.country} onChange={(e) => onUpdateCountry(e.target.value as Country)}>
                  <option value="Nigeria">🇳🇬 Nigeria</option>
                  <option value="Ghana">🇬🇭 Ghana</option>
                  <option value="Senegal">🇸🇳 Senegal</option>
                </select>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Native Ledger Currency</label>
                <div className="w-full bg-slate-100/50 border-2 border-slate-100 rounded-[2.2rem] px-8 py-6 font-black text-slate-400 cursor-not-allowed">
                  {user.currency === 'NGN' ? 'Nigerian Naira (₦)' : user.currency === 'GHS' ? 'Ghanaian Cedi (GH₵)' : 'West African CFA (XOF)'}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'security' && (
          <div className="p-12 md:p-20 animate-in slide-in-from-right-8 duration-500 space-y-12">
            <SectionTitle 
              icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
              title="Identity Hub Shield"
              desc="Configure high-level security protocols for regional settlements."
            />
            <div className="space-y-6">
              <SecurityToggle label="Biometric Vault Lock" desc="Use biometric sensors for all fund movement." active={user.security.biometricsEnabled} />
              <SecurityToggle label="Advanced 2FA Grid" desc="Multi-factor authentication via encrypted push nodes." active={user.security.twoFactorEnabled} />
              <SecurityToggle label="Stealth Mode" desc="Automatically mask all dashboard balances." active={user.security.hideBalances} />
            </div>
          </div>
        )}

        {activeSubTab === 'preferences' && (
          <div className="p-12 md:p-20 animate-in slide-in-from-right-8 duration-500 space-y-12">
            <SectionTitle 
              icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
              title="Interface Intelligence"
              desc="How PayFlow interacts with your daily workflow."
            />
            <div className="space-y-6">
              <SecurityToggle label="Push Command Alerts" desc="Real-time notifications for ledger updates." active={user.preferences.notifications} />
              <SecurityToggle label="Market Intelligence" desc="Daily regional trading signals and utility updates." active={true} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SecurityToggle = ({ label, desc, active }: { label: string, desc: string, active: boolean }) => (
  <div className="flex items-center justify-between p-8 bg-white rounded-[3rem] border border-slate-100 hover:border-purple-200 transition-all shadow-sm">
    <div className="space-y-2">
      <p className="font-[900] text-slate-900 text-lg tracking-tight leading-none">{label}</p>
      <p className="text-xs text-slate-500 font-bold max-w-sm opacity-80">{desc}</p>
    </div>
    <button className={`w-16 h-8 rounded-full transition-all relative shrink-0 ${active ? 'bg-purple-600 shadow-xl' : 'bg-slate-200'}`}>
      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${active ? 'right-1' : 'left-1'}`} />
    </button>
  </div>
);

export default Settings;
