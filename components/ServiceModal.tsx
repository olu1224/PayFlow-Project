
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
    'Nigeria': ['IKEDC (Ikeja)', 'EKEDC (Eko)', 'AEDC (Abuja)', 'KEDCO (Kano)', 'IBEDC (Ibadan)', 'PHED (Port Harcourt)', 'JED (Jos)', 'KAEDCO (Kaduna)', 'EEDC (Enugu)'],
    'Ghana': ['ECG (Electricity Company of Ghana)', 'NEDCo'],
    'Senegal': ['Senelec', 'Woyofal']
  },
  'Airtime': {
    'Nigeria': ['MTN Nigeria', 'Airtel Nigeria', 'Glo', '9mobile'],
    'Ghana': ['MTN Ghana', 'Telecel (Vodafone)', 'AT (AirtelTigo)'],
    'Senegal': ['Orange Senegal', 'Free Senegal', 'Expresso']
  },
  'Data': {
    'Nigeria': ['MTN Data', 'Airtel Data', 'Glo Data', '9mobile Data', 'Spectranet', 'Smile'],
    'Ghana': ['MTN Data', 'Telecel Data', 'AT Data'],
    'Senegal': ['Orange Data', 'Free Data', 'Expresso Data']
  },
  'TV': {
    'Nigeria': ['DSTV Nigeria', 'GOTV Nigeria', 'StarTimes Nigeria', 'Showmax'],
    'Ghana': ['DSTV Ghana', 'GOTV Ghana', 'Canal+ Ghana'],
    'Senegal': ['Canal+ Senegal', 'StarTimes Senegal']
  },
  'Insurance': {
    'Nigeria': ['AXA Mansard', 'AIICO Insurance', 'Leadway Assurance', 'Custodian Life'],
    'Ghana': ['StarLife Assurance', 'Enterprise Insurance', 'Hollard Ghana'],
    'Senegal': ['AXA Senegal', 'Saham Assurance']
  },
  'Investment': {
    'Nigeria': ['Cowrywise', 'PiggyVest', 'Stanbic IBTC Mutual Funds', 'ARM Investments'],
    'Ghana': ['Databank Ghana', 'EcoBank Capital', 'Gold Coast Advisors'],
    'Senegal': ['BNDE Investments', 'CGF Bourse']
  },
  'Gov Services': {
    'Nigeria': ['NIN Card Payment (NIMC)', 'LASG (Lagos State)', 'FIRS Tax', 'FRSC (License)'],
    'Ghana': ['Ghana Card Renewal', 'GRA Tax', 'DVLA (Driver License)'],
    'Senegal': ['Carte d\'Identité Nationale', 'Impôts et Domaines']
  },
  'Public Transport': {
    'Nigeria': ['Cowry Card Topup (Lagos)', 'GIGM (God is Good)', 'NRC Train Ticket'],
    'Ghana': ['Metro Mass Transit', 'STC Bus'],
    'Senegal': ['Dakar Dem Dikk', 'TER (Train Express Régional)']
  },
  'Car Services': {
    'Nigeria': ['Uber Wallet', 'Bolt Wallet', 'TotalEnergies Fuel Card'],
    'Ghana': ['Uber Ghana', 'Bolt Ghana', 'Goil Fuel Card'],
    'Senegal': ['Uber Senegal', 'Heetch Senegal']
  },
  'Loan Repayment': {
    'Nigeria': ['Kuda Loan', 'FairMoney', 'Carbon', 'Renmoney'],
    'Ghana': ['MTN Qwickloan', 'Fido Money'],
    'Senegal': ['Orange Money Credit', 'Baobab']
  },
  'Betting': {
    'Nigeria': ['Bet9ja', 'SportyBet', 'BetKing', '22Bet', 'NairaBet'],
    'Ghana': ['SportyBet Ghana', 'Betway Ghana', '1xBet', 'Melbet'],
    'Senegal': ['1xBet Senegal', 'Premier Bet', 'Lonase Sport']
  },
  'Groceries': {
    'Nigeria': ['Glovo Groceries', 'Spar Nigeria', 'Shoprite NG', 'Market Square'],
    'Ghana': ['Glovo Ghana', 'Jumia Food Groceries', 'Shoprite GH'],
    'Senegal': ['Glovo Dakar', 'Auchan Senegal', 'Carrefour Senegal']
  },
  'Food Delivery': {
    'Nigeria': ['Chowdeck', 'Jumia Food', 'Bolt Food', 'Eden Life'],
    'Ghana': ['Jumia Food', 'Bolt Food', 'Glovo Food'],
    'Senegal': ['Yassir Dakar', 'Glovo Senegal', 'Paps Delivery']
  },
  'Domestic Transfer': {
    'Nigeria': ['Bank Transfer', 'OPay', 'Palmpay', 'Paga'],
    'Ghana': ['MTN Mobile Money', 'Telecel Cash', 'AT Money', 'Bank Transfer'],
    'Senegal': ['Wave Senegal', 'Orange Money', 'Free Money']
  },
  'Intl Transfer': {
    'Nigeria': ['Western Union', 'MoneyGram', 'Chipper Cash', 'Send by Flutterwave'],
    'Ghana': ['Western Union', 'MoneyGram', 'TapTap Send'],
    'Senegal': ['Western Union', 'Ria', 'MoneyGram']
  }
};

