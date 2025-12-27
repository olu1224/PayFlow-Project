
import React, { useState, useMemo } from 'react';
import { User } from '../types';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onDeposit: (amount: number, method: string) => void;
}

const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, user, onDeposit }) => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('card');
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const regulatoryMax = useMemo(() => {
    switch (user.country) {
      case 'Ghana': return { daily: 50000, monthly: 500000 };
      case 'Senegal': return { daily: 5000000, monthly: 50000000 };
      case 'Nigeria':
      default: return { daily: 5000000, monthly: 50000000 };
    }
  }, [user.country]);

  const [limits, setLimits] = useState({
    daily: Math.min(user.preferences.dailyLimit || 1000000, regulatoryMax.daily),
    monthly: Math.min((user.preferences.dailyLimit || 1000000) * 10, regulatoryMax.monthly)
  });

  if (!isOpen) return null;

  const currencySymbol = user.currency === 'NGN' ? '₦' : user.currency === 'GHS' ? 'GH₵' : 'CFA';

  const handleComplete = () => {
    const amt = parseFloat(amount);
    setError(null);

    if (!amt || amt <= 0) {
      setError('Please enter how much you want to add.');
      return;
    }

    if (amt > limits.daily) {
      setError(`Amount exceeds your daily limit of ${currencySymbol}${limits.daily.toLocaleString()}. Change it below if needed.`);
      return;
    }

    if (limits.daily > regulatoryMax.daily) {
      setError(`Maximum daily limit allowed is ${currencySymbol}${regulatoryMax.daily.toLocaleString()}.`);
      return;
    }

    onDeposit(amt, method);
    setStep(2);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[95dvh] flex flex-col">
        <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-center mb-8">
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Add Money</h2>
              <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest">{user.country} Secure Gateway</p>
            </div>
            <button onClick={onClose} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {step === 1 ? (
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">How much to add? ({currencySymbol})</label>
                <div className="relative">
                  <span className="absolute left-7 top-1/2 -translate-y-1/2 font-black text-slate-300 text-3xl">{currencySymbol}</span>
                  <input 
                    type="number"
                    autoFocus
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] pl-16 pr-8 py-7 font-black text-4xl text-slate-800 focus:border-purple-600 focus:bg-white outline-none transition-all placeholder-slate-200 tracking-tighter"
                    placeholder="0.00"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="bg-purple-50 p-6 rounded-[2rem] border border-purple-100 space-y-5">
                <div className="flex items-center gap-2">
                  <h3 className="text-[11px] font-black text-purple-700 uppercase tracking-widest">Safe Spending Limits</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Daily Limit</label>
                    <div className="relative">
                       <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">{currencySymbol}</span>
                       <input 
                        type="number"
                        className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-3 text-sm font-black text-slate-700 focus:ring-2 focus:ring-purple-600 outline-none"
                        value={limits.daily}
                        onChange={e => setLimits({...limits, daily: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Monthly Limit</label>
                    <div className="relative">
                       <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">{currencySymbol}</span>
                       <input 
                        type="number"
                        className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-3 text-sm font-black text-slate-700 focus:ring-2 focus:ring-purple-600 outline-none"
                        value={limits.monthly}
                        onChange={e => setLimits({...limits, monthly: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-purple-600/70 font-bold leading-relaxed">Adjusting these limits keeps your money safe from unauthorized spending.</p>
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">How would you like to pay?</label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setMethod('card')}
                    className={`flex flex-col items-center gap-2 p-5 rounded-[1.8rem] border-2 transition-all ${method === 'card' ? 'border-purple-600 bg-purple-50 text-purple-600 shadow-lg' : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'}`}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                    <span className="font-black text-[10px] uppercase tracking-widest">ATM Card</span>
                  </button>
                  <button 
                    onClick={() => setMethod('transfer')}
                    className={`flex flex-col items-center gap-2 p-5 rounded-[1.8rem] border-2 transition-all ${method === 'transfer' ? 'border-purple-600 bg-purple-50 text-purple-600 shadow-lg' : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'}`}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 10h18"/><path d="M7 15h10"/><path d="M2 6h20"/><path d="M2 18h20"/></svg>
                    <span className="font-black text-[10px] uppercase tracking-widest">Bank Transfer</span>
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-rose-50 border border-rose-100 p-5 rounded-2xl flex gap-4 animate-in slide-in-from-bottom-2">
                  <svg className="text-rose-500 shrink-0 mt-0.5" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <p className="text-xs font-bold text-rose-800 leading-snug">{error}</p>
                </div>
              )}

              <button 
                onClick={handleComplete}
                className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-[900] text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-purple-600 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <span>Add Money Now</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
            </div>
          ) : (
            <div className="text-center py-10 space-y-8 animate-in zoom-in-95">
              <div className="w-32 h-32 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6 9 17l-5-5"/></svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-4xl font-[900] text-slate-900 tracking-tighter">Done!</h3>
                <p className="text-slate-500 font-bold text-lg">
                  You successfully added {currencySymbol}{Number(amount).toLocaleString()}.
                </p>
              </div>
              <button 
                onClick={onClose}
                className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black uppercase tracking-widest text-[11px] hover:scale-105 transition-all"
              >
                Go Back to Home
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepositModal;
