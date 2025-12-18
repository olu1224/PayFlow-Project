
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
  const [showLimits, setShowLimits] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Default limits based on common African fintech tiers (Tier 3)
  const regulatoryMax = useMemo(() => {
    switch (user.country) {
      case 'Ghana':
        return { daily: 50000, monthly: 500000 };
      case 'Senegal':
        return { daily: 5000000, monthly: 50000000 };
      case 'Nigeria':
      default:
        return { daily: 5000000, monthly: 50000000 };
    }
  }, [user.country]);

  const [limits, setLimits] = useState({
    daily: regulatoryMax.daily,
    monthly: regulatoryMax.monthly
  });

  if (!isOpen) return null;

  const currencySymbol = user.currency === 'NGN' ? '₦' : user.currency === 'GHS' ? 'GH₵' : 'CFA';

  const handleComplete = () => {
    const amt = parseFloat(amount);
    setError(null);

    if (!amt || amt <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    // Validation against set limits
    if (amt > limits.daily) {
      setError(`Amount exceeds your Daily Limit of ${currencySymbol}${limits.daily.toLocaleString()}`);
      return;
    }

    // Validation against balance (business rule: deposits should not exceed 10x current balance for unverified accounts, for example)
    // Here we validate that the limit being set isn't absurdly high relative to balance for safety
    if (limits.daily > user.balance * 50) {
       setError("Safety check: Your requested limit is too high relative to your current account activity.");
       return;
    }

    onDeposit(amt, method);
    setStep(2);
  };

  const updateLimit = (type: 'daily' | 'monthly', value: string) => {
    const val = parseFloat(value) || 0;
    const max = regulatoryMax[type];
    
    if (val > max) {
      setError(`${type.charAt(0).toUpperCase() + type.slice(1)} limit cannot exceed regulatory maximum of ${currencySymbol}${max.toLocaleString()}`);
    } else {
      setError(null);
    }
    
    setLimits(prev => ({ ...prev, [type]: val }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-800">Add Funds</h2>
              <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest">{user.country} Hub</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          {step === 1 ? (
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Deposit Amount ({currencySymbol})</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-300 text-xl">{currencySymbol}</span>
                  <input 
                    type="number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-6 py-5 font-black text-3xl focus:ring-2 focus:ring-purple-600 focus:outline-none transition-all"
                    placeholder="0.00"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Method</label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setMethod('card')}
                    className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${method === 'card' ? 'border-purple-600 bg-purple-50 text-purple-600 shadow-sm' : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'}`}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                    <span className="font-bold text-sm">Card</span>
                  </button>
                  <button 
                    onClick={() => setMethod('transfer')}
                    className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${method === 'transfer' ? 'border-purple-600 bg-purple-50 text-purple-600 shadow-sm' : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'}`}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 10h18"/><path d="M7 15h10"/><path d="M2 6h20"/><path d="M2 18h20"/></svg>
                    <span className="font-bold text-sm">Transfer</span>
                  </button>
                </div>
              </div>

              {/* Limits Configuration */}
              <div className="border-t border-slate-100 pt-4">
                <button 
                  onClick={() => setShowLimits(!showLimits)}
                  className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-purple-600 transition-colors"
                >
                  <svg className={`transition-transform ${showLimits ? 'rotate-180' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m6 9 6 6 6-6"/></svg>
                  Manage Deposit Limits
                </button>
                
                {showLimits && (
                  <div className="mt-4 grid grid-cols-2 gap-4 animate-in slide-in-from-top-2">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Daily Limit</label>
                      <input 
                        type="number"
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-purple-600"
                        value={limits.daily}
                        onChange={e => updateLimit('daily', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Monthly Limit</label>
                      <input 
                        type="number"
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-purple-600"
                        value={limits.monthly}
                        onChange={e => updateLimit('monthly', e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex gap-3 animate-in fade-in zoom-in-95">
                  <svg className="text-rose-500 shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <p className="text-[11px] font-bold text-rose-700 leading-tight">{error}</p>
                </div>
              )}

              <button 
                onClick={handleComplete}
                className="w-full bg-purple-600 text-white py-5 rounded-[2rem] font-black shadow-xl shadow-purple-100 hover:bg-purple-700 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Authorize Deposit</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
            </div>
          ) : (
            <div className="text-center py-10 space-y-6 animate-in zoom-in-95">
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6 9 17l-5-5"/></svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-slate-800 tracking-tight">Success!</h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                  Your wallet has been credited with <span className="font-black text-slate-900">{currencySymbol}{Number(amount).toLocaleString()}</span>.
                </p>
              </div>
              <button 
                onClick={onClose}
                className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black hover:scale-105 transition-all shadow-xl shadow-slate-200"
              >
                Return to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepositModal;
