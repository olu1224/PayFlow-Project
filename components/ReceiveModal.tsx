
import React, { useState } from 'react';
import { User } from '../types';

interface ReceiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

const ReceiveModal: React.FC<ReceiveModalProps> = ({ isOpen, onClose, user }) => {
  const [activeMethod, setActiveMethod] = useState<'transfer' | 'link'>('link');
  const [requestAmount, setRequestAmount] = useState('100000');
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const currencySymbol = user.currency === 'NGN' ? '₦' : user.currency === 'GHS' ? 'GH₵' : 'CFA';
  const baseUrl = window.location.origin + window.location.pathname;
  const zynctraPayload = `${baseUrl}#/settle?node=${user.name.replace(/\s+/g, '+')}&amt=${requestAmount || '0'}&curr=${user.currency}`;
  const paymentLink = `https://zynctra.pro/pay/${user.name.replace(/\s+/g, '').toLowerCase()}${parseFloat(requestAmount) > 0 ? `?amount=${requestAmount}` : ''}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(paymentLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90dvh]">
        
        {/* Header - Aligned to reference image */}
        <div className="p-8 pb-4 flex justify-between items-start shrink-0">
          <div>
            <h2 className="text-3xl font-[1000] text-slate-900 tracking-tight leading-none">Receive Funds</h2>
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-2">Regional Settlement Node</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 transition-all">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar space-y-8">
          
          {/* Method Switcher - Aligned to reference image */}
          <div className="flex p-1.5 bg-slate-50 border border-slate-100 rounded-[1.8rem]">
            <button 
              onClick={() => setActiveMethod('transfer')}
              className={`flex-1 py-3 rounded-[1.4rem] font-black text-[9px] uppercase tracking-widest transition-all ${activeMethod === 'transfer' ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-400'}`}
            >
              Direct Node Transfer
            </button>
            <button 
              onClick={() => setActiveMethod('link')}
              className={`flex-1 py-3 rounded-[1.4rem] font-black text-[9px] uppercase tracking-widest transition-all ${activeMethod === 'link' ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-400'}`}
            >
              Express Link
            </button>
          </div>

          {activeMethod === 'link' ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Requested Amount Block */}
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Requested Amount</label>
                <div className="bg-white border border-slate-100 rounded-[1.5rem] px-6 py-5 flex items-center gap-4 shadow-sm hover:border-indigo-100 transition-all">
                  <span className="text-xl font-black text-slate-300">{currencySymbol}</span>
                  <input 
                    type="number"
                    className="w-full bg-transparent font-[1000] text-3xl text-slate-900 outline-none tracking-tight"
                    value={requestAmount}
                    onChange={e => setRequestAmount(e.target.value)}
                  />
                </div>
              </div>

              {/* Node Card Block - Matches Reference Image */}
              <div className="bg-slate-50 p-6 md:p-10 rounded-[2.5rem] border border-slate-100 flex flex-col items-center shadow-inner">
                <div className="bg-white p-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-slate-50 mb-8 relative">
                  {/* Demo Indicator */}
                  <div className="absolute top-4 right-4 bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg z-10 animate-pulse">
                    Demo Active
                  </div>
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(zynctraPayload)}`} 
                    alt="Protocol QR" 
                    className="w-40 h-40 md:w-48 md:h-48"
                  />
                </div>
                
                <div className="text-center space-y-1.5 mb-8">
                  <p className="font-[1000] text-slate-900 text-lg uppercase tracking-tight">Active Settle Node</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{currencySymbol}{parseFloat(requestAmount || '0').toLocaleString()} Requested</p>
                  <p className="text-[8px] text-slate-400 font-medium italic mt-2">Use 'Scan Demo QR' in the Scan portal to test this node.</p>
                </div>

                <div className="flex gap-3 w-full">
                  <button 
                    onClick={handleCopy}
                    className="flex-1 bg-white border border-slate-200 text-slate-700 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-95"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                    {isCopied ? 'Copied' : 'Secure Link'}
                  </button>
                  <button 
                    onClick={() => setRequestAmount('')}
                    className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-xl"
                  >
                    Reset Node
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center space-y-4 animate-in fade-in duration-300">
               <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mx-auto"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 3a8 8 0 0 1 8 7.2c0 7.3-8 11.8-8 11.8Z"/><circle cx="12" cy="10" r="3"/></svg></div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bank Details Node Idle</p>
               <p className="text-xs text-slate-400 font-medium">Regional settlement via link is recommended for this node.</p>
            </div>
          )}
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default ReceiveModal;
