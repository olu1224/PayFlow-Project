
import React, { useState, useMemo } from 'react';
import { User, Transaction } from '../types';
import ServiceModal from '../components/ServiceModal';
import DepositModal from '../components/DepositModal';
import WithdrawModal from '../components/WithdrawModal';
import ReceiveModal from '../components/ReceiveModal';
import { ICONS } from '../constants';
import { t } from '../localization';

const ServiceButton: React.FC<{ icon: React.ReactNode; label: string; color: string; onClick: () => void }> = ({ icon, label, color, onClick }) => (
  <button 
    onClick={onClick} 
    className="flex flex-col items-center gap-3 p-4 group transition-all w-full bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white/60 hover:bg-white hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1 active:scale-95"
  >
    <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center transition-all shadow-lg shadow-black/5 ${color} group-hover:scale-110 group-hover:shadow-purple-500/20`}>
      {React.cloneElement(icon as React.ReactElement<any>, { width: 28, height: 28, strokeWidth: 2.5 })}
    </div>
    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-900 group-hover:text-purple-600 text-center leading-tight transition-colors">
      {label}
    </span>
  </button>
);

type FeatureKey = 'bills' | 'transfer' | 'ai' | 'crypto' | 'b2b' | 'nearby';

const Dashboard: React.FC<{ 
  user: User; 
  transactions: Transaction[]; 
  onNewTransaction: (amount: number, name: string, cat?: string, isRecurring?: boolean, schedule?: any) => void;
  onDeposit: (amount: number, method: string) => void;
  onWithdraw: (amount: number, destination: string) => void;
  onExplorePlanning: () => void; 
  onNearbyClick: () => void 
}> = ({ user, transactions, onNewTransaction, onDeposit, onWithdraw, onExplorePlanning, onNearbyClick }) => {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isReceiveOpen, setIsReceiveOpen] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(user.security.hideBalances);
  const [showWelcomeWidget, setShowWelcomeWidget] = useState(true);
  const [activeFeature, setActiveFeature] = useState<FeatureKey>('bills');

  const currencySymbol = user.currency === 'NGN' ? '₦' : user.currency === 'GHS' ? 'GH₵' : 'CFA';
  const formatBalance = (val: number) => privacyMode ? '••••••' : val.toLocaleString();

  const services = useMemo(() => [
    { label: 'Electricity', icon: ICONS.Electricity, color: 'bg-amber-100 text-amber-600' },
    { label: t('internet_services', user.country), icon: ICONS.Data, color: 'bg-blue-100 text-blue-600' },
    { label: t('order_food', user.country), icon: ICONS.Food, color: 'bg-orange-100 text-orange-600' },
    { label: 'Airtime', icon: ICONS.Airtime, color: 'bg-teal-100 text-teal-600' },
    { label: 'TV', icon: ICONS.TV, color: 'bg-purple-100 text-purple-600' },
    { label: 'Domestic Transfer', icon: ICONS.Domestic, color: 'bg-emerald-100 text-emerald-600' },
    { label: 'International Transfer', icon: ICONS.International, color: 'bg-blue-100 text-blue-700' },
    { label: 'Investment', icon: ICONS.Investment, color: 'bg-emerald-100 text-emerald-700' },
    { label: 'Loan Repayment', icon: ICONS.Loan, color: 'bg-rose-100 text-rose-600' },
    { label: 'Insurance', icon: ICONS.Insurance, color: 'bg-indigo-100 text-indigo-700' },
    { label: 'Gov Services', icon: ICONS.Gov, color: 'bg-slate-100 text-slate-900' },
    { label: 'Betting', icon: ICONS.Betting, color: 'bg-emerald-100 text-emerald-600' },
    { label: 'Transport', icon: ICONS.Transport, color: 'bg-indigo-100 text-indigo-600' },
    { label: 'Groceries', icon: ICONS.Groceries, color: 'bg-amber-100 text-amber-700' },
  ], [user.country]);

  const featureConfigs: Record<FeatureKey, { title: string, color: string, icon: React.ReactNode, detail: string }> = {
    bills: { title: 'MPN Billing Network', color: 'bg-amber-500', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>, detail: "Real-time settlement for 14 regional utility endpoints with 99.9% uptime." },
    transfer: { title: 'Flash Cross-Border', color: 'bg-emerald-500', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m18 8-4-4-4 4"/><path d="M14 4v12a4 4 0 0 1-4 4H4"/></svg>, detail: "Move capital between Nigeria, Ghana, and Senegal on private banking rails." },
    ai: { title: 'Gemini Intelligence', color: 'bg-purple-600', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>, detail: "Neural credit scoring and automated financial roadmap generation." },
    crypto: { title: 'Deep Liquidity Pool', color: 'bg-blue-500', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>, detail: "Trade assets using native fiat without external P2P requirements." },
    b2b: { title: 'Merchant Terminal', color: 'bg-indigo-600', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect width="18" height="12" x="3" y="6" rx="2"/><path d="M3 10h18"/></svg>, detail: "Bulk disbursements and automated enterprise invoicing for startups." },
    nearby: { title: 'Maps Grounding', color: 'bg-rose-500', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>, detail: "Locate verified agents and banking infrastructure in your current radius." }
  };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-12 animate-in fade-in duration-700 px-4 md:px-8">
      <header className="flex flex-col md:flex-row items-center justify-between gap-6 py-4">
        <div className="animate-in slide-in-from-left duration-700">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl md:text-5xl font-[900] text-slate-900 tracking-tighter leading-none">
              {t('welcome_back', user.country)}, {user.name.split(' ')[0]}
            </h1>
            <span className="text-4xl md:text-5xl animate-bounce-slow">👋</span>
          </div>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-[0.4em] mt-3 opacity-90">{t('pay_all_bills', user.country)}</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white/60 backdrop-blur-xl p-2 rounded-[2rem] shadow-2xl border border-white ring-1 ring-black/5">
          <button onClick={() => setPrivacyMode(!privacyMode)} className={`p-4 rounded-[1.4rem] transition-all ${privacyMode ? 'bg-purple-600 text-white shadow-xl' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}>
            {privacyMode ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M9.88 9.88L14.12 14.12"/><path d="M2 2L22 22"/><path d="M10.37 5.07a12.8 12.8 0 0 1 1.63-.07 12 12 0 0 1 9.39 4.66 2 2 0 0 1 0 2.54 11.23 11.23 0 0 1-2.07 2"/></svg> : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>}
          </button>
          <div className="h-8 w-[2px] bg-slate-200/50 mx-1"></div>
          <button onClick={() => setSelectedService('Domestic Transfer')} className="px-8 py-4 bg-emerald-100 text-emerald-700 rounded-[1.4rem] font-[900] text-xs uppercase tracking-widest hover:bg-emerald-200 transition-all border border-emerald-200/50">Send Funds</button>
          <button onClick={() => setIsDepositOpen(true)} className="px-8 py-4 bg-slate-900 text-white rounded-[1.4rem] font-[900] text-xs uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all">Deposit Cash</button>
        </div>
      </header>

      {/* Hero OS Panel - Full Width */}
      {showWelcomeWidget && (
        <section className="bg-slate-950 rounded-[3.5rem] p-1 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] animate-in slide-in-from-top-4 duration-1000 relative overflow-hidden ring-1 ring-white/10">
          <div className="bg-[#0B1221] rounded-[3.4rem] relative overflow-hidden flex flex-col lg:flex-row min-h-[300px]">
            {/* Live Data Visual Side */}
            <div className="lg:w-1/2 relative h-64 lg:h-auto overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0B1221] z-10"></div>
               <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-50 scale-110">
                  <source src="https://assets.mixkit.co/videos/preview/mixkit-circuit-board-animation-loop-9556-large.mp4" type="video/mp4" />
               </video>
               <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                  <p className="text-[12px] font-[900] text-purple-400 uppercase tracking-[0.5em] mb-3 animate-pulse">Regional OS Active</p>
                  <h2 className="text-6xl md:text-8xl font-[900] text-white tracking-tighter leading-none italic select-none">LIVE_FLOW</h2>
                  <div className="mt-8 flex gap-4">
                     {(Object.keys(featureConfigs) as FeatureKey[]).map(key => (
                       <div key={key} className={`w-3 h-3 rounded-full transition-all duration-500 ${activeFeature === key ? 'bg-purple-500 scale-125 shadow-[0_0_15px_rgba(168,85,247,0.8)]' : 'bg-white/20'}`}></div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Briefing Text Side */}
            <div className="lg:w-1/2 p-10 md:p-16 flex flex-col justify-center relative z-20">
              <div className="space-y-8 max-w-xl">
                <div className="flex items-center gap-6">
                   <div className={`w-20 h-20 ${featureConfigs[activeFeature].color} rounded-[2rem] flex items-center justify-center text-white shadow-[0_20px_40px_rgba(0,0,0,0.3)] scale-110`}>
                      {featureConfigs[activeFeature].icon}
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-[900] text-purple-400 uppercase tracking-widest">Mastery Protocol</p>
                      <h3 className="text-3xl font-[900] text-white tracking-tight leading-none">{featureConfigs[activeFeature].title}</h3>
                   </div>
                </div>
                <p className="text-xl text-slate-300 font-bold leading-relaxed opacity-90">
                  "{featureConfigs[activeFeature].detail}"
                </p>
                <div className="flex flex-wrap gap-3">
                   {(Object.keys(featureConfigs) as FeatureKey[]).map(key => (
                     <button 
                       key={key} 
                       onClick={() => setActiveFeature(key)}
                       className={`px-6 py-3 rounded-2xl font-[900] text-[10px] uppercase tracking-widest transition-all border-2 ${activeFeature === key ? 'bg-white text-slate-900 border-white shadow-2xl' : 'bg-transparent border-white/10 text-white/50 hover:border-white/30 hover:text-white'}`}
                     >
                       {key}
                     </button>
                   ))}
                </div>
                <button onClick={() => setShowWelcomeWidget(false)} className="absolute top-10 right-10 p-3 text-white/30 hover:text-white hover:bg-white/10 rounded-full transition-all">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Grid: Fills entire width */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-8">
          {/* Account Balance Command Center */}
          <div className="bg-slate-900 rounded-[3.5rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl border border-white/5 group">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600 rounded-full blur-[150px] opacity-20 -mr-40 -mt-40 group-hover:scale-125 transition-all duration-1000"></div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center ring-4 ring-emerald-500/10">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
                  </div>
                  <p className="text-[12px] font-[900] uppercase tracking-[0.5em] text-slate-400">{t('total_balance', user.country)}</p>
                </div>
                <h2 className="text-7xl md:text-9xl font-[900] text-white tracking-tighter flex items-baseline gap-4 leading-none">
                  <span className="text-4xl md:text-5xl font-black text-purple-500 opacity-80 tracking-tight">{currencySymbol}</span>
                  {formatBalance(user.balance)}
                </h2>
                <div className="flex items-center gap-4 pt-4">
                   <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl flex items-center gap-2">
                     <span className="text-emerald-400 text-sm font-[900]">↑ 12.5%</span>
                     <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Growth Index</span>
                   </div>
                   <div className="bg-purple-500/10 border border-purple-500/20 px-4 py-2 rounded-xl flex items-center gap-2">
                     <span className="text-purple-400 text-sm font-[900]">Secure</span>
                     <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Gateway Vault</span>
                   </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 w-full md:w-auto">
                <button onClick={() => setIsWithdrawOpen(true)} className="w-full md:w-64 bg-white/10 border border-white/20 hover:bg-white/20 px-8 py-5 rounded-[2rem] font-[900] text-xs uppercase tracking-[0.2em] text-center transition-all shadow-xl">Initiate Withdrawal</button>
                <button onClick={() => setIsReceiveOpen(true)} className="w-full md:w-64 bg-purple-600 hover:bg-purple-700 px-8 py-5 rounded-[2rem] font-[900] text-xs uppercase tracking-[0.2em] text-center transition-all shadow-[0_20px_40px_rgba(147,51,234,0.3)] text-white">Receive Funds</button>
              </div>
            </div>
          </div>

          {/* MPN Billing Matrix - Spaced Out */}
          <section className="bg-white/50 backdrop-blur-sm p-10 md:p-14 rounded-[4rem] border border-white shadow-2xl shadow-slate-200/50 relative overflow-hidden">
            <div className="flex items-center justify-between mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-[900] text-slate-900 tracking-tighter">MPN Billing Matrix</h2>
                <p className="text-sm text-slate-500 font-black uppercase tracking-[0.3em] opacity-80">14 Instant Pan-African Regional Endpoints</p>
              </div>
              <div className="hidden sm:flex items-center gap-3 bg-emerald-100/50 border border-emerald-200 px-6 py-3 rounded-2xl">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="text-[10px] font-[900] text-emerald-800 uppercase tracking-widest">Grid Status: ONLINE</span>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
              {services.map(s => (
                <ServiceButton key={s.label} label={s.label} icon={s.icon} color={s.color} onClick={() => setSelectedService(s.label)} />
              ))}
            </div>
          </section>
        </div>

        {/* Dynamic Activity Sideboard */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white rounded-[4rem] border border-white shadow-2xl flex flex-col h-[650px] overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between shrink-0">
               <div>
                  <h3 className="text-2xl font-[900] text-slate-900 tracking-tight">{t('activity', user.country)}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Live Transaction Ledger</p>
               </div>
               <button onClick={() => setSelectedService('Domestic Transfer')} className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center hover:scale-110 transition-all shadow-sm">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14"/></svg>
               </button>
            </div>
            <div className="flex-1 overflow-auto custom-scrollbar px-2">
              {transactions.length > 0 ? transactions.map(tx => (
                <div key={tx.id} className="mx-4 my-2 px-6 py-5 flex items-center justify-between rounded-[2rem] hover:bg-slate-50 transition-all group cursor-pointer border border-transparent hover:border-slate-100">
                   <div className="flex items-center gap-5">
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${tx.type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-900'} group-hover:scale-110 transition-transform`}>
                        {tx.type === 'credit' ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="m19 12-7-7-7 7"/></svg> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="m5 12 7 7 7-7"/></svg>}
                     </div>
                     <div className="min-w-0">
                       <p className="font-[900] text-slate-900 truncate text-[14px] leading-none group-hover:text-purple-600 transition-colors">{tx.name}</p>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">{tx.date}</p>
                     </div>
                   </div>
                   <div className="text-right shrink-0">
                     <p className={`font-[900] text-lg tabular-nums tracking-tighter ${tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-900'}`}>{tx.type === 'credit' ? '+' : '-'}{currencySymbol}{tx.amount.toLocaleString()}</p>
                     <p className={`text-[9px] font-black uppercase tracking-widest mt-1 ${tx.status === 'completed' ? 'text-emerald-500' : 'text-amber-500'}`}>{tx.status}</p>
                   </div>
                </div>
              )) : (
                <div className="h-full flex flex-col items-center justify-center p-12 text-center opacity-30 grayscale gap-4">
                  <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7"/><path d="M16 11l2 2 4-4"/></svg></div>
                  <p className="font-[900] text-xl uppercase tracking-widest">No Session Activity</p>
                </div>
              )}
            </div>
          </div>

          {/* Credit Rating - Vivid Glass */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-10 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-20 -mr-16 -mt-16 group-hover:scale-150 transition-all duration-1000"></div>
             <div className="flex justify-between items-center mb-8 relative z-10">
               <div>
                  <p className="text-[10px] font-[900] text-indigo-400 uppercase tracking-[0.3em] mb-1">{t('credit_rating', user.country)}</p>
                  <h4 className="text-7xl font-[900] text-white tracking-tighter leading-none transition-all group-hover:scale-105">{user.creditScore}</h4>
               </div>
               <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-[1.5rem] flex items-center justify-center shadow-2xl border border-white/10 group-hover:rotate-12 transition-all">
                  <svg className="text-indigo-400" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
               </div>
             </div>
             <div className="relative z-10">
                <div className="flex justify-between items-end mb-4">
                   <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest px-3 py-1 bg-emerald-400/10 rounded-lg">Neural Rating Active</span>
                   <span className="text-[10px] font-black uppercase text-indigo-300">Target: 850</span>
                </div>
                <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden shadow-inner">
                   <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-[2.5s] relative" style={{ width: `${(user.creditScore/850)*100}%` }}>
                      <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent animate-shimmer"></div>
                   </div>
                </div>
                <p className="text-[11px] text-slate-400 font-bold mt-4 leading-relaxed italic opacity-80">"Your credit limit is currently set to Tier 2 based on recent settlement velocity."</p>
             </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .animate-bounce-slow { animation: bounce-slow 4s infinite ease-in-out; }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .animate-shimmer { animation: shimmer 2s infinite linear; }
      `}</style>

      {selectedService && (
        <ServiceModal 
          isOpen={true} 
          onClose={() => setSelectedService(null)} 
          serviceName={selectedService}
          country={user.country}
          currency={user.currency}
          onComplete={(amt, name, isRec, sched) => onNewTransaction(amt, name, selectedService, isRec, sched)}
        />
      )}
      {isDepositOpen && <DepositModal isOpen={true} onClose={() => setIsDepositOpen(false)} user={user} onDeposit={onDeposit} />}
      {isWithdrawOpen && <WithdrawModal isOpen={true} onClose={() => setIsWithdrawOpen(false)} currency={user.currency} country={user.country} balance={user.balance} onWithdraw={onWithdraw} />}
      {isReceiveOpen && <ReceiveModal isOpen={true} onClose={() => setIsReceiveOpen(false)} user={user} />}
    </div>
  );
};

export default Dashboard;
