
import React, { useState } from 'react';
import { User, StoredCard } from '../types';

interface DigitalWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onAddCard: (card: Omit<StoredCard, 'id'>) => void;
}

const DigitalWalletModal: React.FC<DigitalWalletModalProps> = ({ isOpen, onClose, user, onAddCard }) => {
  const [activeTab, setActiveTab] = useState<'cards' | 'tap' | 'add'>('cards');
  const [tapStatus, setTapStatus] = useState<'idle' | 'holding' | 'success'>('idle');
  const [newCard, setNewCard] = useState({ brandName: 'Zynctra Elite', last4: '', type: 'visa' as any });

  if (!isOpen) return null;

  const cards = user.storedCards || [
    { id: '1', type: 'visa', last4: '4921', expiry: '12/28', color: 'bg-slate-900', brandName: 'Premium Black' },
    { id: '2', type: 'mastercard', last4: '8820', expiry: '05/27', color: 'bg-indigo-600', brandName: 'Regional Gold' }
  ];

  const handleTapStart = () => {
    setTapStatus('holding');
    setTimeout(() => {
      setTapStatus('success');
      setTimeout(() => {
        setTapStatus('idle');
        onClose();
      }, 2000);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[3.5rem] overflow-hidden shadow-2xl flex flex-col h-[85dvh] border border-white/20">
        
        {/* Header */}
        <div className="p-8 pb-2 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Digital Vault</h2>
            <p className="text-[10px] font-black text-cyan-600 uppercase tracking-widest mt-1">Encrypted Payment Rails</p>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-all">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-8 pt-4 pb-6">
           <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              <button onClick={() => setActiveTab('cards')} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'cards' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>My Cards</button>
              <button onClick={() => setActiveTab('tap')} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'tap' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>Tap Terminal</button>
           </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
           {activeTab === 'cards' && (
             <div className="space-y-6 animate-in slide-in-from-left-4">
                <div className="space-y-4">
                  {cards.map((card) => (
                    <div key={card.id} className={`${card.color} p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-xl group transition-all hover:scale-[1.02] hover:-rotate-1 active:scale-95 cursor-pointer`}>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                      <div className="flex justify-between items-start relative z-10">
                        <div className="space-y-1">
                           <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">{card.brandName}</p>
                           <p className="text-xl font-[1000] tracking-tighter">•••• •••• •••• {card.last4}</p>
                        </div>
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                           {card.type === 'visa' ? <span className="font-black italic text-sm">VISA</span> : <div className="flex -space-x-2"><div className="w-5 h-5 bg-rose-500 rounded-full opacity-80"></div><div className="w-5 h-5 bg-amber-500 rounded-full opacity-80"></div></div>}
                        </div>
                      </div>
                      <div className="mt-12 flex justify-between items-end relative z-10">
                        <div className="space-y-1">
                           <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Expiry</p>
                           <p className="text-xs font-black">{card.expiry}</p>
                        </div>
                        <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                           <p className="text-[9px] font-black uppercase tracking-widest">Tap Ready</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setActiveTab('add')} className="w-full border-2 border-dashed border-slate-200 p-8 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 group hover:border-indigo-600 transition-all text-slate-400 hover:text-indigo-600">
                   <div className="w-12 h-12 bg-slate-50 group-hover:bg-indigo-50 rounded-full flex items-center justify-center transition-all">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14"/></svg>
                   </div>
                   <span className="font-black text-[10px] uppercase tracking-widest">Add New Virtual Card</span>
                </button>
             </div>
           )}

           {activeTab === 'add' && (
             <div className="space-y-8 animate-in slide-in-from-right-4">
                <div className="bg-slate-950 p-10 rounded-[3rem] text-white space-y-6 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600 rounded-full blur-3xl opacity-30"></div>
                   <div className="flex justify-between items-start">
                     <p className="text-[10px] font-black uppercase tracking-widest opacity-50">New Grid Identity</p>
                     <div className="w-8 h-8 bg-indigo-500 rounded-full animate-pulse"></div>
                   </div>
                   <div className="space-y-4">
                      <div className="h-4 w-3/4 bg-white/10 rounded-full"></div>
                      <div className="h-4 w-1/2 bg-white/10 rounded-full"></div>
                   </div>
                </div>
                
                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Card Label</label>
                      <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-800" placeholder="e.g. My Zenith Card" value={newCard.brandName} onChange={e => setNewCard({...newCard, brandName: e.target.value})} />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Card Type</label>
                        <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-800 appearance-none" value={newCard.type} onChange={e => setNewCard({...newCard, type: e.target.value as any})}>
                          <option value="visa">Visa</option>
                          <option value="mastercard">Mastercard</option>
                          <option value="verve">Verve</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last 4 Digits</label>
                        <input maxLength={4} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-800" placeholder="0000" value={newCard.last4} onChange={e => setNewCard({...newCard, last4: e.target.value})} />
                      </div>
                   </div>
                   <button 
                    onClick={() => {
                      onAddCard({ ...newCard, expiry: '12/30', color: 'bg-indigo-600' });
                      setActiveTab('cards');
                    }}
                    className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-xl"
                   >
                     Provision Card
                   </button>
                   <button onClick={() => setActiveTab('cards')} className="w-full text-slate-400 font-black text-[10px] uppercase tracking-widest">Cancel</button>
                </div>
             </div>
           )}

           {activeTab === 'tap' && (
             <div className="h-full flex flex-col items-center justify-center p-6 space-y-12 animate-in zoom-in-95">
                <div className="relative">
                   <div className={`w-48 h-48 rounded-full border-4 border-dashed border-indigo-200 flex items-center justify-center transition-all ${tapStatus === 'holding' ? 'animate-spin-slow border-indigo-600' : ''}`}>
                      <div className={`w-40 h-40 rounded-full flex items-center justify-center shadow-inner transition-all ${tapStatus === 'success' ? 'bg-emerald-500 text-white scale-110' : 'bg-slate-50 text-indigo-600'}`}>
                         {tapStatus === 'success' ? (
                           <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6 9 17l-5-5"/></svg>
                         ) : (
                           <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M12 7V5"/><path d="M12 19v-2"/><path d="M17 12h2"/><path d="M5 12h2"/></svg>
                         )}
                      </div>
                   </div>
                   {tapStatus === 'holding' && (
                     <div className="absolute inset-0 bg-indigo-600/5 rounded-full animate-ping"></div>
                   )}
                </div>

                <div className="text-center space-y-4">
                   <h3 className="text-3xl font-[1000] text-slate-900 tracking-tighter">
                     {tapStatus === 'idle' ? 'Hold Near Terminal' : tapStatus === 'holding' ? 'Handshaking...' : 'Settled!'}
                   </h3>
                   <p className="text-slate-500 font-medium text-sm max-w-[240px]">
                     {tapStatus === 'idle' ? 'Bring your device near the vendor grid terminal and hold the button below.' : tapStatus === 'holding' ? 'Securing encrypted channel with regional rail...' : 'Payment authorized across the grid.'}
                   </p>
                </div>

                <button 
                  onMouseDown={handleTapStart}
                  onTouchStart={handleTapStart}
                  className={`w-full py-8 rounded-[2.5rem] font-[1000] uppercase tracking-[0.4em] text-[12px] shadow-2xl transition-all active:scale-95 ${tapStatus === 'success' ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-indigo-600'}`}
                >
                  {tapStatus === 'idle' ? 'Press & Hold to Tap' : tapStatus === 'holding' ? 'Maintaining Grid Link...' : 'Node Authorized'}
                </button>
                
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Compatible with standard NFC terminals</p>
             </div>
           )}
        </div>
      </div>
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default DigitalWalletModal;
