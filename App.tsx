
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './pages/Dashboard';
import CryptoHub from './pages/CryptoHub';
import LoansPage from './pages/LoansPage';
import AiAgentsPage from './pages/AiAgentsPage';
import BudgetPage from './pages/BudgetPage';
import History from './pages/History';
import Beneficiaries from './pages/Beneficiaries';
import Settings from './pages/Settings';
import InvestmentPortfolio from './pages/InvestmentPortfolio';
import AIPlanning from './pages/AIPlanning';
import AutoCategorization from './pages/AutoCategorization';
import Analytics from './pages/Analytics';
import RecurringPayments from './pages/RecurringPayments';
import NearbyHub from './pages/NearbyHub';
import B2BPortal from './pages/B2BPortal';
import AIChat from './components/AIChat';
import VoiceAssistant from './components/VoiceAssistant';
import { User, Country, Currency, Transaction, Beneficiary, BudgetGoal, CryptoAsset, AIAgent, RecurringPayment } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<User>({
    name: 'Jay Adebayo',
    country: 'Nigeria',
    currency: 'NGN',
    balance: 854500,
    creditScore: 720,
    isBusiness: true
  });

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', name: 'IKEDC Postpaid', category: 'Electricity', amount: 32000, date: 'Nov 25, 4:39 AM', status: 'completed', type: 'debit' },
    { id: '2', name: 'Canal+', category: 'Cable TV', amount: 21000, date: 'Nov 24, 09:12 AM', status: 'completed', type: 'debit' },
    { id: '3', name: 'Spectranet', category: 'Internet', amount: 12500, date: 'Nov 24, 4:39 AM', status: 'completed', type: 'debit' },
    { id: 'p1', name: 'Transfer to Kola', category: 'Transfers', amount: 45000, date: 'Just now', status: 'pending', type: 'debit' },
    { id: '4', name: 'Airtel Data', category: 'Mobile Data', amount: 4000, date: 'Nov 23, 11:05 AM', status: 'completed', type: 'debit' },
    { id: '5', name: 'MTN Airtime', category: 'Airtime', amount: 2000, date: 'Nov 22, 10:15 AM', status: 'completed', type: 'debit' },
    { id: '6', name: 'Inflow: Payroll', category: 'Salary', amount: 500000, date: 'Nov 20, 08:00 AM', status: 'completed', type: 'credit' },
  ]);

  const [recurringPayments, setRecurringPayments] = useState<RecurringPayment[]>([
    { id: 'r1', name: 'Monthly Data', amount: 15000, frequency: 'monthly', startDate: '2024-12-01', category: 'Data', active: true },
    { id: 'r2', name: 'DSTV Premium', amount: 25000, frequency: 'monthly', startDate: '2024-12-05', category: 'TV', active: true },
  ]);

  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([
    { id: '1', name: 'Mobile Data', type: 'mobile', category: 'Data', account: '08123456789', provider: 'Airtel', country: 'Nigeria' },
  ]);

  const [goals, setGoals] = useState<BudgetGoal[]>([
    { id: '1', title: 'New House Fund', current: 1250000, target: 15000000, color: 'bg-purple-600' },
  ]);

  const [portfolio, setPortfolio] = useState<CryptoAsset[]>([
    { id: 'btc', name: 'Bitcoin', symbol: 'BTC', amount: 0.05, valueUsd: 2117.5 },
  ]);

  const [agents, setAgents] = useState<AIAgent[]>([
    { id: '1', name: 'Budget Guard', role: 'Monitoring', status: 'active', description: 'Monitors spending across all categories and sends real-time alerts.' },
  ]);

  const [showNotifications, setShowNotifications] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);

  const switchCountry = (country: Country) => {
    let curr: Currency = 'NGN';
    if (country === 'Ghana') curr = 'GHS';
    if (country === 'Senegal') curr = 'XOF';
    setUser(prev => ({ ...prev, country, currency: curr }));
  };

  const handleNewTransaction = (amount: number, name: string, category: string = 'General', isRecurring: boolean = false, schedule?: any) => {
    if (isRecurring && schedule) {
      const newRP: RecurringPayment = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        amount,
        frequency: schedule.freq as any,
        startDate: schedule.date,
        category,
        active: true
      };
      setRecurringPayments([newRP, ...recurringPayments]);
      return;
    }

    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      category,
      amount,
      date: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }),
      status: 'completed',
      type: 'debit'
    };
    setTransactions([newTx, ...transactions]);
    setUser(prev => ({ ...prev, balance: prev.balance - amount }));
  };

  const handleDeposit = (amount: number, method: string) => {
    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      name: `Deposit via ${method}`,
      category: 'Deposit',
      amount,
      date: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }),
      status: 'completed',
      type: 'credit'
    };
    setTransactions([newTx, ...transactions]);
    setUser(prev => ({ ...prev, balance: prev.balance + amount }));
  };

  const handleWithdraw = (amount: number, destination: string) => {
    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      name: `Withdrawal to ${destination}`,
      category: 'Withdrawal',
      amount,
      date: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }),
      status: 'completed',
      type: 'debit'
    };
    setTransactions([newTx, ...transactions]);
    setUser(prev => ({ ...prev, balance: prev.balance - amount }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard user={user} transactions={transactions} onNewTransaction={handleNewTransaction} onDeposit={handleDeposit} onWithdraw={handleWithdraw} onExplorePlanning={() => setActiveTab('ai-planning')} onNearbyClick={() => setActiveTab('nearby')} />;
      case 'history': return <History user={user} transactions={transactions} />;
      case 'beneficiaries': return <Beneficiaries user={user} beneficiaries={beneficiaries} onAdd={(b) => setBeneficiaries([...beneficiaries, { ...b, id: Date.now().toString() }])} onDelete={(id) => setBeneficiaries(filtered => filtered.filter(b => b.id !== id))} />;
      case 'recurring': return (
        <RecurringPayments 
          user={user} 
          recurringPayments={recurringPayments} 
          onToggle={(id) => setRecurringPayments(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p))}
          onDelete={(id) => setRecurringPayments(prev => prev.filter(p => p.id !== id))}
          onScheduleNew={handleNewTransaction}
        />
      );
      case 'crypto': return <CryptoHub user={user} portfolio={portfolio} onTrade={(id, amt, price, isBuy) => {}} />;
      case 'loans': return <LoansPage user={user} transactions={transactions} />;
      case 'ai-agents': return <AiAgentsPage user={user} agents={agents} setAgents={setAgents} />;
      case 'budget': return <BudgetPage user={user} goals={goals} onAddGoal={(g) => setGoals([...goals, { ...g, id: Date.now().toString() }])} />;
      case 'nearby': return <NearbyHub user={user} />;
      case 'b2b': return <B2BPortal user={user} />;
      case 'settings': return <Settings user={user} onUpdateCountry={switchCountry} />;
      case 'investment-portfolio': return <InvestmentPortfolio user={user} />;
      case 'ai-planning': return <AIPlanning user={user} />;
      case 'auto-categorize': return <AutoCategorization user={user} transactions={transactions} />;
      case 'analytics': return <Analytics user={user} transactions={transactions} />;
      default: return <Dashboard user={user} transactions={transactions} onNewTransaction={handleNewTransaction} onDeposit={handleDeposit} onWithdraw={handleWithdraw} onExplorePlanning={() => setActiveTab('ai-planning')} onNearbyClick={() => setActiveTab('nearby')} />;
    }
  };

  return (
    <div className="flex h-screen flex-col bg-white overflow-hidden font-['Inter']">
      <TopBar 
        user={user} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNotifications={() => setShowNotifications(!showNotifications)} 
        onOpenSettings={() => setActiveTab('settings')}
      />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth">
          {renderContent()}
        </div>

        <AIChat isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
        <VoiceAssistant isOpen={isVoiceAssistantOpen} onClose={() => setIsVoiceAssistantOpen(false)} />

        {showNotifications && (
          <div className="absolute top-4 right-8 w-96 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-[100] animate-in slide-in-from-top-2 duration-200">
            <div className="bg-slate-900 p-6 text-white">
               <h3 className="font-black text-lg">Activity Stream</h3>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Real-time alerts</p>
            </div>
            <div className="divide-y divide-slate-50 max-h-[400px] overflow-y-auto">
              {transactions.slice(0, 3).map((n, i) => (
                <div key={i} className="p-5 hover:bg-slate-50 transition-colors flex gap-4 items-start">
                   <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>
                   </div>
                   <div>
                      <p className="text-sm font-black text-slate-800">Payment Processed</p>
                      <p className="text-xs text-slate-500 leading-relaxed my-1">Your {n.category} bill for {n.name} has been completed.</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-block bg-slate-100 px-2.5 py-1 rounded-lg text-[10px] font-black text-slate-800">{user.currency} {n.amount.toLocaleString()}</span>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{n.date}</p>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <div className="fixed bottom-10 right-10 flex flex-col gap-4 z-40">
        <button 
          onClick={() => setIsVoiceAssistantOpen(true)}
          className="w-14 h-14 bg-slate-900 rounded-[1.5rem] shadow-2xl shadow-slate-400 flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all duration-300 group relative"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          <span className="absolute right-full mr-6 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none shadow-2xl">Voice Live</span>
        </button>
        <button 
          onClick={() => setIsAIChatOpen(!isAIChatOpen)}
          className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-[1.8rem] shadow-2xl shadow-purple-300 flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all duration-300 group relative"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          <span className="absolute right-full mr-6 bg-purple-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none shadow-2xl">Ask PayFlow</span>
        </button>
      </div>
    </div>
  );
};

export default App;
