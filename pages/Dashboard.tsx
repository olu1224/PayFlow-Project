
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
  
  // Format balance logic
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

  return (
    <div className="space-y-6 md:space-y-10 max-w-[1400px] mx-auto pb-12 animate-in fade-in duration-700 px-2 md:px-12">
      
      {/* 1. THE VAULT CARD */}
      <section className="bg-slate-950 rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-16 text-white relative overflow-hidden shadow-2xl group border border-white/5 mx-1 md:mx-0 mt-2">
        <div className="absolute top-[-30%] right-[-5%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-indigo-600 rounded-full blur-[80px] md:blur-[120px] opacity-20 transition-all duration-[4s]"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-12 text-center md:text-left">
          <div className="space-y-2 md:space-y-4 w-full md:w-auto">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <p className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-slate-400 leading-none">{t('vault_balance', user.country)}</p>
              
              {/* RESTORED HIDE BALANCE TOGGLE */}
              <button 
                onClick={() => onUpdateSecurity({ hideBalances: !user.security.hideBalances })}
                className="p-1 hover:text-white text-slate-500 transition-colors"
                title={user.security.hideBalances ? "Show Balance" : "Hide Balance"}
              >
                {user.security.hideBalances ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88L3 3m6.12 6.12a3 3 0 1 0 4.24 4.24m4.76-4.76A8.7 8.7 0 0 0 21 12a9 9 0 0 1-13.09 8.09M16.62 16.62A8.87 8.87 0 0 1 3 12a9 9 0 0 1 3.47-7.07"/></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
            
            <div className={`flex items-baseline justify-center md:justify-start gap-1 md:gap-3 leading-none transition-all duration-500 ${user.security.hideBalances ? 'opacity-40' : ''}`}>
              <span className={`text-xl md:text-4xl font-black text-indigo-500 leading-none ${user.security.hideBalances ? 'invisible' : ''}`}>{currencySymbol}</span>
              <h2 className={`text-4xl md:text-8xl font-[1000] tracking-tighter leading-none ${user.security.hideBalances ? 'translate-y-1' : ''}`}>
                {formatBalance(user.balance)}
              </h2>
            </div>
          </div>
          <div className="flex flex-row gap-2 md:gap-4 w-full md:w-auto">
            <button onClick={() => setIsWithdrawOpen(true)} className="flex-1 md:w-40 bg-white/5 border border-white/10 py-3 md:py-5 rounded-xl md:rounded-[1.8rem] font-[1000] text-[9px] md:text-[11px] uppercase tracking-widest md:tracking-[0.3em] transition-all hover:bg-white/10 active:scale-95">{t('withdraw', user.country)}</button>
            <button onClick={() => setIsDepositOpen(true)} className="flex-1 md:w-40 bg-white text-slate-900 py-3 md:py-5 rounded-xl md:rounded-[1.8rem] font-[1000] text-[9px] md:text-[11px] uppercase tracking-widest md:tracking-[0.3em] transition-all hover:bg-slate-100 active:scale-95 shadow-xl">{t('add_cash', user.country)}</button>
          </div>
        </div>
      </section>

      {/* 2. COMMAND BAR */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
         <button onClick={() => setSelectedService('Transfer')} className="bg-white p-4 md:p-8 rounded-2xl md:rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-3 md:gap-5 hover:border-indigo-500 transition-all active:scale-95 group">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-indigo-50 text-indigo-600 rounded-xl md:rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0">
              <svg className="w-5 h-5 md:w-7 md:h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="m18 8-4-4-4 4"/><path d="M14 4v12a4 4 0 0 1-4 4H4"/></svg>
            </div>
            <div className="text-left min-w-0">
              <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1 md:mb-1.5">{t('send', user.country)}</p>
              <p className="font-[1000] text-slate-900 text-xs md:text-xl truncate tracking-tight">{t('money', user.country)}</p>
            </div>
         </button>

         <button onClick={() => setIsReceiveOpen(true)} className="bg-white p-4 md:p-8 rounded-2xl md:rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-3 md:gap-5 hover:border-emerald-500 transition-all active:scale-95 group">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-emerald-50 text-emerald-600 rounded-xl md:rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all shrink-0">
               <svg className="w-5 h-5 md:w-7 md:h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
            </div>
            <div className="text-left min-w-0">
              <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1 md:mb-1.5">{t('request', user.country)}</p>
              <p className="font-[1000] text-slate-900 text-xs md:text-xl truncate tracking-tight">{t('funds', user.country)}</p>
            </div>
         </button>

         <button onClick={() => setIsScanOpen(true)} className="bg-white p-4 md:p-8 rounded-2xl md:rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-3 md:gap-5 hover:border-purple-500 transition-all active:scale-95 group">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-purple-50 text-purple-600 rounded-xl md:rounded-2xl flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all shrink-0">
               <div className="scale-75 md:scale-90">{ICONS.Scan}</div>
            </div>
            <div className="text-left min-w-0">
              <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1 md:mb-1.5">{t('scan', user.country)}</p>
              <p className="font-[1000] text-slate-900 text-xs md:text-xl truncate tracking-tight">{t('store_qr', user.country)}</p>
            </div>
         </button>

         <button onClick={() => setIsWalletOpen(true)} className="bg-white p-4 md:p-8 rounded-2xl md:rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-3 md:gap-5 hover:border-cyan-500 transition-all active:scale-95 group">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-cyan-50 text-cyan-600 rounded-xl md:rounded-2xl flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition-all shrink-0">
               <div className="scale-75 md:scale-90">{ICONS.Tap}</div>
            </div>
            <div className="text-left min-w-0">
              <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1 md:mb-1.5">{t('wallet', user.country)}</p>
              <p className="font-[1000] text-slate-900 text-xs md:text-xl truncate tracking-tight">{t('tap_to_pay', user.country)}</p>
            </div>
         </button>
      </section>

      {/* 3. GRID OF SERVICES */}
      <section className="space-y-4 md:space-y-8 pt-2">
        <div className="flex items-center justify-between px-2 md:px-0">
          <h2 className="text-xl md:text-2xl font-[1000] text-slate-900 tracking-tight">{t('universal_grid', user.country)}</h2>
          <button onClick={() => setIsGridExpanded(!isGridExpanded)} className="text-[9px] md:text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline transition-all">
            {isGridExpanded ? 'Collapse Grid' : 'Expand All'}
          </button>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {(isGridExpanded ? gridItems : gridItems.slice(0, 6)).map(item => (
            <button 
              key={item.id} 
              onClick={() => setSelectedService(item.id)}
              className="bg-white p-4 md:p-10 rounded-2xl md:rounded-[2.5rem] border border-slate-50 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all active:scale-95 group"
            >
              <div className={`w-10 h-10 md:w-16 md:h-16 ${item.color} rounded-xl md:rounded-[1.8rem] flex items-center justify-center mb-3 md:mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3 mx-auto shadow-inner`}>
                <div className="scale-75 md:scale-110">{item.icon}</div>
              </div>
              <p className="text-[8px] md:text-[10px] font-black text-slate-900 uppercase text-center leading-tight tracking-tighter md:tracking-widest">{item.label}</p>
            </button>
          ))}
        </div>
      </section>

      {/* MODALS */}
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
      
      {isDepositOpen && <DepositModal isOpen={true} onClose={() => setIsDepositOpen(false)} user={user} onDeposit={onDeposit} />}
      {isWithdrawOpen && <WithdrawModal isOpen={true} onClose={() => setIsWithdrawOpen(false)} user={user} balance={user.balance} currency={user.currency} country={user.country} onWithdraw={onWithdraw} />}
      {isReceiveOpen && <ReceiveModal isOpen={true} onClose={() => setIsReceiveOpen(false)} user={user} />}
      {isScanOpen && <ScanPayModal isOpen={true} onClose={() => setIsScanOpen(false)} onComplete={(amt, merch) => onNewTransaction(-amt, merch, 'Point of Sale')} />}
      {isWalletOpen && <DigitalWalletModal isOpen={true} onClose={() => setIsWalletOpen(false)} user={user} onAddCard={(c) => onUpdateUser({ storedCards: [...(user.storedCards || []), { ...c, id: Date.now().toString() }] })} />}
    </div>
  );
};

export default Dashboard;
