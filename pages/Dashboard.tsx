
import React, { useState } from 'react';
import { User, Transaction } from '../types';
import ServiceModal from '../components/ServiceModal';
import DepositModal from '../components/DepositModal';
import WithdrawModal from '../components/WithdrawModal';
import ReceiveModal from '../components/ReceiveModal';
import { ICONS } from '../constants';

type FeatureKey = 'bills' | 'transfer' | 'savings' | 'crypto' | 'business' | 'nearby';

interface DashboardProps { 
  user: User; 
  transactions: Transaction[]; 
  onNewTransaction: (amount: number, name: string, cat?: string, isRecurring?: boolean, schedule?: any) => void;
  onDeposit: (amount: number, method: string) => void;
  onWithdraw: (amount: number, destination: string) => void;
  onExplorePlanning: () => void; 
  onNearbyClick: () => void;
  onTabChange: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, transactions, onNewTransaction, onDeposit, onWithdraw, onExplorePlanning, onNearbyClick, onTabChange }) => {
  const [activeFeature, setActiveFeature] = useState<FeatureKey>('bills');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isReceiveOpen, setIsReceiveOpen] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(user.security.hideBalances);

  const currencySymbol = user.currency === 'NGN' ? '₦' : user.currency === 'GHS' ? 'GH₵' : 'CFA';
  const formatBalance = (val: number) => privacyMode ? '••••••' : val.toLocaleString();

  const featureConfigs: Record<FeatureKey, { 
    title: string, 
    color: string, 
    icon: React.ReactNode, 
    detail: string, 
    action: string,
    image: string 
  }> = {
    bills: { 
      title: 'Easy Utility Payments', 
      color: 'bg-amber-500', 
      action: 'PAY NOW', 
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>, 
      detail: "Instantly pay for electricity, water, and internet subscriptions with a single tap.",
      image: "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80&w=1200" // Person paying on phone
    },
    transfer: { 
      title: 'Send Money Instantly', 
      color: 'bg-emerald-500', 
      action: 'INITIATE SEND', 
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m18 8-4-4-4 4"/><path d="M14 4v12a4 4 0 0 1-4 4H4"/></svg>, 
      detail: "Move money between accounts in Nigeria, Ghana, and Senegal on private regional rails.",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1200" // Digital banking visual
    },
    savings: { 
      title: 'Save While You Spend', 
      color: 'bg-purple-600', 
      action: 'VIEW GOALS', 
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, 
      detail: "AI-driven goals that help you build wealth automatically from your daily transactions.",
      image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=1200" // Growth visual
    },
    crypto: { 
      title: 'Trade Digital Assets', 
      color: 'bg-blue-500', 
      action: 'TRADE HUB', 
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>, 
      detail: "Buy, sell, and withdraw crypto assets using your native local currency balance.",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1200" // Digital currency
    },
    business: { 
      title: 'Merchant Terminal', 
      color: 'bg-indigo-600', 
      action: 'BUSINESS HUB', 
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect width="18" height="12" x="3" y="6" rx="2"/><path d="M3 10h18"/></svg>, 
      detail: "Professional tools for payroll and automated invoicing for African entrepreneurs.",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1200" // Business dashboard visual
    },
    nearby: { 
      title: 'Infrastructure Locator', 
      color: 'bg-rose-500', 
      action: 'FIND AGENTS', 
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>, 
      detail: "Locate verified agents and commercial banks near you using active Google Maps grounding.",
      image: "https://images.unsplash.com/photo-1569336415962-a4bd9f67c07a?auto=format&fit=crop&q=80&w=1200" // Map / City
    }
  };

  const handleAction = () => {
    if (activeFeature === 'bills') {
      setShowCategoryPicker(true);
    } else if (activeFeature === 'transfer') {
      setSelectedService('Transfer');
    } else if (activeFeature === 'savings') {
      onExplorePlanning();
    } else if (activeFeature === 'crypto') {
      onTabChange('crypto');
    } else if (activeFeature === 'business') {
      onTabChange('b2b');
    } else if (activeFeature === 'nearby') {
      onNearbyClick();
    }
  };

  return (
    <div className="space-y-10 max-w-[1600px] mx-auto pb-24 animate-in fade-in duration-700 px-2 md:px-8">
      {/* Header Area */}
      <header className="flex flex-col md:flex-row items-center justify-between gap-6 py-4">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <h1 className="text-3xl md:text-5xl font-[900] text-slate-900 tracking-tighter leading-none">
              Hello, {user.name.split(' ')[0]}
            </h1>
            <span className="text-3xl md:text-5xl">👋</span>
          </div>
          <p className="text-slate-400 font-bold text-[10px] md:text-sm uppercase tracking-[0.2em] mt-3">Welcome to your Pan-African Hub</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-[2rem] shadow-xl border border-slate-50">
          <button onClick={() => setPrivacyMode(!privacyMode)} className={`p-4 rounded-[1.4rem] transition-all ${privacyMode ? 'bg-purple-600 text-white shadow-xl shadow-purple-200' : 'bg-slate-50 text-slate-400'}`}>
            {privacyMode ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M9.88 9.88L14.12 14.12"/><path d="M2 2L22 22"/><path d="M10.37 5.07a12.8 12.8 0 0 1 1.63-.07 12 12 0 0 1 9.39 4.66 2 2 0 0 1 0 2.54 11.23 11.23 0 0 1-2.07 2"/></svg> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>}
          </button>
          <button onClick={() => setIsDepositOpen(true)} className="px-10 py-4 bg-slate-900 text-white rounded-[1.4rem] font-black text-xs uppercase tracking-widest hover:bg-purple-600 transition-all shadow-xl shadow-slate-200 active:scale-95">Add Money</button>
        </div>
      </header>

      {/* RECREATED FEATURE SPOTLIGHT WITH HIGH FIDELITY ASSETS */}
      <section className="bg-white rounded-[3rem] p-1 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-50 overflow-hidden group">
        <div className="flex flex-col lg:flex-row min-h-[420px]">
          {/* Left Block: Image Viewport */}
          <div className="lg:w-[45%] relative overflow-hidden shrink-0 min-h-[300px]">
             <img 
               key={activeFeature}
               src={featureConfigs[activeFeature].image} 
               alt={activeFeature} 
               className="absolute inset-0 w-full h-full object-cover animate-in fade-in zoom-in-110 duration-1000 grayscale-[10%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
             />
             <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/80 via-slate-900/20 to-transparent"></div>
             
             {/* Text Overlay */}
             <div className="absolute bottom-10 left-10 right-10 z-10">
                <h2 className="text-4xl md:text-5xl font-[900] text-white tracking-[0.15em] italic uppercase drop-shadow-2xl">PAYFLOW_PRO</h2>
                <div className="flex gap-2.5 justify-start mt-8 p-2 bg-white/10 rounded-full w-fit border border-white/10 backdrop-blur-md">
                   {(['bills', 'transfer', 'savings', 'crypto', 'business', 'nearby'] as const).map(dot => (
                     <div key={dot} className={`w-2 h-2 rounded-full transition-all duration-700 ${activeFeature === dot ? 'bg-white scale-125 shadow-[0_0_12px_white]' : 'bg-white/20'}`}></div>
                   ))}
                </div>
             </div>
          </div>

          {/* Right Block: Interactive Content */}
          <div className="flex-1 p-10 md:p-16 flex flex-col justify-center relative bg-white">
            <div className="max-w-xl space-y-8">
              <div className="flex items-center gap-6">
                 <div className={`w-16 h-16 ${featureConfigs[activeFeature].color} rounded-2xl flex items-center justify-center text-white shadow-2xl transition-all duration-500 shrink-0`}>
                    {featureConfigs[activeFeature].icon}
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-purple-600 uppercase tracking-[0.5em] opacity-80">SMART FEATURE SPOTLIGHT</p>
                    <h3 className="text-3xl md:text-5xl font-[900] text-slate-900 tracking-tighter leading-none">{featureConfigs[activeFeature].title}</h3>
                 </div>
              </div>
              
              <p className="text-base md:text-xl text-slate-500 font-medium leading-relaxed">
                {featureConfigs[activeFeature].detail}
              </p>

              <div className="flex flex-col xl:flex-row items-center gap-6 pt-4">
                 <button 
                   onClick={handleAction}
                   className="w-full xl:w-auto px-14 py-6 bg-slate-950 text-white rounded-[1.6rem] font-[900] text-[11px] tracking-[0.25em] shadow-2xl hover:bg-purple-600 hover:scale-105 transition-all active:scale-95 whitespace-nowrap"
                 >
                   {featureConfigs[activeFeature].action}
                 </button>
                 
                 {/* Filter Pills */}
                 <div className="flex gap-1.5 p-1.5 bg-slate-50 rounded-[1.8rem] border border-slate-100 overflow-x-auto no-scrollbar max-w-full">
                    {(['bills', 'transfer', 'savings', 'crypto', 'business', 'nearby'] as const).map(key => (
                      <button 
                        key={key} 
                        onClick={() => setActiveFeature(key)}
                        className={`px-6 py-3 rounded-[1.4rem] font-black text-[10px] uppercase tracking-widest transition-all shrink-0 ${activeFeature === key ? 'bg-white text-purple-600 shadow-md ring-1 ring-black/5' : 'text-slate-400 hover:text-slate-700'}`}
                      >
                        {key}
                      </button>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid: Balance & Universal Bill Payment Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          {/* Balance Hub */}
          <div className="bg-slate-950 rounded-[4rem] p-12 md:p-16 text-white relative overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] group">
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600 rounded-full blur-[180px] opacity-20"></div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center md:items-end gap-12">
              <div className="space-y-4 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
                  <p className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.5em] text-slate-500">Live Grid Balance</p>
                </div>
                <h2 className="text-7xl md:text-9xl font-[900] text-white tracking-tighter flex items-baseline justify-center md:justify-start gap-5 leading-none transition-all duration-700 group-hover:scale-105 origin-left">
                  <span className="text-3xl md:text-4xl font-black text-purple-500">{currencySymbol}</span>
                  {formatBalance(user.balance)}
                </h2>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <button onClick={() => setIsWithdrawOpen(true)} className="flex-1 md:w-44 bg-white/10 border border-white/10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-center transition-all hover:bg-white/20">Withdraw</button>
                <button onClick={() => setIsReceiveOpen(true)} className="flex-1 md:w-44 bg-purple-600 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-center transition-all hover:bg-purple-700 shadow-2xl shadow-purple-500/20">Receive</button>
              </div>
            </div>
          </div>

          {/* COMPREHENSIVE BILL PAYMENT HUB (ALL SECTIONS) */}
          <section className="bg-white p-10 md:p-14 rounded-[4rem] border border-slate-50 shadow-2xl shadow-slate-100/50">
             <div className="flex items-center justify-between mb-12">
                <div>
                  <h3 className="text-3xl font-[900] text-slate-900 tracking-tight leading-none">Global Bill Hub</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3">Verified Regional Settlement Endpoints</p>
                </div>
                <button onClick={() => setShowCategoryPicker(true)} className="bg-slate-50 p-4 rounded-2xl text-slate-400 hover:text-purple-600 transition-all">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
                </button>
             </div>
             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10">
                {[
                  { id: 'Electricity', label: 'Electricity', icon: ICONS.Electricity, color: 'bg-amber-100 text-amber-600', detail: 'EKEDC, ECG, Senelec' },
                  { id: 'Internet', label: 'Internet', icon: ICONS.Data, color: 'bg-blue-100 text-blue-600', detail: 'MTN, Orange, Fiber' },
                  { id: 'TV', label: 'Cable TV', icon: ICONS.TV, color: 'bg-purple-100 text-purple-600', detail: 'DSTV, Canal+, GOTV' },
                  { id: 'Betting', label: 'Betting', icon: ICONS.Betting, color: 'bg-emerald-100 text-emerald-600', detail: 'Lottery & Wallets' },
                  { id: 'Airtime', label: 'Airtime', icon: ICONS.Airtime, color: 'bg-teal-100 text-teal-600', detail: 'Instant Recharge' },
                  { id: 'Food', label: 'Food Delivery', icon: ICONS.Food, color: 'bg-rose-100 text-rose-600', detail: 'Jumia, Glovo, Paps' },
                  { id: 'Transport', label: 'Transport', icon: ICONS.Transport, color: 'bg-indigo-100 text-indigo-600', detail: 'Uber, TER, Bus' },
                  { id: 'Groceries', label: 'Groceries', icon: ICONS.Groceries, color: 'bg-orange-100 text-orange-600', detail: 'Shoprite, Auchan' },
                  { id: 'Gov Services', label: 'Gov Services', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, color: 'bg-slate-100 text-slate-600', detail: 'Taxes & Customs' },
                  { id: 'Transfer', label: 'Send Money', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>, color: 'bg-emerald-100 text-emerald-600', detail: 'Local & Int\'l Send' }
                ].map(item => (
                  <button 
                    key={item.id} 
                    onClick={() => setSelectedService(item.id)}
                    className="flex flex-col items-center gap-4 group transition-all"
                  >
                    <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all group-hover:scale-110 group-hover:-rotate-3 shadow-xl ${item.color}`}>
                       {React.isValidElement(item.icon) ? React.cloneElement(item.icon as React.ReactElement<any>, { width: 32, height: 32, strokeWidth: 3 }) : item.icon}
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-[11px] font-black uppercase text-slate-800 tracking-widest group-hover:text-purple-600 transition-colors">{item.label}</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase leading-none opacity-0 group-hover:opacity-100 transition-all">{item.detail}</p>
                    </div>
                  </button>
                ))}
             </div>
          </section>
        </div>

        {/* Vertical Feed Sidebar */}
        <div className="lg:col-span-4 space-y-10">
           <div className="bg-white rounded-[3.5rem] border border-slate-50 shadow-2xl h-[780px] flex flex-col overflow-hidden">
              <div className="p-10 border-b border-slate-50 shrink-0">
                 <h3 className="text-2xl font-[900] text-slate-900 tracking-tight leading-none">Activity Feed</h3>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3">Live Sync Active</p>
              </div>
              <div className="flex-1 overflow-auto p-4 custom-scrollbar">
                {transactions.length > 0 ? transactions.map(tx => (
                  <div key={tx.id} className="p-6 flex items-center justify-between rounded-[2rem] hover:bg-slate-50 transition-all group">
                     <div className="flex items-center gap-5">
                       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${tx.type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                          {tx.type === 'credit' ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M7 7l10 10M17 7v10H7"/></svg> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M17 17L7 7M7 17V7h10"/></svg>}
                       </div>
                       <div className="min-w-0">
                         <p className="font-black text-slate-800 text-sm truncate group-hover:text-purple-600 transition-colors">{tx.name}</p>
                         <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">{tx.date}</p>
                       </div>
                     </div>
                     <div className="text-right shrink-0 ml-4">
                        <p className={`font-black text-base ${tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-900'}`}>{tx.type === 'credit' ? '+' : '-'}{currencySymbol}{tx.amount.toLocaleString()}</p>
                     </div>
                  </div>
                )) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-30 grayscale gap-6 p-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
                    <p className="text-xs font-black uppercase tracking-widest">No activity found</p>
                  </div>
                )}
              </div>
              <div className="p-10 bg-slate-50/50 border-t border-slate-50">
                 <button onClick={() => onTabChange('history')} className="w-full py-5 bg-white border border-slate-200 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.25em] text-slate-600 hover:text-purple-600 hover:border-purple-200 shadow-sm transition-all">View All Transactions</button>
              </div>
           </div>
        </div>
      </div>

      {/* Protocol Picker Flow */}
      {showCategoryPicker && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[4rem] p-12 md:p-16 shadow-2xl animate-in zoom-in-95 border border-white">
            <div className="flex justify-between items-center mb-12">
              <div className="space-y-1">
                <h2 className="text-3xl font-[900] text-slate-900 tracking-tight leading-none">Select Protocol</h2>
                <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest">Global Marketplace Settlement</p>
              </div>
              <button onClick={() => setShowCategoryPicker(false)} className="p-4 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-[1.5rem] transition-all">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {[
                { id: 'Electricity', label: 'Electricity', icon: ICONS.Electricity, color: 'bg-amber-50 text-amber-600 border-amber-100' },
                { id: 'Internet', label: 'Internet', icon: ICONS.Data, color: 'bg-blue-50 text-blue-600 border-blue-100' },
                { id: 'TV', label: 'Cable TV', icon: ICONS.TV, color: 'bg-purple-50 text-purple-600 border-purple-100' },
                { id: 'Water', label: 'Water Settlement', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>, color: 'bg-cyan-50 text-cyan-600 border-cyan-100' },
                { id: 'Betting', label: 'Betting Wallets', icon: ICONS.Betting, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
                { id: 'Gov Services', label: 'Gov & Taxes', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, color: 'bg-slate-50 text-slate-600 border-slate-100' }
              ].map(cat => (
                <button 
                  key={cat.id} 
                  onClick={() => { setSelectedService(cat.id); setShowCategoryPicker(false); }}
                  className={`p-10 rounded-[3rem] border-2 transition-all flex flex-col items-center gap-5 hover:shadow-2xl hover:scale-105 active:scale-95 ${cat.color}`}
                >
                  <div className="w-14 h-14 flex items-center justify-center">
                    {React.isValidElement(cat.icon) ? React.cloneElement(cat.icon as any, { width: 36, height: 36, strokeWidth: 3 }) : cat.icon}
                  </div>
                  <span className="font-black text-[11px] uppercase tracking-widest text-center leading-tight">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

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
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Dashboard;
