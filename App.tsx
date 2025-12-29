
import React, { useState, useEffect } from 'react';
import TopBar from './components/TopBar';
import MobileNav from './components/MobileNav';
import Dashboard from './pages/Dashboard';
import CryptoHub from './pages/CryptoHub';
import LoansPage from './pages/LoansPage';
import BudgetPage from './pages/BudgetPage';
import History from './pages/History';
import Beneficiaries from './pages/Beneficiaries';
import Settings from './pages/Settings';
import AboutPage from './pages/AboutPage';
import InvestmentPortfolio from './pages/InvestmentPortfolio';
import NearbyHub from './pages/NearbyHub';
import B2BPortal from './pages/B2BPortal';
import Membership from './pages/Membership';
import AiAgentsPage from './pages/AiAgentsPage';
import DealForge from './pages/DealForge';
import Onboarding from './pages/Onboarding';
import SecurityLock from './components/SecurityLock';
import AIChat from './components/AIChat';
import VoiceAssistant from './components/VoiceAssistant';
import { User, Country, Currency, Transaction, Beneficiary, BudgetGoal, CryptoAsset, AIAgent, RecurringPayment } from './types';
import { t } from './localization';

export interface Trade {
  id: string;
  asset: string;
  amount: number;
  priceUsd: number;
  type: 'buy' | 'sell' | 'withdraw';
  date: string;
  address?: string;
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('zynctra_user_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [isLocked, setIsLocked] = useState(() => {
    const lastUnlock = localStorage.getItem('zynctra_last_unlock');
    if (!lastUnlock) return true;
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    return (now - parseInt(lastUnlock)) > twentyFourHours;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recurringPayments, setRecurringPayments] = useState<RecurringPayment[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [goals, setGoals] = useState<BudgetGoal[]>([]);
  const [portfolio, setPortfolio] = useState<CryptoAsset[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [agents, setAgents] = useState<AIAgent[]>([]);

  useEffect(() => {
    if (!user) return;
    const uid = user.uid;
    const loadData = <T,>(key: string, defaultValue: T): T => {
      const saved = localStorage.getItem(`zynctra_${uid}_${key}`);
      return saved ? JSON.parse(saved) : defaultValue;
    };
    setTransactions(loadData('txs', []));
    setRecurringPayments(loadData('recurring', []));
    setBeneficiaries(loadData('beneficiaries', []));
    setGoals(loadData('goals', []));
    setPortfolio(loadData('portfolio', [
      { id: 'btc', name: 'Bitcoin', symbol: 'BTC', amount: 0.45, valueUsd: 42350 },
      { id: 'eth', name: 'Ethereum', symbol: 'ETH', amount: 2.1, valueUsd: 2240 },
      { id: 'usdt', name: 'Tether', symbol: 'USDT', amount: 1500, valueUsd: 1 },
    ]));
    setTrades(loadData('trades', []));
    setAgents(loadData('agents', []));
  }, [user?.uid]);

  useEffect(() => {
    if (!user) return;
    const uid = user.uid;
    localStorage.setItem(`zynctra_${uid}_txs`, JSON.stringify(transactions));
    localStorage.setItem(`zynctra_${uid}_trades`, JSON.stringify(trades));
    localStorage.setItem(`zynctra_${uid}_portfolio`, JSON.stringify(portfolio));
    localStorage.setItem(`zynctra_${uid}_goals`, JSON.stringify(goals));
    localStorage.setItem(`zynctra_${uid}_beneficiaries`, JSON.stringify(beneficiaries));
    localStorage.setItem(`zynctra_${uid}_agents`, JSON.stringify(agents));
  }, [transactions, trades, portfolio, goals, beneficiaries, agents, user?.uid]);

  const calculateServiceFee = (amount: number) => {
    if (!user) return 0;
    if (user.creditScore >= 700) return 0;
    if (amount < 0) {
      const fee = Math.max(100, Math.abs(amount) * 0.015);
      return fee;
    }
    return 0;
  };

  const handleOnboardingComplete = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('zynctra_user_session', JSON.stringify(newUser));
    localStorage.setItem('zynctra_last_unlock', Date.now().toString());
    setIsLocked(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('zynctra_user_session');
    localStorage.removeItem('zynctra_last_unlock');
    setUser(null);
    setIsLocked(true);
    setActiveTab('dashboard');
  };

  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);

  const switchCountry = (country: Country) => {
    if (!user) return;
    let curr: Currency = country === 'Ghana' ? 'GHS' : country === 'Senegal' ? 'XOF' : 'NGN';
    const updated = { ...user, country, currency: curr };
    setUser(updated);
    localStorage.setItem('zynctra_user_session', JSON.stringify(updated));
  };

  const handleUpdateSecurity = (updates: Partial<User['security']>) => {
    if (!user) return;
    const updated = { ...user, security: { ...user.security, ...updates } };
    setUser(updated);
    localStorage.setItem('zynctra_user_session', JSON.stringify(updated));
  };

  const handleUpdateWealth = (updates: Partial<User['wealth']>) => {
    if (!user) return;
    const updated = { 
      ...user, 
      wealth: { 
        ...(user.wealth || { 
          emergencyFund: { tier1: 0, tier2: 0, target: 250000 }, 
          dollarFund: { balanceUsd: 0, investedNaira: 0 }, 
          connectedPlatforms: [] 
        }), 
        ...updates 
      } 
    };
    setUser(updated);
    localStorage.setItem('zynctra_user_session', JSON.stringify(updated));
  };

  const handleUpdateGoal = (goalId: string, amount: number) => {
    setGoals(prev => prev.map(g => g.id === goalId ? { ...g, current: g.current + amount } : g));
  };

  const handleNewTransaction = (amount: number, name: string, category: string = 'General', isRecurring: boolean = false, schedule?: any) => {
    if (!user) return;
    
    if (isRecurring && schedule) {
      setRecurringPayments([{ id: Math.random().toString(36).substr(2, 9), name, amount: Math.abs(amount), frequency: schedule.freq as any, startDate: schedule.date, category, active: true }, ...recurringPayments]);
      return;
    }

    const fee = calculateServiceFee(amount);
    const totalDeduction = amount - fee;

    if (user.balance < Math.abs(totalDeduction)) {
      alert(`Insufficient balance. Transaction: ${Math.abs(amount)}, Service Fee: ${fee}`);
      return;
    }

    const newTx: Transaction = { 
      id: Math.random().toString(36).substr(2, 9), 
      name, 
      category, 
      amount: Math.abs(amount), 
      date: 'Just now', 
      status: 'completed', 
      type: amount < 0 ? 'debit' : 'credit' 
    };

    setTransactions([newTx, ...transactions]);
    setUser(prev => prev ? ({ ...prev, balance: prev.balance + totalDeduction }) : null);
    
    if (fee > 0) {
      const feeTx: Transaction = {
        id: 'fee_' + Math.random().toString(36).substr(2, 5),
        name: `Service Fee: ${name}`,
        category: 'Service Fee',
        amount: fee,
        date: 'Just now',
        status: 'completed',
        type: 'debit'
      };
      setTransactions(prev => [feeTx, ...prev]);
    }
  };

  const handleDeposit = (amount: number, method: string) => {
    if (!user) return;
    const newTx: Transaction = { 
      id: Math.random().toString(36).substr(2, 9), 
      name: `Money Added (${method})`, 
      category: 'Deposit', 
      amount, 
      date: 'Just now', 
      status: 'completed', 
      type: 'credit',
      method 
    };
    setTransactions([newTx, ...transactions]);
    setUser(prev => prev ? ({ ...prev, balance: prev.balance + amount }) : null);
  };

  const handleTrade = (assetId: string, amount: number, priceUsd: number, isBuy: boolean) => {
    if (!user) return;
    const rate = user.currency === 'NGN' ? 1550 : user.currency === 'GHS' ? 12 : 610;
    const totalLocal = amount * priceUsd * rate;
    const tradeFee = user.creditScore >= 700 ? 0 : totalLocal * 0.01;

    if (isBuy && user.balance < (totalLocal + tradeFee)) return alert("You don't have enough money for this trade.");
    
    setPortfolio(prev => prev.map(a => a.id === assetId ? { ...a, amount: isBuy ? a.amount + amount : a.amount - amount } : a));
    setUser(prev => prev ? ({ ...prev, balance: isBuy ? prev.balance - (totalLocal + tradeFee) : prev.balance + (totalLocal - tradeFee) }) : null);
    
    const tradeId = `t-${Date.now()}`;
    setTrades([{ id: tradeId, asset: assetId.toUpperCase(), amount, priceUsd, type: isBuy ? 'buy' : 'sell', date: 'Just now' }, ...trades]);
    
    if (tradeFee > 0) {
      handleNewTransaction(-tradeFee, `Trade Fee: ${assetId.toUpperCase()} ${isBuy ? 'Buy' : 'Sell'}`, 'Service Fee');
    }
  };

  const handleWithdrawCrypto = (assetId: string, amount: number, address: string, priceUsd: number) => {
    const asset = portfolio.find(a => a.id === assetId);
    if (!asset || asset.amount < amount) return alert(`Insufficient ${assetId.toUpperCase()} balance.`);
    setPortfolio(prev => prev.map(a => a.id === assetId ? { ...a, amount: a.amount - amount } : a));
    setTrades([{ id: `tw-${Date.now()}`, asset: assetId.toUpperCase(), amount, priceUsd, type: 'withdraw', address, date: 'Just now' }, ...trades]);
  };

  const renderContent = () => {
    if (!user) return null;
    switch (activeTab) {
      case 'dashboard': return <Dashboard user={user} transactions={transactions} onNewTransaction={handleNewTransaction} onDeposit={handleDeposit} onWithdraw={(amt) => setUser(prev => prev ? {...prev, balance: prev.balance - amt} : null)} onExplorePlanning={() => setActiveTab('money-hub')} onNearbyClick={() => setActiveTab('nearby')} onTabChange={setActiveTab} onUpdateSecurity={handleUpdateSecurity} />;
      case 'history': return <History user={user} transactions={transactions} />;
      case 'loans': return <LoansPage user={user} transactions={transactions} onNewTransaction={handleNewTransaction} />;
      case 'crypto': return <CryptoHub user={user} portfolio={portfolio} trades={trades} onTrade={handleTrade} onWithdrawCrypto={handleWithdrawCrypto} />;
      case 'investment-portfolio': return <InvestmentPortfolio user={user} />;
      case 'money-hub': return <BudgetPage user={user} goals={goals} onAddGoal={(g) => setGoals([...goals, { ...g, id: Date.now().toString() }])} onUpdateGoal={handleUpdateGoal} onNewTransaction={handleNewTransaction} onUpdateUserWealth={handleUpdateWealth} />;
      case 'b2b': return <B2BPortal user={user} onNewTransaction={handleNewTransaction} />;
      case 'nearby': return <NearbyHub user={user} />;
      case 'settings': return <Settings user={user} onUpdateCountry={switchCountry} onUpdateSecurity={handleUpdateSecurity} />;
      case 'membership': return <Membership user={user} onUpgrade={(plan) => setUser(prev => prev ? {...prev, creditScore: 800} : null)} />;
      case 'ai-gen': return <AiAgentsPage user={user} agents={agents} setAgents={setAgents} />;
      case 'deal-forge': return <DealForge user={user} />;
      default: return <Dashboard user={user} transactions={transactions} onNewTransaction={handleNewTransaction} onDeposit={handleDeposit} onWithdraw={(amt) => setUser(prev => prev ? {...prev, balance: prev.balance - amt} : null)} onExplorePlanning={() => setActiveTab('money-hub')} onNearbyClick={() => setActiveTab('nearby')} onTabChange={setActiveTab} onUpdateSecurity={handleUpdateSecurity} />;
    }
  };

  if (!user) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (isLocked) {
    return <SecurityLock onUnlock={() => setIsLocked(false)} title={user.country === 'Senegal' ? 'Heureux de vous revoir' : 'Welcome Back'} />;
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#FDFDFD] overflow-hidden font-['Inter'] selection:bg-cyan-100 relative">
      <TopBar user={user} activeTab={activeTab} setActiveTab={setActiveTab} onOpenNotifications={() => {}} onOpenSettings={() => setActiveTab('settings')} onUpdateCountry={switchCountry} />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="flex-1 overflow-y-auto scroll-smooth relative z-10 p-4 md:p-12 pb-40 xl:pb-16">
          {renderContent()}
          
          <div className="mt-20 pt-20 border-t-2 border-slate-50">
             <AboutPage user={user} />
          </div>
          
          <footer className="max-w-[1200px] mx-auto pt-20 pb-10 px-4 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-slate-100 mt-20 opacity-60">
             <div className="flex items-center gap-4">
               <span className="text-[12px] font-[1000] uppercase tracking-[0.4em] text-indigo-600">Zynctra Pro Hub</span>
               <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_5px_#22d3ee]"></div>
               <span className="text-[12px] font-black uppercase tracking-widest text-black">{t('built_in_2025', user.country)}</span>
             </div>
             <p className="text-[11px] font-bold text-slate-800 uppercase tracking-widest text-center md:text-right">
               {t('secure_regional_payments', user.country)}
             </p>
          </footer>
        </div>
        <AIChat user={user} isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
        <VoiceAssistant user={user} isOpen={isVoiceAssistantOpen} onClose={() => setIsVoiceAssistantOpen(false)} />
      </main>
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} country={user.country} />
      <div className="fixed bottom-28 md:bottom-12 right-6 md:right-12 flex flex-col gap-6 z-40">
        <button onClick={handleLogout} className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-3xl md:rounded-[2.5rem] shadow-2xl flex items-center justify-center text-rose-500 hover:bg-rose-50 transition-all border-2 border-rose-100 group active:scale-95" title={t('logout', user.country)}><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg></button>
        <button onClick={() => setIsAIChatOpen(!isAIChatOpen)} className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-[2.5rem] md:rounded-[3rem] shadow-[0_30px_70px_rgba(79,70,229,0.4)] flex items-center justify-center text-white hover:scale-110 transition-all ring-8 ring-white active:scale-95"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg></button>
      </div>
    </div>
  );
};

export default App;
