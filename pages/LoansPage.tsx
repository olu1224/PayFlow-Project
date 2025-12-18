
import React, { useState } from 'react';
import { User, Transaction } from '../types';
import { analyzeCreditScore } from '../geminiService';

const LoansPage: React.FC<{ user: User; transactions: Transaction[] }> = ({ user, transactions }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [requestModal, setRequestModal] = useState<{ type: 'nano' | 'business' | 'merchant', amount: number } | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const currencySymbol = user.currency === 'NGN' ? '₦' : user.currency === 'GHS' ? 'GH₵' : 'CFA';

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
    if (score >= 700) return { color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100', accent: 'emerald' };
    if (score >= 500) return { color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100', accent: 'amber' };
    return { color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-100', accent: 'rose' };
  };

  const handleRequestLoan = (type: 'nano' | 'business' | 'merchant') => {
    if (!analysisResult && type !== 'merchant') {
      alert("Please run the Eligibility Analyzer first!");
      return;
    }
    
    if (type === 'business' && analysisResult.creditScore < 700) {
      alert("Your AI Credit Score is currently below the 700 threshold for Business Expansion loans. Pay more bills on time to improve your score!");
      return;
    }

    if (type === 'nano' && analysisResult.creditScore < 400) {
      alert("Your risk level is too high for a loan. Start by paying small bills through PayFlow to build your credit history.");
      return;
    }

    if (type === 'merchant' && user.balance < 100000) {
      alert("Merchant credit is for active sellers. Maintain a higher account turnover to qualify.");
      return;
    }

    const defaultAmounts = {
      nano: 25000,
      business: 1500000,
      merchant: 500000
    };

    setRequestModal({ type, amount: defaultAmounts[type] });
  };

  const completeLoanRequest = () => {
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setRequestModal(null);
    }, 3000);
  };

  const hasPriorLoans = transactions.some(t => t.category.toLowerCase().includes('loan'));
  const theme = analysisResult ? getScoreTheme(analysisResult.creditScore) : { color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', accent: 'purple' };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-300">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Loans & Credit</h1>
          <p className="text-slate-500 font-medium">Access quick credit based on your transaction behavior.</p>
        </div>
        {!hasPriorLoans && (
          <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl flex items-center gap-2">
            <span className="text-amber-600 animate-pulse">●</span>
            <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">First Time User: High Risk Profile</span>
          </div>
        )}
      </header>

      <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden relative">
        <div className={`absolute top-0 right-0 w-64 h-64 ${theme.bg} rounded-full -mr-32 -mt-32 blur-3xl opacity-50 transition-colors duration-700`}></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/3 space-y-6">
            <div className={`w-16 h-16 ${theme.bg} ${theme.color} rounded-2xl flex items-center justify-center shadow-lg transition-colors duration-700`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 leading-tight">AI Eligibility Engine</h2>
              <p className="text-slate-500 mt-2 font-medium">Our AI assesses your bill payment history, prior loans, and spending to calculate a real-time Pan-African credit score.</p>
            </div>
            <button 
              onClick={handleAnalyze}
              disabled={analyzing}
              className={`w-full ${analyzing ? 'bg-slate-300' : 'bg-slate-900'} text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200`}
            >
              {analyzing ? (
                <>
                  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span>Analyzing Growth Data...</span>
                </>
              ) : (
                <>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  <span>Assess My Credit</span>
                </>
              )}
            </button>
          </div>

          <div className="lg:w-2/3">
            {analysisResult ? (
              <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 space-y-8 animate-in slide-in-from-right-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="flex flex-col items-center">
                    <div className="relative w-48 h-48 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="96" cy="96" r="82" stroke="currentColor" strokeWidth="14" fill="transparent" className="text-slate-200" />
                        <circle 
                          cx="96" cy="96" r="82" stroke="currentColor" strokeWidth="14" fill="transparent" 
                          strokeDasharray={515} 
                          strokeDashoffset={515 - (515 * analysisResult.creditScore) / 850} 
                          strokeLinecap="round"
                          className={`${theme.color} transition-all duration-1000 ease-out`} 
                        />
                      </svg>
                      <div className="absolute text-center">
                        <span className="text-5xl font-black text-slate-800 leading-none">{analysisResult.creditScore}</span>
                        <p className={`text-[10px] font-black ${theme.color} uppercase tracking-widest mt-1`}>AI Credit Rating</p>
                      </div>
                    </div>
                    <div className={`mt-6 inline-flex items-center gap-2 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      analysisResult.riskLevel.toLowerCase() === 'low' ? 'bg-emerald-100 text-emerald-700' :
                      analysisResult.riskLevel.toLowerCase() === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                       <div className={`w-2 h-2 rounded-full animate-pulse ${
                         analysisResult.riskLevel.toLowerCase() === 'low' ? 'bg-emerald-500' :
                         analysisResult.riskLevel.toLowerCase() === 'medium' ? 'bg-amber-500' : 'bg-rose-500'
                       }`}></div>
                       {analysisResult.riskLevel} Risk Profile
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Health Indicators</h3>
                    <div className="space-y-3">
                      {analysisResult.keyObservations.map((obs: string, idx: number) => {
                        const isPositive = !obs.toLowerCase().includes('low') && !obs.toLowerCase().includes('risk') && !obs.toLowerCase().includes('no');
                        return (
                          <div key={idx} className={`p-4 rounded-2xl border flex items-start gap-3 transition-all ${
                            isPositive ? 'bg-emerald-50/50 border-emerald-100' : 'bg-rose-50/50 border-rose-100'
                          }`}>
                            <div className={`mt-0.5 ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                              {isPositive ? (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg>
                              ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
                              )}
                            </div>
                            <p className="text-xs font-bold text-slate-700 leading-tight">{obs}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Improvement Strategy</h3>
                    <span className="text-sm font-black text-slate-900">Eligible: {currencySymbol}{analysisResult.maxEligibleAmount.toLocaleString()}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analysisResult.improvementTips.map((tip: string, idx: number) => (
                      <div key={idx} className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex items-center gap-4 group hover:border-purple-200 transition-all">
                        <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-purple-50 group-hover:text-purple-600 transition-all">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                        </div>
                        <p className="text-[11px] font-bold text-slate-600 leading-tight">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center space-y-6 border-2 border-dashed border-slate-100 rounded-[2.5rem] bg-white/50">
                <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center relative">
                   <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                   <div className="absolute inset-0 border-4 border-slate-50 rounded-full animate-ping opacity-20"></div>
                </div>
                <div className="max-w-xs">
                  <h3 className="font-black text-slate-400 text-xl tracking-tight">Financial Health Check</h3>
                  <p className="text-slate-300 text-sm font-medium mt-2 leading-relaxed">Your Pan-African credit score is calculated using real-time bill payment and loan behavior. Click "Assess My Credit" to begin.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col group hover:border-purple-200 transition-all">
          <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
             <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 14.75 15.3 3 13.5 10.25h6.7L8.7 21l1.8-7.25H4z"/></svg>
          </div>
          <h3 className="font-black text-slate-800 text-xl mb-2">Quick Nano Loan</h3>
          <p className="text-slate-500 text-sm mb-8 flex-1 font-medium">Instant approval for small emergencies. Ideal for users building their first credit line through bill payments.</p>
          <button 
            onClick={() => handleRequestLoan('nano')}
            className="bg-slate-900 text-white py-4 rounded-2xl font-black text-sm hover:bg-purple-600 transition-all shadow-lg shadow-slate-200 group-hover:shadow-purple-100"
          >
            Request Now
          </button>
        </div>
        
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col group hover:border-blue-200 transition-all">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
             <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          </div>
          <h3 className="font-black text-slate-800 text-xl mb-2">Business Expansion</h3>
          <p className="text-slate-500 text-sm mb-8 flex-1 font-medium">Higher capital for enterprise growth. Requires a Low Risk Profile (Score {'>'} 700) and prior history.</p>
          <button 
            onClick={() => handleRequestLoan('business')}
            className="bg-slate-900 text-white py-4 rounded-2xl font-black text-sm hover:bg-blue-600 transition-all shadow-lg shadow-slate-200 group-hover:shadow-blue-100"
          >
            Get Offer
          </button>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col group hover:border-emerald-200 transition-all">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
             <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
          </div>
          <h3 className="font-black text-slate-800 text-xl mb-2">Merchant Credit</h3>
          <p className="text-slate-500 text-sm mb-8 flex-1 font-medium">Revolving credit line for active businesses. Access inventory financing based on your sales volume.</p>
          <button 
            onClick={() => handleRequestLoan('merchant')}
            className="bg-slate-900 text-white py-4 rounded-2xl font-black text-sm hover:bg-emerald-600 transition-all shadow-lg shadow-slate-200 group-hover:shadow-emerald-100"
          >
            Activate Credit
          </button>
        </div>
      </section>

      {requestModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden relative">
            {isSuccess ? (
              <div className="text-center space-y-6 py-10 animate-in fade-in duration-500">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                   <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <h2 className="text-3xl font-black text-slate-800">Approved!</h2>
                <p className="text-slate-500 font-medium">Funds will be disbursed to your {user.currency} wallet instantly.</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black text-slate-800">Loan Request</h3>
                  <button onClick={() => setRequestModal(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Requested Amount</p>
                    <p className="text-4xl font-black text-slate-800">{currencySymbol}{requestModal.amount.toLocaleString()}</p>
                    <div className="flex items-center gap-2 mt-4 text-[10px] font-black text-purple-600 uppercase tracking-widest bg-purple-50 w-fit px-3 py-1 rounded-full">
                       Interest Rate: 5% Monthly
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between text-sm font-bold text-slate-700">
                      <span>Processing Fee</span>
                      <span>{currencySymbol}0.00</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-slate-700">
                      <span>Disbursement Time</span>
                      <span>Instant</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-slate-700">
                      <span>Repayment Term</span>
                      <span>30 Days</span>
                    </div>
                  </div>

                  <button 
                    onClick={completeLoanRequest}
                    className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black hover:bg-purple-600 transition-all shadow-xl shadow-slate-200 mt-4"
                  >
                    Confirm & Disburse
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoansPage;
