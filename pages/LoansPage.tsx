
import React, { useState } from 'react';
import { User, Transaction } from '../types';
import { analyzeCreditScore } from '../geminiService';
import ServiceModal from '../components/ServiceModal';

const LOAN_REPAYMENT_PROVIDERS: Record<string, string[]> = {
  'Nigeria': ['Carbon (Paylater)', 'FairMoney', 'Renmoney', 'Branch International', 'PalmCredit', 'Migo', 'QuickCheck'],
  'Ghana': ['Fido Loans', 'MTN Qwikloan Repayment', 'Advans Ghana', 'Izwe Loans', 'SikaPurse', 'Zidisha GH'],
  'Senegal': ['Cofina Sénégal', 'Baobab Plus', 'Crédit du Sénégal', 'Microcred', 'PAMECAS', 'ACEP Sénégal']
};

interface LoansPageProps {
  user: User;
  transactions: Transaction[];
  onNewTransaction?: (amount: number, name: string, category: string) => void;
}

const LoansPage: React.FC<LoansPageProps> = ({ user, transactions, onNewTransaction }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [requestModal, setRequestModal] = useState<{ type: 'nano' | 'business' | 'merchant', amount: number } | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedRepaymentProvider, setSelectedRepaymentProvider] = useState<string | null>(null);

  const currencySymbol = user.currency === 'NGN' ? '₦' : user.currency === 'GHS' ? 'GH₵' : 'CFA';
  const providers = LOAN_REPAYMENT_PROVIDERS[user.country] || [];

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const result = await analyzeCreditScore(transactions, user);
      setAnalysisResult(result);
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreTheme = (score: number) => {
    if (score >= 700) return { color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100', label: 'Excellent', gradient: 'from-emerald-500 to-teal-400' };
    if (score >= 500) return { color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100', label: 'Fair', gradient: 'from-amber-500 to-orange-400' };
    return { color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-100', label: 'Low', gradient: 'from-rose-500 to-pink-400' };
  };

  const isPositiveInsight = (text: string) => {
    const positiveWords = ['consistent', 'growth', 'excellent', 'high', 'low risk', 'strong', 'regular', 'active', 'healthy', 'maintain', 'good'];
    const lowerText = text.toLowerCase();
    return positiveWords.some(word => lowerText.includes(word));
  };

  const handleRequestLoan = (type: 'nano' | 'business' | 'merchant') => {
    if (!analysisResult && type !== 'merchant') {
      alert("Please run the Eligibility Analyzer first!");
      return;
    }
    const defaultAmounts = { nano: 25000, business: 1500000, merchant: 500000 };
    setRequestModal({ type, amount: defaultAmounts[type] });
  };

  const completeLoanRequest = () => {
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setRequestModal(null);
    }, 3000);
  };

  const theme = analysisResult ? getScoreTheme(analysisResult.creditScore) : { color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', label: 'Unknown', gradient: 'from-purple-600 to-indigo-500' };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-300 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Loans & Credit Hub</h1>
          <p className="text-slate-500 font-medium">Get micro-credit or settle existing debts across {user.country}.</p>
        </div>
      </header>

      {/* AI Scoring Engine */}
      <section className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden relative">
        <div className={`absolute top-0 right-0 w-80 h-80 ${theme.bg} rounded-full -mr-40 -mt-40 blur-3xl opacity-30 transition-colors duration-700`}></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/3 space-y-8">
            <div className={`w-16 h-16 ${theme.bg} ${theme.color} rounded-2xl flex items-center justify-center shadow-lg transition-colors duration-700 ring-4 ring-white`}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 leading-tight">Eligibility Analyzer</h2>
              <p className="text-slate-500 mt-2 font-medium leading-relaxed text-sm">We use neural processing to scan your transaction velocity and social capital to determine your real-time borrowing power.</p>
            </div>
            <button 
              onClick={handleAnalyze}
              disabled={analyzing}
              className={`w-full ${analyzing ? 'bg-slate-300' : 'bg-slate-900'} text-white py-4.5 rounded-[1.8rem] font-black flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200`}
            >
              {analyzing ? (
                <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              )}
              <span>{analyzing ? 'Processing Data...' : 'Analyze My Score'}</span>
            </button>
          </div>

          <div className="lg:w-2/3">
            {analysisResult ? (
              <div className="bg-slate-50 rounded-[3rem] p-10 border border-slate-100 space-y-10 animate-in slide-in-from-right-6 duration-500 shadow-inner">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                  <div className="flex flex-col items-center">
                    <div className="relative w-64 h-64 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <defs>
                          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#9333ea" />
                            <stop offset="100%" stopColor="#4f46e5" />
                          </linearGradient>
                        </defs>
                        <circle cx="128" cy="128" r="110" stroke="#e2e8f0" strokeWidth="18" fill="transparent" />
                        <circle 
                          cx="128" cy="128" r="110" 
                          stroke="url(#scoreGrad)" 
                          strokeWidth="18" 
                          fill="transparent" 
                          strokeDasharray={690} 
                          strokeDashoffset={690 - (690 * (analysisResult.creditScore - 300)) / 550} 
                          strokeLinecap="round"
                          className="transition-all duration-1000 ease-out" 
                        />
                      </svg>
                      <div className="absolute text-center">
                        <span className="text-7xl font-black text-slate-900 tracking-tighter leading-none">{analysisResult.creditScore}</span>
                        <p className={`text-[10px] font-black ${theme.color} uppercase tracking-[0.2em] mt-3`}>{analysisResult.riskLevel} Risk</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Neural Insights</h3>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {analysisResult.keyObservations.map((obs: string, i: number) => {
                        const isGood = isPositiveInsight(obs);
                        return (
                          <div key={i} className={`p-5 rounded-2xl border flex items-start gap-4 transition-all ${isGood ? 'bg-emerald-50/50 border-emerald-100' : 'bg-rose-50/50 border-rose-100'}`}>
                            <div className={`mt-0.5 shrink-0 ${isGood ? 'text-emerald-500' : 'text-rose-500'}`}>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">{isGood ? <path d="M20 6 9 17l-5-5"/> : <path d="M12 8v4M12 16h.01"/><circle cx="12" cy="12" r="10"/>}</svg>
                            </div>
                            <p className={`text-xs font-bold leading-tight ${isGood ? 'text-emerald-800' : 'text-rose-800'}`}>{obs}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Growth Plan</h3>
                    <div className="bg-slate-900 text-white px-5 py-2.5 rounded-2xl flex items-center gap-2">
                       <span className="text-[9px] font-black text-slate-400 uppercase">Limit:</span>
                       <span className="font-black text-sm">{currencySymbol}{analysisResult.maxEligibleAmount.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analysisResult.improvementTips.map((tip: string, i: number) => {
                      const isPositive = isPositiveInsight(tip);
                      return (
                        <div key={i} className={`p-4 rounded-2xl border flex items-center gap-4 group transition-all cursor-default ${isPositive ? 'bg-emerald-50/30 border-emerald-50 hover:border-emerald-200' : 'bg-rose-50/30 border-rose-50 hover:border-rose-200'}`}>
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${isPositive ? 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white' : 'bg-rose-100 text-rose-600 group-hover:bg-rose-500 group-hover:text-white'}`}>
                             {isPositive ? (
                               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                             ) : (
                               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 9v4"/><path d="M12 17h.01"/><circle cx="12" cy="12" r="10"/></svg>
                             )}
                          </div>
                          <p className={`text-[11px] font-bold leading-tight ${isPositive ? 'text-emerald-700' : 'text-rose-700'}`}>{tip}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[450px] flex flex-col items-center justify-center text-center space-y-6 border-2 border-dashed border-slate-100 rounded-[3rem] bg-white/50">
                <div className="w-24 h-24 bg-white rounded-[2.5rem] shadow-xl flex items-center justify-center text-slate-200">
                   <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="12" r="3"/></svg>
                </div>
                <div className="max-w-xs">
                  <h3 className="font-black text-slate-800 text-2xl tracking-tight">Access Locked</h3>
                  <p className="text-slate-400 text-sm font-medium mt-2 leading-relaxed">Run a behavior analysis to unlock specialized loan offers from our partners.</p>
                </div>
                <button 
                  onClick={handleAnalyze}
                  className="bg-purple-600 text-white px-12 py-4 rounded-[1.8rem] font-black shadow-xl shadow-purple-100 hover:scale-105 active:scale-95 transition-all"
                >
                  Analyze My Account
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Offers Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black text-slate-800 px-4">Instant Capital Offers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { type: 'nano', title: 'PayFlow Nano', desc: 'Micro-credit for daily needs. Repay in 7-30 days.', color: 'purple' },
            { type: 'business', title: 'Venture Float', desc: 'Working capital for business inventory.', color: 'blue' },
            { type: 'merchant', title: 'Asset Finance', desc: 'Equipment and POS device financing.', color: 'emerald' }
          ].map((loan, idx) => (
            <div key={idx} className={`bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col group hover:border-${loan.color}-200 transition-all`}>
              <div className={`w-14 h-14 bg-${loan.color}-50 text-${loan.color}-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                 {loan.type === 'nano' && <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 14.75 15.3 3 13.5 10.25h6.7L8.7 21l1.8-7.25H4z"/></svg>}
                 {loan.type === 'business' && <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>}
                 {loan.type === 'merchant' && <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/></svg>}
              </div>
              <h3 className="font-black text-slate-800 text-xl mb-2">{loan.title}</h3>
              <p className="text-slate-500 text-sm mb-8 flex-1 font-medium leading-relaxed">{loan.desc}</p>
              <button 
                onClick={() => handleRequestLoan(loan.type as any)}
                className="bg-slate-900 text-white py-4 rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Repayment Hub */}
      <section className="bg-slate-900 rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600 rounded-full blur-[120px] -mr-32 -mt-32 opacity-40"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-purple-500/30">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></span>
                Regional Repayment Hub
              </div>
              <h2 className="text-3xl font-black tracking-tight">Settle External Debts</h2>
              <p className="text-slate-400 font-medium max-w-lg">Directly repay loans from active providers in {user.country} to maintain your global PayFlow credit score.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {providers.map((provider) => (
              <button 
                key={provider}
                onClick={() => setSelectedRepaymentProvider(provider)}
                className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] flex flex-col items-center justify-center text-center gap-4 hover:bg-white/10 hover:border-white/20 transition-all group active:scale-95"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                   <span className="font-black text-xl text-purple-400">{provider.charAt(0)}</span>
                </div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-300 group-hover:text-white transition-colors">{provider}</p>
                <div className="bg-purple-600 text-[9px] font-black uppercase px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">Pay Now</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Request Modal */}
      {requestModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[3.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            {isSuccess ? (
              <div className="text-center space-y-6 py-10">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6 9 17l-5-5"/></svg></div>
                <h2 className="text-3xl font-black text-slate-800">Funds Disbursed!</h2>
                <p className="text-slate-500 font-medium">Your wallet has been credited instantly.</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black text-slate-800">Apply for {requestModal.type.toUpperCase()}</h3>
                  <button onClick={() => setRequestModal(null)} className="p-2 hover:bg-slate-100 rounded-2xl transition-all text-slate-300 hover:text-slate-600"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
                </div>
                <div className="space-y-6">
                  <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Request Principal</p>
                    <p className="text-4xl font-black text-slate-800 tracking-tighter">{currencySymbol}{requestModal.amount.toLocaleString()}</p>
                    <p className="mt-4 text-[10px] font-black text-purple-600 uppercase tracking-[0.2em] bg-purple-50 px-3 py-1 rounded-lg w-fit">Interest: 4.5% Monthly</p>
                  </div>
                  <button onClick={completeLoanRequest} className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">Confirm & Accept Terms</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* External Repayment Modal */}
      {selectedRepaymentProvider && (
        <ServiceModal 
          isOpen={true} 
          onClose={() => setSelectedRepaymentProvider(null)} 
          serviceName="Loan Repayment"
          country={user.country}
          currency={user.currency}
          onComplete={(amt, name) => {
            if (onNewTransaction) {
              onNewTransaction(amt, `Loan Repayment: ${selectedRepaymentProvider}`, 'Loan Repayment');
            } else {
              alert(`Repayment of ${currencySymbol}${amt.toLocaleString()} processed for ${selectedRepaymentProvider}.`);
            }
            setSelectedRepaymentProvider(null);
          }}
        />
      )}
    </div>
  );
};

export default LoansPage;
