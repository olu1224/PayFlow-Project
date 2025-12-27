
import React, { useState } from 'react';
import { Country, Currency } from '../types';

// Comprehensive Regional Provider Mapping
const PROVIDERS: Record<string, Record<string, string[]>> = {
  'Electricity': {
    'Nigeria': ['IKEDC (Ikeja Electric)', 'EKEDC (Eko Electric)', 'AEDC (Abuja Electric)', 'KEDCO (Kano Electric)'],
    'Ghana': ['ECG Postpaid', 'ECG Prepaid', 'NEDCo'],
    'Senegal': ['Senelec (Postpaid)', 'Woyofal (Prepaid)']
  },
  'Airtime': {
    'Nigeria': ['MTN Nigeria', 'Airtel Nigeria', 'Glo', '9mobile'],
    'Ghana': ['MTN Ghana', 'Telecel Ghana', 'AT Ghana'],
    'Senegal': ['Orange Sénégal', 'Free Sénégal', 'Expresso Sénégal']
  },
  'Data': {
    'Nigeria': ['MTN Data Plans', 'Airtel Data Plans', 'Smile 4G'],
    'Ghana': ['MTN Ghana Fiber', 'Telecel Broadband'],
    'Senegal': ['Orange Fiber/ADSL', 'Free Max Data']
  },
  'TV': {
    'Nigeria': ['DSTV Nigeria', 'GOTV Nigeria', 'StarTimes', 'Showmax'],
    'Ghana': ['DSTV Ghana', 'GOTV Ghana', 'StarTimes GH'],
    'Senegal': ['Canal+ Sénégal', 'TNT Sénégal']
  },
  'Water': {
    'Nigeria': ['Lagos Water Corporation', 'Abuja Water Board'],
    'Ghana': ['GWCL (Ghana Water)'],
    'Senegal': ['Sen’Eau']
  },
  'Food': {
    'Nigeria': ['Jumia Food', 'Chowdeck', 'Glovo NG', 'Bolt Food'],
    'Ghana': ['Glovo Ghana', 'Bolt Food GH', 'Hubtel Food'],
    'Senegal': ['Paps Food', 'Yassir Express', 'Glovo SN']
  },
  'Transfer': {
    'Nigeria': ['Access Bank', 'Zenith Bank', 'GTBank', 'OPay', 'Palmpay'],
    'Ghana': ['MTN MoMo', 'Telecel Cash', 'G-Money', 'Standard Chartered'],
    'Senegal': ['Wave Sénégal', 'Orange Money', 'Free Money', 'UBA Sénégal']
  },
  'Investment': {
    'Nigeria': ['Cowrywise', 'PiggyVest', 'Bamboo', 'Risevest'],
    'Ghana': ['EcoCapital', 'Databank', 'Gold Coast Fund'],
    'Senegal': ['Wari Invest', 'CGF Bourse', 'SGI Sénégal']
  },
  'Gov Services': {
    'Nigeria': ['Remita (TSA)', 'LIRS Tax', 'FIRS Tax', 'FRSC Pin'],
    'Ghana': ['Ghana.gov', 'GRA Tax', 'SSNIT Payments'],
    'Senegal': ['E-Tax Sénégal', 'Douanes SN', 'Seneau Settlement']
  },
  'Insurance': {
    'Nigeria': ['AXA Mansard', 'Leadway Assurance', 'AIICO'],
    'Ghana': ['Star Assurance', 'Enterprise Life', 'SIC Insurance'],
    'Senegal': ['AXA Sénégal', 'Saham Assurance', 'Allianz SN']
  },
  'Betting': {
    'Nigeria': ['Bet9ja', 'SportyBet', 'BetKing', '1xBet'],
    'Ghana': ['SportyBet GH', 'Betway Ghana', 'MSport'],
    'Senegal': ['Lonase', '1xBet SN', 'Betclic SN']
  },
  'Transport': {
    'Nigeria': ['Uber Wallet', 'Bolt Wallet', 'GIGM', 'Cowry Card'],
    'Ghana': ['STC Ghana', 'Uber GH', 'Yangoo'],
    'Senegal': ['TER Dakar', 'DDD Bus', 'Yango SN']
  },
  'Groceries': {
    'Nigeria': ['Shoprite Pay', 'Spar Wallet', 'PricePally'],
    'Ghana': ['Melcom Pay', 'Shoprite GH', 'MaxMart'],
    'Senegal': ['Auchan Sénégal', 'Casino SN', 'Carrefour SN']
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
  
  const getProviderKey = (display: string) => {
    const d = display.toLowerCase();
    if (d.includes('elect')) return 'Electricity';
    if (d.includes('airtime')) return 'Airtime';
    if (d.includes('data') || d.includes('internet')) return 'Data';
    if (d.includes('tv') || d.includes('cable')) return 'TV';
    if (d.includes('water')) return 'Water';
    if (d.includes('food')) return 'Food';
    if (d.includes('trans')) return 'Transfer';
    if (d.includes('invest')) return 'Investment';
    if (d.includes('loan')) return 'Transfer';
    if (d.includes('gov')) return 'Gov Services';
    if (d.includes('insur')) return 'Insurance';
    if (d.includes('bett')) return 'Betting';
    if (d.includes('bus') || d.includes('transport')) return 'Transport';
    if (d.includes('grocer')) return 'Groceries';
    return 'Transfer';
  };

  const calculateFee = (principal: number): number => {
    if (principal === 0) return 0;
    switch (country) {
      case 'Nigeria': return 100;
      case 'Ghana': return 1;
      case 'Senegal': return principal * 0.01;
      default: return 50;
    }
  };

  const currentFee = calculateFee(parseFloat(formData.amount || '0'));
  const totalCharge = parseFloat(formData.amount || '0') + currentFee;

  const providerKey = getProviderKey(serviceName);
  const providers = PROVIDERS[providerKey]?.[country] || PROVIDERS[providerKey]?.['Nigeria'] || [];

  const handleNext = async () => {
    if (step === 1 && !formData.provider) return setError("Please select a provider");
    if (step === 2) {
      const amt = Number(formData.amount);
      if (!formData.amount || isNaN(amt) || amt <= 0) return setError("Please enter a valid amount");
      if (!formData.account.trim()) return setError("Reference identifier required");
    }
    setError(null);
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsProcessing(true);
      await new Promise(resolve => setTimeout(resolve, 2500));
      onComplete(totalCharge, `Settlement: ${formData.provider}`, false);
      setIsProcessing(false);
      setStep(4);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] md:rounded-[4rem] shadow-2xl max-h-[90dvh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border border-white">
        <div className="p-6 md:p-14 overflow-y-auto custom-scrollbar flex-1">
          <div className="flex justify-between items-center mb-6 md:mb-10">
            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-[900] text-slate-900 tracking-tighter leading-none">{serviceName}</h2>
              <p className="text-[9px] md:text-[10px] font-black text-purple-600 uppercase tracking-[0.3em]">{country} Region Node</p>
            </div>
            <button onClick={onClose} className="p-2 md:p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl md:rounded-2xl transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <div className="min-h-[300px] md:min-h-[400px] flex flex-col">
            {isProcessing ? (
              <div className="flex-1 flex flex-col items-center justify-center space-y-6 md:space-y-8 animate-pulse">
                <div className="w-16 h-16 md:w-24 md:h-24 border-8 border-slate-100 border-t-purple-600 rounded-full animate-spin"></div>
                <div className="text-center space-y-2">
                  <p className="font-[900] text-slate-900 uppercase tracking-[0.3em] text-[10px] md:text-xs">Auth Protocol Active</p>
                  <p className="text-slate-400 font-bold text-xs md:text-sm">Validating multi-party ledger settlement...</p>
                </div>
              </div>
            ) : step === 1 ? (
              <div className="flex-1 space-y-3">
                <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 md:mb-4 ml-1">Select Local Endpoint</p>
                <div className="space-y-2">
                  {providers.length > 0 ? providers.map(p => (
                    <button key={p} onClick={() => setFormData({...formData, provider: p})} className={`w-full flex items-center justify-between p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border-2 transition-all group ${formData.provider === p ? 'border-purple-600 bg-purple-50 shadow-lg' : 'border-slate-50 bg-slate-50 hover:border-slate-200'}`}>
                      <span className={`font-[900] text-base md:text-lg tracking-tight ${formData.provider === p ? 'text-purple-700' : 'text-slate-600'}`}>{p}</span>
                      <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all ${formData.provider === p ? 'bg-purple-600 text-white rotate-0 scale-100' : 'bg-slate-200 text-transparent rotate-90 scale-50'}`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6 9 17l-5-5"/></svg>
                      </div>
                    </button>
                  )) : (
                    <div className="py-20 text-center opacity-40">
                      <p className="font-black text-[10px] uppercase tracking-widest">No endpoints found for this region.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : step === 2 ? (
              <div className="flex-1 space-y-6 md:space-y-10 animate-in slide-in-from-right-8">
                <div className="space-y-3 md:space-y-4">
                  <label className="block text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account / Reference ID</label>
                  <input className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] md:rounded-[2rem] px-6 md:px-8 py-4 md:py-6 font-[900] text-xl md:text-2xl text-slate-900 focus:border-purple-600 focus:ring-4 focus:ring-purple-100 outline-none transition-all" placeholder="Enter Ref ID..." value={formData.account} onChange={e => setFormData({...formData, account: e.target.value})} />
                </div>
                <div className="space-y-3 md:space-y-4">
                  <label className="block text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payment Amount ({currencySymbol})</label>
                  <input type="number" className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] md:rounded-[2rem] px-6 md:px-8 py-4 md:py-6 font-[900] text-3xl md:text-5xl text-slate-900 focus:border-purple-600 focus:ring-4 focus:ring-purple-100 outline-none transition-all tracking-tighter" placeholder="0.00" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                </div>
              </div>
            ) : step === 3 ? (
              <div className="flex-1 space-y-6 md:space-y-8 animate-in slide-in-from-right-8">
                <div className="bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 text-white relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600 rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>
                  <div className="space-y-4 md:space-y-6 relative z-10">
                    <div className="flex justify-between items-center border-b border-white/10 pb-3 md:pb-4">
                      <span className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">Principal</span>
                      <span className="text-lg md:text-xl font-bold">{currencySymbol}{Number(formData.amount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-3 md:pb-4">
                      <span className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">Commission Fee</span>
                      <span className="text-lg md:text-xl font-bold text-purple-400">+{currencySymbol}{currentFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-end pt-2">
                      <span className="text-[10px] md:text-[12px] font-black text-white uppercase tracking-[0.2em]">Final Debit</span>
                      <span className="text-3xl md:text-4xl font-[900] tracking-tighter text-emerald-400 leading-none">{currencySymbol}{totalCharge.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase text-center tracking-widest">Verified MPN Regional Endpoint</p>
              </div>
            ) : (
              <div className="flex-1 text-center py-6 md:py-10 space-y-6 md:space-y-8 animate-in zoom-in-95">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-emerald-50 text-emerald-600 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner ring-4 ring-emerald-50"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6 9 17l-5-5"/></svg></div>
                <div className="space-y-2 px-2">
                  <h3 className="text-3xl md:text-4xl font-[900] text-slate-900 tracking-tighter leading-none">Order Dispatched</h3>
                  <p className="text-slate-500 font-bold text-base md:text-lg leading-relaxed">Your settlement of {currencySymbol}{totalCharge.toLocaleString()} for {formData.provider} has been broadcasted.</p>
                </div>
                <button onClick={onClose} className="w-full bg-slate-900 text-white py-5 md:py-6 rounded-[1.5rem] md:rounded-[2.5rem] font-[900] text-[10px] md:text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl">Confirm & Exit</button>
              </div>
            )}
            
            {step < 4 && !isProcessing && (
              <div className="mt-8 md:mt-12 mb-2">
                {error && <p className="text-rose-600 text-[9px] md:text-[10px] font-[900] uppercase mb-4 md:mb-6 text-center tracking-[0.2em] animate-bounce">{error}</p>}
                <button onClick={handleNext} className="w-full bg-purple-600 text-white py-5 md:py-6 rounded-[1.5rem] md:rounded-[2.5rem] font-[900] text-[10px] md:text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-purple-700 transition-all flex items-center justify-center gap-3 group active:scale-95">
                  <span>{step === 3 ? 'Authorize Settlement' : 'Continue Protocol'}</span>
                  <svg className="group-hover:translate-x-1 transition-transform" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </button>
              </div>
            )}
          </div>
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
