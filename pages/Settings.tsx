
import React from 'react';
import { User, Country, Currency } from '../types';

interface SettingsProps {
  user: User;
  onUpdateCountry: (c: Country) => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onUpdateCountry }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      <header>
        <button className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2 hover:text-purple-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Settings</h1>
        <p className="text-slate-500 font-medium">Manage your country, currency, and language preferences</p>
      </header>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
        <div className="space-y-4">
           <div className="flex items-center gap-2 text-purple-600">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
             <h3 className="font-bold text-slate-800">Country</h3>
           </div>
           <select 
             className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-200"
             value={user.country}
             onChange={(e) => onUpdateCountry(e.target.value as Country)}
           >
             <option value="Nigeria">🇳🇬 Nigeria</option>
             <option value="Ghana">🇬🇭 Ghana</option>
             <option value="Senegal">🇸🇳 Senegal</option>
           </select>
           <p className="text-xs text-slate-400 font-medium px-2">Your country determines available services and payment providers</p>
        </div>

        <div className="space-y-4">
           <div className="flex items-center gap-2 text-purple-600">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
             <h3 className="font-bold text-slate-800">Currency</h3>
           </div>
           <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-400 cursor-not-allowed">
             {user.currency === 'NGN' ? 'NGN (₦)' : user.currency === 'GHS' ? 'GHS (GH₵)' : 'XOF (CFA)'}
           </div>
           <p className="text-xs text-slate-400 font-medium px-2">Automatically set based on your country</p>
        </div>

        <div className="space-y-4">
           <div className="flex items-center gap-2 text-purple-600">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 8 6 6 6-6"/><path d="m2 18 6-6 6 6 6-6"/></svg>
             <h3 className="font-bold text-slate-800">Language</h3>
           </div>
           <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-200">
             <option>🇬🇧 English</option>
             <option>🇫🇷 Français</option>
             <option>🇳🇬 Yoruba / Igbo / Hausa</option>
           </select>
           <p className="text-xs text-slate-400 font-medium px-2">Choose your preferred language for the interface</p>
        </div>

        <div className="bg-purple-50 p-6 rounded-3xl border border-purple-100">
          <h4 className="font-black text-purple-800 text-sm mb-4">Available Services in {user.country}</h4>
          <div className="grid grid-cols-2 gap-y-3">
             <div className="flex items-center gap-2 text-purple-600 text-xs font-bold">
               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
               Electricity & Utilities
             </div>
             <div className="flex items-center gap-2 text-purple-600 text-xs font-bold">
               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
               Mobile Services
             </div>
             <div className="flex items-center gap-2 text-purple-600 text-xs font-bold">
               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
               Cable TV
             </div>
             <div className="flex items-center gap-2 text-purple-600 text-xs font-bold">
               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
               Internet
             </div>
             <div className="flex items-center gap-2 text-purple-600 text-xs font-bold">
               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
               Money Transfer
             </div>
             <div className="flex items-center gap-2 text-purple-600 text-xs font-bold">
               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
               Food & Groceries
             </div>
          </div>
        </div>

        <button className="w-full bg-purple-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-purple-200 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
           Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;
