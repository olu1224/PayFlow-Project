
import React, { useState } from 'react';
import { Currency } from '../types';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
  onDeposit: (amount: number, method: string) => void;
}

const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, currency, onDeposit }) => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('card');
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  const currencySymbol = currency === 'NGN' ? '₦' : currency === 'GHS' ? 'GH₵' : 'CFA';

  const handleComplete = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return alert('Enter a valid amount');
    onDeposit(amt, method);
    setStep(2);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-slate-800">Add Funds</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          {step === 1 ? (
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Deposit Amount ({currencySymbol})</label>
                <input 
                  type="number"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-black text-2xl focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  placeholder="0.00"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setMethod('card')}
                    className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${method === 'card' ? 'border-purple-600 bg-purple-50 text-purple-600' : 'border-slate-100 bg-slate-50 text-slate-500'}`}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                    <span className="font-bold text-sm">Card</span>
                  </button>
                  <button 
                    onClick={() => setMethod('transfer')}
                    className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${method === 'transfer' ? 'border-purple-600 bg-purple-50 text-purple-600' : 'border-slate-100 bg-slate-50 text-slate-500'}`}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 10h18"/><path d="M7 15h10"/><path d="M2 6h20"/><path d="M2 18h20"/></svg>
                    <span className="font-bold text-sm">Transfer</span>
                  </button>
                </div>
              </div>

              <button 
                onClick={handleComplete}
                className="w-full bg-purple-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-purple-100 hover:bg-purple-700 transition-all flex items-center justify-center gap-2"
              >
                <span>Complete Deposit</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
            </div>
          ) : (
            <div className="text-center py-10 space-y-6">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg>
              </div>
              <h3 className="text-2xl font-black text-slate-800">Success!</h3>
              <p className="text-slate-500 font-medium">Your account has been credited with {currencySymbol}{Number(amount).toLocaleString()}.</p>
              <button 
                onClick={onClose}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-slate-800 transition-all"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepositModal;
