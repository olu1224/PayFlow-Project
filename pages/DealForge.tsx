
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { t } from '../localization';

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

  const initialDeals: ForgeDeal[] = [
    {
      id: 'd1',
      title: user.country === 'Senegal' ? 'Pool Énergie Dakar' : 'Lagos Light Pool',
      target: 500,
      current: 412,
      reward: user.country === 'Senegal' ? '5% Remise Senelec' : '5% Cashback on IKEDC',
      category: 'utility',
      expiresIn: '02h 14m',
      color: 'from-amber-400 to-orange-600',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
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
      title: user.country === 'Senegal' ? 'Syndicat Marchands Dakar' : 'Dakar Merchant Syndicate',
      target: 20,
      current: 14,
      reward: '-2% Loan Interest',
      category: 'capital',
      expiresIn: '1d 04h',
      color: 'from-emerald-400 to-teal-600',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
    }
  ];

  const handleJoin = (id: string) => {
    if (joinedDeals.includes(id)) return;
    setJoinedDeals([...joinedDeals, id]);
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 animate-in fade-in duration-700 pb-24 px-4">
      <header className="relative py-12 px-8 overflow-hidden rounded-[4rem] bg-slate-950 text-white shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 to-transparent"></div>
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">
             {t('forge_syndicate', user.country)}
          </div>
          <h1 className="text-5xl md:text-7xl font-[1000] tracking-tighter leading-none">{t('forge_title', user.country)}</h1>
          <p className="text-slate-400 font-medium text-lg max-w-xl">
            {user.country === 'Senegal' 
              ? 'Ne vous contentez pas de payer—commandez la grille. Regroupez vos transactions pour réduire les frais.'
              : 'Don\'t just pay—command the grid. Pool your transactions with thousands of others to crush fees.'}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {initialDeals.map(deal => (
          <div key={deal.id} className="bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-xl flex flex-col group">
            <div className="flex justify-between items-start mb-10">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-inner">
                {deal.icon}
              </div>
              <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{deal.expiresIn}</p>
            </div>

            <div className="flex-1 space-y-4">
              <h3 className="text-2xl font-[900] text-slate-900 tracking-tight leading-none group-hover:text-purple-600 transition-colors">{deal.title}</h3>
              <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-2xl border border-emerald-100 w-fit font-black text-[10px] uppercase tracking-widest">
                 {deal.reward}
              </div>
            </div>

            <div className="mt-12 space-y-4">
               <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  <span>{t('forge_power', user.country)}</span>
                  <span>{deal.current}/{deal.target} {t('forge_members', user.country)}</span>
               </div>
               <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${deal.color} transition-all duration-[2s]`} style={{ width: `${(deal.current/deal.target)*100}%` }}></div>
               </div>
            </div>

            <button 
              onClick={() => handleJoin(deal.id)}
              className={`w-full mt-8 py-5 rounded-[2rem] font-black uppercase text-[10px] tracking-widest transition-all ${joinedDeals.includes(deal.id) ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-900 text-white hover:bg-purple-600'}`}
            >
              {joinedDeals.includes(deal.id) ? 'Syndicat Rejoint' : t('forge_join', user.country)}
            </button>
          </div>
        ))}
      </div>

      <section className="bg-purple-50 p-12 md:p-20 rounded-[4rem] border border-purple-100 text-center space-y-8">
         <h2 className="text-4xl md:text-6xl font-[1000] text-slate-900 tracking-tighter">{t('forge_maker', user.country)}</h2>
         <p className="text-slate-600 font-medium text-lg max-w-2xl mx-auto">
            {user.country === 'Senegal'
              ? 'Lancez votre propre pool de deals et gagnez une commission sur chaque transaction réussie.'
              : 'Found a merchant or biller we haven\'t forged yet? Start your own deal pool and earn commission.'}
         </p>
         <button className="bg-slate-900 text-white px-12 py-5 rounded-[2rem] font-black uppercase text-[10px] tracking-widest hover:bg-purple-600 active:scale-95 shadow-xl transition-all">
            {user.country === 'Senegal' ? 'Initialiser Ma Forge' : 'Initialize My Forge'}
         </button>
      </section>
    </div>
  );
};

export default DealForge;
