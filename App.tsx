
import React, { useState, useEffect } from 'react';
import TopBar from './components/TopBar';
import Dashboard from './pages/Dashboard';
import CryptoHub from './pages/CryptoHub';
import LoansPage from './pages/LoansPage';
import BudgetPage from './pages/BudgetPage';
import History from './pages/History';
import Settings from './pages/Settings';
import AboutPage from './pages/AboutPage';
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
    localStorage.setItem(`zynctra_${uid}_agents`, JSON.stringify(agents));
    localStorage.setItem('zynctra_user_session', JSON.stringify(user));
  }, [transactions, trades, portfolio, goals, agents, user]);

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
    setUser({ ...user, country, currency: curr });
  };

  const handleUpdateSecurity = (updates: Partial<User['security']>) => {
    if (!user) return;
    setUser({ ...user, security: { ...user.security, ...updates } });
  };

  const handleUpdateUser = (updates: Partial<User>) => {
    if (!user) return;
    setUser({ ...user, ...updates });
  };

  const handleUpdateWealth = (updates: Partial<User['wealth']>) => {
    if (!user) return;
    setUser({ 
      ...user, 
      wealth: { 
        ...(user.wealth || { 
          emergencyFund: { tier1: 0, tier2: 0, target: 250000 }, 
          dollarFund: { balanceUsd: 0, investedNaira: 0 }, 
          connectedPlatforms: [] 
        }), 
        ...updates 
      } 
    });
  };

  const handleNewTransaction = (amount: number, name: string, category: string = 'General') => {
    if (!user) return;
    const fee = amount < 0 ? Math.max(100, Math.abs(amount) * 0.015) : 0;
    const totalDeduction = amount - fee;
    if (user.balance < Math.abs(totalDeduction)) {
      alert(`Insufficient balance.`);
      return;
    }
    const newTx: Transaction = { 
      id: Math.random().toString(36).substr(2, 9), 
      name, category, amount: Math.abs(amount), 
      date: 'Just now', status: 'completed', 
      type: amount < 0 ? 'debit' : 'credit' 
    };
    setTransactions([newTx, ...transactions]);
    setUser(prev => prev ? ({ ...prev, balance: prev.balance + totalDeduction }) : null);
  };

  const handleDeposit = (amount: number, method: string) => {
    if (!user) return;
    setTransactions([{ 
      id: Math.random().toString(36).substr(2, 9), 
      name: `Money Added (${method})`, category: 'Deposit', 
      amount, date: 'Just now', status: 'completed', 
      type: 'credit', method 
    }, ...transactions]);
    setUser(prev => prev ? ({ ...prev, balance: prev.balance + amount }) : null);
  };

  const renderContent = () => {
    if (!user) return null;
    switch (activeTab) {
      case 'dashboard': 
        return <Dashboard user={user} transactions={transactions} onNewTransaction={handleNewTransaction} onDeposit={handleDeposit} onWithdraw={(amt) => setUser(prev => prev ? {...prev, balance: prev.balance - amt} : null)} onExplorePlanning={() => setActiveTab('money-hub')} onNearbyClick={() => setActiveTab('nearby')} onTabChange={setActiveTab} onUpdateSecurity={handleUpdateSecurity} onUpdateUser={handleUpdateUser} />;
      case 'history': return <History user={user} transactions={transactions} />;
      case 'loans': return <LoansPage user={user} transactions={transactions} onNewTransaction={handleNewTransaction} />;
      case 'crypto': return <CryptoHub user={user} portfolio={portfolio} trades={trades} onTrade={() => {}} onWithdrawCrypto={() => {}} />;
      case 'money-hub': return <BudgetPage user={user} goals={goals} onAddGoal={(g) => setGoals([...goals, { ...g, id: Date.now().toString() }])} onNewTransaction={handleNewTransaction} onUpdateUserWealth={handleUpdateWealth} />;
      case 'b2b': return <B2BPortal user={user} onNewTransaction={handleNewTransaction} />;
      case 'nearby': return <NearbyHub user={user} />;
      case 'settings': return <Settings user={user} onUpdateCountry={switchCountry} onUpdateSecurity={handleUpdateSecurity} />;
      case 'membership': return <Membership user={user} />;
      case 'ai-gen': return <AiAgentsPage user={user} agents={agents} setAgents={setAgents} />;
      case 'deal-forge': return <DealForge user={user} />;
      default: return <Dashboard user={user} transactions={transactions} onNewTransaction={handleNewTransaction} onDeposit={handleDeposit} onWithdraw={(amt) => setUser(prev => prev ? {...prev, balance: prev.balance - amt} : null)} onExplorePlanning={() => setActiveTab('money-hub')} onNearbyClick={() => setActiveTab('nearby')} onTabChange={setActiveTab} onUpdateSecurity={handleUpdateSecurity} onUpdateUser={handleUpdateUser} />;
    }
  };

  if (!user) return <Onboarding onComplete={handleOnboardingComplete} />;
  if (isLocked) return <SecurityLock onUnlock={() => setIsLocked(false)} title={user.country === 'Senegal' ? 'Heureux de vous revoir' : 'Welcome Back'} />;

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#FDFDFD] overflow-hidden font-['Inter'] relative">
      <TopBar user={user} activeTab={activeTab} setActiveTab={setActiveTab} onOpenNotifications={() => {}} onOpenSettings={() => setActiveTab('settings')} onUpdateCountry={switchCountry} />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="flex-1 overflow-y-auto scroll-smooth relative z-10 p-4 md:p-12 pb-20">
          <div className="max-w-[1400px] mx-auto animate-in fade-in duration-700">
            {renderContent()}
          </div>
          {/* Integrated About Section with tighter margins */}
          <div className="mt-8 pt-8 border-t border-slate-100">
             <AboutPage user={user} />
          </div>
          <footer className="max-w-[1200px] mx-auto pt-12 pb-10 px-4 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-slate-100 mt-12 opacity-60">
             <div className="flex items-center gap-4">
               <span className="text-[10px] font-[1000] uppercase tracking-[0.4em] text-indigo-600">Zynctra Pro Hub</span>
               <div className="w-1 h-1 rounded-full bg-cyan-500"></div>
               <span className="text-[10px] font-black uppercase tracking-widest text-black">2025 Grid Node</span>
             </div>
             <p className="text-[10px] font-bold text-slate-800 uppercase tracking-widest text-center md:text-right">
               Secure regional infrastructure node
             </p>
          </footer>
        </div>
        <AIChat user={user} isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
        <VoiceAssistant user={user} isOpen={isVoiceAssistantOpen} onClose={() => setIsVoiceAssistantOpen(false)} />
      </main>
      <div className="fixed bottom-12 right-6 md:right-12 flex flex-col gap-6 z-40">
        <button onClick={handleLogout} className="w-14 h-14 bg-white rounded-2xl shadow-2xl flex items-center justify-center text-rose-500 border-2 border-rose-100 group active:scale-95 transition-all"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg></button>
        <button onClick={() => setIsAIChatOpen(!isAIChatOpen)} className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-[2rem] shadow-[0_30px_70px_rgba(79,70,229,0.4)] flex items-center justify-center text-white hover:scale-110 transition-all ring-4 ring-white active:scale-95"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg></button>
      </div>
    </div>
  );
};

export default App;
