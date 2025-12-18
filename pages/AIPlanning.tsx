
import React, { useState } from 'react';
import { User } from '../types';

const AIPlanning: React.FC<{ user: User }> = ({ user }) => {
  const [profile, setProfile] = useState({
    monthlyIncome: '',
    riskTolerance: 'Moderate (Balanced)',
    experience: 'Beginner',
    timeHorizon: 'Medium Term (3-10 years)',
    dependents: '0',
    emergencyFund: '3'
  });
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      <header>
        <div className="flex items-center gap-4 mb-2">
          <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">AI Financial Planning</h1>
        </div>
        <p className="text-slate-500 font-medium">Your personalized AI-powered financial advisor</p>
      </header>

      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
        <div>
          <h2 className="text-xl font-black text-slate-800 mb-1">Complete Your Financial Profile</h2>
          <p className="text-slate-400 text-sm font-medium">Set up your financial profile to get personalized AI recommendations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Monthly Income *</label>
            <input 
              placeholder="Enter monthly income" 
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-purple-200 outline-none font-medium"
              value={profile.monthlyIncome}
              onChange={e => setProfile({...profile, monthlyIncome: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Risk Tolerance *</label>
            <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-purple-200 outline-none font-medium">
               <option>Low (Conservative)</option>
               <option selected>Moderate (Balanced)</option>
               <option>High (Aggressive)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Investment Experience</label>
            <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-purple-200 outline-none font-medium">
               <option>Beginner</option>
               <option>Intermediate</option>
               <option>Expert</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Time Horizon</label>
            <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-purple-200 outline-none font-medium">
               <option>Short Term (1-3 years)</option>
               <option selected>Medium Term (3-10 years)</option>
               <option>Long Term (10+ years)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Number of Dependents</label>
            <input 
              type="number"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-purple-200 outline-none font-medium"
              value={profile.dependents}
              onChange={e => setProfile({...profile, dependents: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Emergency Fund (months)</label>
            <input 
              type="number"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-purple-200 outline-none font-medium"
              value={profile.emergencyFund}
              onChange={e => setProfile({...profile, emergencyFund: e.target.value})}
            />
          </div>
        </div>

        <button 
          onClick={() => setIsSaved(true)}
          className="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-purple-700 transition-all shadow-lg shadow-purple-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          Save Profile
        </button>
      </div>

      <div className="space-y-6">
        <div className="flex gap-4 p-1 bg-slate-100 w-fit rounded-2xl">
          <button className="px-6 py-2 bg-white text-slate-800 rounded-xl shadow-sm font-bold text-sm flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M2 12h2"/><path d="M20 12h2"/></svg>
            Financial Roadmap
          </button>
          <button className="px-6 py-2 text-slate-500 hover:bg-white/50 rounded-xl font-bold text-sm flex items-center gap-2 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
            Investments
          </button>
          <button className="px-6 py-2 text-slate-500 hover:bg-white/50 rounded-xl font-bold text-sm flex items-center gap-2 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            AI Assistant
          </button>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-32 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
             <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800">Profile Required</h3>
            <p className="text-slate-400 font-medium">Complete your financial profile above to generate a personalized roadmap</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPlanning;
