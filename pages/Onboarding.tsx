
import React, { useState, useEffect } from 'react';
import { User, Country, Currency } from '../types';
import Logo from '../components/Logo';
import { t } from '../localization';

interface OnboardingProps {
  onComplete: (user: User) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [mode, setMode] = useState<'choice' | 'signup' | 'login'>(() => {
    return localStorage.getItem('zynctra_user_session') ? 'login' : 'choice';
  });
  
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  
  const [rememberedEmail, setRememberedEmail] = useState(() => localStorage.getItem('payflow_remembered_email') || '');
  const [rememberedName, setRememberedName] = useState(() => localStorage.getItem('payflow_remembered_name') || '');

  const [loginEmail, setLoginEmail] = useState(rememberedEmail);
  const [loginPin, setLoginPin] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: 'Nigeria' as Country,
    isBusiness: false,
    pin: '',
    biometrics: true,
    initialDeposit: '5000'
  });

  const nextStep = () => {
    if (step === 1 && !formData.name) return setError("Name is required");
    if (step === 3 && formData.pin.length < 6) return setError("6-digit PIN required");
    setError(null);
    setStep(s => s + 1);
  };
  
  const prevStep = () => setStep(s => s - 1);

  const getCurrency = (c: Country): Currency => {
    if (c === 'Ghana') return 'GHS';
    if (c === 'Senegal') return 'XOF';
    return 'NGN';
  };

  const handleResetHub = () => {
    if (window.confirm("This will clear your local session data. You will need to re-initialize your hub. Continue?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleLogin = async () => {
    if (!loginPin || loginPin.length < 6) return setError("6-digit PIN required");
    setIsAuthenticating(true);
    setError(null);

    localStorage.setItem('payflow_remembered_email', loginEmail);
    await new Promise(r => setTimeout(r, 1200));
    const saved = localStorage.getItem('zynctra_user_session');
    
    // Demo backdoor for development/lost access
    if (loginPin === "123456") {
      if (saved) {
        const user = JSON.parse(saved);
        localStorage.setItem('payflow_remembered_name', user.name);
        onComplete(user);
      } else {
        const demoUser: User = {
          uid: 'demo_' + Math.random().toString(36).substr(2, 5),
          name: loginEmail.split('@')[0] || 'Demo User',
          email: loginEmail || 'demo@zynctra.pro',
          country: 'Nigeria',
          currency: 'NGN',
          balance: 250000,
          creditScore: 720,
          isOnboarded: true,
          security: {
            twoFactorEnabled: true,
            biometricsEnabled: true,
            hideBalances: false,
            lastLogin: new Date().toISOString(),
            pin: "123456"
          },
          preferences: {
            notifications: true,
            marketing: false,
            dailyLimit: 5000000
          }
        };
        localStorage.setItem('payflow_remembered_name', demoUser.name);
        onComplete(demoUser);
      }
      return;
    }

    if (saved) {
      const user = JSON.parse(saved);
      if (loginPin === user.security.pin) {
        localStorage.setItem('payflow_remembered_name', user.name);
        onComplete(user);
      } else {
        setError("Invalid PIN. Hint: Check Demo Node docs.");
        setLoginPin('');
      }
    } else {
      setError("Account not found. Resetting grid connection...");
      setTimeout(() => setMode('choice'), 1500);
    }
    setIsAuthenticating(false);
  };

  const handleFinish = () => {
    localStorage.setItem('payflow_remembered_email', formData.email);
    localStorage.setItem('payflow_remembered_name', formData.name);

    const uid = 'usr_' + Math.random().toString(36).substr(2, 9);
    const newUser: User = {
      uid,
      name: formData.name,
      email: formData.email,
      country: formData.country,
      currency: getCurrency(formData.country),
      balance: parseFloat(formData.initialDeposit) || 0,
      creditScore: 350,
      isBusiness: formData.isBusiness,
      isOnboarded: true,
      security: {
        twoFactorEnabled: false,
        biometricsEnabled: formData.biometrics,
        hideBalances: false,
        lastLogin: new Date().toISOString(),
        pin: formData.pin
      },
      preferences: {
        notifications: true,
        marketing: false,
        dailyLimit: 1000000
      }
    };
    onComplete(newUser);
  };

  if (mode === 'choice') {
    return (
      <div className="fixed inset-0 z-[200] bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-lg rounded-[4rem] p-10 md:p-16 shadow-2xl relative z-10 text-center animate-in zoom-in-95 duration-500">
           <div className="flex justify-center mb-10">
             <Logo size="md" />
           </div>
           
           <div className="space-y-4 mb-12">
             <h2 className="text-3xl font-[900] text-slate-900 tracking-tight leading-none">
               {rememberedEmail ? t('welcome_back', formData.country) : t('welcome_hub', formData.country)}
             </h2>
             <p className="text-slate-500 font-medium text-lg px-4">
               {t('init_grid', formData.country)}
             </p>
           </div>

           <div className="space-y-4">
             {rememberedEmail ? (
               <>
                 <button 
                   onClick={() => { setLoginEmail(rememberedEmail); setMode('login'); }}
                   className="w-full bg-slate-900 text-white py-6 rounded-[2.2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-purple-600 transition-all flex flex-col items-center justify-center gap-1 active:scale-95 group"
                 >
                   <span className="opacity-60 text-[9px]">{t('continue_as', formData.country)}</span>
                   <span className="text-sm font-black">{rememberedName || rememberedEmail.split('@')[0]}</span>
                 </button>
                 <button 
                   onClick={() => { setRememberedEmail(''); setMode('login'); setLoginEmail(''); }}
                   className="w-full text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-purple-600 transition-colors py-2"
                 >
                   {t('sign_different', formData.country)}
                 </button>
               </>
             ) : (
               <>
                 <button 
                   onClick={() => setMode('signup')}
                   className="w-full bg-slate-900 text-white py-6 rounded-[2.2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-purple-600 transition-all flex items-center justify-center gap-3 active:scale-95 group"
                 >
                   {t('register_new', formData.country)}
                   <svg className="group-hover:translate-x-1 transition-transform" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                 </button>
                 <button 
                   onClick={() => setMode('login')}
                   className="w-full bg-slate-50 border-2 border-slate-100 text-slate-800 py-6 rounded-[2.2rem] font-black text-xs uppercase tracking-[0.2em] hover:border-purple-200 hover:text-purple-600 transition-all active:scale-95"
                 >
                   {t('access_existing', formData.country)}
                 </button>
               </>
             )}
           </div>
        </div>
      </div>
    );
  }

  if (mode === 'login') {
    return (
      <div className="fixed inset-0 z-[200] bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-lg rounded-[4rem] p-10 md:p-16 shadow-2xl animate-in zoom-in-95 duration-500">
          <div className="flex justify-between items-center mb-10">
             <Logo size="sm" />
             <button onClick={() => setMode('choice')} className="text-[10px] font-black uppercase text-slate-400 tracking-widest hover:text-slate-900">Back</button>
          </div>
          
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-[900] text-slate-900 tracking-tight leading-none">Access Hub</h2>
              <p className="text-slate-500 font-medium">Verify your regional identity node.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Email Terminal</label>
                <input 
                  className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 font-bold text-slate-800"
                  placeholder="name@email.com"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Access PIN</label>
                <input 
                  type="password"
                  maxLength={6}
                  className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 font-black text-3xl tracking-[0.5em] text-slate-800"
                  placeholder="••••••"
                  value={loginPin}
                  onChange={e => setLoginPin(e.target.value)}
                />
              </div>
            </div>

            {error && <p className="text-rose-500 text-xs font-bold text-center animate-shake">{error}</p>}

            <button 
              onClick={handleLogin}
              disabled={isAuthenticating}
              className="w-full bg-slate-900 text-white py-6 rounded-[2.2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-purple-600 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              {isAuthenticating ? 'Decrypting...' : 'Authorize Login'}
            </button>
            
            <div className="flex flex-col items-center gap-3 pt-4">
               <button onClick={handleResetHub} className="text-[10px] font-black uppercase text-slate-300 hover:text-rose-500 transition-colors tracking-widest">Lost Access? Reset Hub</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] bg-slate-900 flex items-center justify-center p-4 md:p-6 overflow-hidden">
      <div className="bg-white w-full max-w-4xl rounded-[4rem] shadow-2xl relative z-10 overflow-hidden flex flex-col md:flex-row h-full max-h-[850px] md:h-auto transition-all duration-500">
        
        {/* Visual Sidebar */}
        <div className="hidden md:flex w-1/3 bg-slate-950 p-12 flex-col justify-between relative overflow-hidden shrink-0">
           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-[100px] opacity-20 -mr-32 -mt-32"></div>
           <div className="relative z-10">
              <Logo size="sm" />
           </div>
           <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white font-black text-xl">{step}</div>
              <h3 className="text-white text-2xl font-black leading-tight">Step {step} of 2</h3>
              <p className="text-slate-500 text-sm font-medium">Regional identity nodes require multi-factor verification for security.</p>
           </div>
        </div>

        <div className="flex-1 p-8 md:p-20 flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
            {step === 1 && (
              <div className="space-y-12 animate-in slide-in-from-right-8 duration-500 pb-4">
                <div className="space-y-4">
                  <h2 className="text-6xl font-[1000] text-slate-900 tracking-tight leading-none">Plan</h2>
                  <p className="text-slate-500 font-medium text-xl">Define your identity on the hub.</p>
                </div>
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Full Legal Name</label>
                    <input 
                      autoFocus
                      className="w-full bg-[#f8fafc] border-none rounded-[2rem] px-10 py-7 font-bold text-slate-800 text-xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all shadow-sm"
                      placeholder="e.g. Chinua Azikiwe"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="pt-4">
                     <button onClick={() => setMode('login')} className="text-xs font-black uppercase text-indigo-600 tracking-widest hover:underline">Already have a Hub Node? Access it here</button>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-in slide-in-from-right-8 duration-500 pb-4">
                <div className="space-y-2">
                  <h2 className="text-4xl font-[1000] text-slate-900 tracking-tight leading-none">Region</h2>
                  <p className="text-slate-500 font-medium text-lg">Localizing your financial grid.</p>
                </div>
                <div className="space-y-8">
                  <div className="grid grid-cols-1 gap-4">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Primary Region</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {(['Nigeria', 'Ghana', 'Senegal'] as Country[]).map(c => (
                        <button 
                          key={c}
                          onClick={() => setFormData({...formData, country: c})}
                          className={`py-5 rounded-[2rem] border-2 font-black text-sm transition-all flex flex-col items-center gap-2 ${formData.country === c ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-xl' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                        >
                          <span className="text-3xl">{c === 'Nigeria' ? '🇳🇬' : c === 'Ghana' ? '🇬🇭' : '🇸🇳'}</span>
                          <span>{c}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Email Node</label>
                    <input 
                      type="email"
                      className="w-full bg-[#f8fafc] border-none rounded-[2rem] px-10 py-7 font-bold text-slate-800 text-xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all shadow-sm"
                      placeholder="name@terminal.pro"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6 mt-12 shrink-0 border-t border-slate-100 pt-10">
            {error && <p className="text-rose-500 text-xs font-bold text-center animate-shake">{error}</p>}
            
            <div className="flex items-center justify-between w-full">
               <button 
                 onClick={prevStep} 
                 disabled={step === 1} 
                 className="px-8 py-5 rounded-[2rem] font-black text-slate-300 hover:text-slate-900 transition-all uppercase tracking-[0.25em] text-[11px] disabled:opacity-0"
               >
                 Back
               </button>

               <button 
                onClick={step === 2 ? () => {
                  if(!formData.email) return setError("Email is required");
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
                } : nextStep}
                className="bg-[#0f172a] text-white px-16 py-6 rounded-full font-black shadow-[0_20px_50px_rgba(15,23,42,0.3)] hover:bg-indigo-600 transition-all flex items-center justify-center gap-6 active:scale-95 group"
               >
                 <span className="uppercase tracking-[0.3em] text-[11px]">Continue</span>
                 <svg className="group-hover:translate-x-2 transition-transform" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="m9 18 6-6-6-6"/></svg>
               </button>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
};

export default Onboarding;
