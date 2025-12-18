
import React, { useState } from 'react';
import { User } from '../types';

const Membership: React.FC<{ user: User, onUpgrade?: (plan: string) => void }> = ({ user, onUpgrade }) => {
  const [activePlan, setActivePlan] = useState<string>(user.creditScore > 700 ? 'Elite Pro' : 'Standard');
  const [isActivating, setIsActivating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const currencySymbol = user.currency === 'NGN' ? '₦' : user.currency === 'GHS' ? 'GH₵' : 'CFA';

  const plans = [
    {
      name: 'Standard',
      price: 'Free',
      desc: 'Essential financial tools for daily regional utility payments.',
      features: [
        'Pay-as-you-go Fees (NGN 100/ea)',
        'Standard AI Chat Access',
        'Tier 1 Borrowing Limit',
        'Basic Transaction History'
      ],
      color: 'bg-slate-100 text-slate-900 border-slate-200',
      btnColor: 'bg-slate-900 text-white',
      badge: null
    },
    {
      name: 'Elite Pro',
      price: `${currencySymbol}${user.currency === 'NGN' ? '5,000' : user.currency === 'GHS' ? '50' : '2,000'}`,
      period: '/month',
      desc: 'The ultimate tool for high-velocity traders and professionals.',
      features: [
        'ZERO Processing Fees',
        'Gemini 3 Pro Precision AI',
        '10% Cashback on Airtime',
        'Priority Peer-to-Peer Rails',
        'Multi-Currency Vaults'
      ],
      color: 'bg-indigo-600 text-white border-indigo-400 shadow-[0_20px_50px_rgba(79,70,229,0.3)]',
      btnColor: 'bg-white text-indigo-600',
      badge: 'Most Popular'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      desc: 'B2B infrastructure for regional startups and merchants.',
      features: [
        'Custom Bulk Disbursement API',
        'Dedicated Account Manager',
        'Audit-Ready PDF Exports',
        'Infinite Transaction Velocity',
        'Whitelabel Payment Links'
      ],
      color: 'bg-slate-900 text-white border-slate-700 shadow-2xl',
      btnColor: 'bg-purple-600 text-white',
      badge: 'Merchant Grade'
    }
  ];

  const handleActivate = async (planName: string) => {
    if (planName === activePlan) return;
    setIsActivating(true);
    // Simulate API call to upgrade
    await new Promise(r => setTimeout(r, 2000));
    setActivePlan(planName);
    if (onUpgrade) onUpgrade(planName);
    setIsActivating(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 4000);
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <header className="text-center space-y-4 pt-10">
        <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-purple-200">
           {activePlan} Account Active
        </div>
        <h1 className="text-5xl md:text-7xl font-[900] text-slate-900 tracking-tighter leading-tight">
          Select Your <span className="text-purple-600">Sovereignty</span>
        </h1>
        <p className="text-slate-500 font-bold text-lg max-w-2xl mx-auto">
          Scale your Pan-African financial operations with precision-engineered membership plans.
        </p>
      </header>

      {showSuccess && (
        <div className="mx-4 p-6 bg-emerald-500 text-white rounded-3xl flex items-center justify-between animate-in zoom-in-95 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shadow-inner">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6L9 17l-5-5"/></svg>
            </div>
            <div>
               <p className="font-black text-lg leading-none uppercase tracking-tight">Upgrade Successful</p>
               <p className="text-sm opacity-90 font-medium">Your new Plan Protocol is now active across the grid.</p>
            </div>
          </div>
          <button onClick={() => setShowSuccess(false)} className="px-5 py-2 bg-white text-emerald-600 rounded-xl font-black text-xs uppercase">Dismiss</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        {plans.map((plan, i) => (
          <div key={i} className={`p-10 rounded-[3.5rem] border-2 flex flex-col relative overflow-hidden transition-all hover:scale-[1.02] group ${plan.color}`}>
            {plan.badge && (
              <div className="absolute top-8 right-[-35px] bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest px-10 py-1.5 rotate-45 shadow-lg">
                {plan.badge}
              </div>
            )}
            
            <div className="space-y-2 mb-8">
              <h3 className="text-sm font-black uppercase tracking-[0.3em] opacity-60">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-[900] tracking-tighter">{plan.price}</span>
                {plan.period && <span className="text-lg font-bold opacity-60">{plan.period}</span>}
              </div>
              <p className="text-sm font-medium leading-relaxed opacity-80 pt-4">{plan.desc}</p>
            </div>

            <div className="flex-1 space-y-5 mb-10">
              {plan.features.map((feat, j) => (
                <div key={j} className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${plan.name === 'Standard' ? 'bg-slate-200 text-slate-600' : 'bg-white/20 text-white'}`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6L9 17l-5-5"/></svg>
                  </div>
                  <span className="text-sm font-black tracking-tight">{feat}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => handleActivate(plan.name)}
              disabled={isActivating || activePlan === plan.name}
              className={`w-full py-5 rounded-[2rem] font-[900] text-xs uppercase tracking-[0.2em] transition-all shadow-xl group-hover:scale-105 active:scale-95 disabled:opacity-50 ${plan.btnColor}`}
            >
              {isActivating ? 'Syncing...' : activePlan === plan.name ? 'Active Plan' : plan.name === 'Enterprise' ? 'Contact Sales' : 'Activate Plan'}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-slate-50 p-12 rounded-[4rem] border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-10">
         <div className="space-y-2">
           <h4 className="text-2xl font-[900] text-slate-900 tracking-tight leading-none">Market Fee Transparency</h4>
           <p className="text-slate-500 font-bold max-w-xl">
             We charge a nominal convenience fee to maintain direct grid connections with electricity and utility providers in Nigeria, Ghana, and Senegal. Elite members enjoy 100% fee waivers.
           </p>
         </div>
         <div className="flex gap-8 text-slate-900">
            <div className="text-center">
              <p className="text-3xl font-[900] text-purple-600 leading-none">1.0%</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Avg. Utility Fee</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-[900] text-emerald-600 leading-none">24/7</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Grid Uptime</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Membership;
