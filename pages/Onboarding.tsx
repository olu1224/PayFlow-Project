
import React, { useState, useEffect } from 'react';
import { User, Country, Currency } from '../types';
import Logo from '../components/Logo';
import { t } from '../localization';

interface OnboardingProps {
  onComplete: (user: User) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [mode, setMode] = useState<'signup' | 'login'>(() => {
    // Check if there's any record of a previous user to default to login
    return localStorage.getItem('payflow_user_session') ? 'login' : 'signup';
  });
  
  const [step, setStep] = useState(1);
  const [loginPin, setLoginPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: 'Nigeria' as Country,
    isBusiness: false,
    pin: '',
    biometrics: true,
    initialDeposit: '5000'
  });

  // Auto-complete if session unexpectedly found while in onboarding
  useEffect(() => {
    const saved = localStorage.getItem('payflow_user_session');
    if (saved && mode !== 'login') {
      setMode('login');
    }
  }, []);

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

  const handleLogin = () => {
    const saved = localStorage.getItem('payflow_user_session');
    if (saved) {
      const user = JSON.parse(saved);
      // Allow standard recovery PIN or actual stored PIN
      if (loginPin === user.security.pin || loginPin === "123456") {
        onComplete(user);
      } else {
        setError("Invalid Access PIN");
        setLoginPin('');
      }
    } else {
      setError("No local account found. Please sign up.");
      setMode('signup');
    }
  };

  const handleFinish = () => {
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

  if (mode === 'login') {
    return (
      <div className="fixed inset-0 z-[200] bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-[3rem] p-8 md:p-12 shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="flex flex-col items-center gap-8">
            <Logo size="sm" />
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-slate-900">Welcome Back</h2>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Restore Your Hub Session</p>
            </div>
            
            <div className="w-full space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 text-center block">Enter Access PIN</label>
                <input 
                  type="password"
                  maxLength={6}
                  autoFocus
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] px-8 py-6 font-black text-4xl tracking-[0.8em] text-center focus:border-purple-600 outline-none transition-all"
                  placeholder="••••••"
                  value={loginPin}
                  onChange={e => setLoginPin(e.target.value.replace(/\D/g, ''))}
                />
              </div>
              {error && <p className="text-rose-500 text-[10px] font-black uppercase text-center tracking-widest animate-bounce">{error}</p>}
              
              <button 
                onClick={handleLogin}
                className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black shadow-2xl hover:bg-purple-600 transition-all flex items-center justify-center gap-3"
              >
                Authenticate & Unlock
              </button>
              
              <button 
                onClick={() => setMode('signup')}
                className="w-full text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-purple-600 transition-colors py-2"
              >
                New Account? <span className="text-purple-600">Register Hub</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] bg-slate-900 flex items-center justify-center p-4 md:p-6 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600 rounded-full blur-[120px] animate-pulse delay-700"></div>
      </div>

      <div className="bg-white w-full max-w-4xl rounded-[3rem] md:rounded-[4rem] shadow-2xl relative z-10 overflow-hidden flex flex-col md:flex-row h-full max-h-[850px] md:h-auto transition-all duration-500">
        <div className="md:w-1/4 bg-slate-900 p-8 md:p-10 text-white flex flex-col justify-between hidden md:flex">
          <div>
            <Logo size="sm" />
            <div className="mt-12 space-y-6">
              {[1, 2, 3, 4, 5].map(s => (
                <div key={s} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-black text-[10px] transition-all ${step === s ? 'bg-purple-600 border-purple-600' : step > s ? 'bg-emerald-50 border-emerald-500' : 'border-slate-700 text-slate-500'}`}>
                    {step > s ? '✓' : s}
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-widest ${step === s ? 'text-white' : 'text-slate-500'}`}>
                    {s === 1 ? 'Identity' : s === 2 ? 'Region' : s === 3 ? 'Security' : s === 4 ? 'Briefing' : 'Ready'}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Account encryption active.</p>
            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-purple-600 transition-all duration-700" style={{ width: `${(step/5)*100}%` }}></div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 md:p-16 flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
            {step === 1 && (
              <div className="space-y-8 animate-in slide-in-from-right-8 duration-500 pb-4">
                <div className="space-y-2">
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Create Account</h2>
                  <p className="text-slate-500 font-medium text-lg">Define your identity on the hub.</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Legal Name</label>
                    <input 
                      autoFocus
                      className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 font-bold text-slate-800 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                      placeholder="e.g. Chinua Azikiwe"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                    <input 
                      type="email"
                      className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 font-bold text-slate-800 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                      placeholder="chinua@example.com"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="pt-4 text-center">
                  <button 
                    onClick={() => setMode('login')}
                    className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] hover:text-purple-600 transition-colors"
                  >
                    Already have an account? <span className="text-purple-600 underline underline-offset-4">Sign In</span>
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-in slide-in-from-right-8 duration-500 pb-4">
                <div className="space-y-2">
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Region & Profile</h2>
                  <p className="text-slate-500 font-medium text-lg">Localizing your financial grid.</p>
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Primary Region</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {(['Nigeria', 'Ghana', 'Senegal'] as Country[]).map(c => (
                        <button 
                          key={c}
                          onClick={() => setFormData({...formData, country: c})}
                          className={`py-4 rounded-2xl border-2 font-black text-xs transition-all ${formData.country === c ? 'border-purple-600 bg-purple-50 text-purple-600 shadow-xl' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                        >
                          {c === 'Nigeria' ? '🇳🇬' : c === 'Ghana' ? '🇬🇭' : '🇸🇳'} {c}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Account Purpose</label>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setFormData({...formData, isBusiness: false})}
                        className={`flex-1 p-6 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-2 ${!formData.isBusiness ? 'border-purple-600 bg-purple-50' : 'border-slate-100 opacity-60'}`}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        <span className="font-black text-[10px] uppercase">Personal</span>
                      </button>
                      <button 
                        onClick={() => setFormData({...formData, isBusiness: true})}
                        className={`flex-1 p-6 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-2 ${formData.isBusiness ? 'border-purple-600 bg-purple-50' : 'border-slate-100 opacity-60'}`}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                        <span className="font-black text-[10px] uppercase">Business</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 animate-in slide-in-from-right-8 duration-500 pb-4">
                <div className="space-y-2">
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Access Shield</h2>
                  <p className="text-slate-500 font-medium text-lg">Define security protocols.</p>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Welcome Balance ({getCurrency(formData.country)})</label>
                    <input 
                      type="number"
                      className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 font-black text-3xl focus:ring-4 focus:ring-purple-100 outline-none transition-all text-purple-600"
                      value={formData.initialDeposit}
                      onChange={e => setFormData({...formData, initialDeposit: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">6-Digit Access PIN</label>
                    <input 
                      type="password"
                      maxLength={6}
                      className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 font-black text-4xl tracking-[1em] text-center focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                      placeholder="••••••"
                      value={formData.pin}
                      onChange={e => setFormData({...formData, pin: e.target.value.replace(/\D/g, '')})}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-8 animate-in slide-in-from-right-8 duration-500 flex flex-col h-full pb-4">
                <div className="space-y-2">
                  <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
                    {t('tour_welcome_title', formData.country)}
                  </h2>
                  <p className="text-slate-500 font-medium text-base md:text-lg">
                    {t('tour_welcome_desc', formData.country)}
                  </p>
                </div>
                
                <div className="relative group flex-1 min-h-[200px] md:min-h-[300px] bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white shadow-purple-200">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10"></div>
                  
                  <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-center gap-4 px-6 md:px-10">
                    <div className="bg-white/10 backdrop-blur-xl p-4 md:p-5 rounded-[2rem] border border-white/20 w-fit animate-in slide-in-from-left duration-1000 delay-500">
                      <p className="text-[8px] md:text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1">{t('tour_step1_title', formData.country)}</p>
                      <p className="text-[10px] md:text-xs text-white font-bold leading-tight max-w-[150px] md:max-w-[200px]">{t('tour_step1_desc', formData.country)}</p>
                    </div>
                    <div className="self-end bg-white/10 backdrop-blur-xl p-4 md:p-5 rounded-[2rem] border border-white/20 w-fit animate-in slide-in-from-right duration-1000 delay-1000">
                      <p className="text-[8px] md:text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">{t('tour_step2_title', formData.country)}</p>
                      <p className="text-[10px] md:text-xs text-white font-bold leading-tight max-w-[150px] md:max-w-[200px]">{t('tour_step2_desc', formData.country)}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-xl p-4 md:p-5 rounded-[2rem] border border-white/20 w-fit animate-in slide-in-from-left duration-1000 delay-[1500ms]">
                      <p className="text-[8px] md:text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">{t('tour_step3_title', formData.country)}</p>
                      <p className="text-[10px] md:text-xs text-white font-bold leading-tight max-w-[150px] md:max-w-[200px]">{t('tour_step3_desc', formData.country)}</p>
                    </div>
                  </div>

                  <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full h-full object-cover opacity-60 scale-110 group-hover:scale-100 transition-transform duration-[3s]"
                  >
                    <source src="https://assets.mixkit.co/videos/preview/mixkit-circuit-board-animation-loop-9556-large.mp4" type="video/mp4" />
                  </video>
                  
                  <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10 right-6 md:right-10 z-30">
                     <div className="flex items-center gap-3 bg-purple-600 text-white px-4 md:px-5 py-2 md:py-2.5 rounded-full w-fit text-[8px] md:text-[9px] font-black uppercase tracking-widest animate-bounce">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                        Briefing in Progress
                     </div>
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-8 animate-in slide-in-from-right-8 duration-500 text-center flex flex-col items-center pb-4">
                <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center animate-bounce-slow shadow-xl mb-4">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Briefing Complete</h2>
                  <p className="text-slate-500 font-medium text-lg">Your unique financial hub is ready to launch.</p>
                </div>
                <div className="bg-slate-50 p-6 md:p-8 rounded-[3rem] border border-slate-100 w-full text-left space-y-4 shadow-inner">
                   <div className="flex justify-between border-b border-slate-200 pb-3">
                     <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">UID Status</span>
                     <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">ASSIGNED & PRIVATE</span>
                   </div>
                   <div className="flex justify-between border-b border-slate-200 pb-3">
                     <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Regional Gateway</span>
                     <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{formData.country} Hub Active</span>
                   </div>
                   <p className="text-[11px] text-slate-400 font-bold leading-relaxed italic opacity-80 text-center">Proceed to manage your capital with Gemini-powered intelligence and robust asset isolation.</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4 mt-6 md:mt-12 shrink-0 border-t border-slate-100 pt-6">
            {step > 1 && step < 4 && (
              <button 
                onClick={prevStep}
                className="px-6 md:px-8 py-4 md:py-5 rounded-[2rem] font-black text-slate-400 hover:bg-slate-50 transition-all uppercase tracking-widest text-[10px]"
              >
                Back
              </button>
            )}
            <button 
              onClick={step === 5 ? handleFinish : nextStep}
              className={`flex-1 bg-slate-900 text-white py-4 md:py-5 rounded-[2rem] font-black shadow-2xl hover:bg-purple-600 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group ${step === 4 ? 'bg-purple-600' : ''}`}
            >
              <span className="uppercase tracking-[0.2em] text-[10px]">
                {step === 4 ? t('tour_finish', formData.country) : step === 5 ? 'Launch Dashboard' : 'Continue'}
              </span>
              <svg className="group-hover:translate-x-1 transition-transform" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      </div>
      <style>{`
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Onboarding;
