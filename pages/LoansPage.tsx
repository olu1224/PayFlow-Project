
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
    if (score >= 700) return { color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100', label: 'Elite', gradient: ['#10b981', '#059669'], glow: 'shadow-emerald-500/20' };
    if (score >= 500) return { color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100', label: 'Prime', gradient: ['#f59e0b', '#d97706'], glow: 'shadow-amber-500/20' };
    return { color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-100', label: 'Subprime', gradient: ['#f43f5e', '#e11d48'], glow: 'shadow-rose-500/20' };
  };

  const getInsightCategory = (text: string) => {
    const lower = text.toLowerCase();
    const positive = ['consistent', 'growth', 'excellent', 'high', 'low risk', 'strong', 'regular', 'active', 'healthy', 'maintain', 'good', 'success', 'reliable'];
    const negative = ['risk', 'high risk', 'limited', 'missed', 'default', 'low', 'unstable', 'shortage', 'first-time', 'missing', 'insufficient'];
    
    if (positive.some(word => lower.includes(word))) return 'positive';
    if (negative.some(word => lower.includes(word))) return 'negative';
    return 'neutral';
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

  const theme = analysisResult ? getScoreTheme(analysisResult.creditScore) : { color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', label: 'Unknown', gradient: ['#9333ea', '#7c3aed'], glow: 'shadow-purple-500/20' };

  // Gauge constants
  const radius = 100;
  const strokeWidth = 14;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const arcLength = circumference * 0.75; // 270 degree arc
  const scorePercent = analysisResult ? (analysisResult.creditScore - 300) / 550 : 0;
  const strokeDashoffset = arcLength - scorePercent * arcLength;

  return (
    <div className="max-w-[1200px] mx-auto space-y-12 animate-in fade-in duration-500 pb-20 px-4">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-[1000] text-slate-900 tracking-tight leading-none">Credit Terminal</h1>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">Regional Liquidity Node • {user.country}</p>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
           <div className="px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-400">Repayment Mode</div>
        </div>
      </header>

      {/* AI Scoring Engine */}
      <section className="bg-white p-8 md:p-12 rounded-[4rem] border border-slate-100 shadow-2xl relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-[500px] h-[500px] ${theme.bg} rounded-full -mr-64 -mt-64 blur-[120px] opacity-20 transition-colors duration-1000`}></div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4 space-y-10">
            <div className="space-y-4">
              <div className={`w-14 h-14 ${theme.bg} ${theme.color} rounded-2xl flex items-center justify-center shadow-xl transition-colors duration-700 ring-4 ring-white`}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
              </div>
              <h2 className="text-3xl font-black text-slate-900 leading-tight">Gemini Neural Scoring</h2>
              <p className="text-slate-500 font-medium leading-relaxed">Our AI scans your settlement history across Nigeria, Ghana, and Senegal to calculate your instant borrowing potential.</p>
            </div>
            
            <button 
              onClick={handleAnalyze}
              disabled={analyzing}
              className={`w-full ${analyzing ? 'bg-slate-200 text-slate-400' : 'bg-slate-900 text-white'} py-5 rounded-[2rem] font-black flex items-center justify-center gap-4 hover:bg-purple-600 transition-all shadow-2xl active:scale-95 text-xs uppercase tracking-[0.2em] group`}
            >
              {analyzing ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="group-hover:rotate-12 transition-transform"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              )}
              <span>{analyzing ? 'Calibrating Node...' : 'Analyze My Power'}</span>
            </button>

            <div className="pt-6 border-t border-slate-50">
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Security Protocol: AES-256 Cloud Settlement</span>
               </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            {analysisResult ? (
              <div className="bg-slate-50/50 rounded-[3.5rem] p-10 border border-slate-100 space-y-12 animate-in slide-in-from-bottom-8 duration-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div className="flex flex-col items-center">
                    <div className="relative w-64 h-64 flex items-center justify-center">
                      {/* Glow Layer */}
                      <div className={`absolute inset-0 rounded-full blur-3xl opacity-20 ${theme.bg}`}></div>
                      
                      <svg width={radius * 2} height={radius * 2} className="transform -rotate-[225deg] relative z-10">
                        <defs>
                          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={theme.gradient[0]} />
                            <stop offset="100%" stopColor={theme.gradient[1]} />
                          </linearGradient>
                          <filter id="shadow">
                             <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={theme.gradient[0]} floodOpacity="0.5"/>
                          </filter>
                        </defs>
                        {/* Background track */}
                        <circle
                          cx={radius}
                          cy={radius}
                          r={normalizedRadius}
                          fill="transparent"
                          stroke="#eef2f6"
                          strokeWidth={strokeWidth}
                          strokeDasharray={circumference}
                          style={{ strokeDashoffset: circumference * 0.25 }}
                          strokeLinecap="round"
                        />
                        {/* Colored gauge with animation */}
                        <circle
                          cx={radius}
                          cy={radius}
                          r={normalizedRadius}
                          fill="transparent"
                          stroke="url(#gaugeGrad)"
                          strokeWidth={strokeWidth}
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset + (circumference * 0.25)}
                          strokeLinecap="round"
                          filter="url(#shadow)"
                          className="transition-all duration-[2000ms] ease-out-expo"
                        />
                      </svg>
                      
                      <div className="absolute flex flex-col items-center justify-center text-center mt-4">
                        <span className="text-8xl font-[1000] text-slate-900 tracking-tighter leading-none">{analysisResult.creditScore}</span>
                        <div className={`mt-4 px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${theme.bg} ${theme.color} border border-current/10 shadow-lg`}>
                          {theme.label} Rating
                        </div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-3">Identity Node Score</p>
                      </div>

                      {/* Markers */}
                      <div className="absolute inset-0 pointer-events-none opacity-20">
                         <div className="absolute bottom-4 left-4 text-[9px] font-black text-slate-400 uppercase rotate-45">300</div>
                         <div className="absolute bottom-4 right-4 text-[9px] font-black text-slate-400 uppercase -rotate-45">850</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-1">
                      <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Grid Observations</h3>
                      <p className="text-slate-400 font-bold text-xs">AI-synthesized behavioral insights</p>
                    </div>
                    
                    <div className="space-y-4 max-h-[320px] overflow-y-auto pr-3 custom-scrollbar">
                      {analysisResult.keyObservations.map((obs: string, i: number) => {
                        const category = getInsightCategory(obs);
                        const styles = {
                          positive: 'bg-white border-emerald-100 text-emerald-600 border-l-4 border-l-emerald-500',
                          negative: 'bg-white border-rose-100 text-rose-600 border-l-4 border-l-rose-500',
                          neutral: 'bg-white border-amber-100 text-amber-600 border-l-4 border-l-amber-500'
                        }[category];

                        return (
                          <div key={i} className={`p-6 rounded-2xl border shadow-sm transition-all hover:translate-x-1 ${styles}`}>
                            <div className="flex items-start gap-4">
                              <div className="mt-0.5 shrink-0">
                                {category === 'positive' ? (
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6 9 17l-5-5"/></svg>
                                ) : category === 'negative' ? (
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M12 8v4M12 16h.01"/><circle cx="12" cy="12" r="10"/></svg>
                                ) : (
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                )}
                              </div>
                              <p className="text-[13px] font-black leading-snug group-hover:tracking-tight">
                                {obs}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-10 border-t border-slate-200">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 px-2">
                    <div className="space-y-1">
                      <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Strategic Upgrades</h3>
                      <p className="text-slate-400 font-bold text-xs italic">Steps to bypass current capital limits</p>
                    </div>
                    <div className="bg-slate-900 text-white px-8 py-3 rounded-2xl flex items-center gap-4 shadow-2xl border border-white/10 group overflow-hidden relative">
                       <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest relative z-10">Assigned Limit:</span>
                       <span className="font-[1000] text-xl relative z-10 tracking-tighter">{currencySymbol}{analysisResult.maxEligibleAmount.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {analysisResult.improvementTips.map((tip: string, i: number) => {
                      const category = getInsightCategory(tip);
                      const isPositive = category === 'positive';
                      const colorClass = isPositive ? 'emerald' : 'amber';
                      
                      return (
                        <div key={i} className={`p-6 rounded-[2rem] bg-white border border-slate-100 flex flex-col gap-4 group transition-all hover:border-${colorClass}-500 shadow-sm`}>
                          <div className="flex items-center justify-between">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${isPositive ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white' : 'bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white'}`}>
                               {isPositive ? (
                                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                               ) : (
                                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M12 9v4"/><path d="M12 17h.01"/><circle cx="12" cy="12" r="10"/></svg>
                               )}
                            </div>
                            <span className={`text-[8px] font-black uppercase text-slate-300 tracking-[0.2em]`}>Level 1 Task</span>
                          </div>
                          
                          <div className="space-y-4">
                            <p className={`text-[12px] font-black leading-tight text-slate-800`}>{tip}</p>
                            <div className="space-y-1.5">
                               <div className="flex justify-between text-[8px] font-black uppercase text-slate-400">
                                  <span>Task completion</span>
                                  <span className={`text-${colorClass}-500`}>Pending</span>
                               </div>
                               <div className="h-1 bg-slate-50 rounded-full overflow-hidden">
                                  <div className={`h-full bg-${colorClass}-500 w-[5%] group-hover:w-[15%] transition-all duration-1000`}></div>
                               </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center space-y-8 border-4 border-dashed border-slate-50 rounded-[4rem] bg-white group hover:border-purple-100 transition-all duration-500">
                <div className="relative">
                  <div className="w-28 h-28 bg-slate-50 rounded-[2.5rem] shadow-inner flex items-center justify-center text-slate-200 group-hover:scale-110 group-hover:text-purple-200 transition-all duration-700">
                     <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="12" r="3"/></svg>
                  </div>
                  <div className="absolute -right-2 -bottom-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-slate-300 border border-slate-50">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  </div>
                </div>
                <div className="max-w-xs space-y-2">
                  <h3 className="font-[1000] text-slate-800 text-3xl tracking-tighter">Terminal Idle</h3>
                  <p className="text-slate-400 text-sm font-bold leading-relaxed">Initialize a behavior analysis to unlock specialized regional liquidity pools.</p>
                </div>
                <button 
                  onClick={handleAnalyze}
                  className="bg-slate-900 text-white px-14 py-5 rounded-[2rem] font-[1000] text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:bg-purple-600 hover:scale-[1.05] active:scale-95 transition-all"
                >
                  Authorize Full Scan
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Offers Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 px-2">
          <h2 className="text-2xl font-[1000] text-slate-900 tracking-tight">Active Liquidity Pools</h2>
          <div className="h-1 flex-1 bg-slate-50 rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { type: 'nano', title: 'PayFlow Nano', desc: 'Instant micro-credit for essential utility settlements. Term: 7-30 days.', color: 'purple' },
            { type: 'business', title: 'Merchant Float', desc: 'Working capital to scale business inventory across the grid.', color: 'indigo' },
            { type: 'merchant', title: 'Asset Forge', desc: 'Enterprise-grade equipment and infrastructure financing.', color: 'emerald' }
          ].map((loan, idx) => (
            <div key={idx} className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm flex flex-col group hover:border-purple-600 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity -mr-10 -mt-10`}></div>
              <div className={`w-16 h-16 bg-slate-50 text-slate-400 group-hover:bg-slate-950 group-hover:text-white rounded-[1.8rem] flex items-center justify-center mb-8 transition-all duration-500 shadow-inner group-hover:rotate-6`}>
                 {loan.type === 'nano' && <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 14.75 15.3 3 13.5 10.25h6.7L8.7 21l1.8-7.25H4z"/></svg>}
                 {loan.type === 'business' && <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>}
                 {loan.type === 'merchant' && <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/></svg>}
              </div>
              <h3 className="font-black text-slate-900 text-2xl mb-3 tracking-tight">{loan.title}</h3>
              <p className="text-slate-500 text-sm mb-10 flex-1 font-medium leading-relaxed">{loan.desc}</p>
              <button 
                onClick={() => handleRequestLoan(loan.type as any)}
                className="bg-slate-950 text-white py-5 rounded-[1.8rem] font-[1000] text-[10px] uppercase tracking-[0.2em] hover:bg-purple-600 transition-all shadow-xl active:scale-95"
              >
                Apply for Entry
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Repayment Hub */}
      <section className="bg-slate-950 rounded-[4rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600 rounded-full blur-[200px] -mr-64 -mt-64 opacity-20 group-hover:opacity-30 transition-all duration-[3s]"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/5 text-purple-400 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-white/5 backdrop-blur-md">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                Universal Settlement Hub
              </div>
              <h2 className="text-4xl md:text-6xl font-[1000] tracking-tighter leading-none">Settle <span className="text-purple-400">External Debt</span></h2>
              <p className="text-slate-400 font-medium text-xl max-w-xl leading-relaxed">Bridge your local commitments. Directly repay loans from any registered provider in {user.country} to maintain a flawless credit identity.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {providers.map((provider) => (
              <button 
                key={provider}
                onClick={() => setSelectedRepaymentProvider(provider)}
                className="bg-white/5 border border-white/5 p-8 rounded-[3rem] flex flex-col items-center justify-center text-center gap-6 hover:bg-white/10 hover:border-white/10 transition-all group active:scale-95 hover:-translate-y-1"
              >
                <div className="w-16 h-16 rounded-[1.8rem] bg-white/5 flex items-center justify-center group-hover:bg-purple-600 group-hover:scale-110 transition-all duration-500 shadow-inner">
                   <span className="font-black text-2xl text-white/40 group-hover:text-white">{provider.charAt(0)}</span>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">{provider}</p>
                   <div className="bg-purple-500/20 text-purple-400 text-[8px] font-black uppercase px-3 py-1 rounded-full opacity-60 group-hover:opacity-100 transition-opacity">Active Node</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Request Modal */}
      {requestModal && (
        <div className="fixed inset-0 z-[150] bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[4rem] p-10 md:p-14 shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden border border-white relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full -mr-16 -mt-16 blur-2xl opacity-50"></div>
            
            {isSuccess ? (
              <div className="text-center space-y-8 py-10 animate-in slide-in-from-bottom-4">
                <div className="w-28 h-28 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner"><svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6 9 17l-5-5"/></svg></div>
                <div className="space-y-2">
                   <h2 className="text-4xl font-[1000] text-slate-900 tracking-tighter">Funds Injected</h2>
                   <p className="text-slate-500 font-bold text-lg">Your regional ledger has been updated.</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-10 relative z-10">
                  <div className="space-y-1">
                    <h3 className="text-3xl font-[1000] text-slate-900 tracking-tighter leading-none">{requestModal.type.toUpperCase()}</h3>
                    <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest">Protocol Initiation</p>
                  </div>
                  <button onClick={() => setRequestModal(null)} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-all"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
                </div>
                
                <div className="space-y-10 relative z-10">
                  <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 space-y-2 text-center shadow-inner">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Request Principal</p>
                    <p className="text-6xl font-[1000] text-slate-900 tracking-[-0.05em]">{currencySymbol}{requestModal.amount.toLocaleString()}</p>
                    <div className="inline-flex mt-6 bg-purple-600 text-white px-5 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-purple-500/20">Interest: 4.5% Fixed</div>
                  </div>
                  
                  <div className="space-y-4">
                     <p className="text-center text-[10px] font-bold text-slate-400 leading-relaxed max-w-xs mx-auto">By authorizing, you agree to the regional financial data sharing protocols.</p>
                     <button onClick={completeLoanRequest} className="w-full bg-slate-900 text-white py-6 rounded-[2.2rem] font-[1000] text-xs uppercase tracking-[0.25em] hover:bg-purple-600 transition-all shadow-2xl active:scale-95">Authorize Injection</button>
                  </div>
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
          serviceName="External Repayment"
          country={user.country}
          currency={user.currency}
          onComplete={(amt, name) => {
            if (onNewTransaction) {
              onNewTransaction(-amt, `Repayment: ${selectedRepaymentProvider}`, 'Settlement');
            } else {
              alert(`Repayment of ${currencySymbol}${amt.toLocaleString()} processed for ${selectedRepaymentProvider}.`);
            }
            setSelectedRepaymentProvider(null);
          }}
        />
      )}
      
      <style>{`
        .ease-out-expo {
          transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
};

export default LoansPage;
