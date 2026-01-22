
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
  'GiftCard': {
    'Nigeria': ['Amazon US/UK', 'iTunes / Apple', 'Steam Wallet', 'Google Play Store', 'Razer Gold', 'Playstation Store', 'Xbox Gift Card', 'Jumia Gift Card'],
    'Ghana': ['Jumia GH', 'Amazon Global', 'iTunes / Apple', 'Google Play'],
    'Senegal': ['Playstation Store FR', 'Amazon FR', 'iTunes / Apple FR', 'Steam Wallet']
  },
  'GiftUser': {
    'Nigeria': ['Search via Node ID', 'Search via Phone Number', 'Direct P2P Gift'],
    'Ghana': ['Search via Node ID', 'Search via Phone Number', 'Direct P2P Gift'],
    'Senegal': ['Search via Node ID', 'Search via Phone Number', 'Direct P2P Gift']
  },
  'Flight': {
    'Nigeria': ['Air Peace', 'Arik Air', 'United Nigeria Airlines', 'Ibom Air', 'Max Air', 'Dana Air', 'ValueJet'],
    'Ghana': ['Africa World Airlines (AWA)', 'Passion Air'],
    'Senegal': ['Air Sénégal', 'Transair', 'Emirates Regional', 'Ethiopian Airlines']
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
    origin: '',
    destination: '',
    amount: '',
  });

  if (!isOpen) return null;

  const currencySymbol = currency === 'NGN' ? '₦' : currency === 'GHS' ? 'GH₵' : 'CFA';
  const getFee = (amt: number) => Math.max(100, amt * 0.015);

  const getProviderKey = (display: string) => {
    const d = display.toLowerCase();
    if (d.includes('elect')) return 'Electricity';
    if (d.includes('airtime')) return 'Airtime';
    if (d.includes('giftcard') || d.includes('gift card')) return 'GiftCard';
    if (d.includes('giftuser') || d.includes('gift user')) return 'GiftUser';
    if (d.includes('flight')) return 'Flight';
    if (d.includes('internet') || d.includes('data')) return 'Internet';
    if (d.includes('tv') || d.includes('cable')) return 'TV';
    return 'Transfer';
  };

  const providerKey = getProviderKey(serviceName);
  const providers = PROVIDERS[providerKey]?.[country] || PROVIDERS[providerKey]?.['Nigeria'] || [];

  const handleNext = async () => {
    if (step === 1 && !formData.provider) return setError("Please select a provider");
    if (step === 2) {
      if (providerKey === 'Flight' && (!formData.origin || !formData.destination)) return setError("Origin and Destination are required");
      if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) return setError("Enter a valid amount");
      if (providerKey !== 'Flight' && !formData.account.trim()) return setError("Account reference required");
    }
    setError(null);
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsProcessing(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      const txName = providerKey === 'Flight' 
        ? `Flight: ${formData.origin} to ${formData.destination}` 
        : `${serviceName}: ${formData.provider}`;
      onComplete(Number(formData.amount), txName, false);
      setIsProcessing(false);
      setStep(4);
    }
  };

  const currentAmt = Number(formData.amount) || 0;
  const currentFee = getFee(currentAmt);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-300 flex flex-col h-[82dvh] sm:h-auto sm:max-h-[85dvh] border border-white/20">
        
        {/* Header */}
        <div className="px-8 pt-8 pb-4 shrink-0 border-b border-slate-50 bg-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl sm:text-3xl font-[1000] text-slate-950 tracking-tighter leading-none">{serviceName}</h2>
              <p className="text-[8px] sm:text-[10px] font-black text-indigo-600 uppercase tracking-[0.25em] mt-2">{country} Hub Service</p>
            </div>
            <button onClick={onClose} className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-all">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 min-h-0 overflow-y-auto px-8 py-6 bg-white custom-scrollbar">
          {isProcessing ? (
            <div className="py-20 text-center space-y-6">
              <div className="w-16 h-16 border-8 border-slate-100 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
              <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Broadcasting Transaction...</p>
            </div>
          ) : step === 1 ? (
            <div className="space-y-4">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Available Providers</p>
              <div className="grid grid-cols-1 gap-2.5">
                {providers.map(p => (
                  <button 
                    key={p} 
                    onClick={() => setFormData({...formData, provider: p})} 
                    className={`w-full text-left px-6 py-4 rounded-2xl border-2 transition-all ${formData.provider === p ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md' : 'border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-200'}`}
                  >
                    <span className="font-black text-sm">{p}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : step === 2 ? (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              {providerKey === 'Flight' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Origin City</label>
                    <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-800" placeholder="e.g. Lagos" value={formData.origin} onChange={e => setFormData({...formData, origin: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Destination</label>
                    <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-800" placeholder="e.g. Accra" value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    {providerKey === 'GiftUser' ? 'Recipient Node ID' : 'Account Reference / ID'}
                  </label>
                  <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900" placeholder="Enter Reference..." value={formData.account} onChange={e => setFormData({...formData, account: e.target.value})} />
                </div>
              )}

              <div className="space-y-3">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Value ({currencySymbol})</label>
                <input type="number" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 font-black text-4xl text-slate-900 focus:border-indigo-600 outline-none transition-all tracking-tighter" placeholder="0.00" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                
                {providerKey === 'GiftCard' && (
                  <div className="flex gap-2 pt-2">
                    {['5000', '10000', '25000', '50000'].map(val => (
                      <button key={val} onClick={() => setFormData({...formData, amount: val})} className="px-4 py-2 bg-slate-100 rounded-lg text-[10px] font-black text-slate-600 hover:bg-indigo-600 hover:text-white transition-all">
                        {currencySymbol}{Number(val).toLocaleString()}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : step === 3 ? (
            <div className="space-y-4 animate-in slide-in-from-right-4">
              <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white space-y-4 shadow-2xl">
                <div className="flex justify-between border-b border-white/10 pb-3">
                  <span className="text-[10px] font-black uppercase text-slate-500">Service Provider</span>
                  <span className="font-black text-sm">{formData.provider}</span>
                </div>
                {providerKey === 'Flight' && (
                  <div className="flex justify-between border-b border-white/10 pb-3">
                    <span className="text-[10px] font-black uppercase text-slate-500">Route</span>
                    <span className="font-black text-sm">{formData.origin} ➔ {formData.destination}</span>
                  </div>
                )}
                <div className="flex justify-between border-b border-white/10 pb-3">
                  <span className="text-[10px] font-black uppercase text-slate-500">Principal</span>
                  <span className="font-black text-sm">{currencySymbol}{currentAmt.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-3">
                  <span className="text-[10px] font-black uppercase text-indigo-400">Node Fee</span>
                  <span className="font-black text-sm text-indigo-400">{currencySymbol}{currentFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-4">
                  <span className="text-sm font-black uppercase text-slate-400">Total Settlement</span>
                  <span className="text-3xl font-[1000] tracking-tighter">{currencySymbol}{(currentAmt + currentFee).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center space-y-8 animate-in zoom-in-95">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6 9 17l-5-5"/></svg>
              </div>
              <h3 className="text-3xl font-[1000] text-slate-950 tracking-tighter">Settlement Finalized</h3>
              <button onClick={onClose} className="w-full bg-slate-950 text-white py-5 rounded-[1.8rem] font-black uppercase tracking-widest text-xs shadow-2xl active:scale-95 transition-all">Go Back to Home</button>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        {step < 4 && !isProcessing && (
          <div className="px-8 pb-10 pt-4 bg-white border-t border-slate-50 shrink-0">
            {error && <p className="text-rose-500 text-[10px] font-black uppercase text-center mb-4 animate-pulse">{error}</p>}
            <button 
              onClick={handleNext} 
              className="w-full bg-indigo-600 text-white py-5 rounded-[1.8rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-xl hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              {step === 3 ? 'Authorize Injection' : 'Continue'}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceModal;
