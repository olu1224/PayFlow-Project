
import React, { useState } from 'react';
import { User, Country, Currency } from '../types';
import Logo from '../components/Logo';
import { t } from '../localization';

interface OnboardingProps {
  onComplete: (user: User) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [mode, setMode] = useState<'choice' | 'signup' | 'login'>(() => {
    return localStorage.getItem('zynctra_user_session') ? 'login' : 'signup';
  });
  
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  
  // Signup State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: 'Nigeria' as Country,
    pin: '123456'
  });

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const nextStep = () => {
    if (step === 1 && !formData.name) return setError("Full legal name is required");
    setError(null);
    setStep(s => s + 1);
  };

  const getCurrency = (c: Country): Currency => {
    if (c === 'Ghana') return 'GHS';
    if (c === 'Senegal') return 'XOF';
    return 'NGN';
  };

  const handleLogin = async (demo: boolean = false) => {
    if (!demo && (!loginPin || loginPin.length < 6)) return setError("6-digit PIN required");
    setIsAuthenticating(true);
    await new Promise(r => setTimeout(r, 1000));
    
    if (demo) {
      onComplete({
        uid: 'demo_node_alpha',
        name: 'Alpha Tester',
        email: 'tester@zynctra.pro',
        country: 'Nigeria',
        currency: 'NGN',
        balance: 125000,
        creditScore: 680,
        isOnboarded: true,
        security: { twoFactorEnabled: false, biometricsEnabled: true, hideBalances: false, lastLogin: new Date().toISOString(), pin: "123456" },
        preferences: { notifications: true, marketing: false, dailyLimit: 1000000 }
      });
      return;
    }

    const saved = localStorage.getItem('zynctra_user_session');
    if (saved) {
      const user = JSON.parse(saved);
      if (loginPin === user.security.pin || loginPin === "123456") {
        onComplete(user);
      } else {
        setError("Invalid Access PIN");
      }
    } else if (loginPin === "123456") {
        onComplete({
            uid: 'demo_123',
            name: loginEmail.split('@')[0] || 'Demo User',
            email: loginEmail,
            country: 'Nigeria',
            currency: 'NGN',
            balance: 50000,
            creditScore: 450,
            isOnboarded: true,
            security: { twoFactorEnabled: false, biometricsEnabled: true, hideBalances: false, lastLogin: new Date().toISOString(), pin: "123456" },
            preferences: { notifications: true, marketing: false, dailyLimit: 1000000 }
        });
    } else {
      setError("Node not found. Please register.");
    }
    setIsAuthenticating(false);
  };

  const handleFinish = () => {
    if(!formData.email) return setError("Email node is required");
    const user: User = {
      uid: 'usr_' + Math.random().toString(36).substr(2, 9),
      name: formData.name,
      email: formData.email,
      country: formData.country,
      currency: getCurrency(formData.country),
      balance: 0,
      creditScore: 350,
      isOnboarded: true,
      security: {
        twoFactorEnabled: false,
        biometricsEnabled: true,
        hideBalances: false,
        lastLogin: new Date().toISOString(),
        pin: "123456"
      },
      preferences: {
        notifications: true,
        marketing: false,
        dailyLimit: 1000000
      }
    };
    onComplete(user);
  };

  if (mode === 'login') {
    return (
      <div className="fixed inset-0 z-[200] bg-[#020617] flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-lg rounded-[4rem] p-10 md:p-16 shadow-2xl animate-in zoom-in-95 duration-500">
          <div className="flex justify-between items-center mb-10">
             <Logo size="sm" />
             <button onClick={() => setMode('signup')} className="text-[10px] font-black uppercase text-indigo-600 tracking-widest hover:underline">New Hub?</button>
          </div>
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-[1000] text-slate-900 tracking-tight leading-none">Access Hub</h2>
              <p className="text-slate-500 font-medium italic opacity-70">Testers: Use PIN 123456</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Email Terminal</label>
                <input className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 font-bold text-slate-800" placeholder="name@email.com" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Access PIN</label>
                <input type="password" maxLength={6} className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 font-black text-3xl tracking-[0.5em] text-slate-800" placeholder="••••••" value={loginPin} onChange={e => setLoginPin(e.target.value)} />
              </div>
            </div>
            {error && <p className="text-rose-500 text-xs font-bold text-center">{error}</p>}
            <div className="space-y-3">
              <button onClick={() => handleLogin()} disabled={isAuthenticating} className="w-full bg-slate-950 text-white py-6 rounded-[2.2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-indigo-600 transition-all active:scale-95">
                {isAuthenticating ? 'Decrypting...' : 'Authorize Access'}
              </button>
              <button onClick={() => handleLogin(true)} className="w-full bg-indigo-50 text-indigo-600 py-4 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-indigo-100 transition-all">
                Quick Test: Use Demo Node
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] bg-[#0f172a] flex items-center justify-center p-4 md:p-6 overflow-hidden">
      <div className="bg-white w-full max-w-5xl rounded-[4rem] shadow-2xl relative z-10 overflow-hidden flex flex-col md:flex-row h-full max-h-[800px] md:h-auto transition-all duration-500 border border-white/10">
        
        <div className="hidden md:flex w-[35%] bg-[#050510] p-12 flex-col justify-between relative overflow-hidden shrink-0">
           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-[100px] opacity-10 -mr-32 -mt-32"></div>
           <div className="relative z-10">
              <Logo size="sm" />
           </div>
           
           <div className="relative z-10 space-y-6">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white font-black text-xl border border-white/5 shadow-2xl">
                {step}
              </div>
              <div className="space-y-3">
                <h3 className="text-white text-3xl font-[1000] tracking-tight leading-none">Step {step} of 2</h3>
                <p className="text-slate-500 text-[13px] font-medium leading-relaxed max-w-[200px]">
                  Regional identity nodes require verification for secure liquidity access.
                </p>
              </div>
           </div>
        </div>

        <div className="flex-1 p-8 md:p-24 flex flex-col h-full overflow-hidden bg-white">
          <div className="flex-1 overflow-y-auto pr-1">
            {step === 1 && (
              <div className="space-y-16 animate-in slide-in-from-right-8 duration-500 pb-4">
                <div className="space-y-5">
                  <h2 className="text-8xl font-[1000] text-[#0f172a] tracking-tighter leading-none">Plan</h2>
                  <p className="text-slate-400 font-bold text-xl tracking-tight">Define your identity on the hub.</p>
                </div>
                
                <div className="space-y-10">
                  <div className="space-y-4">
                    <label className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Full Legal Name</label>
                    <input 
                      autoFocus
                      className="w-full bg-[#f8fafc] border-none rounded-[2.5rem] px-12 py-8 font-black text-slate-700 text-2xl focus:ring-8 focus:ring-slate-50 outline-none transition-all shadow-sm placeholder-slate-300"
                      placeholder="e.g. Chinua Azikiwe"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
                    <button onClick={() => setMode('login')} className="text-xs font-black uppercase text-indigo-600 tracking-widest hover:underline">Already have a Node?</button>
                    <button onClick={() => handleLogin(true)} className="text-[10px] font-black uppercase text-emerald-600 tracking-widest hover:underline">Tester's Fast Access</button>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-12 animate-in slide-in-from-right-8 duration-500 pb-4">
                <div className="space-y-4">
                  <h2 className="text-6xl font-[1000] text-[#0f172a] tracking-tighter leading-none">Region</h2>
                  <p className="text-slate-400 font-bold text-xl tracking-tight">Localizing your financial grid.</p>
                </div>
                
                <div className="space-y-10">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {(['Nigeria', 'Ghana', 'Senegal'] as Country[]).map(c => (
                      <button 
                        key={c} 
                        onClick={() => setFormData({...formData, country: c})} 
                        className={`py-6 rounded-[2.5rem] border-2 font-black text-xs transition-all flex flex-col items-center gap-3 ${formData.country === c ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-xl' : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200'}`}
                      >
                        <span className="text-4xl">{c === 'Nigeria' ? '🇳🇬' : c === 'Ghana' ? '🇬🇭' : '🇸🇳'}</span>
                        <span className="uppercase tracking-widest">{c}</span>
                      </button>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    <label className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Email Node</label>
                    <input 
                      type="email" 
                      className="w-full bg-[#f8fafc] border-none rounded-[2.5rem] px-10 py-7 font-bold text-slate-800 text-xl focus:ring-8 focus:ring-slate-50 outline-none shadow-sm" 
                      placeholder="name@terminal.pro" 
                      value={formData.email} 
                      onChange={e => setFormData({...formData, email: e.target.value})} 
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6 mt-12 pt-10 border-t border-slate-50 shrink-0">
             {error && <p className="text-rose-500 text-xs font-black uppercase tracking-widest text-center animate-pulse">{error}</p>}
             <div className="flex items-center justify-between">
                <button 
                  onClick={() => setStep(1)} 
                  disabled={step === 1} 
                  className="px-10 py-5 rounded-[2rem] font-black text-slate-300 hover:text-slate-900 transition-all uppercase tracking-[0.3em] text-[10px] disabled:opacity-0"
                >
                  Back
                </button>

                <button 
                  onClick={step === 2 ? handleFinish : nextStep} 
                  className="bg-[#0f172a] text-white px-16 py-6 rounded-full font-black shadow-[0_20px_50px_rgba(15,23,42,0.3)] hover:bg-indigo-600 transition-all flex items-center justify-center gap-8 active:scale-95 group"
                >
                  <span className="uppercase tracking-[0.4em] text-[11px]">Continue</span>
                  <svg className="group-hover:translate-x-2 transition-transform" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
