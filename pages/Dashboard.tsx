
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
  const [isGridExpanded, setIsGridExpanded] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isReceiveOpen, setIsReceiveOpen] = useState(false);
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting(t('good_morning', user.country));
    else if (hour < 17) setGreeting(t('good_afternoon', user.country));
    else setGreeting(t('good_evening', user.country));
  }, [user.country]);

  const currencySymbol = user.currency === 'NGN' ? '₦' : user.currency === 'GHS' ? 'GH₵' : 'CFA';
  const formatBalance = (val: number) => user.security.hideBalances ? '••••••' : val.toLocaleString();

  const gridItems = [
    { id: 'Electricity', label: 'Electricity', icon: ICONS.Electricity, color: 'bg-amber-100 text-amber-600' },
    { id: 'Internet', label: 'Internet', icon: ICONS.Data, color: 'bg-blue-100 text-blue-600' },
    { id: 'TV', label: 'TV & Cable', icon: ICONS.TV, color: 'bg-purple-100 text-purple-600' },
    { id: 'Airtime', label: 'Airtime', icon: ICONS.Airtime, color: 'bg-rose-100 text-rose-600' },
    { id: 'Food', label: 'Order Food', icon: ICONS.Food, color: 'bg-orange-100 text-orange-600' },
    { id: 'Water', label: 'Water Bill', icon: ICONS.Domestic, color: 'bg-cyan-100 text-cyan-600' },
    { id: 'Gov Services', label: 'Government', icon: ICONS.Gov, color: 'bg-emerald-100 text-emerald-600' },
    { id: 'Transport', label: 'Transport', icon: ICONS.Transport, color: 'bg-slate-100 text-slate-600' },
    { id: 'Betting', label: 'Betting', icon: ICONS.Betting, color: 'bg-indigo-100 text-indigo-600' },
    { id: 'Insurance', label: 'Insurance', icon: ICONS.Insurance, color: 'bg-teal-100 text-teal-600' },
    { id: 'Education', label: 'Education', icon: ICONS.Loan, color: 'bg-violet-100 text-violet-600' },
    { id: 'International', label: 'Global Pay', icon: ICONS.International, color: 'bg-zinc-900 text-white' }
  ];

  const featureConfigs: Record<FeatureKey, { 
    title: string, 
    color: string, 
    icon: React.ReactNode, 
    detail: string, 
    action: string,
    image: string 
  }> = {
    bills: { 
      title: t('bills_title', user.country), 
      color: 'bg-amber-500', 
      action: t('bills_action', user.country), 
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>, 
      detail: t('bills_desc', user.country),
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=1200"
    },
    transfer: { 
      title: t('transfer_title', user.country), 
      color: 'bg-emerald-500', 
      action: t('transfer_action', user.country), 
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="m18 8-4-4-4 4"/><path d="M14 4v12a4 4 0 0 1-4 4H4"/></svg>, 
      detail: t('transfer_desc', user.country),
      image: "https://images.unsplash.com/photo-1556740714-a8395b3bf30f?auto=format&fit=crop&q=80&w=1200"
    },
    savings: { 
      title: t('savings_title', user.country), 
      color: 'bg-purple-600', 
      action: t('savings_action', user.country), 
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, 
      detail: t('savings_desc', user.country),
      image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=1200"
    },
    crypto: { 
      title: t('crypto_title', user.country), 
      color: 'bg-blue-500', 
      action: t('crypto_action', user.country), 
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>, 
      detail: t('crypto_desc', user.country),
      image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&q=80&w=1200"
    },
    business: { 
      title: t('business_title', user.country), 
      color: 'bg-indigo-600', 
      action: t('business_action', user.country), 
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><rect width="18" height="12" x="3" y="6" rx="2"/><path d="M3 10h18"/></svg>, 
      detail: t('business_desc', user.country),
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200"
    },
    nearby: { 
      title: t('nearby_title', user.country), 
      color: 'bg-rose-500', 
      action: t('nearby_action', user.country), 
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>, 
      detail: t('nearby_desc', user.country),
      image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1200"
    }
  };

  const handleAction = () => {
    if (activeFeature === 'bills') setSelectedService('Electricity');
    else if (activeFeature === 'transfer') setSelectedService('Transfer');
    else if (activeFeature === 'savings') onExplorePlanning();
    else if (activeFeature === 'crypto') onTabChange('crypto');
    else if (activeFeature === 'business') onTabChange('b2b');
    else if (activeFeature === 'nearby') onNearbyClick();
  };

  return (
    <div className="space-y-6 md:space-y-12 max-w-[1400px] mx-auto pb-40 animate-in fade-in duration-700 px-2 md:px-12">
      
      {/* 1. THE VAULT CARD (PRIMARY START) */}
      <section className="bg-slate-950 rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-20 text-white relative overflow-hidden shadow-2xl group border border-white/5 mx-1 md:mx-0 mt-4">
        <div className="absolute top-[-30%] right-[-5%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-indigo-600 rounded-full blur-[80px] md:blur-[120px] opacity-20 transition-all duration-[4s]"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-12 text-center md:text-left">
          <div className="space-y-2 md:space-y-4 w-full md:w-auto">
            <div className="flex items-center justify-center md:justify-start gap-2 md:gap-4">
              <div className="w-1.5 h-1.5 md:w-2.5 md:h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
              <p className="text-[9px] md:text-[12px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-slate-400 leading-none">{t('vault_balance', user.country)}</p>
            </div>
            <div className={`flex items-baseline justify-center md:justify-start gap-1 md:gap-4 leading-none transition-all ${user.security.hideBalances ? 'blur-xl opacity-20 select-none' : ''}`}>
              <span className="text-xl md:text-5xl font-black text-indigo-500 leading-none">{currencySymbol}</span>
              <h2 className="text-4xl md:text-9xl font-[1000] tracking-tighter leading-none">{formatBalance(user.balance)}</h2>
            </div>
          </div>
          <div className="flex flex-row gap-2 md:gap-4 w-full md:w-auto">
            <button onClick={() => setIsWithdrawOpen(true)} className="flex-1 md:w-44 bg-white/5 border md:border-2 border-white/10 py-3 md:py-6 rounded-xl md:rounded-[2rem] font-[1000] text-[9px] md:text-[12px] uppercase tracking-widest md:tracking-[0.3em] transition-all hover:bg-white/10 active:scale-95">{t('withdraw', user.country)}</button>
            <button onClick={() => setIsDepositOpen(true)} className="flex-1 md:w-44 bg-white text-slate-900 py-3 md:py-6 rounded-xl md:rounded-[2rem] font-[1000] text-[9px] md:text-[12px] uppercase tracking-widest md:tracking-[0.3em] transition-all hover:bg-slate-100 active:scale-95 shadow-xl">{t('add_cash', user.country)}</button>
          </div>
        </div>
      </section>

      {/* 2. COMMAND BAR (SEND, REQUEST, SCAN, WALLET) */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
         <button onClick={() => setSelectedService('Transfer')} className="bg-white p-4 md:p-10 rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-3 md:gap-6 hover:border-indigo-500 transition-all active:scale-95 group">
            <div className="w-10 h-10 md:w-16 md:h-16 bg-indigo-50 text-indigo-600 rounded-xl md:rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0">
              <svg className="w-5 h-5 md:w-8 md:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="m18 8-4-4-4 4"/><path d="M14 4v12a4 4 0 0 1-4 4H4"/></svg>
            </div>
            <div className="text-left min-w-0">
              <p className="text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest md:tracking-[0.2em] leading-none mb-1 md:mb-2">{t('send', user.country)}</p>
              <p className="font-[1000] text-slate-900 text-xs md:text-2xl truncate tracking-tight">{t('money', user.country)}</p>
            </div>
         </button>

         <button onClick={() => setIsReceiveOpen(true)} className="bg-white p-4 md:p-10 rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-3 md:gap-6 hover:border-emerald-500 transition-all active:scale-95 group">
            <div className="w-10 h-10 md:w-16 md:h-16 bg-emerald-50 text-emerald-600 rounded-xl md:rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all shrink-0">
               <svg className="w-5 h-5 md:w-8 md:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
            </div>
            <div className="text-left min-w-0">
              <p className="text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest md:tracking-[0.2em] leading-none mb-1 md:mb-2">{t('request', user.country)}</p>
              <p className="font-[1000] text-slate-900 text-xs md:text-2xl truncate tracking-tight">{t('funds', user.country)}</p>
            </div>
         </button>

         <button onClick={() => setIsScanOpen(true)} className="bg-white p-4 md:p-10 rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-3 md:gap-6 hover:border-purple-500 transition-all active:scale-95 group">
            <div className="w-10 h-10 md:w-16 md:h-16 bg-purple-50 text-purple-600 rounded-xl md:rounded-2xl flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all shrink-0">
               <div className="scale-75 md:scale-110">{ICONS.Scan}</div>
            </div>
            <div className="text-left min-w-0">
              <p className="text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest md:tracking-[0.2em] leading-none mb-1 md:mb-2">{t('scan', user.country)}</p>
              <p className="font-[1000] text-slate-900 text-xs md:text-2xl truncate tracking-tight">{t('store_qr', user.country)}</p>
            </div>
         </button>

         <button onClick={() => setIsWalletOpen(true)} className="bg-white p-4 md:p-10 rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-3 md:gap-6 hover:border-cyan-500 transition-all active:scale-95 group">
            <div className="w-10 h-10 md:w-16 md:h-16 bg-cyan-50 text-cyan-600 rounded-xl md:rounded-2xl flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition-all shrink-0">
               <div className="scale-75 md:scale-110">{ICONS.Tap}</div>
            </div>
            <div className="text-left min-w-0">
              <p className="text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest md:tracking-[0.2em] leading-none mb-1 md:mb-2">{t('wallet', user.country)}</p>
              <p className="font-[1000] text-slate-900 text-xs md:text-2xl truncate tracking-tight">{t('tap_to_pay', user.country)}</p>
            </div>
         </button>
      </section>

      {/* 3. WELCOME WIDGET (BANNER) */}
      <section className="bg-white rounded-[2rem] md:rounded-[3.5rem] border border-slate-100 shadow-xl overflow-hidden group mx-1 md:mx-0">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-[35%] relative overflow-hidden h-32 md:h-auto shrink-0 bg-slate-100">
             <img key={activeFeature} src={featureConfigs[activeFeature].image} className="absolute inset-0 w-full h-full object-cover saturate-[0.7] brightness-[0.7]" alt="Banner" />
             <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent"></div>
             <div className="absolute inset-0 p-4 md:p-12 flex flex-col justify-end md:justify-start gap-1 md:gap-2">
                <p className="text-[8px] md:text-[12px] font-black text-indigo-400 uppercase tracking-widest md:tracking-[0.4em]">{greeting}</p>
                <h3 className="text-lg md:text-5xl font-[1000] text-white leading-tight tracking-tighter">{user.name.split(' ')[0]} - {t('workspace', user.country)}</h3>
             </div>
          </div>

          <div className="flex-1 p-5 md:p-20 space-y-6 md:space-y-12 flex flex-col justify-center">
            <div className="space-y-2 md:space-y-4">
              <div className="flex items-center gap-3 md:gap-8">
                 <div className={`w-10 h-10 md:w-20 md:h-20 ${featureConfigs[activeFeature].color} rounded-xl md:rounded-[2rem] flex items-center justify-center text-white shadow-lg md:shadow-2xl`}>
                    {featureConfigs[activeFeature].icon}
                 </div>
                 <h4 className="text-xl md:text-5xl font-[1000] text-slate-900 tracking-tighter leading-none">{featureConfigs[activeFeature].title}</h4>
              </div>
              <p className="text-sm md:text-2xl text-slate-500 font-medium leading-relaxed max-w-2xl">
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
                     {t(`${key}_title`, user.country)}
                   </button>
                 ))}
              </div>
              
              <button 
                onClick={handleAction}
                className="w-full md:w-fit px-12 py-4 md:py-7 bg-slate-900 text-white rounded-xl md:rounded-[2rem] font-[1000] text-[10px] md:text-sm uppercase tracking-[0.2em] md:tracking-[0.4em] shadow-2xl hover:bg-indigo-600 transition-all active:scale-95"
              >
                {featureConfigs[activeFeature].action}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. UNIVERSAL GRID SECTION */}
      <section className="bg-white p-6 md:p-20 rounded-[2.5rem] md:rounded-[4rem] border border-slate-100 shadow-sm mx-1 md:mx-0">
         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 md:mb-20 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                <h3 className="text-xl md:text-5xl font-[1000] text-slate-900 tracking-tighter leading-none">{t('universal_grid', user.country)}</h3>
              </div>
              <p className="text-[10px] md:text-[14px] font-black text-slate-400 uppercase tracking-widest md:tracking-[0.4em] leading-none ml-4 md:ml-6">{t('mpn_subtitle', user.country)}</p>
            </div>
            <button 
              onClick={() => setIsGridExpanded(!isGridExpanded)}
              className="px-8 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-600 hover:bg-white hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm flex items-center gap-3 active:scale-95"
            >
              {isGridExpanded ? 'Show Less' : 'Explore Grid'}
              <svg className={`transition-transform duration-300 ${isGridExpanded ? 'rotate-180' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="m6 9 6 6 6-6"/></svg>
            </button>
         </div>

         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-12">
            {(isGridExpanded ? gridItems : gridItems.slice(0, 6)).map((item, idx) => (
              <button 
                key={item.id} 
                onClick={() => setSelectedService(item.id)}
                className="flex flex-col items-center gap-3 md:gap-6 group p-4 md:p-8 rounded-[2.5rem] md:rounded-[4rem] hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className={`w-14 h-14 md:w-32 md:h-32 rounded-[2rem] md:rounded-[3.5rem] flex items-center justify-center transition-all group-hover:scale-110 shadow-sm ${item.color} group-hover:shadow-2xl`}>
                   {React.isValidElement(item.icon) ? React.cloneElement(item.icon as React.ReactElement<any>, { width: 32, height: 32, className: "md:w-12 md:h-12" }) : item.icon}
                </div>
                <div className="text-center space-y-1">
                   <p className="text-[9px] md:text-[14px] font-[1000] uppercase text-slate-800 tracking-wider md:tracking-[0.3em] truncate w-full group-hover:text-indigo-600 transition-colors">{item.label}</p>
                </div>
              </button>
            ))}
         </div>
      </section>

      {/* 5. RECENT ACTIVITY SECTION */}
      <div className="bg-white rounded-[2.5rem] md:rounded-[4rem] border border-slate-100 shadow-sm p-6 md:p-20 mx-1 md:mx-0">
         <div className="flex items-center justify-between mb-8 md:mb-16 px-1">
            <div className="space-y-1 md:space-y-2">
               <h3 className="text-xl md:text-5xl font-[1000] text-slate-900 tracking-tighter leading-none">{t('recent_activity', user.country)}</h3>
            </div>
            <button onClick={() => onTabChange('history')} className="px-5 md:px-10 py-2.5 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl font-[1000] text-[10px] md:text-[12px] uppercase tracking-widest md:tracking-[0.2em] text-slate-600 hover:text-indigo-600 transition-all shadow-sm">{t('audit_history', user.country)}</button>
         </div>
         <div className="space-y-2 md:space-y-4">
           {transactions.slice(0, 5).map(tx => (
             <div key={tx.id} className="p-4 md:p-10 flex items-center justify-between rounded-2xl md:rounded-[2.5rem] bg-slate-50 border border-transparent hover:border-slate-200 transition-all group shadow-sm">
                <div className="flex items-center gap-3 md:gap-8 min-w-0">
                  <div className={`w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-md ${tx.type === 'credit' ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-slate-400'}`}>
                     {tx.type === 'credit' ? '+' : '-'}
                  </div>
                  <div className="min-w-0">
                    <p className={`font-[1000] text-slate-800 text-sm md:text-2xl truncate leading-none mb-1.5 md:mb-3`}>{tx.name}</p>
                    <p className="text-[8px] md:text-[12px] text-slate-400 font-black uppercase tracking-widest md:tracking-[0.25em] leading-none truncate">{tx.date} • {tx.category}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                   <p className={`font-[1000] text-sm md:text-3xl tracking-tighter ${tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-900'}`}>
                     {tx.type === 'credit' ? '+' : '-'}{currencySymbol}{tx.amount.toLocaleString()}
                   </p>
                </div>
             </div>
           ))}
         </div>
      </div>

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
    </div>
  );
};

export default Dashboard;
