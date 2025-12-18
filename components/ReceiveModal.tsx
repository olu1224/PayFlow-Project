
import React, { useState } from 'react';
import { User, Currency, Country } from '../types';

interface ReceiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

const ReceiveModal: React.FC<ReceiveModalProps> = ({ isOpen, onClose, user }) => {
  const [activeMethod, setActiveMethod] = useState<'transfer' | 'card'>('transfer');
  const [requestAmount, setRequestAmount] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  if (!isOpen) return null;

  const currencySymbol = user.currency === 'NGN' ? '₦' : user.currency === 'GHS' ? 'GH₵' : 'CFA';

  // Mock Virtual Account Details based on country
  const accountDetails = {
    'Nigeria': { bank: 'Wema Bank (PayFlow)', number: '8214059281', name: user.name },
    'Ghana': { bank: 'Ecobank Ghana', number: '0245910283', name: user.name },
    'Senegal': { bank: 'Wave / UBA Senegal', number: '776204918', name: user.name }
  }[user.country];

  const paymentLink = `https://payflow.pro/pay/${user.name.replace(/\s+/g, '').toLowerCase()}${parseFloat(requestAmount) > 0 ? `?amount=${requestAmount}` : ''}`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const generateLink = () => {
    handleCopy(paymentLink);
    setShowQR(true);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 md:p-10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Receive Funds</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-2xl transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          <div className="flex p-1.5 bg-slate-100 rounded-[1.5rem] mb-10">
            <button 
              onClick={() => { setActiveMethod('transfer'); setShowQR(false); }}
              className={`flex-1 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeMethod === 'transfer' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500'}`}
            >
              Bank Transfer
            </button>
            <button 
              onClick={() => { setActiveMethod('card'); setShowQR(false); }}
              className={`flex-1 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeMethod === 'card' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500'}`}
            >
              Card / Link
            </button>
          </div>

          {activeMethod === 'transfer' ? (
            <div className="space-y-8 animate-in slide-in-from-left-4 duration-300">
              <div className="text-center space-y-2">
                <p className="text-slate-500 font-medium">Send money to this virtual account to credit your wallet instantly.</p>
              </div>

              <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6 relative group">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Bank Name</p>
                    <p className="text-xl font-black text-slate-800">{accountDetails.bank}</p>
                  </div>
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2.5"><path d="M3 21h18"/><path d="M3 10h18"/><path d="M5 10V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3"/><path d="M7 21v-4"/><path d="M11 21v-4"/><path d="M15 21v-4"/><path d="M19 21v-4"/></svg>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Account Number</p>
                  <div className="flex items-center justify-between">
                    <p className="text-4xl font-black text-purple-600 tracking-tighter">{accountDetails.number}</p>
                    <button 
                      onClick={() => handleCopy(accountDetails.number)}
                      className="p-3 bg-white text-slate-400 hover:text-purple-600 rounded-2xl shadow-sm border border-slate-100 transition-all active:scale-90"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Account Name</p>
                  <p className="font-bold text-slate-700">{accountDetails.name}</p>
                </div>

                {isCopied && (
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full animate-in fade-in slide-in-from-top-2">
                    Copied to clipboard
                  </div>
                )}
              </div>

              <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 flex gap-4">
                <div className="w-10 h-10 bg-purple-600 text-white rounded-xl flex items-center justify-center shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                </div>
                <p className="text-[11px] font-bold text-purple-700 leading-relaxed">
                  Funds sent to this account are typically available in your wallet within 60 seconds. Powered by PayFlow Direct.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Request Amount (Optional)</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-300">{currencySymbol}</span>
                    <input 
                      type="number"
                      placeholder="0.00"
                      className="w-full bg-slate-50 border border-slate-200 rounded-3xl pl-16 pr-6 py-5 font-black text-3xl focus:ring-2 focus:ring-purple-600 focus:outline-none"
                      value={requestAmount}
                      onChange={e => setRequestAmount(e.target.value)}
                    />
                  </div>
                </div>

                {!showQR ? (
                  <button 
                    onClick={generateLink}
                    className="w-full bg-purple-600 text-white py-5 rounded-[2rem] font-black shadow-xl shadow-purple-200 hover:bg-purple-700 transition-all flex items-center justify-center gap-3 group"
                  >
                    <span>Generate Payment Link</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </button>
                ) : (
                  <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 flex flex-col animate-in zoom-in-95 duration-300">
                    <div className="flex items-center gap-6 mb-8">
                      <div className="bg-white p-4 rounded-3xl shadow-xl border border-slate-100 shrink-0">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(paymentLink)}`} 
                          alt="Payment QR" 
                          className="w-32 h-32"
                        />
                      </div>
                      <div className="flex-1 space-y-4">
                        <div>
                          <p className="font-black text-slate-800 leading-tight">Payment Link Ready</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Share link or scan QR</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button 
                            onClick={() => handleCopy(paymentLink)}
                            className="w-full bg-white border border-slate-200 text-slate-600 py-3 rounded-xl font-black text-xs hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center gap-2"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                            {isCopied ? 'Copied!' : 'Copy Link'}
                          </button>
                          <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-black text-xs hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                            Share Link
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Amount</p>
                      <p className="font-black text-slate-800">{currencySymbol}{Number(requestAmount || 0).toLocaleString()}</p>
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Supported Card Networks</p>
                  <div className="flex justify-center gap-6 mt-4 grayscale opacity-40">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="Visa" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="Mastercard" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Verve_Logo.svg" className="h-5" alt="Verve" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceiveModal;
