
import React, { useState, useEffect } from 'react';
import { User, Transaction } from '../types';
import ServiceModal from '../components/ServiceModal';
import DepositModal from '../components/DepositModal';
import WithdrawModal from '../components/WithdrawModal';
import ReceiveModal from '../components/ReceiveModal';
import { ICONS } from '../constants';
import { t } from '../localization';

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
  onUpdateSecurity: (updates: Partial<User['security']>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, transactions, onNewTransaction, onDeposit, onWithdraw, onExplorePlanning, onNearbyClick, onTabChange, onUpdateSecurity }) => {
  const [activeFeature, setActiveFeature] = useState<FeatureKey>('bills');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isReceiveOpen, setIsReceiveOpen] = useState(false);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting(t('greeting_morning', user.country));
    else if (hour < 17) setGreeting(t('greeting_afternoon', user.country));
    else setGreeting(t('greeting_evening', user.country));
  }, [user.country]);

  const currencySymbol = user.currency === 'NGN' ? '₦' : user.currency === 'GHS' ? 'GH₵' : 'CFA';
  const formatBalance = (val: number) => user.security.hideBalances ? '••••••' : val.toLocaleString();

  const featureConfigs: Record<FeatureKey, { 
    title: string, 
    color: string, 
    icon: React.ReactNode, 
    detail: string, 
    action: string,
    image: string 
  }> = {
    bills: { 
      title: t('feat_bills_title', user.country), 
      color: 'bg-amber-500', 
      action: t('feat_bills_action', user.country), 
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>, 
      detail: t('feat_bills_detail', user.country),
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=1200"
    },
    transfer: { 
      title: t('feat_transfer_title', user.country), 
      color: 'bg-emerald-500', 
      action: t('feat_transfer_action', user.country), 
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="m18 8-4-4-4 4"/><path d="M14 4v12a4 4 0 0 1-4 4H4"/></svg>, 
      detail: t('feat_transfer_detail', user.country),
      image: "https://images.unsplash.com/photo-1556740714-a8395b3bf30f?auto=format&fit=crop&q=80&w=1200"
    },
    savings: { 
      title: t('feat_savings_title', user.country), 
      color: 'bg-purple-600', 
      action: t('feat_savings_action', user.country), 
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, 
      detail: t('feat_savings_detail', user.country),
      image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=1200"
    },
    crypto: { 
      title: t('feat_crypto_title', user.country), 
      color: 'bg-blue-500', 
      action: t('feat_crypto_action', user.country), 
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>, 
      detail: t('feat_crypto_detail', user.country),
      image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&q=80&w=1200"
    },
    business: { 
      title: t('feat_business_title', user.country), 
      color: 'bg-indigo-600', 
      action: t('feat_business_action', user.country), 
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><rect width="18" height="12" x="3" y="6" rx="2"/><path d="M3 10h18"/></svg>, 
      detail: t('feat_business_detail', user.country),
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200"
    },
    nearby: { 
      title: t('feat_nearby_title', user.country), 
      color: 'bg-rose-500', 
      action: t('feat_nearby_action', user.country), 
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>, 
      detail: t('feat_nearby_detail', user.country),
      image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1200"
    }
  };

  const gridItems = [
    { id: 'Electricity', label: t('grid_electricity', user.country), icon: ICONS.Electricity, color: 'bg-amber-100 text-amber-600', detail: t('grid_desc_electricity', user.country) },
    { id: 'Internet', label: t('grid_internet', user.country), icon: ICONS.Data, color: 'bg-blue-100 text-blue-600', detail: t('grid_desc_internet', user.country) },
    { id: 'TV', label: t('grid_tv', user.country), icon: ICONS.TV, color: 'bg-purple-100 text-purple-600', detail: t('grid_desc_tv', user.country) },
    { id: 'Food', label: t('grid_food', user.country), icon: ICONS.Food, color: 'bg-orange-100 text-orange-600', detail: t('grid_desc_food', user.country) },
    { id: 'Transfer', label: t('grid_transfer', user.country), icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>, color: 'bg-teal-100 text-teal-600', detail: t('grid_desc_transfer', user.country) },
    { id: 'Airtime', label: t('grid_airtime', user.country), icon: ICONS.Airtime, color: 'bg-rose-100 text-rose-600', detail: t('grid_desc_airtime', user.country) },
    { id: 'Betting', label: t('grid_betting', user.country), icon: ICONS.Betting, color: 'bg-emerald-100 text-emerald-600', detail: t('grid_desc_betting', user.country) },
    { id: 'Transport', label: t('grid_transport', user.country), icon: ICONS.Transport, color: 'bg-indigo-100 text-indigo-600', detail: t('grid_desc_transport', user.country) },
    { id: 'Groceries', label: t('grid_groceries', user.country), icon: ICONS.Groceries, color: 'bg-cyan-100 text-cyan-600', detail: t('grid_desc_groceries', user.country) },
    { id: 'Gov Services', label: t('grid_gov', user.country), icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, color: 'bg-slate-100 text-slate-600', detail: t('grid_desc_gov', user.country) }
  ];

  const handleAction = () => {
    if (activeFeature === 'bills') setShowCategoryPicker(true);
    else if (activeFeature === 'transfer') setSelectedService('Transfer');
    else if (activeFeature === 'savings') onExplorePlanning();
    else if (activeFeature === 'crypto') onTabChange('crypto');
    else if (activeFeature === 'business') onTabChange('b2b');
    else if (activeFeature === 'nearby') onNearbyClick();
  };

  const toggleStealth = () => {
    onUpdateSecurity({ hideBalances: !user.security.hideBalances });
  };

  return (
    <div className="space-y-4 md:space-y-12 max-w-[1600px] mx-auto pb-32 animate-in fade-in duration-1000 px-3 sm:px-12">
      
      {/* Welcome Widget: The Hub Command Center */}
      <section className="bg-white rounded-[2rem] md:rounded-[4rem] p-1 shadow-[0_15px_50px_-10px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden mt-2 md:mt-8">
        <div className="flex flex-col lg:flex-row min-h-[350px] md:min-h-[600px]">
          
          {/* Left: Interactive Visual Header */}
          <div className="lg:w-[45%] relative overflow-hidden shrink-0 h-[180px] md:h-[400px] lg:h-auto">
             <img 
               key={activeFeature}
               src={featureConfigs[activeFeature].image} 
               alt={activeFeature} 
               className="absolute inset-0 w-full h-full object-cover animate-in fade-in zoom-in-105 duration-[2s] saturate-[0.8] brightness-[0.7]"
             />
             <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-transparent"></div>
             
             <div className="absolute inset-0 p-5 md:p-14 flex flex-col justify-between">
                <div className="space-y-1 md:space-y-4">
                   <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl px-2.5 py-1 rounded-full border border-white/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span className="text-[7px] md:text-[9px] font-black text-white uppercase tracking-[0.2em] md:tracking-[0.3em]">{user.country} Terminal</span>
                   </div>
                   <h2 className="text-2xl md:text-6xl font-[1000] text-white tracking-tight leading-none">
                     {greeting},<br/>{user.name.split(' ')[0]}<span className="text-purple-400">.</span>
                   </h2>
                </div>
                
                <div className="hidden sm:flex flex-col gap-4">
                   <div className="bg-white/10 backdrop-blur-2xl p-6 rounded-[2rem] border border-white/20 w-fit">
                      <p className="text-[9px] font-black text-purple-300 uppercase tracking-widest mb-1">Live Intelligence</p>
                      <p className="text-white text-xs font-bold leading-tight max-w-[200px]">Utility nodes are 100% active in your region. Settlement latency: &lt;2s.</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Right: Interaction Terminal */}
          <div className="flex-1 p-5 md:p-16 flex flex-col justify-center bg-white">
            <div className="max-w-3xl space-y-4 md:space-y-10">
              <div className="flex items-center gap-3 md:gap-6">
                 <div className={`w-10 h-10 md:w-20 md:h-20 ${featureConfigs[activeFeature].color} rounded-xl md:rounded-[2rem] flex items-center justify-center text-white shadow-xl md:shadow-2xl transition-all duration-500 ring-4 md:ring-8 ring-slate-50`}>
                    {React.isValidElement(featureConfigs[activeFeature].icon) ? React.cloneElement(featureConfigs[activeFeature].icon as React.ReactElement<any>, { width: 20, height: 20, strokeWidth: 3.5 }) : featureConfigs[activeFeature].icon}
                 </div>
                 <div className="space-y-0.5 md:space-y-1">
                    <p className="text-[7px] md:text-[10px] font-black text-purple-700 uppercase tracking-[0.3em] md:tracking-[0.4em]">PRO TERMINAL</p>
                    <h3 className="text-xl md:text-5xl font-[1000] text-black tracking-tight leading-none">{featureConfigs[activeFeature].title}</h3>
                 </div>
              </div>
              
              <p className="text-xs md:text-xl text-black font-bold leading-relaxed max-w-xl opacity-70">
                {featureConfigs[activeFeature].detail}
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-6 pt-1 md:pt-4">
                 <button 
                   onClick={handleAction}
                   className="px-6 md:px-12 py-3.5 md:py-6 bg-black text-white rounded-xl md:rounded-[1.8rem] font-[1000] text-[9px] md:text-[12px] uppercase tracking-[0.2em] md:tracking-[0.3em] shadow-xl md:shadow-2xl hover:bg-purple-600 hover:scale-[1.03] transition-all active:scale-95 whitespace-nowrap"
                 >
                   {featureConfigs[activeFeature].action}
                 </button>
                 
                 <div className="flex gap-1.5 p-1 bg-slate-50 rounded-full border border-slate-100 overflow-x-auto no-scrollbar scroll-smooth">
                    {(['bills', 'transfer', 'savings', 'crypto', 'business', 'nearby'] as const).map(key => (
                      <button 
                        key={key} 
                        onClick={() => setActiveFeature(key)}
                        className={`px-3 md:px-6 py-1.5 md:py-3 rounded-full font-black text-[7px] md:text-[10px] uppercase tracking-widest transition-all shrink-0 ${activeFeature === key ? 'bg-white text-purple-700 shadow-md ring-1 ring-black/5' : 'text-black hover:text-purple-600 opacity-60 hover:opacity-100'}`}
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

      {/* Vault Balance Display */}
      <section className="bg-slate-950 rounded-[2rem] md:rounded-[4rem] p-6 md:p-20 text-white relative overflow-hidden shadow-2xl group">
        <div className="absolute top-[-30%] right-[-5%] w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-purple-600 rounded-full blur-[80px] md:blur-[200px] opacity-20 group-hover:opacity-30 transition-all duration-[3s]"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-12 text-center md:text-left">
          <div className="space-y-3 md:space-y-10 w-full md:w-auto">
            <div className="flex items-center justify-center md:justify-start gap-2 md:gap-4">
              <div className="w-1.5 h-1.5 md:w-3 md:h-3 rounded-full bg-emerald-400 animate-ping shadow-[0_0_15px_#10b981]"></div>
              <p className="text-[8px] md:text-[12px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-purple-400">{t('wallet_balance', user.country)}</p>
              
              <button 
                onClick={toggleStealth}
                className={`ml-2 px-2.5 py-1 md:px-5 md:py-2 rounded-full border transition-all flex items-center gap-1.5 group/stealth ${user.security.hideBalances ? 'bg-purple-600 border-purple-400 text-white shadow-lg' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white'}`}
              >
                {user.security.hideBalances ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8-11-8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
                <span className="text-[7px] md:text-[10px] font-black uppercase tracking-widest">{user.security.hideBalances ? 'Stealth' : 'Privacy'}</span>
              </button>
            </div>
            <h2 className={`text-4xl md:text-9xl font-[1000] text-white tracking-tighter flex items-baseline justify-center md:justify-start gap-1 md:gap-6 leading-none transition-all origin-center md:origin-left ${user.security.hideBalances ? 'blur-lg select-none opacity-40' : ''}`}>
              <span className="text-xl md:text-6xl font-black text-purple-500">{currencySymbol}</span>
              {formatBalance(user.balance)}
            </h2>
          </div>
          <div className="flex flex-col gap-2 md:gap-4 w-full md:w-auto">
            <div className="flex gap-2 md:gap-4">
              <button onClick={() => setIsWithdrawOpen(true)} className="flex-1 md:w-48 bg-white/5 border border-white/10 py-3.5 md:py-6 rounded-xl md:rounded-[1.8rem] font-black text-[9px] md:text-[12px] uppercase tracking-widest text-center transition-all hover:bg-white/10 active:scale-95">Withdraw</button>
              <button onClick={() => setIsReceiveOpen(true)} className="flex-1 md:w-48 bg-white border border-white py-3.5 md:py-6 rounded-xl md:rounded-[1.8rem] font-black text-[9px] md:text-[12px] uppercase tracking-widest text-black text-center transition-all hover:bg-slate-100 active:scale-95 shadow-lg">Receive</button>
            </div>
            <button onClick={() => setIsDepositOpen(true)} className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 py-4 md:py-7 rounded-xl md:rounded-[1.8rem] font-black text-[10px] md:text-[13px] uppercase tracking-[0.3em] md:tracking-[0.4em] text-center transition-all hover:scale-[1.02] shadow-xl active:scale-95">Add Liquidity</button>
          </div>
        </div>
      </section>

      {/* The MPN Infrastructure Grid */}
      <section className="bg-white p-5 md:p-16 rounded-[2rem] md:rounded-[3rem] border border-slate-50 shadow-xl">
         <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-12 gap-3">
            <div className="space-y-0.5 md:space-y-1">
              <h3 className="text-xl md:text-5xl font-[1000] text-black tracking-tight leading-none">{t('mpn_grid', user.country)}</h3>
              <p className="text-[7px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] md:tracking-[0.4em]">{t('mpn_subtitle', user.country)}</p>
            </div>
            <button onClick={() => setShowCategoryPicker(true)} className="w-full md:w-auto px-5 py-2.5 bg-slate-50 rounded-lg md:rounded-2xl border border-slate-100 font-black text-[9px] uppercase tracking-widest text-purple-600 hover:bg-purple-50 transition-all">Select Full Grid</button>
         </div>
         
         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-12">
            {gridItems.map(item => (
              <button 
                key={item.id} 
                onClick={() => setSelectedService(item.id)}
                className="flex flex-col items-center gap-2 md:gap-5 group transition-all"
              >
                <div className={`w-12 h-12 md:w-24 md:h-24 rounded-xl md:rounded-[2rem] flex items-center justify-center transition-all group-hover:scale-110 group-hover:-translate-y-1 shadow-md md:shadow-xl ${item.color}`}>
                   {React.isValidElement(item.icon) ? React.cloneElement(item.icon as React.ReactElement<any>, { width: 20, height: 20, strokeWidth: 3 }) : item.icon}
                </div>
                <div className="text-center space-y-0.5 md:space-y-1.5">
                  <p className="text-[9px] md:text-base font-black uppercase text-black tracking-widest group-hover:text-purple-600 transition-colors">{item.label}</p>
                  <p className="hidden md:block text-[9px] font-bold text-slate-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">{item.detail}</p>
                </div>
              </button>
            ))}
         </div>
      </section>

      {/* Activity Tracker */}
      <div className="bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-xl p-5 md:p-14">
         <div className="flex items-center justify-between mb-6 md:mb-10">
            <div className="space-y-0.5 md:space-y-1">
               <h3 className="text-lg md:text-3xl font-[1000] text-black tracking-tight leading-none">
                 {t('recent_transactions', user.country)}
               </h3>
               <p className="text-[7px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 Live Terminal Activity
               </p>
            </div>
            <button onClick={() => onTabChange('history')} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg md:rounded-xl font-black text-[8px] md:text-[10px] uppercase tracking-widest text-slate-600 hover:text-purple-600 transition-all">
              {t('see_more', user.country)}
            </button>
         </div>
         
         <div className="space-y-1.5 max-h-[350px] md:max-h-[500px] overflow-y-auto custom-scrollbar pr-1 md:pr-2">
           {transactions.length > 0 ? transactions.map(tx => (
             <div key={tx.id} className="p-3.5 md:p-7 flex items-center justify-between rounded-xl md:rounded-[2rem] bg-slate-50/50 border border-transparent hover:border-purple-100 hover:bg-white transition-all group shadow-sm">
                <div className="flex items-center gap-3 md:gap-6 min-w-0">
                  <div className={`w-9 h-9 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center shrink-0 shadow-sm ${tx.type === 'credit' ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-slate-400'}`}>
                     {tx.type === 'credit' ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M7 7l10 10M17 7v10H7"/></svg> : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M17 17L7 7M7 17V7h10"/></svg>}
                  </div>
                  <div className="min-w-0">
                    <p className={`font-black text-black text-xs md:text-lg truncate group-hover:text-purple-600 transition-colors leading-tight ${user.security.hideBalances ? 'blur-sm select-none' : ''}`}>{tx.name}</p>
                    <p className="text-[7px] md:text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 md:mt-2 truncate">{tx.date} • {tx.category}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                   <p className={`font-black text-sm md:text-xl ${tx.type === 'credit' ? 'text-emerald-600' : 'text-black'} ${user.security.hideBalances ? 'blur-sm select-none' : ''}`}>{tx.type === 'credit' ? '+' : '-'}{currencySymbol}{user.security.hideBalances ? '•••' : tx.amount.toLocaleString()}</p>
                   <span className="text-[6px] md:text-[8px] font-black text-slate-300 uppercase tracking-widest mt-0.5 md:mt-1 block">Authorized</span>
                </div>
             </div>
           )) : (
             <div className="py-12 md:py-24 flex flex-col items-center justify-center text-center opacity-30 grayscale gap-3 md:gap-5">
               <div className="w-14 h-14 md:w-20 md:h-20 bg-slate-50 rounded-xl md:rounded-[2rem] flex items-center justify-center shadow-inner"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
               <p className="text-[9px] md:text-xs font-black uppercase tracking-[0.3em]">No Recorded Activity</p>
             </div>
           )}
         </div>
      </div>

      {/* Modals */}
      {selectedService && (
        <ServiceModal 
          isOpen={true} 
          onClose={() => setSelectedService(null)} 
          serviceName={selectedService}
          country={user.country}
          currency={user.currency}
          onComplete={(amt, name) => {
             onNewTransaction(-amt, name, selectedService);
             setSelectedService(null);
          }}
        />
      )}

      {showCategoryPicker && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 bg-slate-950/95 backdrop-blur-2xl animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-4xl rounded-[2rem] md:rounded-[4rem] p-5 sm:p-16 shadow-2xl border border-white animate-in zoom-in-95 duration-300 max-h-[90dvh] flex flex-col overflow-hidden">
              <div className="flex justify-between items-center mb-6 sm:mb-12 px-2 shrink-0">
                 <div className="space-y-0.5 sm:space-y-2">
                    <h2 className="text-xl sm:text-4xl font-[1000] text-slate-900 tracking-tighter leading-none">Terminal Grid</h2>
                    <p className="text-[8px] sm:text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] md:tracking-[0.4em]">Regional Settlement Node</p>
                 </div>
                 <button onClick={() => setShowCategoryPicker(false)} className="p-2 sm:p-4 bg-slate-50 text-slate-400 hover:text-slate-950 rounded-xl md:rounded-3xl transition-all border border-slate-100"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-8 overflow-y-auto pr-2 custom-scrollbar flex-1 pb-4">
                 {gridItems.map(item => (
                    <button 
                      key={item.id} 
                      onClick={() => { setSelectedService(item.id); setShowCategoryPicker(false); }}
                      className="group flex flex-col items-center gap-2 sm:gap-4 transition-all"
                    >
                       <div className={`w-14 h-14 sm:w-24 sm:h-24 rounded-xl sm:rounded-[2.5rem] ${item.color} flex items-center justify-center transition-all group-hover:scale-110 shadow-md sm:shadow-2xl`}>
                          {React.isValidElement(item.icon) ? React.cloneElement(item.icon as React.ReactElement<any>, { width: 20, height: 20, strokeWidth: 3 }) : item.icon}
                       </div>
                       <p className="font-black text-[9px] sm:text-xs uppercase tracking-widest text-slate-900 group-hover:text-purple-600 text-center">{item.label}</p>
                    </button>
                 ))}
                 {['Insurance', 'Investment', 'Water', 'Domestic'].map(extra => (
                   <button 
                      key={extra} 
                      onClick={() => { setSelectedService(extra); setShowCategoryPicker(false); }}
                      className="group flex flex-col items-center gap-2 sm:gap-4 transition-all"
                   >
                      <div className={`w-14 h-14 sm:w-24 sm:h-24 rounded-xl sm:rounded-[2.5rem] bg-slate-50 text-slate-400 flex items-center justify-center transition-all group-hover:scale-110 shadow-sm border border-slate-100 group-hover:border-purple-200 group-hover:text-purple-600`}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M12 5v14M5 12h14"/></svg>
                      </div>
                      <p className="font-black text-[9px] sm:text-xs uppercase tracking-widest text-slate-400 group-hover:text-purple-600 text-center">{extra}</p>
                   </button>
                 ))}
              </div>
           </div>
        </div>
      )}

      {isDepositOpen && (
        <DepositModal 
          isOpen={true} 
          onClose={() => setIsDepositOpen(false)} 
          user={user} 
          onDeposit={(amt, method) => {
             onDeposit(amt, method);
             setIsDepositOpen(false);
          }} 
        />
      )}

      {isWithdrawOpen && (
        <WithdrawModal 
          isOpen={true} 
          onClose={() => setIsWithdrawOpen(false)} 
          currency={user.currency}
          country={user.country}
          balance={user.balance}
          onWithdraw={(amt, dest) => {
             onWithdraw(amt, dest);
             onNewTransaction(-amt, `Withdrawal to ${dest}`, 'Transfer');
             setIsWithdrawOpen(false);
          }}
        />
      )}

      {isReceiveOpen && (
        <ReceiveModal 
          isOpen={true} 
          onClose={() => setIsReceiveOpen(false)} 
          user={user} 
        />
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Dashboard;
