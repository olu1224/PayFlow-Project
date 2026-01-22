
import React from 'react';
import { User } from '../types';
import Logo from '../components/Logo';
import { t } from '../localization';

const AboutPage: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="max-w-[1200px] mx-auto space-y-16 animate-in fade-in duration-1000 pb-12 px-4">
      <header className="text-center space-y-4 pt-10">
        <div className="flex justify-center mb-4">
          <Logo size="sm" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-[1000] text-slate-900 tracking-tighter leading-none">
          {t('about_title', user.country)}
        </h1>
        
        <p className="text-slate-500 font-bold text-base md:text-lg max-w-xl mx-auto italic leading-relaxed opacity-70">
          {t('about_quote', user.country)}
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { 
            title: t('security', user.country), 
            desc: user.country === 'Senegal' 
              ? "Chaque nœud de notre réseau est protégé par un cryptage de niveau institutionnel."
              : "Every node in our network is protected by institutional-grade encryption.",
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
            color: "bg-indigo-600"
          },
          { 
            title: t('usability', user.country), 
            desc: user.country === 'Senegal'
              ? "Conçu pour l'interaction humaine. Nous comblons le fossé entre la liquidité complexe."
              : "Built for human-first interaction. We bridge the gap between complex blockchain liquidity.",
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><circle cx="19" cy="11" r="2"/></svg>,
            color: "bg-emerald-500"
          },
          { 
            title: t('simplicity', user.country), 
            desc: user.country === 'Senegal'
              ? "Un clic pour payer une facture, un geste pour se protéger contre l'inflation."
              : "One tap to pay a bill, one swipe to hedge against inflation.",
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
            color: "bg-amber-500"
          }
        ].map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-6 group hover:-translate-y-2 transition-all duration-500">
            <div className={`w-12 h-12 ${item.color} text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-all duration-500`}>
              {item.icon}
            </div>
            <h3 className="text-xl font-[1000] text-slate-900 tracking-tight">{item.title}</h3>
            <p className="text-slate-500 font-medium leading-relaxed text-sm opacity-90">
              {item.desc}
            </p>
          </div>
        ))}
      </section>

      <section className="bg-slate-950 p-10 md:p-14 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-[100px] opacity-20"></div>
        <div className="relative z-10 space-y-6">
          <div className="space-y-3">
            <h2 className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.4em]">{t('mission_statement', user.country)}</h2>
            <p className="text-2xl md:text-4xl font-[1000] tracking-tighter leading-tight max-w-3xl">
              {user.country === 'Senegal' 
                ? "Offrir un terminal financier d'élite privilégiant la Sécurité, l'Utilisabilité et la Simplicité."
                : "To deliver an elite, unified financial terminal that prioritizes security, usability, and simplicity."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
