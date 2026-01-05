
import React, { useState } from 'react';
import { User } from '../types';
import { t } from '../localization';

const Membership: React.FC<{ user: User, onUpgrade?: (plan: string) => void }> = ({ user, onUpgrade }) => {
  const [activePlan, setActivePlan] = useState<string>(user.creditScore > 700 ? 'Elite Pro' : 'Standard');
  const [isActivating, setIsActivating] = useState(false);

  const currencySymbol = user.currency === 'NGN' ? '₦' : user.currency === 'GHS' ? 'GH₵' : 'CFA';

  const plans = [
    {
      name: t('plan_standard', user.country),
      price: 'Gratuit',
      desc: user.country === 'Senegal' ? 'Outils essentiels pour les paiements de factures au Sénégal.' : 'Essential financial tools for daily regional utility payments.',
      features: ['1.5% Frais de traitement', 'IA Standard', 'Limite de crédit Tier 1'],
      color: 'bg-slate-100 text-slate-900',
      btnColor: 'bg-slate-900 text-white'
    },
    {
      name: t('plan_elite', user.country),
      price: `${currencySymbol}${user.currency === 'XOF' ? '2.000' : '5,000'}`,
      period: '/mois',
      desc: user.country === 'Senegal' ? 'Pour les traders et professionnels à haute vélocité.' : 'The ultimate tool for high-velocity traders and professionals.',
      features: ['ZERO Frais', 'IA Gemini 3 Pro Precision', 'Priorité de réseau P2P', '10% Cashback'],
      color: 'bg-indigo-600 text-white shadow-[0_20px_50px_rgba(79,70,229,0.3)]',
      btnColor: 'bg-white text-indigo-600'
    },
    {
      name: t('plan_enterprise', user.country),
      price: 'Sur mesure',
      desc: user.country === 'Senegal' ? 'Infrastructure B2B pour les startups et marchands sénégalais.' : 'B2B infrastructure for regional startups and merchants.',
      features: ['API de paiement groupé', 'Gestionnaire dédié', 'Rapports PDF d\'audit'],
      color: 'bg-slate-900 text-white',
      btnColor: 'bg-purple-600 text-white'
    }
  ];

  const handleActivate = async (planName: string) => {
    if (planName === activePlan) return;
    setIsActivating(true);
    await new Promise(r => setTimeout(r, 2000));
    setActivePlan(planName);
    if (onUpgrade) onUpgrade(planName);
    setIsActivating(false);
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 animate-in fade-in duration-700 pb-20 px-4">
      <header className="text-center space-y-4 pt-10">
        <h1 className="text-5xl md:text-7xl font-[1000] text-slate-900 tracking-tighter leading-tight">
          {t('plan_title', user.country)}
        </h1>
        <p className="text-slate-500 font-bold text-lg max-w-2xl mx-auto">
           {user.country === 'Senegal' ? 'Gérez vos opérations financières avec une ingénierie de précision.' : 'Scale your Pan-African financial operations with precision-engineered membership plans.'}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <div key={i} className={`p-10 rounded-[3.5rem] border-2 flex flex-col group ${plan.color} ${activePlan === plan.name ? 'border-current' : 'border-transparent'}`}>
            <div className="space-y-2 mb-10">
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
                  <div className="w-5 h-5 rounded-full bg-current/20 flex items-center justify-center shrink-0">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6L9 17l-5-5"/></svg>
                  </div>
                  <span className="text-sm font-black tracking-tight">{feat}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => handleActivate(plan.name)}
              disabled={isActivating || activePlan === plan.name}
              className={`w-full py-5 rounded-[2rem] font-[900] text-xs uppercase tracking-widest transition-all ${plan.btnColor} active:scale-95 disabled:opacity-50`}
            >
              {isActivating ? '...' : activePlan === plan.name ? t('plan_active', user.country) : t('plan_activate', user.country)}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Membership;
