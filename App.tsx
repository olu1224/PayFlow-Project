
import React, { useState, useEffect } from 'react';
import TopBar from './components/TopBar';
import Dashboard from './pages/Dashboard';
import CryptoHub from './pages/CryptoHub';
import LoansPage from './pages/LoansPage';
import BudgetPage from './pages/BudgetPage';
import History from './pages/History';
import Beneficiaries from './pages/Beneficiaries';
import Settings from './pages/Settings';
import InvestmentPortfolio from './pages/InvestmentPortfolio';
import NearbyHub from './pages/NearbyHub';
import B2BPortal from './pages/B2BPortal';
import Membership from './pages/Membership';
import AIChat from './components/AIChat';
import VoiceAssistant from './components/VoiceAssistant';
import DepositModal from './components/DepositModal';
import Onboarding from './pages/Onboarding';
import SecurityLock from './components/SecurityLock';
import { User, Country, Currency, Transaction, Beneficiary, BudgetGoal, CryptoAsset, AIAgent, RecurringPayment } from './types';

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
  const [isReady, setIsReady] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<User | null>(null);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recurringPayments, setRecurringPayments] = useState<RecurringPayment[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [goals, setGoals] = useState<BudgetGoal[]>([]);
  const [portfolio, setPortfolio] = useState<CryptoAsset[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [agents, setAgents] = useState<AIAgent[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('payflow_user_session');
    if (saved) {
      setUser(JSON.parse(saved));
      setIsLocked(true);
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!user) return;
    const uid = user.uid;
    const loadData = <T,>(key: string, defaultValue: T): T => {
      const saved = localStorage.getItem(`payflow_${uid}_${key}`);
      return saved ? JSON.parse(saved) : defaultValue;
    };
    setTransactions(loadData('txs', []));
    setRecurringPayments(loadData('recurring', []));
    setBeneficiaries(loadData('beneficiaries', []));
    setGoals(loadData('goals', []));
    setPortfolio(loadData('portfolio', [
      { id: 'btc', name: 'Bitcoin', symbol: 'BTC', amount: 0, valueUsd: 42350 },
      { id: 'eth', name: 'Ethereum', symbol: 'ETH', amount: 0, valueUsd: 2240 },
      { id: 'usdt', name: 'Tether', symbol: 'USDT', amount: 0, valueUsd: 1 },
    ]));
    setTrades(loadData('trades', []));
  }, [user?.uid]);

  useEffect(() => {
    if (!user) return;
    const uid = user.uid;
    localStorage.setItem(`payflow_${uid}_txs`, JSON.stringify(transactions));
    localStorage.setItem(`payflow_${uid}_trades`, JSON.stringify(trades));
    localStorage.setItem(`payflow_${uid}_portfolio`, JSON.stringify(portfolio));
    localStorage.setItem(`payflow_${uid}_goals`, JSON.stringify(goals));
    localStorage.setItem(`payflow_${uid}_beneficiaries`, JSON.stringify(beneficiaries));
  }, [transactions, trades, portfolio, goals, beneficiaries, user?.uid]);

  const handleOnboardingComplete = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('payflow_user_session', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('payflow_user_session');
    setActiveTab('dashboard');
  };

  const [showNotifications, setShowNotifications] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);

  const switchCountry = (country: Country) => {
    if (!user) return;
    let curr: Currency = country === 'Ghana' ? 'GHS' : country === 'Senegal' ? 'XOF' : 'NGN';
    const updated = { ...user, country, currency: curr };
    setUser(updated);
    localStorage.setItem('payflow_user_session', JSON.stringify(updated));
  };

  const handleNewTransaction = (amount: number, name: string, category: string = 'General', isRecurring: boolean = false, schedule?: any) => {
    if (!user) return;
    if (isRecurring && schedule) {
      setRecurringPayments([{ id: Math.random().toString(36).substr(2, 9), name, amount, frequency: schedule.freq as any, startDate: schedule.date, category, active: true }, ...recurringPayments]);
      return;
    }
    const newTx: Transaction = { id: Math.random().toString(36).substr(2, 9), name, category, amount, date: 'Just now', status: 'completed', type: 'debit' };
    setTransactions([newTx, ...transactions]);
    setUser(prev => prev ? ({ ...prev, balance: prev.balance - amount }) : null);
  };

  const handleTrade = (assetId: string, amount: number, priceUsd: number, isBuy: boolean) => {
    if (!user) return;
    const rate = user.currency === 'NGN' ? 1550 : user.currency === 'GHS' ? 12 : 610;
    const totalLocal = amount * priceUsd * rate;
    if (isBuy && user.balance < totalLocal) return alert("Insufficient balance.");
    setPortfolio(prev => prev.map(a => a.id === assetId ? { ...a, amount: isBuy ? a.amount + amount : a.amount - amount } : a));
    setUser(prev => prev ? ({ ...prev, balance: isBuy ? prev.balance - totalLocal : prev.balance + totalLocal }) : null);
    setTrades([{ id: `t-${Date.now()}`, asset: assetId.toUpperCase(), amount, priceUsd, type: isBuy ? 'buy' : 'sell', date: 'Just now' }, ...trades]);
  };

  const handleWithdrawCrypto = (assetId: string, amount: number, address: string, priceUsd: number) => {
    if (!user) return;
    const asset = portfolio.find(a => a.id === assetId);
    if (!asset || asset.amount < amount) return alert(`Insufficient ${assetId.toUpperCase()} balance.`);
    setPortfolio(prev => prev.map(a => a.id === assetId ? { ...a, amount: a.amount - amount } : a));
    setTrades([{ id: `tw-${Date.now()}`, asset: assetId.toUpperCase(), amount, priceUsd, type: 'withdraw', address, date: 'Just now' }, ...trades]);
  };

  const handleUpgrade = (plan: string) => {
    if (!user) return;
    const updated = { ...user, creditScore: 800 }; // Mock "Elite" activation by bumping credit score/tier
    setUser(updated);
    localStorage.setItem('payflow_user_session', JSON.stringify(updated));
  };

  const renderContent = () => {
    if (!user) return null;
    switch (activeTab) {
      case 'dashboard': return <Dashboard user={user} transactions={transactions} onNewTransaction={handleNewTransaction} onDeposit={(amt, method) => setUser({...user, balance: user.balance + amt})} onWithdraw={(amt) => setUser({...user, balance: user.balance - amt})} onExplorePlanning={() => setActiveTab('money-hub')} onNearbyClick={() => setActiveTab('nearby')} />;
      case 'history': return <History user={user} transactions={transactions} />;
      case 'loans': return <LoansPage user={user} transactions={transactions} onNewTransaction={handleNewTransaction} />;
      case 'crypto': return <CryptoHub user={user} portfolio={portfolio} trades={trades} onTrade={handleTrade} onWithdrawCrypto={handleWithdrawCrypto} />;
      case 'investment-portfolio': return <InvestmentPortfolio user={user} />;
      case 'money-hub': return <BudgetPage user={user} goals={goals} onAddGoal={(g) => setGoals([...goals, { ...g, id: Date.now().toString() }])} />;
      case 'b2b': return <B2BPortal user={user} />;
      case 'nearby': return <NearbyHub user={user} />;
      case 'settings': return <Settings user={user} onUpdateCountry={switchCountry} />;
      case 'membership': return <Membership user={user} onUpgrade={handleUpgrade} />;
      default: return <Dashboard user={user} transactions={transactions} onNewTransaction={handleNewTransaction} onDeposit={(amt, method) => setUser({...user, balance: user.balance + amt})} onWithdraw={(amt) => setUser({...user, balance: user.balance - amt})} onExplorePlanning={() => setActiveTab('money-hub')} onNearbyClick={() => setActiveTab('nearby')} />;
    }
  };

  if (!isReady) return null;
  if (!user) return <Onboarding onComplete={handleOnboardingComplete} />;

  return (
    <div className="flex h-screen flex-col bg-[#FDFDFD] overflow-hidden font-['Inter'] selection:bg-purple-100">
      {isLocked && <SecurityLock type={user.security.biometricsEnabled ? 'biometric' : 'pin'} onUnlock={() => setIsLocked(false)} />}
      <TopBar user={user} activeTab={activeTab} setActiveTab={setActiveTab} onOpenNotifications={() => setShowNotifications(!showNotifications)} onOpenSettings={() => setActiveTab('settings')} onUpdateCountry={switchCountry} />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="flex-1 overflow-y-auto scroll-smooth relative z-10 p-4 md:p-8">
          {renderContent()}
        </div>
        <AIChat user={user} isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
        <VoiceAssistant user={user} isOpen={isVoiceAssistantOpen} onClose={() => setIsVoiceAssistantOpen(false)} />
      </main>
      <div className="fixed bottom-12 right-12 flex flex-col gap-5 z-40">
        <button onClick={handleLogout} className="w-16 h-16 bg-rose-50 rounded-[1.8rem] shadow-2xl flex items-center justify-center text-rose-500 hover:bg-rose-100 transition-all border border-rose-200 group" title="Logout"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y2="12" y1="12"/></svg></button>
        <button onClick={() => setIsAIChatOpen(!isAIChatOpen)} className="w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-800 rounded-[2rem] shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-all ring-4 ring-white"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg></button>
      </div>
    </div>
  );
};

export default App;
