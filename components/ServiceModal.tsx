
import React, { useState } from 'react';
import { Country, Currency } from '../types';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  country: Country;
  currency: Currency;
  onComplete: (amount: number, name: string, isRecurring: boolean, schedule?: { freq: string, date: string }) => void;
}

const PROVIDERS: Record<string, Record<string, string[]>> = {
  'Electricity': {
    'Nigeria': ['IKEDC (Ikeja Electric)', 'EKEDC (Eko Electric)', 'AEDC (Abuja Electric)', 'KEDCO (Kano Electric)', 'IBEDC (Ibadan Electric)', 'PHED (Port Harcourt)', 'JED (Jos Electric)', 'KAEDCO (Kaduna)', 'EEDC (Enugu)'],
    'Ghana': ['ECG Postpaid (Electricity Co. of Ghana)', 'ECG Prepaid (Electricity Co. of Ghana)', 'NEDCo (Northern Electricity)'],
    'Senegal': ['Senelec (Postpaid)', 'Woyofal (Prepaid Electricity)']
  },
  'Airtime': {
    'Nigeria': ['MTN Nigeria', 'Airtel Nigeria', 'Glo (Globacom)', '9mobile'],
    'Ghana': ['MTN Ghana', 'Telecel Ghana (formerly Vodafone)', 'AT Ghana (formerly AirtelTigo)'],
    'Senegal': ['Orange Sénégal', 'Free Sénégal', 'Expresso Sénégal']
  },
  'Data': {
    'Nigeria': ['MTN Data Plans', 'Airtel Data Plans', 'Glo Data Plans', 'Smile 4G LTE', 'Spectranet Fiber'],
    'Ghana': ['MTN Ghana Fiber', 'Telecel Broadband', 'Surfline 4G GH'],
    'Senegal': ['Orange Fiber/ADSL', 'Free Max Data', 'Expresso 4G Data']
  },
  'TV': {
    'Nigeria': ['DSTV Nigeria', 'GOTV Nigeria', 'StarTimes Nigeria', 'Showmax Subscription'],
    'Ghana': ['DSTV Ghana', 'GOTV Ghana', 'Canal+ Ghana', 'StarTimes GH'],
    'Senegal': ['Canal+ Sénégal', 'StarTimes Sénégal', 'Excaf Telecom']
  },
  'Insurance': {
    'Nigeria': ['Leadway Assurance', 'AIICO Insurance', 'AXA Mansard Health/Life', 'Custodian Insurance', 'Cornerstone Insurance'],
    'Ghana': ['Star Assurance', 'Enterprise Insurance', 'Hollard Insurance Ghana', 'Old Mutual GH'],
    'Senegal': ['AXA Sénégal', 'Saham Assurance', 'NSIA Sénégal', 'Allianz Sénégal']
  },
  'Investment': {
    'Nigeria': ['Cowrywise', 'Piggyvest (Pocket)', 'ARM Investment', 'Stanbic IBTC Mutual Funds', 'Bamboo (Stocks)'],
    'Ghana': ['Databank Ghana', 'EcoCapital Investment', 'Stanlib Ghana', 'GoldCoast Fund'],
    'Senegal': ['CGF Bourse', 'Fonsis', 'Wari Invest', 'BOA Capital']
  },
  'Loan Repayment': {
    'Nigeria': ['Carbon (Paylater)', 'FairMoney', 'Renmoney', 'Branch International', 'PalmCredit'],
    'Ghana': ['Fido Loans', 'MTN Qwikloan Repayment', 'Advans Ghana', 'Izwe Loans'],
    'Senegal': ['Cofina Sénégal', 'Baobab Plus', 'Crédit du Sénégal', 'Microcred']
  },
  'Betting': {
    'Nigeria': ['Bet9ja', 'SportyBet NG', 'BetKing', '1xBet NG', 'NairaBet'],
    'Ghana': ['Betway Ghana', 'SportyBet GH', 'Soccabet', 'Premier Bet GH'],
    'Senegal': ['Lonase (Loterie Nationale)', '1xBet SN', 'Premier Bet SN']
  },
  'Gov Services': {
    'Nigeria': ['NIN Card Renewal (NIMC)', 'FIRS Tax Payment', 'Remita Gov Payments', 'JAMB/WAEC E-Pin', 'Lagos State Water'],
    'Ghana': ['GRA Tax Payment', 'Ghana Card (NIA)', 'DVLA Driver License', 'Ghana.gov Unified Portal'],
    'Senegal': ['DGID (Tax)', 'Douanes Sénégalaises', 'Teledac (Gov Admin)', 'Sénégalaise des Eaux (SDE)']
  },
  'Transport': {
    'Nigeria': ['GIGM (God is Good Motors)', 'ABC Transport', 'Cowry Card Top-up (Lagos Rail/Bus)', 'Peace Mass Transit'],
    'Ghana': ['STC Ghana (Intercity)', 'VIP Jeoun Bus', '2Hygge Transport', 'Metro Mass Transit'],
    'Senegal': ['Dakar Dem Dikk (Bus)', 'TER (Train Express Régional)', 'Sénégal Dem Dikk', 'Petit Train de Banlieue']
  },
  'Car Services': {
    'Nigeria': ['Uber Nigeria', 'Bolt Nigeria', 'InDrive NG', 'Rida Nigeria'],
    'Ghana': ['Uber Ghana', 'Bolt Ghana', 'Yango Ghana', 'Shuttle GH'],
    'Senegal': ['Yango Sénégal', 'Heetch Sénégal', 'Allo Taxi Dakar']
  },
  'Groceries': {
    'Nigeria': ['Shoprite NG', 'Spar NG', 'Chowdeck Groceries', 'Jumia Food Mart', 'PricePally'],
    'Ghana': ['Melcom Online', 'Shoprite GH', 'MaxMart GH', 'Koala Supermarket'],
    'Senegal': ['Auchan Sénégal', 'Casino SN', 'Super U Sénégal', 'Citydia']
  },
  'Food Delivery': {
    'Nigeria': ['Chowdeck', 'Glovo Nigeria', 'FoodCourt', 'Eden Life', 'Jumia Food'],
    'Ghana': ['Glovo GH', 'Bolt Food GH', 'Jumia Food GH', 'Hubtel Food'],
    'Senegal': ['Glovo SN', 'Paps SN', 'Food-Express SN']
  },
  'Domestic Transfer': {
    'Nigeria': ['Commercial Bank (NIP)', 'OPay Wallet', 'Palmpay Wallet', 'Kuda Bank'],
    'Ghana': ['MTN MoMo (Mobile Money)', 'Telecel Cash', 'G-Money', 'Zeepay'],
    'Senegal': ['Wave SN Transfer', 'Orange Money SN', 'Free Money', 'Wizall Money']
  },
  'International Transfer': {
    'Nigeria': ['PayFlow Global', 'SWIFT Direct', 'Western Union', 'WorldRemit'],
    'Ghana': ['PayFlow Global', 'SWIFT Direct', 'MoneyGram', 'Chipper Cash'],
    'Senegal': ['PayFlow Global', 'SWIFT Direct', 'RIA Money Transfer', 'Western Union SN']
  }
};

