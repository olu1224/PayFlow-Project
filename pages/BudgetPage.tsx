
import React, { useState } from 'react';
import { User, BudgetGoal } from '../types';
import { generateBudgetStrategy } from '../geminiService';

interface BudgetPageProps {
  user: User;
  goals: BudgetGoal[];
  onAddGoal: (goal: Omit<BudgetGoal, 'id'>) => void;
  onUpdateGoal?: (goalId: string, amount: number) => void;
  onUpdateUserWealth?: (updates: Partial<User['wealth']>) => void;
  onNewTransaction: (amount: number, name: string, category: string) => void;
}

const FINTECH_PARTNERS: Record<string, { name: string, logo: string, desc: string, type: 'savings' | 'investment' }[]> = {
  'Nigeria': [
    { name: 'PiggyVest', logo: '🐷', desc: 'Best for Safelock & Flex savings', type: 'savings' },
    { name: 'Cowrywise', logo: '🐚', desc: 'Automated savings & Mutual funds', type: 'savings' },
    { name: 'Bamboo', logo: '🎍', desc: 'Buy US Stocks & Dollar assets', type: 'investment' },
    { name: 'FairMoney', logo: '⚖️', desc: 'High interest & instant loans', type: 'savings' }
  ],
  'Ghana': [
    { name: 'Zeepay', logo: '⚡', desc: 'Mobile money & remittances', type: 'savings' },
    { name: 'Hubtel', logo: '📱', desc: 'Everyday payments & savings', type: 'savings' }
  ],
  'Senegal': [
    { name: 'Wave', logo: '🌊', desc: 'Low cost mobile payments', type: 'savings' },
    { name: 'Orange Money', logo: '🍊', desc: 'Regional standard wallet', type: 'savings' }
  ]
};