const ServiceModal: React.FC<ServiceModalProps> = ({ isOpen, onClose, serviceName, country, currency, onComplete }) => {
  const [step, setStep] = useState(1);
  const [isRecurring, setIsRecurring] = useState(false);
  const [formData, setFormData] = useState({
    provider: '',
    account: '',
    amount: '',
    frequency: 'monthly',
    startDate: new Date().toISOString().split('T')[0]
  });

  if (!isOpen) return null;

  const steps = [
    { id: 1, label: 'Service & Provider' },
    { id: 2, label: 'Details' },
    { id: 3, label: 'Amount & Review' },
    { id: 4, label: 'Complete' },
  ];

  const currencySymbol = currency === 'NGN' ? '₦' : currency === 'GHS' ? 'GH₵' : 'CFA';
  
  // Get providers based on service name and user country
  const serviceGroup = PROVIDERS[serviceName] || {};
  const providers = serviceGroup[country] || serviceGroup['Nigeria'] || ['Generic Provider'];

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else if (step === 3) {
      const amt = parseFloat(formData.amount);
      if (isNaN(amt) || amt <= 0) return alert('Invalid amount');
      onComplete(
        amt, 
        `${formData.provider || serviceName} Payment`, 
        isRecurring, 
        isRecurring ? { freq: formData.frequency, date: formData.startDate } : undefined
      );
      setStep(4);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-purple-600">{serviceName}</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          <div className="flex items-center justify-between mb-10 px-2">
            {steps.map((s, idx) => (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    step >= s.id ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {s.id}
                  </div>
                  <span className={`text-[10px] font-bold text-center leading-tight transition-all ${
                    step === s.id ? 'text-slate-800' : 'text-slate-400'
                  }`}>
                    {s.label}
                  </span>
                </div>
                {idx < steps.length - 1 && <div className={`h-1 flex-1 mx-2 rounded-full ${step > s.id ? 'bg-purple-600' : 'bg-slate-100'}`} />}
              </React.Fragment>
            ))}
          </div>

          <div className="min-h-[250px]">
            {step === 1 && (
              <div className="space-y-6">
                <p className="text-slate-500 text-center font-medium italic">Available providers for {country}</p>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Service Provider *</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-600 focus:outline-none font-bold"
                    value={formData.provider}
                    onChange={(e) => setFormData({...formData, provider: e.target.value})}
                  >
                    <option value="">Select provider</option>
                    {providers.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <p className="text-slate-500 text-center font-medium">Enter beneficiary account details</p>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Account / Reference / ID Number *</label>
                  <input 
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-600 focus:outline-none font-bold"
                    placeholder="Enter unique ID"
                    value={formData.account}
                    onChange={(e) => setFormData({...formData, account: e.target.value})}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <p className="text-slate-500 text-center font-medium">Review and confirm amount</p>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex justify-between py-1 border-b border-slate-200/50">
                    <span className="text-slate-500 text-xs">Provider</span>
                    <span className="font-bold text-xs">{formData.provider || 'Generic'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500 text-xs">Account</span>
                    <span className="font-bold text-xs">{formData.account}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Amount ({currencySymbol}) *</label>
                  <input 
                    type="number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 font-bold text-xl focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  />
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700">Recurring Payment</span>
                    <button 
                      onClick={() => setIsRecurring(!isRecurring)}
                      className={`w-10 h-5 rounded-full transition-all relative ${isRecurring ? 'bg-purple-600' : 'bg-slate-300'}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${isRecurring ? 'right-0.5' : 'left-0.5'}`}></div>
                    </button>
                  </div>
                  
                  {isRecurring && (
                    <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Frequency</label>
                        <select 
                          className="w-full bg-white border border-slate-200 rounded-lg px-2 py-2 text-xs font-bold focus:outline-none"
                          value={formData.frequency}
                          onChange={e => setFormData({...formData, frequency: e.target.value})}
                        >
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Start Date</label>
                        <input 
                          type="date"
                          className="w-full bg-white border border-slate-200 rounded-lg px-2 py-2 text-xs font-bold focus:outline-none"
                          value={formData.startDate}
                          onChange={e => setFormData({...formData, startDate: e.target.value})}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="text-center py-8 space-y-4">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Payment Sent!</h3>
                <p className="text-slate-500">Your {isRecurring ? 'recurring payment' : 'payment'} of {currencySymbol}{Number(formData.amount).toLocaleString()} to {formData.provider} has been successful.</p>
                <button 
                  onClick={onClose}
                  className="mt-8 bg-purple-600 text-white px-8 py-3 rounded-xl font-bold w-full"
                >
                  Return Home
                </button>
              </div>
            )}
          </div>

          {step < 4 && (
            <button 
              onClick={handleNext}
              disabled={step === 1 && !formData.provider || step === 2 && !formData.account || step === 3 && !formData.amount}
              className="w-full mt-10 bg-slate-400 hover:bg-purple-600 disabled:bg-slate-300 text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 group"
            >
              <span>{step === 3 ? (isRecurring ? 'Schedule Payment' : 'Pay Now') : 'Next Step'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;
