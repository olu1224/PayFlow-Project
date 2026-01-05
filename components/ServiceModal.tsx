
import React, { useState } from 'react';
import { Country, Currency } from '../types';

// Comprehensive Regional Provider Mapping
const PROVIDERS: Record<string, Record<string, string[]>> = {
  'Electricity': {
    'Nigeria': ['IKEDC (Ikeja Electric)', 'EKEDC (Eko Electric)', 'AEDC (Abuja Electric)', 'KEDCO (Kano Electric)', 'PHED (Port Harcourt)', 'JED (Jos Electric)', 'IBEDC (Ibadan Electric)', 'KAEDCO (Kaduna Electric)', 'EEDC (Enugu Electric)'],
    'Ghana': ['ECG Postpaid', 'ECG Prepaid', 'NEDCo', 'Enclave Power Company'],
    'Senegal': ['Senelec (Postpaid)', 'Woyofal (Prepaid)', 'Akilee Smart Meter']
  },
  'Airtime': {
    'Nigeria': ['MTN Nigeria', 'Airtel Nigeria', 'Glo', '9mobile'],
    'Ghana': ['MTN Ghana', 'Telecel Ghana (Vodafone)', 'AT Ghana (AirtelTigo)'],
    'Senegal': ['Orange Sénégal', 'Free Sénégal', 'Expresso Sénégal', 'Promobile']
  },
  'Internet': {
    'Nigeria': ['MTN Fiber', 'Airtel Broadband', 'Smile 4G/LTE', 'Spectranet', 'Swift 4G', 'ipNX Fiber'],
    'Ghana': ['MTN Ghana Fiber', 'Telecel Broadband', 'AT Home Fiber', 'Surfline', 'Telesol'],
    'Senegal': ['Orange Fiber/ADSL', 'Free Max Fiber', 'Expresso Pro Internet', 'Arc Informatique']
  },
  'TV': {
    'Nigeria': ['DSTV Nigeria', 'GOTV Nigeria', 'StarTimes', 'Showmax', 'Kwese TV'],
    'Ghana': ['DSTV Ghana', 'GOTV Ghana', 'StarTimes GH', 'Canal+ GH'],
    'Senegal': ['Canal+ Sénégal', 'TNT Sénégal', 'Excaf Télécom']
  },
  'Water': {
    'Nigeria': ['Lagos Water Corporation (LWC)', 'Abuja Water Board (FCTWB)', 'Water Corporation of Oyo State'],
    'Ghana': ['GWCL (Ghana Water Company Ltd)'],
    'Senegal': ['Sen’Eau (Dakar & Regions)']
  },
  'Food': {
    'Nigeria': ['Chowdeck', 'Glovo Nigeria', 'Bolt Food', 'Eden Life', 'FoodCourt'],
    'Ghana': ['Glovo Ghana', 'Bolt Food GH', 'Hubtel Food', 'Jumia Food'],
    'Senegal': ['Paps Food', 'Yassir Express', 'Glovo Sénégal', 'Fraisen']
  },
  'Transfer': {
    'Nigeria': ['Access Bank', 'Zenith Bank', 'GTBank', 'OPay', 'Palmpay', 'Kuda Bank', 'Moniepoint'],
    'Ghana': ['MTN MoMo', 'Telecel Cash', 'G-Money', 'Standard Chartered', 'Fidelity Bank GH'],
    'Senegal': ['Wave Sénégal', 'Orange Money', 'Free Money', 'UBA Sénégal', 'Ecobank SN']
  },
  'International': {
    'Nigeria': ['Western Union (Global)', 'MoneyGram International', 'WorldRemit Nigeria', 'LemFi (UK/US/CA)', 'Sendwave', 'Ria Money Transfer'],
    'Ghana': ['MTN Global Payout', 'Western Union GH', 'UnityLink', 'ExpressPay Global', 'WorldRemit GH'],
    'Senegal': ['Wari Global', 'Orange Money International', 'Western Union SN', 'MoneyGram SN', 'Joni Joni Global']
  },
  'Gov Services': {
    'Nigeria': ['NIN Card Payment (NIMC)', 'Remita (TSA)', 'LIRS Tax', 'FIRS Tax', 'FRSC Pin', 'JAMB Pin'],
    'Ghana': ['Ghana.gov', 'GRA Tax', 'SSNIT Payments', 'Passport Fees'],
    'Senegal': ['E-Tax Sénégal', 'Douanes SN', 'Seneau Settlement', 'Trésor Public']
  },
  'Betting': {
    'Nigeria': ['Bet9ja', 'SportyBet', 'BetKing', '1xBet', 'NairaBet'],
    'Ghana': ['SportyBet GH', 'Betway Ghana', 'MSport', 'Safaribet'],
    'Senegal': ['Lonase', '1xBet SN', 'Premier Bet SN']
  },
  'Transport': {
    'Nigeria': ['Uber Wallet', 'Bolt Wallet', 'GIGM', 'Cowry Card', 'Shuttlers'],
    'Ghana': ['STC Ghana', 'Uber GH', 'Yangoo', 'Bolt GH'],
    'Senegal': ['TER Dakar', 'DDD Bus', 'Yango SN', 'Heetch SN']
  }
};

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  country: Country;
  currency: Currency;
  onComplete: (amount: number, name: string, isRecurring: boolean, schedule?: { freq: string, date: string }) => void;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ isOpen, onClose, serviceName, country, currency, onComplete }) => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    provider: '',
    account: '',
    amount: '',
  });

  if (!isOpen) return null;

  const currencySymbol = currency === 'NGN' ? '₦' : currency === 'GHS' ? 'GH₵' : 'CFA';
  const getFee = (amt: number) => Math.max(100, amt * 0.015);

  const getProviderKey = (display: string) => {
    const d = display.toLowerCase();
    if (d.includes('elect')) return 'Electricity';
    if (d.includes('airtime')) return 'Airtime';
    if (d.includes('data') || d.includes('internet')) return 'Internet';
    if (d.includes('tv') || d.includes('cable')) return 'TV';
    if (d.includes('food')) return 'Food';
    if (d.includes('gov')) return 'Gov Services';
    if (d.includes('bett')) return 'Betting';
    if (d.includes('transport')) return 'Transport';
    if (d.includes('inter')) return 'International';
    return 'Transfer';
  };

  const getServiceImage = (key: string) => {
    switch (key) {
      case 'Electricity': return "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800";
      case 'Internet': return "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800";
      case 'TV': return "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&q=80&w=800";
      case 'Food': return "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800";
      case 'Gov Services': return "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=800";
      case 'International': return "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=800";
      default: return "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=800";
    }
  };

  const providerKey = getProviderKey(serviceName);
  const providers = PROVIDERS[providerKey]?.[country] || PROVIDERS[providerKey]?.['Nigeria'] || [];
  const heroImage = getServiceImage(providerKey);

  const handleNext = async () => {
    if (step === 1 && !formData.provider) return setError("Please select a provider");
    if (step === 2) {
      if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) return setError("Enter a valid amount");
      if (!formData.account.trim()) return setError("Account reference required");
    }
    setError(null);
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsProcessing(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      onComplete(Number(formData.amount), `${serviceName}: ${formData.provider}`, false);
      setIsProcessing(false);
      setStep(4);
    }
  };

  const currentAmt = Number(formData.amount) || 0;
  const currentFee = getFee(currentAmt);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
      {/* Container locked to 82dvh to stay clear of browser chrome and bottom bars */}
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300 flex flex-col h-[82dvh] sm:h-auto sm:max-h-[85dvh] border border-white/20">
        
        {/* Compact Header for mobile priority */}
        <div className="relative h-[60px] sm:h-32 shrink-0 overflow-hidden">
          <img src={heroImage} className="w-full h-full object-cover" alt={serviceName} />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-slate-950/10"></div>
          <button 
            onClick={onClose} 
            className="absolute top-3 right-5 sm:top-6 sm:right-6 p-2 bg-black/40 backdrop-blur-md text-white hover:bg-white hover:text-slate-900 rounded-xl transition-all border border-white/20 z-[70]"
            aria-label="Close modal"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Title Area */}
        <div className="px-6 pt-3 pb-1 shrink-0 border-b border-slate-50 bg-white">
          <h2 className="text-xl sm:text-3xl font-black text-slate-950 tracking-tighter leading-none">{serviceName}</h2>
          <p className="text-[7px] sm:text-[10px] font-black text-indigo-600 uppercase tracking-[0.25em] mt-1">{country} Regional Node</p>
        </div>

        {/* Scrollable Body - min-h-0 is the flexbox secret to internal scrolling */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4 custom-scrollbar bg-white">
          {isProcessing ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 border-4 border-slate-100 border-t-cyan-500 rounded-full animate-spin mx-auto"></div>
              <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Broadcasting Settlement...</p>
            </div>
          ) : step === 1 ? (
            <div className="space-y-2 pb-6">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Network Biller</p>
              <div className="grid grid-cols-1 gap-2">
                {providers.map(p => (
                  <button 
                    key={p} 
                    onClick={() => setFormData({...formData, provider: p})} 
                    className={`w-full text-left px-5 py-3 rounded-2xl border-2 transition-all active:scale-95 ${formData.provider === p ? 'border-cyan-500 bg-cyan-50 text-cyan-700 shadow-md ring-4 ring-cyan-100' : 'border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-200'}`}
                  >
                    <span className="font-black text-xs leading-tight block">{p}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : step === 2 ? (
            <div className="space-y-6 animate-in slide-in-from-right-4 pb-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Reference / ID</label>
                <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:border-indigo-600 outline-none transition-all shadow-inner" placeholder="Enter ID..." value={formData.account} onChange={e => setFormData({...formData, account: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Value ({currencySymbol})</label>
                <input type="number" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-black text-3xl text-slate-900 focus:border-indigo-600 outline-none transition-all tracking-tighter shadow-inner" placeholder="0.00" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
              </div>
            </div>
          ) : step === 3 ? (
            <div className="space-y-4 animate-in slide-in-from-right-4 pb-6">
              <div className="bg-slate-900 p-6 rounded-[2rem] text-white space-y-3 shadow-xl">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-[9px] font-black uppercase text-slate-500">Node</span>
                  <span className="font-black text-xs text-right truncate max-w-[150px]">{formData.provider}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-[9px] font-black uppercase text-slate-500">Amount</span>
                  <span className="font-black text-xs">{currencySymbol}{currentAmt.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-[9px] font-black uppercase text-cyan-400">Node Fee</span>
                  <span className="font-black text-xs text-cyan-400">{currencySymbol}{currentFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-[10px] font-black uppercase text-indigo-400">Total</span>
                  <span className="text-xl font-black">{currencySymbol}{(currentAmt + currentFee).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center space-y-6 animate-in zoom-in-95">
              <div className="w-16 h-16 bg-cyan-50 text-cyan-500 rounded-full flex items-center justify-center mx-auto shadow-inner"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6 9 17l-5-5"/></svg></div>
              <h3 className="text-xl font-black text-slate-950 tracking-tighter">Settlement Finalized</h3>
              <button onClick={onClose} className="w-full bg-slate-950 text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl active:scale-95">Close Portal</button>
            </div>
          )}
        </div>

        {/* Locked Footer - Guaranteed visibility at the bottom of the 82dvh box */}
        {step < 4 && !isProcessing && (
          <div className="px-6 pb-10 pt-3 bg-white border-t border-slate-100 shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-[60]">
            {error && <p className="text-rose-500 text-[8px] font-black uppercase text-center mb-2 animate-pulse tracking-widest">{error}</p>}
            <button 
              onClick={handleNext} 
              className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-[0_15px_40px_rgba(79,70,229,0.3)] hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {step === 3 ? 'Authorize Payment' : 'Continue'}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default ServiceModal;