const BudgetPage: React.FC<BudgetPageProps> = ({ user, goals, onAddGoal, onUpdateGoal, onNewTransaction, onUpdateUserWealth }) => {
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState({ title: '', target: '', color: 'bg-purple-600' });
  const [activeTab, setActiveTab] = useState<'goals' | 'strategy' | 'wealth'>('wealth');
  
  // Local state synced with user.wealth
  const wealth = user.wealth || {
    emergencyFund: { tier1: 50000, tier2: 0, target: 250000 },
    dollarFund: { balanceUsd: 0, investedNaira: 0 },
    connectedPlatforms: []
  };

  const getStrategy = async () => {
    setLoading(true);
    try {
      const res = await generateBudgetStrategy(goals, user.balance, user.currency, user.country);
      setStrategy(res);
      setActiveTab('strategy');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.target) return;
    onAddGoal({ 
      title: newGoal.title, 
      target: parseFloat(newGoal.target), 
      current: 0, 
      color: newGoal.color 
    });
    setShowAdd(false);
    setNewGoal({ title: '', target: '', color: 'bg-purple-600' });
  };

  const handleContributeToGoal = (goal: BudgetGoal, amt: number) => {
    if (user.balance < amt) return alert("Insufficient funds in main wallet.");
    if (onUpdateGoal) {
      onUpdateGoal(goal.id, amt);
      onNewTransaction(-amt, `Saved for: ${goal.title}`, 'Savings');
    }
  };

  const partners = FINTECH_PARTNERS[user.country] || [];
  const currencySymbol = user.currency === 'NGN' ? '₦' : user.currency === 'GHS' ? 'GH₵' : 'CFA';

  const handleMoveToEmergency = (amt: number, tier: 1 | 2) => {
    if (user.balance < amt) return alert("Not enough money in your main wallet.");
    const updatedEF = { ...wealth.emergencyFund };
    if (tier === 1) updatedEF.tier1 += amt;
    else updatedEF.tier2 += amt;
    
    if (onUpdateUserWealth) {
      onUpdateUserWealth({ emergencyFund: updatedEF });
      onNewTransaction(-amt, `Transfer to Safety Net (Tier ${tier})`, 'Savings');
    }
  };

  const handleDollarHedge = (nairaAmt: number) => {
    if (user.balance < nairaAmt) return alert("Not enough money in your main wallet.");
    const rate = 1600; // Mock rate
    const usd = nairaAmt / rate;
    const updatedDF = { 
      balanceUsd: wealth.dollarFund.balanceUsd + usd,
      investedNaira: wealth.dollarFund.investedNaira + nairaAmt
    };
    
    if (onUpdateUserWealth) {
      onUpdateUserWealth({ dollarFund: updatedDF });
      onNewTransaction(-nairaAmt, `Hedge: Dollar Fund Purchase`, 'Investment');
    }
  };

  const handleConnectFintech = async (name: string) => {
    if (wealth.connectedPlatforms.includes(name)) return;
    setConnectingPlatform(name);
    await new Promise(r => setTimeout(r, 2000));
    if (onUpdateUserWealth) {
      onUpdateUserWealth({ connectedPlatforms: [...wealth.connectedPlatforms, name] });
    }
    setConnectingPlatform(null);
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-10 animate-in fade-in duration-500 pb-24 px-4">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-[1000] text-slate-900 tracking-tight leading-none">Money Hub</h1>
          <p className="text-slate-500 font-bold text-sm">Grow your money and protect it from inflation.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
           <button onClick={() => setActiveTab('wealth')} className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'wealth' ? 'bg-white text-purple-600 shadow-md' : 'text-slate-400 hover:text-slate-700'}`}>My Wealth</button>
           <button onClick={() => setActiveTab('goals')} className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'goals' ? 'bg-white text-purple-600 shadow-md' : 'text-slate-400 hover:text-slate-700'}`}>Custom Goals</button>
           <button onClick={() => setActiveTab('strategy')} className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'strategy' ? 'bg-white text-purple-600 shadow-md' : 'text-slate-400 hover:text-slate-700'}`}>AI Plan</button>
        </div>
      </header>

      {activeTab === 'wealth' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-8">
            
            {/* TIERED EMERGENCY FUND SECTION */}
            <section className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-xl space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-slate-900">Your Safety Net</h2>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Tiered Emergency Fund</p>
                </div>
                <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black text-emerald-600 uppercase bg-emerald-50 px-3 py-1 rounded-lg">Tier 1: Instant Access</span>
                    <span className="text-xs font-bold text-slate-400 italic">No Withdrawal Fees</span>
                  </div>
                  <p className="text-3xl font-black text-slate-900">{currencySymbol}{wealth.emergencyFund.tier1.toLocaleString()}</p>
                  <p className="text-xs text-slate-500 font-medium">Keep this for immediate needs like repairs or health.</p>
                  <button onClick={() => handleMoveToEmergency(10000, 1)} className="w-full py-3 bg-white border border-slate-200 rounded-xl font-black text-[10px] uppercase tracking-widest hover:border-emerald-500 hover:text-emerald-600 transition-all">+ Add {currencySymbol}10k</button>
                </div>

                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black text-indigo-600 uppercase bg-indigo-50 px-3 py-1 rounded-lg">Tier 2: Growth</span>
                    <span className="text-xs font-bold text-slate-400 italic">10% - 15% Interest</span>
                  </div>
                  <p className="text-3xl font-black text-slate-900">{currencySymbol}{wealth.emergencyFund.tier2.toLocaleString()}</p>
                  <p className="text-xs text-slate-500 font-medium">Locked for growth. Best for long-term protection.</p>
                  <button onClick={() => handleMoveToEmergency(20000, 2)} className="w-full py-3 bg-white border border-slate-200 rounded-xl font-black text-[10px] uppercase tracking-widest hover:border-indigo-500 hover:text-indigo-600 transition-all">+ Add {currencySymbol}20k</button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end px-1">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Progress to {currencySymbol}{wealth.emergencyFund.target.toLocaleString()} Target</p>
                  <p className="text-sm font-black text-emerald-500">{Math.round(((wealth.emergencyFund.tier1 + wealth.emergencyFund.tier2)/wealth.emergencyFund.target)*100)}%</p>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-indigo-600 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, ((wealth.emergencyFund.tier1 + wealth.emergencyFund.tier2)/wealth.emergencyFund.target)*100)}%` }}></div>
                </div>
              </div>
            </section>

            {/* DOLLAR HEDGE SECTION */}
            <section className="bg-slate-900 p-8 md:p-12 rounded-[3.5rem] text-white relative overflow-hidden shadow-2xl group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600 rounded-full blur-[120px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
               <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                 <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 bg-purple-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
                      🛡️ Inflation Shield
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">Hedge Against Devaluation</h2>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed">Protect the value of your money by converting a portion of your local balance into a <b>Dollar Fund</b>.</p>
                    <div className="flex gap-4">
                       <button onClick={() => handleDollarHedge(50000)} className="flex-1 bg-white text-slate-900 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-purple-400 hover:text-white transition-all">Protect {currencySymbol}50,000</button>
                    </div>
                 </div>
                 <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl text-center space-y-2">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Dollar Fund Balance</p>
                    <p className="text-5xl font-black text-white tracking-tighter">${wealth.dollarFund.balanceUsd.toFixed(2)}</p>
                    <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Cost Basis: {currencySymbol}{wealth.dollarFund.investedNaira.toLocaleString()}</p>
                 </div>
               </div>
            </section>

          </div>

          {/* SIDEBAR: FINTECH CONNECTIVITY */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl space-y-6">
              <h3 className="text-lg font-[1000] text-slate-900 tracking-tight leading-none">Connect to Fintechs</h3>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">Seamlessly move funds to your favorite specialized platforms in {user.country}.</p>
              
              <div className="space-y-3">
                {partners.map(p => {
                  const isConnected = wealth.connectedPlatforms.includes(p.name);
                  const isConnecting = connectingPlatform === p.name;
                  
                  return (
                    <button 
                      key={p.name} 
                      onClick={() => handleConnectFintech(p.name)}
                      disabled={isConnected || isConnecting}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all group ${isConnected ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100 hover:border-purple-600 hover:bg-white'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl shadow-sm flex items-center justify-center text-xl group-hover:scale-110 transition-transform ${isConnected ? 'bg-emerald-500 text-white' : 'bg-white'}`}>
                          {isConnected ? '✓' : p.logo}
                        </div>
                        <div className="text-left">
                          <p className="font-black text-slate-800 text-sm leading-none">{p.name}</p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase mt-1 tracking-wider">{isConnecting ? 'Linking Node...' : isConnected ? 'Node Synchronized' : p.desc}</p>
                        </div>
                      </div>
                      {!isConnected && !isConnecting && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-300 group-hover:text-purple-600"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>}
                      {isConnecting && <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>}
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-50">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center leading-relaxed">Automated "Standing Orders" available for connected accounts.</p>
              </div>
            </div>

            <div className="bg-indigo-600 p-8 rounded-[3rem] text-white shadow-2xl space-y-6 relative overflow-hidden group">
               <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
               <h3 className="font-black text-xl leading-tight tracking-tight">Need a Strategy?</h3>
               <p className="text-indigo-100 text-sm font-medium leading-relaxed">Let PayFlow AI analyze your balance and goals to suggest the best split for your wealth.</p>
               <button onClick={getStrategy} className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-indigo-50 transition-all">Generate My Plan</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'goals' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl">
               <div className="flex items-center justify-between mb-10">
                  <h3 className="text-2xl font-[1000] text-slate-900 tracking-tight">Custom Goals</h3>
                  <button onClick={() => setShowAdd(true)} className="bg-purple-600 text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-purple-700 transition-all">+ New Goal</button>
               </div>
               
               {showAdd && (
                <div className="mb-10 bg-slate-50 p-8 rounded-[2.5rem] border-2 border-purple-100 space-y-6 animate-in slide-in-from-top-4">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Goal Name</label>
                        <input placeholder="e.g. New Laptop" className="w-full bg-white border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-purple-600 outline-none font-black text-slate-800" value={newGoal.title} onChange={e => setNewGoal({...newGoal, title: e.target.value})} />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Amount ({currencySymbol})</label>
                        <input type="number" placeholder="0.00" className="w-full bg-white border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-purple-600 outline-none font-black text-slate-800" value={newGoal.target} onChange={e => setNewGoal({...newGoal, target: e.target.value})} />
                     </div>
                   </div>
                   <div className="flex justify-end gap-3">
                     <button onClick={() => setShowAdd(false)} className="px-6 py-2 text-slate-400 font-black text-[10px] uppercase tracking-widest">Cancel</button>
                     <button onClick={handleAddGoal} className="bg-slate-900 text-white px-10 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl">Activate Goal</button>
                   </div>
                </div>
              )}

               <div className="space-y-12">
                  {goals.length > 0 ? goals.map((goal) => (
                    <div key={goal.id} className="space-y-6 group">
                      <div className="flex justify-between items-end">
                        <div>
                          <h4 className="text-2xl font-black text-slate-800 group-hover:text-purple-600 transition-colors">{goal.title}</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{currencySymbol} {goal.current.toLocaleString()} / {goal.target.toLocaleString()}</p>
                        </div>
                        <span className="text-xl font-black text-slate-900">{Math.round((goal.current / goal.target) * 100)}%</span>
                      </div>
                      <div className="h-4 bg-slate-100 rounded-full overflow-hidden p-0.5">
                        <div 
                          className={`h-full ${goal.color} rounded-full transition-all duration-1000 shadow-sm`} 
                          style={{ width: `${Math.min(100, (goal.current / goal.target) * 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleContributeToGoal(goal, 5000)}
                          className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:border-purple-600 transition-all shadow-sm"
                        >
                          + Add {currencySymbol}5k
                        </button>
                        <button 
                          onClick={() => handleContributeToGoal(goal, 20000)}
                          className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:border-purple-600 transition-all shadow-sm"
                        >
                          + Add {currencySymbol}20k
                        </button>
                      </div>
                    </div>
                  )) : (
                    <div className="py-20 text-center opacity-30 grayscale flex flex-col items-center gap-6">
                       <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg></div>
                       <p className="font-black text-xs uppercase tracking-[0.3em]">No Recorded Goals</p>
                    </div>
                  )}
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'strategy' && (
        <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-xl overflow-hidden min-h-[600px] flex flex-col">
          <div className="bg-slate-950 p-10 md:p-16 text-white shrink-0 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600 rounded-full blur-[150px] opacity-30 animate-pulse"></div>
             <div className="relative z-10 space-y-4">
                <h2 className="text-4xl md:text-5xl font-[1000] tracking-tighter leading-none">Neural Wealth Strategy</h2>
                <p className="text-slate-400 text-lg max-w-2xl font-medium">Tailored financial planning based on regional inflation and your spending velocity.</p>
             </div>
          </div>
          <div className="p-10 md:p-16 flex-1 bg-white relative">
             {loading ? (
                <div className="h-full flex flex-col items-center justify-center space-y-8 py-20">
                   <div className="w-20 h-20 border-8 border-slate-100 border-t-purple-600 rounded-full animate-spin"></div>
                   <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Scanning Financial Grid...</p>
                </div>
             ) : strategy ? (
                <div className="animate-in slide-in-from-bottom-8 duration-700 max-w-3xl">
                   <div className="flex items-center gap-4 mb-10">
                      <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shadow-sm">
                         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">AI Generated Strategy</h3>
                   </div>
                   <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed space-y-6 text-lg">
                      {strategy.split('\n').map((line, i) => (
                        <p key={i} className={line.startsWith('*') ? 'pl-6 border-l-4 border-purple-100 italic' : ''}>{line.replace(/^\*+/, '')}</p>
                      ))}
                   </div>
                   <button onClick={getStrategy} className="mt-12 px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.25em] shadow-2xl hover:bg-purple-600 transition-all active:scale-95">Re-Generate Logic</button>
                </div>
             ) : (
                <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-8 grayscale opacity-30">
                   <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-300">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                   </div>
                   <p className="font-black text-xs uppercase tracking-[0.4em]">Engine Idle: Generation Required</p>
                   <button onClick={getStrategy} className="bg-slate-900 text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-purple-600 transition-all">Initialize Synthesis</button>
                </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetPage;
