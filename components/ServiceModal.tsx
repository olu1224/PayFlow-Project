
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
  
  // Fee Calculation Logic for UI Preview
  const getFee = (amt: number) => {
    // Mock user tier logic for UI: usually we'd pass user object, but we assume market standard here
    // Standard tier: 1.5%, min 100
    return Math.max(100, amt * 0.015);
  };

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
    return 'Transfer';
  };

  const getServiceImage = (key: string) => {
    switch (key) {
      case 'Electricity': return "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800";
      case 'Internet': return "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800";
      case 'TV': return "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&q=80&w=800";
      case 'Food': return "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800";
      case 'Gov Services': return "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=800";
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-2xl animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white">
        <div className="relative h-48 overflow-hidden">
          <img src={heroImage} className="w-full h-full object-cover" alt={serviceName} />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent"></div>
          <button onClick={onClose} className="absolute top-6 right-6 p-3 bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-slate-900 rounded-2xl transition-all border border-white/20">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="p-10 -mt-6 relative z-10 bg-white rounded-t-[3rem]">
          <div className="space-y-1 mb-8">
            <h2 className="text-3xl font-black text-slate-950 tracking-tighter leading-none">{serviceName}</h2>
            <p className="text-[10px] font-black text-purple-600 uppercase tracking-[0.3em]">{country} Hub</p>
          </div>

          <div className="min-h-[320px]">
            {isProcessing ? (
              <div className="py-20 text-center space-y-6">
                <div className="w-16 h-16 border-8 border-slate-100 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
                <p className="text-sm font-black text-slate-950 uppercase tracking-widest">Processing Transaction...</p>
              </div>
            ) : step === 1 ? (
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Provider</p>
                <div className="grid grid-cols-1 gap-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                  {providers.map(p => (
                    <button key={p} onClick={() => setFormData({...formData, provider: p})} className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${formData.provider === p ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-slate-50 bg-slate-50 text-slate-600 hover:border-slate-200'}`}>
                      <span className="font-black text-sm">{p}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : step === 2 ? (
              <div className="space-y-6 animate-in slide-in-from-right-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account / Meter Number</label>
                  <input className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-black text-slate-900 focus:border-purple-600 outline-none transition-all" placeholder="Enter Reference ID..." value={formData.account} onChange={e => setFormData({...formData, account: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Amount ({currencySymbol})</label>
                  <input type="number" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 font-black text-3xl text-slate-900 focus:border-purple-600 outline-none transition-all tracking-tighter" placeholder="0.00" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                </div>
              </div>
            ) : step === 3 ? (
              <div className="space-y-6 animate-in slide-in-from-right-4">
                <div className="bg-slate-950 p-8 rounded-[2.5rem] text-white space-y-4 shadow-2xl">
                  <div className="flex justify-between border-b border-white/10 pb-4">
                    <span className="text-[10px] font-black uppercase text-slate-500">Service</span>
                    <span className="font-black text-sm">{formData.provider}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-4">
                    <span className="text-[10px] font-black uppercase text-slate-500">Principal</span>
                    <span className="font-black text-sm">{currencySymbol}{currentAmt.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-4">
                    <span className="text-[10px] font-black uppercase text-rose-400">Processing Fee</span>
                    <span className="font-black text-sm text-rose-400">{currencySymbol}{currentFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-[12px] font-black uppercase text-purple-400">Total Settlement</span>
                    <span className="text-2xl font-black">{currencySymbol}{(currentAmt + currentFee).toLocaleString()}</span>
                  </div>
                </div>
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                   <p className="text-[9px] text-amber-700 font-bold uppercase text-center tracking-widest leading-relaxed">Fees waived for <span className="text-purple-600">Elite Members</span>. Upgrade now to save.</p>
                </div>
              </div>
            ) : (
              <div className="py-10 text-center space-y-6 animate-in zoom-in-95">
                <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6 9 17l-5-5"/></svg></div>
                <h3 className="text-3xl font-black text-slate-950 tracking-tighter">Settlement Complete</h3>
                <button onClick={onClose} className="w-full bg-slate-950 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-2xl">Close Portal</button>
              </div>
            )}
          </div>

          {step < 4 && !isProcessing && (
            <div className="mt-8 space-y-4">
              {error && <p className="text-rose-500 text-[10px] font-black uppercase text-center animate-bounce">{error}</p>}
              <button onClick={handleNext} className="w-full bg-purple-600 text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-purple-500/20 hover:bg-purple-700 transition-all active:scale-95">
                {step === 3 ? 'Authorize Payment' : 'Continue'}
              </button>
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

export default ServiceModal;
