
import React, { useState } from 'react';
import { Currency, Country } from '../types';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
  country: Country;
  balance: number;
  onWithdraw: (amount: number, destination: string) => void;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose, currency, country, balance, onWithdraw }) => {
  const [amount, setAmount] = useState('');
  const [destination, setDestination] = useState('bank');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  const currencySymbol = currency === 'NGN' ? '₦' : currency === 'GHS' ? 'GH₵' : 'CFA';

  const handleComplete = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0 || amt > balance) return alert('Invalid amount or insufficient funds');
    onWithdraw(amt, `${bankName} (${accountNumber})`);
    setStep(2);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-slate-800">Withdraw Funds</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          {step === 1 ? (
            <div className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Available Balance</p>
                <p className="text-xl font-black text-slate-800">{currencySymbol}{balance.toLocaleString()}</p>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Withdraw Amount ({currencySymbol})</label>
                <input 
                  type="number"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-black text-2xl focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  placeholder="0.00"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Select Bank</label>
                    <input 
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold focus:outline-none"
                      placeholder="e.g. Zenith Bank"
                      value={bankName}
                      onChange={e => setBankName(e.target.value)}
                    />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Account Number</label>
                    <input 
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold focus:outline-none"
                      placeholder="10 digits"
                      value={accountNumber}
                      onChange={e => setAccountNumber(e.target.value)}
                    />
                 </div>
              </div>

              <button 
                onClick={handleComplete}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                <span>Process Withdrawal</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
            </div>
          ) : (
            <div className="text-center py-10 space-y-6">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg>
              </div>
              <h3 className="text-2xl font-black text-slate-800">Withdrawal Initiated</h3>
              <p className="text-slate-500 font-medium text-sm">Funds will reach your bank account within 2 hours.</p>
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

export default WithdrawModal;
