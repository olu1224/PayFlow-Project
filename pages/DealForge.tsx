
import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface ForgeDeal {
  id: string;
  title: string;
  target: number;
  current: number;
  reward: string;
  category: string;
  expiresIn: string;
  color: string;
  icon: React.ReactNode;
}

const DealForge: React.FC<{ user: User }> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'utility' | 'crypto' | 'capital'>('utility');
  const [joinedDeals, setJoinedDeals] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [newDeal, setNewDeal] = useState({
    title: '',
    category: 'utility',
    participants: '250',
    reward: '5% Cashback'
  });

  const initialDeals: ForgeDeal[] = [
    {
      id: 'd1',
      title: 'Lagos Light Pool',
      target: 500,
      current: 412,
      reward: '5% Cashback on IKEDC',
      category: 'utility',
      expiresIn: '02h 14m',
      color: 'from-amber-400 to-orange-600',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
    },
    {
      id: 'd2',
      title: 'Accra Data Tribe',
      target: 1000,
      current: 890,
      reward: 'ZERO Fees on MTN Fiber',
      category: 'utility',
      expiresIn: '45m 10s',
      color: 'from-blue-400 to-indigo-600',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
    },
    {
      id: 'd3',
      title: 'BTC Flash Raid',
      target: 25.0,
      current: 18.4,
      reward: '+0.5% Sell Rate',
      category: 'crypto',
      expiresIn: '12m 04s',
      color: 'from-purple-400 to-fuchsia-600',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
    },
    {
      id: 'd4',
      title: 'Dakar Merchant Syndicate',
      target: 20,
      current: 14,
      reward: '-2% Loan Interest',
      category: 'capital',
      expiresIn: '1d 04h',
      color: 'from-emerald-400 to-teal-600',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="19" cy="11" r="2"/></svg>
    }
  ];

  const [deals, setDeals] = useState<ForgeDeal[]>(initialDeals);

  const filteredDeals = deals.filter(d => d.category === activeTab);

  const handleJoin = (id: string) => {
    if (joinedDeals.includes(id)) return;
    setJoinedDeals([...joinedDeals, id]);
  };

  const handleCreateForge = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeploying(true);
    
    // Simulate smart contract / pool deployment animation
    await new Promise(r => setTimeout(r, 2500));

    const deal: ForgeDeal = {
      id: 'custom-' + Date.now(),
      title: newDeal.title,
      category: newDeal.category,
      target: parseInt(newDeal.participants),
      current: 1, // User is the first one
      reward: newDeal.reward,
      expiresIn: '2d 00h',
      color: newDeal.category === 'utility' ? 'from-amber-400 to-orange-600' : newDeal.category === 'crypto' ? 'from-purple-400 to-indigo-600' : 'from-emerald-400 to-teal-600',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
    };

    setDeals([deal, ...deals]);
    setJoinedDeals([...joinedDeals, deal.id]);
    setIsDeploying(false);
    setIsCreateModalOpen(false);
    setNewDeal({ title: '', category: 'utility', participants: '250', reward: '5% Cashback' });
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 animate-in fade-in duration-700 pb-24">
      {/* Cinematic Header */}
      <header className="relative py-12 px-6 overflow-hidden rounded-[4rem] bg-slate-950 text-white border border-white/5 shadow-2xl">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="text-center md:text-left space-y-4">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping"></span>
              Live Syndicate Hub
            </div>
            <h1 className="text-5xl md:text-7xl font-[900] tracking-tighter leading-none">The <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-emerald-400">Deal Forge</span></h1>
            <p className="text-slate-400 font-medium text-lg max-w-xl">
              Don't just pay—command the grid. Pool your transactions with thousands of others to crush fees and unlock institutional rates.
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-2xl p-8 rounded-[3rem] border border-white/10 shadow-2xl flex items-center gap-8 group hover:border-purple-500/30 transition-all">
            <div className="text-center">
              <p className="text-3xl font-[900] text-purple-400 leading-none">12.4k</p>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-2">Active Forgers</p>
            </div>
            <div className="w-[1px] h-12 bg-white/10"></div>
            <div className="text-center">
              <p className="text-3xl font-[900] text-emerald-400 leading-none">18%</p>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-2">Avg. Savings</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation & Interaction */}
      <div className="flex flex-col lg:flex-row gap-10 px-4">
        <aside className="lg:w-72 space-y-6">
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-4">Forge Sectors</p>
            {(['utility', 'crypto', 'capital'] as const).map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                {tab}
                {activeTab === tab && <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></div>}
              </button>
            ))}
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[3rem] text-white space-y-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform"></div>
            <h3 className="font-black text-lg leading-tight">My Forge Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-400 uppercase font-black">Impact Score</span>
                <span className="text-emerald-400 font-black">A+</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-3/4"></div>
              </div>
              <p className="text-[10px] text-slate-500 font-bold leading-relaxed">Join 3 more Forges this week to unlock "Syndicate Lead" status.</p>
            </div>
          </div>
        </aside>

        <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredDeals.map(deal => (
            <div key={deal.id} className="bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all group flex flex-col relative overflow-hidden">
              {/* Heat Background */}
              <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${deal.color} opacity-[0.03] group-hover:opacity-[0.08] rounded-full -mr-20 -mt-20 blur-3xl transition-all duration-700`}></div>
              
              <div className="flex justify-between items-start mb-10 relative z-10">
                <div className={`w-16 h-16 bg-slate-50 rounded-[1.8rem] flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 shadow-inner`}>
                  {deal.icon}
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest animate-pulse">{deal.expiresIn}</p>
                  <p className="text-[9px] font-bold text-slate-300 uppercase mt-1">Time Remaining</p>
                </div>
              </div>

              <div className="flex-1 space-y-4 relative z-10">
                <h3 className="text-2xl font-[900] text-slate-900 tracking-tight leading-none group-hover:text-purple-600 transition-colors">{deal.title}</h3>
                <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-2xl border border-emerald-100 w-fit">
                   <p className="text-[11px] font-black uppercase tracking-widest">{deal.reward}</p>
                </div>
              </div>

              <div className="mt-12 space-y-4 relative z-10">
                <div className="flex justify-between items-end">
                   <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Syndicate Power</p>
                     <p className="text-lg font-black text-slate-800">{deal.current} / {deal.target} Members</p>
                   </div>
                   <span className="text-sm font-black text-purple-600">{Math.round((deal.current/deal.target)*100)}%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                  <div 
                    className={`h-full bg-gradient-to-r ${deal.color} rounded-full transition-all duration-[2s]`} 
                    style={{ width: `${(deal.current/deal.target)*100}%` }}
                  ></div>
                </div>
              </div>

              <button 
                onClick={() => handleJoin(deal.id)}
                disabled={joinedDeals.includes(deal.id)}
                className={`w-full mt-8 py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl ${
                  joinedDeals.includes(deal.id) 
                    ? 'bg-emerald-50 text-emerald-600 cursor-default' 
                    : 'bg-slate-900 text-white hover:bg-purple-600 shadow-purple-500/10'
                }`}
              >
                {joinedDeals.includes(deal.id) ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6L9 17l-5-5"/></svg>
                    Locked Into Forge
                  </>
                ) : (
                  <>
                    Enter Syndicate
                    <svg className="group-hover:translate-x-1 transition-transform" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </>
                )}
              </button>
            </div>
          ))}
        </main>
      </div>

      <section className="bg-purple-50 p-12 md:p-20 rounded-[4rem] mx-4 border border-purple-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200/50 rounded-full blur-[100px] -mr-40 -mt-40"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-16">
          <div className="w-48 h-48 md:w-64 md:h-64 bg-white rounded-[3rem] shadow-2xl flex items-center justify-center shrink-0 border-4 border-white rotate-3 group hover:rotate-0 transition-transform duration-700">
             <div className="text-center space-y-2">
                <p className="text-6xl">💎</p>
                <p className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Syndicate NFT</p>
             </div>
          </div>
          <div className="space-y-8 text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-[900] text-slate-900 tracking-tighter leading-none">Become a <span className="text-purple-600">Deal Maker</span></h2>
            <p className="text-slate-600 font-medium text-lg max-w-2xl">
              Found a merchant or biller we haven't forged yet? Start your own deal pool and earn <span className="text-purple-600 font-black">0.5% Commission</span> on every transaction made through your syndicate.
            </p>
            <button onClick={() => setIsCreateModalOpen(true)} className="bg-slate-900 text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl hover:bg-purple-600 transition-all hover:scale-105 active:scale-95">Initialize My Own Forge</button>
          </div>
        </div>
      </section>

      {/* CREATE FORGE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[3.5rem] p-10 md:p-14 shadow-2xl relative overflow-hidden border border-white">
             {isDeploying ? (
                <div className="py-20 text-center space-y-8 animate-pulse">
                   <div className="w-24 h-24 border-8 border-slate-100 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
                   <div className="space-y-2">
                      <h3 className="text-2xl font-black text-slate-900 uppercase tracking-widest">Forging Syndicate...</h3>
                      <p className="text-slate-500 font-medium">Broadcasting pool parameters to the regional node.</p>
                   </div>
                </div>
             ) : (
                <>
                  <div className="flex justify-between items-center mb-10">
                    <div className="space-y-1">
                       <h2 className="text-3xl font-[900] text-slate-900 tracking-tight leading-none">New Forge</h2>
                       <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest">Initialize Liquidity Pool</p>
                    </div>
                    <button onClick={() => setIsCreateModalOpen(false)} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-all">
                       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M18 6 6 18M6 6l12 12"/></svg>
                    </button>
                  </div>

                  <form onSubmit={handleCreateForge} className="space-y-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Syndicate Name</label>
                       <input 
                         required
                         className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:border-purple-600 outline-none transition-all shadow-inner"
                         placeholder="e.g. Lagos Diesel Pool"
                         value={newDeal.title}
                         onChange={e => setNewDeal({...newDeal, title: e.target.value})}
                       />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sector</label>
                          <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:border-purple-600 outline-none appearance-none" value={newDeal.category} onChange={e => setNewDeal({...newDeal, category: e.target.value})}>
                             <option value="utility">Utility</option>
                             <option value="crypto">Crypto</option>
                             <option value="capital">Capital</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Reward Goal</label>
                          <input 
                             required
                             className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:border-purple-600 outline-none transition-all shadow-inner"
                             placeholder="e.g. 5% Cashback"
                             value={newDeal.reward}
                             onChange={e => setNewDeal({...newDeal, reward: e.target.value})}
                          />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Forge Capacity (Participants)</label>
                       <input 
                         type="number"
                         required
                         className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:border-purple-600 outline-none transition-all shadow-inner"
                         value={newDeal.participants}
                         onChange={e => setNewDeal({...newDeal, participants: e.target.value})}
                       />
                    </div>

                    <div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100 space-y-2">
                       <p className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">Founder Bonus</p>
                       <p className="text-xs font-medium text-indigo-600 leading-relaxed">As the initiator, you will earn <span className="font-black">0.5% Commission</span> on every participant's successful settlement within this forge.</p>
                    </div>

                    <button type="submit" className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.25em] text-[11px] shadow-2xl hover:bg-purple-600 transition-all active:scale-95">Deploy Forge Protocol</button>
                  </form>
                </>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DealForge;
