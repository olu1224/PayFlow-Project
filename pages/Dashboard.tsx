
import React, { useState, useEffect } from 'react';
import { User, Transaction } from '../types';
import ServiceModal from '../components/ServiceModal';
import DepositModal from '../components/DepositModal';
import WithdrawModal from '../components/WithdrawModal';
import ReceiveModal from '../components/ReceiveModal';
import ScanPayModal from '../components/ScanPayModal';
import DigitalWalletModal from '../components/DigitalWalletModal';
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
  onUpdateUser: (updates: Partial<User>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, transactions, onNewTransaction, onDeposit, onWithdraw, onExplorePlanning, onNearbyClick, onTabChange, onUpdateSecurity, onUpdateUser }) => {
  const [activeFeature, setActiveFeature] = useState<FeatureKey>('bills');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isReceiveOpen, setIsReceiveOpen] = useState(false);
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
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
    { id: 'Electricity', label: t('grid_electricity', user.country), icon: ICONS.Electricity, color: 'bg-amber-100 text-amber-600' },
    { id: 'Internet', label: t('grid_internet', user.country), icon: ICONS.Data, color: 'bg-blue-100 text-blue-600' },
    { id: 'TV', label: t('grid_tv', user.country), icon: ICONS.TV, color: 'bg-purple-100 text-purple-600' },
    { id: 'Food', label: t('grid_food', user.country), icon: ICONS.Food, color: 'bg-orange-100 text-orange-600' },
    { id: 'Transfer', label: t('grid_transfer', user.country), icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>, color: 'bg-teal-100 text-teal-600' },
    { id: 'Airtime', label: t('grid_airtime', user.country), icon: ICONS.Airtime, color: 'bg-rose-100 text-rose-600' },
    { id: 'Betting', label: t('grid_betting', user.country), icon: ICONS.Betting, color: 'bg-emerald-100 text-emerald-600' },
    { id: 'Transport', label: t('grid_transport', user.country), icon: ICONS.Transport, color: 'bg-indigo-100 text-indigo-600' },
    { id: 'Groceries', label: t('grid_groceries', user.country), icon: ICONS.Groceries, color: 'bg-cyan-100 text-cyan-600' },
    { id: 'International', label: t('grid_international', user.country), icon: ICONS.International, color: 'bg-violet-100 text-violet-600' },
    { id: 'Gov Services', label: t('grid_gov', user.country), icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, color: 'bg-slate-100 text-slate-600' }
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
    <div className="space-y-6 md:space-y-12 max-w-[1400px] mx-auto pb-40 animate-in fade-in duration-700 px-2 md:px-12">
      
      {/* 1. TOP COMMAND BAR: Send, Receive, Scan, Tap */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
         <button onClick={() => setSelectedService('Transfer')} className="bg-white p-4 md:p-8 rounded-2xl md:rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-3 md:gap-5 hover:border-indigo-500 transition-all active:scale-95 group">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-indigo-50 text-indigo-600 rounded-xl md:rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0">
              <svg className="w-5 h-5 md:w-7 md:h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="m18 8-4-4-4 4"/><path d="M14 4v12a4 4 0 0 1-4 4H4"/></svg>
            </div>
            <div className="text-left min-w-0">
              <p className="text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest md:tracking-[0.2em] leading-none mb-1 md:mb-2">Send</p>
              <p className="font-black text-slate-900 text-xs md:text-xl truncate tracking-tight">Money</p>
            </div>
         </button>

         <button onClick={() => setIsReceiveOpen(true)} className="bg-white p-4 md:p-8 rounded-2xl md:rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-3 md:gap-5 hover:border-emerald-500 transition-all active:scale-95 group">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-emerald-50 text-emerald-600 rounded-xl md:rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all shrink-0">
               <svg className="w-5 h-5 md:w-7 md:h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
            </div>
            <div className="text-left min-w-0">
              <p className="text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest md:tracking-[0.2em] leading-none mb-1 md:mb-2">Request</p>
              <p className="font-black text-slate-900 text-xs md:text-xl truncate tracking-tight">Funds</p>
            </div>
         </button>

         <button onClick={() => setIsScanOpen(true)} className="bg-white p-4 md:p-8 rounded-2xl md:rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-3 md:gap-5 hover:border-purple-500 transition-all active:scale-95 group">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-purple-50 text-purple-600 rounded-xl md:rounded-2xl flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all shrink-0">
               <div className="scale-75 md:scale-100">{ICONS.Scan}</div>
            </div>
            <div className="text-left min-w-0">
              <p className="text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest md:tracking-[0.2em] leading-none mb-1 md:mb-2">Scan</p>
              <p className="font-black text-slate-900 text-xs md:text-xl truncate tracking-tight">Store QR</p>
            </div>
         </button>

         <button onClick={() => setIsWalletOpen(true)} className="bg-white p-4 md:p-8 rounded-2xl md:rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-3 md:gap-5 hover:border-cyan-500 transition-all active:scale-95 group">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-cyan-50 text-cyan-600 rounded-xl md:rounded-2xl flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition-all shrink-0">
               <div className="scale-75 md:scale-100">{ICONS.Tap}</div>
            </div>
            <div className="text-left min-w-0">
              <p className="text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest md:tracking-[0.2em] leading-none mb-1 md:mb-2">Wallet</p>
              <p className="font-black text-slate-900 text-xs md:text-xl truncate tracking-tight">Tap to Pay</p>
            </div>
         </button>
      </section>

      {/* 2. THE VAULT CARD (BALANCE AREA) */}
      <section className="bg-slate-950 rounded-[2rem] md:rounded-[3rem] p-6 md:p-16 text-white relative overflow-hidden shadow-2xl group border border-white/5">
        <div className="absolute top-[-30%] right-[-5%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-indigo-600 rounded-full blur-[80px] md:blur-[120px] opacity-20 transition-all duration-[4s]"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-12 text-center md:text-left">
          <div className="space-y-2 md:space-y-4 w-full md:w-auto">
            <div className="flex items-center justify-center md:justify-start gap-2 md:gap-4">
              <div className="w-1.5 h-1.5 md:w-2.5 md:h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
              <p className="text-[9px] md:text-[12px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-slate-400 leading-none">{t('wallet_balance', user.country)}</p>
              
              <button 
                onClick={toggleStealth}
                className={`ml-1 md:ml-2 px-2 md:px-4 py-1 rounded-full border md:border-2 transition-all flex items-center gap-1.5 md:gap-2 ${user.security.hideBalances ? 'bg-indigo-600 border-indigo-400' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
              >
                <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest leading-none">{user.security.hideBalances ? 'Hidden' : 'Show'}</span>
              </button>
            </div>
            
            <div className={`flex items-baseline justify-center md:justify-start gap-1 md:gap-4 leading-none transition-all ${user.security.hideBalances ? 'blur-xl opacity-20 select-none' : ''}`}>
              <span className="text-xl md:text-5xl font-black text-indigo-500 leading-none">{currencySymbol}</span>
              <h2 className="text-4xl md:text-8xl font-[1000] tracking-tighter leading-none">{formatBalance(user.balance)}</h2>
            </div>
          </div>

          <div className="flex flex-row gap-2 md:gap-4 w-full md:w-auto">
            <button onClick={() => setIsWithdrawOpen(true)} className="flex-1 md:w-44 bg-white/5 border md:border-2 border-white/10 py-3 md:py-5 rounded-xl md:rounded-2xl font-[1000] text-[9px] md:text-[12px] uppercase tracking-widest md:tracking-[0.3em] transition-all hover:bg-white/10 active:scale-95">Withdraw</button>
            <button onClick={() => setIsDepositOpen(true)} className="flex-1 md:w-44 bg-white text-slate-900 py-3 md:py-5 rounded-xl md:rounded-2xl font-[1000] text-[9px] md:text-[12px] uppercase tracking-widest md:tracking-[0.3em] transition-all hover:bg-slate-100 active:scale-95 shadow-xl">Add Cash</button>
          </div>
        </div>
      </section>

      {/* 3. WELCOME WIDGET / MODULE SELECTOR */}
      <section className="bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden group mx-1 md:mx-0">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-[35%] relative overflow-hidden h-32 md:h-auto shrink-0 bg-slate-100">
             <img 
               key={activeFeature}
               src={featureConfigs[activeFeature].image} 
               alt={activeFeature} 
               className="absolute inset-0 w-full h-full object-cover saturate-[0.7] brightness-[0.7]"
             />
             <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent"></div>
             <div className="absolute inset-0 p-4 md:p-10 flex flex-col justify-end md:justify-start gap-1 md:gap-2">
                <p className="text-[8px] md:text-[12px] font-black text-indigo-400 uppercase tracking-widest md:tracking-[0.4em]">{greeting}</p>
                <h3 className="text-lg md:text-4xl font-[1000] text-white leading-tight tracking-tight">{user.name.split(' ')[0]}'s Workspace</h3>
             </div>
          </div>

          <div className="flex-1 p-5 md:p-16 space-y-6 md:space-y-10 flex flex-col justify-center">
            <div className="space-y-2 md:space-y-4">
              <div className="flex items-center gap-3 md:gap-6">
                 <div className={`w-10 h-10 md:w-16 md:h-16 ${featureConfigs[activeFeature].color} rounded-xl md:rounded-[1.5rem] flex items-center justify-center text-white shadow-lg md:shadow-2xl`}>
                    {featureConfigs[activeFeature].icon}
                 </div>
                 <h4 className="text-xl md:text-4xl font-[1000] text-slate-900 tracking-tight leading-none">{featureConfigs[activeFeature].title}</h4>
              </div>
              <p className="text-sm md:text-xl text-slate-500 font-medium leading-relaxed max-w-2xl">
                {featureConfigs[activeFeature].detail}
              </p>
            </div>

            <div className="space-y-4 md:space-y-8">
              <div className="flex gap-1 md:gap-2 p-1 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100 overflow-x-auto no-scrollbar scroll-smooth">
                 {(['bills', 'transfer', 'savings', 'crypto', 'business', 'nearby'] as const).map(key => (
                   <button 
                     key={key} 
                     onClick={() => setActiveFeature(key)}
                     className={`px-4 md:px-8 py-2 md:py-4 rounded-lg md:rounded-xl font-black text-[9px] md:text-[12px] uppercase tracking-widest transition-all shrink-0 whitespace-nowrap ${activeFeature === key ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                   >
                     {key}
                   </button>
                 ))}
              </div>
              
              <button 
                onClick={handleAction}
                className="w-full md:w-fit px-12 py-4 md:py-6 bg-slate-900 text-white rounded-xl md:rounded-2xl font-[1000] text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.4em] shadow-2xl hover:bg-indigo-600 transition-all active:scale-95"
              >
                {featureConfigs[activeFeature].action}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. UTILITY GRID SECTION */}
      <section className="bg-white p-5 md:p-16 rounded-[2rem] md:rounded-[3.5rem] border border-slate-100 shadow-sm mx-1 md:mx-0">
         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 md:mb-12 gap-4 md:gap-6">
            <div className="space-y-1 md:space-y-2">
              <h3 className="text-xl md:text-4xl font-[1000] text-slate-900 tracking-tighter leading-none">Universal Grid</h3>
              <p className="text-[9px] md:text-[12px] font-black text-slate-400 uppercase tracking-widest md:tracking-[0.4em] leading-none">{t('mpn_subtitle', user.country)}</p>
            </div>
            <button onClick={() => setShowCategoryPicker(true)} className="px-5 md:px-8 py-2.5 md:py-3.5 bg-slate-50 border border-slate-100 rounded-xl font-[1000] text-[10px] md:text-[11px] uppercase tracking-widest md:tracking-[0.2em] text-indigo-600 hover:bg-indigo-50 transition-all">Expand Grid</button>
         </div>
         
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-8">
            {gridItems.map(item => (
              <button 
                key={item.id} 
                onClick={() => setSelectedService(item.id)}
                className="flex flex-col items-center gap-2 md:gap-4 group p-3 rounded-2xl md:rounded-[2.5rem] hover:bg-slate-50 transition-all"
              >
                <div className={`w-12 h-12 md:w-24 md:h-24 rounded-2xl md:rounded-[2rem] flex items-center justify-center transition-all group-hover:scale-110 shadow-sm ${item.color}`}>
                   {React.isValidElement(item.icon) ? React.cloneElement(item.icon as React.ReactElement<any>, { width: 24, height: 24, className: "md:w-8 md:h-8" }) : item.icon}
                </div>
                <p className="text-[8px] md:text-[12px] font-black uppercase text-slate-800 tracking-wider md:tracking-[0.25em] truncate w-full text-center group-hover:text-indigo-600 transition-colors">{item.label}</p>
              </button>
            ))}
         </div>
      </section>

      {/* Grid Expand Modal - Fixed Scroll Issue */}
      {showCategoryPicker && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-2xl animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-5xl rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-16 shadow-2xl border border-white animate-in zoom-in-95 duration-300 flex flex-col max-h-[90dvh]">
              <div className="flex justify-between items-center mb-8 md:mb-12 shrink-0">
                 <div className="space-y-1 md:space-y-2">
                    <h2 className="text-2xl md:text-4xl font-[1000] text-slate-900 tracking-tighter leading-none">Grid Interface</h2>
                    <p className="text-[9px] md:text-[12px] font-black text-slate-400 uppercase tracking-widest md:tracking-[0.4em] leading-none">Global Terminal</p>
                 </div>
                 <button onClick={() => setShowCategoryPicker(false)} className="p-3 md:p-4 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl md:rounded-[1.5rem] transition-all border border-slate-100"><svg className="w-6 h-6 md:w-8 md:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 overflow-y-auto pr-2 md:pr-4 custom-scrollbar flex-1 pb-6 overscroll-contain">
                 {gridItems.map(item => (
                    <button 
                      key={item.id} 
                      onClick={() => { setSelectedService(item.id); setShowCategoryPicker(false); }}
                      className="group flex flex-col items-center gap-3 md:gap-4 p-5 md:p-8 rounded-[1.5rem] md:rounded-[3rem] hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                    >
                       <div className={`w-16 h-16 md:w-32 md:h-32 rounded-2xl md:rounded-[2.5rem] ${item.color} flex items-center justify-center transition-all group-hover:scale-105 shadow-sm`}>
                          {React.isValidElement(item.icon) ? React.cloneElement(item.icon as React.ReactElement<any>, { width: 28, height: 28, className: "md:w-11 md:h-11" }) : item.icon}
                       </div>
                       <p className="font-black text-[9px] md:text-[12px] uppercase tracking-widest md:tracking-[0.3em] text-slate-800 text-center leading-tight">{item.label}</p>
                    </button>
                 ))}
              </div>
           </div>
        </div>
      )}

      {/* 5. RECENT ACTIVITY SECTION */}
      <div className="bg-white rounded-[2rem] md:rounded-[3.5rem] border border-slate-100 shadow-sm p-6 md:p-16 mx-1 md:mx-0">
         <div className="flex items-center justify-between mb-8 md:mb-12 px-1">
            <div className="space-y-1 md:space-y-2">
               <h3 className="text-xl md:text-4xl font-[1000] text-slate-900 tracking-tighter leading-none">Recent Activity</h3>
               <p className="text-[9px] md:text-[12px] font-black text-slate-400 uppercase tracking-widest md:tracking-[0.4em] leading-none">Terminal Logs</p>
            </div>
            <button onClick={() => onTabChange('history')} className="px-4 md:px-8 py-2 md:py-3.5 bg-slate-50 border border-slate-100 rounded-xl font-[1000] text-[10px] md:text-[11px] uppercase tracking-widest md:tracking-[0.2em] text-slate-600 hover:text-indigo-600 transition-all">Audit History</button>
         </div>
         
         <div className="space-y-2 md:space-y-3">
           {transactions.slice(0, 5).length > 0 ? transactions.slice(0, 5).map(tx => (
             <div key={tx.id} className="p-4 md:p-8 flex items-center justify-between rounded-2xl md:rounded-[2rem] bg-slate-50 border border-transparent hover:border-slate-200 transition-all group shadow-sm">
                <div className="flex items-center gap-3 md:gap-6 min-w-0">
                  <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 shadow-md ${tx.type === 'credit' ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-slate-400'}`}>
                     {tx.type === 'credit' ? <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M7 7l10 10M17 7v10H7"/></svg> : <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M17 17L7 7M7 17V7h10"/></svg>}
                  </div>
                  <div className="min-w-0">
                    <p className={`font-black text-slate-800 text-sm md:text-xl truncate leading-none mb-1.5 md:mb-2.5 ${user.security.hideBalances ? 'blur-lg opacity-20' : ''}`}>{tx.name}</p>
                    <p className="text-[8px] md:text-[11px] text-slate-400 font-bold uppercase tracking-widest md:tracking-[0.25em] leading-none truncate">{tx.date} • {tx.category}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                   <p className={`font-black text-sm md:text-2xl tracking-tight ${tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-900'} ${user.security.hideBalances ? 'blur-lg opacity-20' : ''}`}>
                     {tx.type === 'credit' ? '+' : '-'}{currencySymbol}{user.security.hideBalances ? '•••' : tx.amount.toLocaleString()}
                   </p>
                </div>
             </div>
           )) : (
             <div className="py-20 md:py-24 text-center grayscale opacity-30">
               <p className="text-[12px] md:text-[14px] font-[1000] uppercase tracking-[0.3em] md:tracking-[0.5em] text-slate-300">No Activity Records</p>
             </div>
           )}
         </div>
      </div>

      {/* Rendering common modals */}
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

      {isDepositOpen && <DepositModal isOpen={true} onClose={() => setIsDepositOpen(false)} user={user} onDeposit={(amt, m) => { onDeposit(amt, m); setIsDepositOpen(false); }} />}
      {isWithdrawOpen && <WithdrawModal isOpen={true} onClose={() => setIsWithdrawOpen(false)} currency={user.currency} country={user.country} balance={user.balance} onWithdraw={(amt, dest) => { onWithdraw(amt, dest); onNewTransaction(-amt, `Withdrawal: ${dest}`, 'Transfer'); setIsWithdrawOpen(false); }} />}
      {isReceiveOpen && <ReceiveModal isOpen={true} onClose={() => setIsReceiveOpen(false)} user={user} />}
      {isScanOpen && <ScanPayModal isOpen={true} onClose={() => setIsScanOpen(false)} onComplete={(amt, merchant) => onNewTransaction(-amt, `QR Pay: ${merchant}`, 'Express Pay')} />}
      {isWalletOpen && <DigitalWalletModal isOpen={true} onClose={() => setIsWalletOpen(false)} user={user} onAddCard={(c) => onUpdateUser({storedCards: [...(user.storedCards || []), {...c, id: Date.now().toString()}]})} />}
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        @media (min-width: 768px) { .custom-scrollbar::-webkit-scrollbar { width: 6px; } }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Dashboard;
