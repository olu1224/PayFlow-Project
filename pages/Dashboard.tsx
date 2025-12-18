
import React, { useState } from 'react';
import { User, Transaction } from '../types';
import ServiceModal from '../components/ServiceModal';
import DepositModal from '../components/DepositModal';
import WithdrawModal from '../components/WithdrawModal';
import ReceiveModal from '../components/ReceiveModal';
import { ICONS } from '../constants';
import { t } from '../localization';

const ServiceButton: React.FC<{ icon: React.ReactNode; label: string; color: string; onClick: () => void }> = ({ icon, label, color, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-3 p-2 group transition-all w-full">
    <div className={`w-14 h-14 md:w-16 md:h-16 rounded-[1.8rem] md:rounded-[2rem] flex items-center justify-center transition-all shadow-sm ${color} group-hover:scale-110 group-hover:shadow-lg group-hover:-translate-y-1 ring-1 ring-black/5`}>
      {icon}
    </div>
    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-wider text-slate-500 group-hover:text-purple-600 text-center leading-tight max-w-[100px] break-words">
      {label}
    </span>
  </button>
);

const StatCard: React.FC<{ label: string; value: string | number; subtext: string; icon: React.ReactNode; color: string }> = ({ label, value, subtext, icon, color }) => (
  <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-4 group hover:shadow-2xl hover:ring-8 hover:ring-purple-50/50 transition-all duration-500 hover:-translate-y-2 cursor-default relative overflow-hidden">
    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-600/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 ${color} relative z-10`}>
      {icon}
    </div>
    <div className="relative z-10">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{label}</p>
      <p className="text-xl font-black text-slate-900 tracking-tight leading-none transition-colors group-hover:text-purple-600">{value}</p>
      <p className="text-[10px] text-slate-400 font-medium mt-1">{subtext}</p>
    </div>
  </div>
);

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
  const [quickAmount, setQuickAmount] = useState('');

  const currencySymbol = user.currency === 'NGN' ? '₦' : user.currency === 'GHS' ? 'GH₵' : 'CFA';
  
  const totalSpent = transactions.filter(t => t.type === 'debit' && t.status === 'completed').reduce((acc, t) => acc + t.amount, 0);
  const totalTransactionsCount = transactions.length;
  const pendingCount = transactions.filter(t => t.status === 'pending').length;
  
  const services = [
    { label: 'Domestic Transfer', icon: ICONS.Domestic, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'International Transfer', icon: ICONS.International, color: 'bg-blue-50 text-blue-600' },
    { label: 'Electricity', icon: ICONS.Electricity, color: 'bg-amber-50 text-amber-500' },
    { label: 'Airtime', icon: ICONS.Airtime, color: 'bg-teal-50 text-teal-500' },
    { label: 'Data', icon: ICONS.Data, color: 'bg-sky-50 text-sky-500' },
    { label: 'TV', icon: ICONS.TV, color: 'bg-purple-50 text-purple-500' },
    { label: 'Insurance', icon: ICONS.Insurance, color: 'bg-blue-50 text-blue-600' },
    { label: 'Investment', icon: ICONS.Investment, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Loan Repayment', icon: ICONS.Loan, color: 'bg-rose-50 text-rose-500' },
    { label: 'Gov Services', icon: ICONS.Gov, color: 'bg-slate-50 text-slate-700' },
    { label: 'Transport', icon: ICONS.Transport, color: 'bg-indigo-50 text-indigo-500' },
    { label: 'Car Services', icon: ICONS.Car, color: 'bg-orange-50 text-orange-600' },
    { label: 'Betting', icon: ICONS.Betting, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Groceries', icon: ICONS.Groceries, color: 'bg-amber-50 text-amber-600' },
    { label: 'Food Delivery', icon: ICONS.Food, color: 'bg-orange-50 text-orange-600' },
    { label: 'Nearby Hub', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>, color: 'bg-indigo-50 text-indigo-600' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row items-center justify-between gap-6 px-2">
        <div className="animate-in slide-in-from-left duration-700">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            {t('welcome_back', user.country)}, {user.name.split(' ')[0]} <span className="animate-bounce-slow text-4xl">👋</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">{t('pay_all_bills', user.country)}</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100 animate-in slide-in-from-right duration-700">
          <button 
            onClick={() => setSelectedService('Domestic Transfer')}
            className="flex items-center gap-2 px-6 py-3 border border-emerald-500 text-emerald-600 rounded-xl font-bold hover:bg-emerald-50 transition-all hover:scale-105 active:scale-95"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Transfer
          </button>
          <input 
            type="number" 
            placeholder="Amount" 
            className="w-28 bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
            value={quickAmount}
            onChange={e => setQuickAmount(e.target.value)}
          />
          <button 
            onClick={() => setIsDepositOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl font-bold shadow-lg shadow-purple-100 hover:shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            <span className="text-xl leading-none font-black">+</span> Deposit
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-slate-900 rounded-[3.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-slate-300 group transition-all duration-700 hover:shadow-purple-200">
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600 rounded-full blur-[120px] -mr-40 -mt-40 opacity-40 transition-all duration-1000 group-hover:scale-150"></div>
            <div className="relative z-10 space-y-8">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 mb-2">{t('total_balance', user.country)}</p>
                  <h2 className="text-7xl font-black tracking-tighter transition-all duration-500 group-hover:scale-105 origin-left">
                    <span className="text-3xl font-bold mr-2 opacity-40">{currencySymbol}</span>
                    {user.balance.toLocaleString()}
                  </h2>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/10 transition-all duration-500 group-hover:rotate-12 group-hover:scale-125">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => setSelectedService('Domestic Transfer')}
                  className="flex-1 min-w-[140px] bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-emerald-600 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-500/20"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  {t('transfer', user.country)}
                </button>
                <button 
                  onClick={() => setIsDepositOpen(true)}
                  className="flex-1 min-w-[140px] bg-purple-600 text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-purple-700 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-purple-600/20"
                >
                  <span className="text-xl leading-none font-bold">+</span>
                  {t('top_up', user.country)}
                </button>
                <button 
                  onClick={() => setIsWithdrawOpen(true)}
                  className="flex-1 min-w-[140px] bg-white/10 border border-white/20 backdrop-blur-md px-8 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-white/20 hover:scale-105 active:scale-95 transition-all"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
                  {t('withdraw', user.country)}
                </button>
                <button 
                  onClick={() => setIsReceiveOpen(true)}
                  className="flex-1 min-w-[140px] bg-white/10 border border-white/20 backdrop-blur-md px-8 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-white/20 hover:scale-105 active:scale-95 transition-all"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m9 6-6 6 6 6"/><path d="M21 12H3"/></svg>
                  {t('receive', user.country)}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom duration-700 delay-100">
            <StatCard 
              label="Total Spent" 
              value={`${currencySymbol}${totalSpent.toLocaleString()}`} 
              subtext="Lifetime debits" 
              color="bg-rose-50 text-rose-500"
              icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20M5 5l14 14"/></svg>}
            />
            <StatCard 
              label="Transactions" 
              value={totalTransactionsCount} 
              subtext="Processed actions" 
              color="bg-blue-50 text-blue-500"
              icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
            />
            <StatCard 
              label="Pending" 
              value={pendingCount} 
              subtext="In settlement queue" 
              color="bg-amber-50 text-amber-500"
              icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
            />
          </div>

          <section className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/40">
            <div className="flex items-center justify-between mb-10 px-4">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">{t('services', user.country)}</h2>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">Live Network Active</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-x-4 gap-y-10">
              {services.map(s => (
                <ServiceButton 
                  key={s.label} 
                  label={s.label} 
                  icon={s.icon} 
                  color={s.color} 
                  onClick={() => s.label === 'Nearby Hub' ? onNearbyClick() : setSelectedService(s.label)} 
                />
              ))}
            </div>
          </section>

          <div className="bg-gradient-to-br from-indigo-700 via-purple-700 to-purple-500 p-1 rounded-[3.5rem] shadow-2xl group overflow-hidden">
            <div className="bg-slate-900/50 backdrop-blur-3xl rounded-[3.4rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-200 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-purple-500/30">
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></span>
                  Gemini AI Powered
                </div>
                <h3 className="text-4xl font-black text-white leading-tight">{t('ai_intel', user.country)}</h3>
                <p className="text-purple-100/70 text-lg max-w-md font-medium leading-relaxed">
                  Get personalized recommendations and track your local MPN settlement patterns.
                </p>
              </div>
              <button 
                onClick={onExplorePlanning}
                className="bg-white text-slate-900 px-12 py-5 rounded-[2rem] font-black shadow-2xl hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
              >
                {t('explore_ai', user.country)}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-xl h-[550px] flex flex-col overflow-hidden">
            <div className="p-8 border-b border-slate-50 shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-800 tracking-tight">{t('activity', user.country)}</h3>
                <button className="text-purple-600 text-[10px] font-black uppercase tracking-widest hover:bg-purple-50 px-3 py-1.5 rounded-lg transition-colors">History</button>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto custom-scrollbar">
              {transactions.map(tx => (
                <div key={tx.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-all group cursor-pointer border-b border-slate-50 last:border-0">
                   <div className="flex items-center gap-4">
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${tx.type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                        {tx.type === 'credit' ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m19 12-7-7-7 7"/><path d="M12 19V5"/></svg> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m5 12 7 7 7-7"/><path d="M12 5v14"/></svg>}
                     </div>
                     <div className="min-w-0">
                       <p className="font-black text-slate-800 truncate text-sm leading-tight">{tx.name}</p>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{tx.date}</p>
                     </div>
                   </div>
                   <div className="text-right">
                     <p className={`font-black text-sm tabular-nums ${tx.type === 'credit' ? 'text-emerald-500' : 'text-slate-800'}`}>
                       {tx.type === 'credit' ? '+' : '-'}{currencySymbol}{tx.amount.toLocaleString()}
                     </p>
                     <p className="text-[8px] font-black uppercase text-slate-300 tracking-widest">{tx.status}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-xl group hover:shadow-2xl hover:ring-8 hover:ring-emerald-50/50 transition-all duration-500">
             <div className="flex justify-between items-start mb-6">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('credit_rating', user.country)}</p>
                <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
             </div>
             <div className="flex items-end justify-between">
                <div>
                  <h4 className="text-5xl font-black text-slate-800 transition-all duration-500 group-hover:text-emerald-600 group-hover:translate-x-1">{user.creditScore}</h4>
                  <p className="text-[10px] font-black text-emerald-500 uppercase mt-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    {t('excellent_standing', user.country)}
                  </p>
                </div>
                <div className="w-20 h-10 bg-slate-50 rounded-2xl relative overflow-hidden border border-slate-100">
                   <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-300 w-4/5 transition-all duration-1000 group-hover:w-[95%]"></div>
                </div>
             </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-10px) rotate(15deg); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
          display: inline-block;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>

      {selectedService && (
        <ServiceModal 
          isOpen={true} 
          onClose={() => setSelectedService(null)} 
          serviceName={selectedService}
          country={user.country}
          currency={user.currency}
          onComplete={(amt, name, isRec, sched) => onNewTransaction(amt, name, selectedService || 'General', isRec, sched)}
        />
      )}
      {isDepositOpen && <DepositModal isOpen={true} onClose={() => setIsDepositOpen(false)} user={user} onDeposit={onDeposit} />}
      {isWithdrawOpen && <WithdrawModal isOpen={true} onClose={() => setIsWithdrawOpen(false)} currency={user.currency} country={user.country} balance={user.balance} onWithdraw={onWithdraw} />}
      {isReceiveOpen && <ReceiveModal isOpen={true} onClose={() => setIsReceiveOpen(false)} user={user} />}
    </div>
  );
};

export default Dashboard;