const ServiceModal: React.FC<ServiceModalProps> = ({ isOpen, onClose, serviceName, country, currency, onComplete }) => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRecurring, setIsRecurring] = useState(false);
  const [formData, setFormData] = useState({
    provider: '',
    account: '',
    amount: '',
    recipientName: '',
    recipientCountry: '',
    swiftCode: '',
    bankName: '',
    frequency: 'monthly',
    startDate: new Date().toISOString().split('T')[0]
  });

  if (!isOpen) return null;

  const isInternational = serviceName === 'International Transfer';
  const currencySymbol = currency === 'NGN' ? '₦' : currency === 'GHS' ? 'GH₵' : 'CFA';
  
  // Robust provider lookup with fallback
  const serviceGroup = PROVIDERS[serviceName] || PROVIDERS['Domestic Transfer'];
  const providers = serviceGroup[country] || serviceGroup['Nigeria'] || [];

  const handleNext = async () => {
    if (step === 1 && !formData.provider) return setError("Please select a provider");
    
    if (step === 2) {
      if (isInternational) {
        if (!formData.recipientName.trim()) return setError("Recipient Name is required");
        if (!formData.recipientCountry) return setError("Recipient Country is required");
        if (!formData.bankName.trim()) return setError("Bank Name is required");
        
        const swift = formData.swiftCode.trim().toUpperCase();
        if (!swift) return setError("SWIFT/BIC Code is required");
        if (swift.length !== 8 && swift.length !== 11) return setError("Invalid SWIFT Code (must be 8 or 11 characters)");
        
        if (!formData.account.trim()) return setError("Account Number/IBAN is required");
      } else {
        if (!formData.account.trim()) return setError("Recipient ID/Account/Meter Number is required");
      }
      
      const amt = Number(formData.amount);
      if (!formData.amount || isNaN(amt) || amt <= 0) return setError("Please enter a valid positive amount");
    }
    
    setError(null);
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsProcessing(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const transactionName = isInternational 
        ? `Transfer to ${formData.recipientName}` 
        : `${formData.provider} Payment`;
        
      onComplete(
        parseFloat(formData.amount), 
        transactionName, 
        isRecurring, 
        isRecurring ? { freq: formData.frequency, date: formData.startDate } : undefined
      );
      
      setIsProcessing(false);
      setStep(4);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 flex flex-col">
        <div className="p-8 md:p-10">
          <div className="flex justify-between items-center mb-8">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">{serviceName}</h2>
              <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest">{country} Region</p>
            </div>
            <button onClick={onClose} className="p-2.5 text-slate-300 hover:text-slate-500 hover:bg-slate-50 rounded-2xl transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          {step < 4 && (
            <div className="flex gap-2 mb-8">
              {[1, 2, 3].map(s => (
                <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-purple-600' : 'bg-slate-100'}`} />
              ))}
            </div>
          )}

          <div className="min-h-[320px]">
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4 py-12">
                <div className="w-16 h-16 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin"></div>
                <p className="font-black text-slate-800 uppercase tracking-widest text-xs text-center">
                  Connecting Secure Payment Gateway...<br/>
                  <span className="text-[9px] text-slate-400">Verifying {formData.provider} Endpoint</span>
                </p>
              </div>
            ) : step === 1 ? (
              <div className="grid grid-cols-1 gap-3 animate-in slide-in-from-right-4 duration-300 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Select Active {serviceName} Provider</p>
                {providers.length > 0 ? providers.map(p => (
                  <button 
                    key={p}
                    onClick={() => setFormData({...formData, provider: p})}
                    className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
                      formData.provider === p ? 'border-purple-600 bg-purple-50' : 'border-slate-50 bg-slate-50 hover:border-slate-200'
                    }`}
                  >
                    <span className="font-bold text-slate-700 text-sm">{p}</span>
                    {formData.provider === p && <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6 9 17l-5-5"/></svg></div>}
                  </button>
                )) : (
                  <div className="text-center py-10">
                    <p className="text-slate-400 font-bold italic text-sm">No specific providers available for this category in {country}.</p>
                  </div>
                )}
              </div>
            ) : step === 2 ? (
              <div className="space-y-4 animate-in slide-in-from-right-4 duration-300 overflow-y-auto max-h-[450px] pr-2 custom-scrollbar pb-2">
                {isInternational ? (
                  <>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Recipient Full Name</label>
                        <input 
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 font-bold text-slate-700 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                          placeholder="Legal name on ID"
                          value={formData.recipientName}
                          onChange={e => setFormData({...formData, recipientName: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Recipient Country</label>
                        <select 
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 font-bold text-slate-700 focus:ring-4 focus:ring-purple-100 outline-none transition-all appearance-none"
                          value={formData.recipientCountry}
                          onChange={e => setFormData({...formData, recipientCountry: e.target.value})}
                        >
                          <option value="">Select Destination</option>
                          <option value="United States">United States</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Canada">Canada</option>
                          <option value="China">China</option>
                          <option value="South Africa">South Africa</option>
                          <option value="Kenya">Kenya</option>
                          <option value="France">France</option>
                          <option value="Germany">Germany</option>
                          <option value="United Arab Emirates">United Arab Emirates</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Bank Name</label>
                        <input 
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 font-bold text-slate-700 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                          placeholder="e.g. Barclays"
                          value={formData.bankName}
                          onChange={e => setFormData({...formData, bankName: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">SWIFT / BIC</label>
                        <input 
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 font-bold text-slate-700 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                          placeholder="8 or 11 chars"
                          value={formData.swiftCode}
                          onChange={e => setFormData({...formData, swiftCode: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Account Number / IBAN</label>
                      <input 
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 font-bold text-slate-700 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                        placeholder="Enter international format"
                        value={formData.account}
                        onChange={e => setFormData({...formData, account: e.target.value})}
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Recipient ID / Account / Meter Number</label>
                    <input 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-black text-xl focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                      placeholder="Enter Reference Number"
                      value={formData.account}
                      onChange={e => setFormData({...formData, account: e.target.value})}
                    />
                  </div>
                )}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Amount ({currencySymbol})</label>
                  <input 
                    type="number"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-black text-2xl focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={e => setFormData({...formData, amount: e.target.value})}
                  />
                </div>
              </div>
            ) : step === 3 ? (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="bg-slate-900 rounded-3xl p-8 text-white space-y-4 shadow-xl">
                  <div className="flex justify-between border-b border-white/10 pb-4">
                    <span className="text-[10px] uppercase font-black text-slate-500">Service</span>
                    <span className="font-bold">{serviceName}</span>
                  </div>
                  {isInternational ? (
                    <>
                      <div className="flex justify-between border-b border-white/10 pb-4">
                        <span className="text-[10px] uppercase font-black text-slate-500">Recipient</span>
                        <span className="font-bold truncate max-w-[150px]">{formData.recipientName}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/10 pb-4">
                        <span className="text-[10px] uppercase font-black text-slate-500">Destination</span>
                        <span className="font-bold">{formData.recipientCountry}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between border-b border-white/10 pb-4">
                      <span className="text-[10px] uppercase font-black text-slate-500">Provider</span>
                      <span className="font-bold">{formData.provider}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-b border-white/10 pb-4">
                    <span className="text-[10px] uppercase font-black text-slate-500">Reference</span>
                    <span className="font-bold truncate max-w-[150px]">{formData.account}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-[10px] uppercase font-black text-slate-500">Payable Amount</span>
                    <span className="text-2xl font-black">{currencySymbol}{Number(formData.amount).toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-6 bg-purple-50 rounded-2xl border border-purple-100">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-purple-600 text-white rounded-xl flex items-center justify-center">
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                     </div>
                     <span className="font-bold text-sm text-purple-900">Enable Auto-Settlement?</span>
                   </div>
                   <button 
                     onClick={() => setIsRecurring(!isRecurring)}
                     className={`w-12 h-6 rounded-full transition-all relative ${isRecurring ? 'bg-purple-600' : 'bg-slate-200'}`}
                   >
                     <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isRecurring ? 'right-1' : 'left-1'}`} />
                   </button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6 py-8 animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                   <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <h3 className="text-3xl font-black text-slate-800 tracking-tight">Payment Dispatched</h3>
                <p className="text-slate-500 font-medium leading-relaxed px-4">
                  Settlement request for <span className="font-black text-slate-900">{isInternational ? formData.recipientName : formData.provider}</span> has been successfully queued in the {country} financial network.
                </p>
                <button 
                  onClick={onClose}
                  className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-200"
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>

          {step < 4 && !isProcessing && (
            <div className="mt-8">
              {error && <p className="text-rose-500 text-[10px] font-black uppercase mb-4 text-center tracking-widest">{error}</p>}
              <button 
                onClick={handleNext}
                className="w-full bg-purple-600 text-white py-5 rounded-[2rem] font-black shadow-xl shadow-purple-100 hover:bg-purple-700 transition-all flex items-center justify-center gap-2 group"
              >
                <span>{step === 3 ? 'Authorize & Pay' : 'Next Step'}</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
            </div>
          )}
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default ServiceModal;
