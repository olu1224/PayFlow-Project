
import React, { useState } from 'react';
import { User, AIAgent } from '../types';

interface AiAgentsPageProps {
  user: User;
  agents: AIAgent[];
  setAgents: React.Dispatch<React.SetStateAction<AIAgent[]>>;
}

const SimpleStatus: React.FC<{ status: AIAgent['status'] }> = ({ status }) => {
  const configs = {
    active: {
      bg: 'bg-emerald-500',
      label: 'Working',
      pulse: true
    },
    idle: {
      bg: 'bg-slate-300',
      label: 'Off',
      pulse: false
    },
    deploying: {
      bg: 'bg-blue-500',
      label: 'Starting...',
      pulse: true
    }
  };

  const config = configs[status] || configs.idle;

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2.5 h-2.5 rounded-full ${config.bg} ${config.pulse ? 'animate-pulse' : ''}`}></div>
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{config.label}</span>
    </div>
  );
};

const AiAgentsPage: React.FC<AiAgentsPageProps> = ({ user, agents, setAgents }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAgent, setNewAgent] = useState({
    name: '',
    role: 'Personal Assistant',
    description: ''
  });

  const categories = [
    {
      id: 'home',
      title: 'Home & Bills',
      icon: '🏠',
      helpers: [
        { title: 'Power Sentry', icon: '⚡', desc: 'Auto-buys electricity before your lights go out.', role: 'Bill Helper', brief: 'Monitor my electricity balance and buy more if it gets too low.' },
        { title: 'Show Saver', icon: '📺', desc: 'Renews your DSTV/Canal+ so you never miss a game.', role: 'TV Helper', brief: 'Automatically renew my TV subscription 1 day before it expires.' },
        { title: 'Water Watcher', icon: '💧', desc: 'Handles water bills automatically every month.', role: 'Home Helper', brief: 'Pay my monthly water bill on the last Friday of every month.' },
      ]
    },
    {
      id: 'wealth',
      title: 'Growing Wealth',
      icon: '💰',
      helpers: [
        { title: 'Round-Up Save', icon: '🎯', desc: 'Saves your spare change from every purchase.', role: 'Savings Helper', brief: 'Round up every purchase to the nearest 100 and put the extra in my savings.' },
        { title: 'Rainy Day Fund', icon: '🛡️', desc: 'Moves small amounts to your emergency wallet daily.', role: 'Savings Helper', brief: 'Save a small amount from my balance every morning automatically.' },
        { title: 'Smart Trader', icon: '📈', desc: 'Alerts you when it’s the best time to buy crypto.', role: 'Money Expert', brief: 'Watch the market and send me a notification when prices are low.' },
      ]
    },
    {
      id: 'biz',
      title: 'Work & Business',
      icon: '💼',
      helpers: [
        { title: 'Payment Nudger', icon: '📑', desc: 'Reminds clients to pay their invoices on time.', role: 'Business Helper', brief: 'Nudge my clients automatically if their payment is almost due.' },
        { title: 'Staff Payer', icon: '👥', desc: 'Handles monthly salary payments for your team.', role: 'Work Helper', brief: 'Pay my staff their monthly salaries on the 25th of every month.' },
      ]
    }
  ];

  const handleToggleHelper = (name: string, role: string, description: string) => {
    const existing = agents.find(a => a.name === name);
    if (existing) {
      setAgents(prev => prev.filter(a => a.name !== name));
      return;
    }

    const agent: AIAgent = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      role,
      status: 'deploying',
      description
    };

    setAgents(prev => [agent, ...prev]);

    setTimeout(() => {
      setAgents(current => current.map(a => a.id === agent.id ? { ...a, status: 'active' } : a));
    }, 1500);
  };

  const activateAll = () => {
    categories.forEach(cat => {
      cat.helpers.forEach((h, i) => {
        if (!agents.find(a => a.name === h.title)) {
          setTimeout(() => handleToggleHelper(h.title, h.role, h.brief), i * 200);
        }
      });
    });
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-10 animate-in fade-in duration-500 pb-24 px-4">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-[900] text-slate-900 tracking-tight leading-none">Smart Helpers</h1>
          <p className="text-slate-500 font-bold text-sm">Your AI team that works for you 24/7.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-white border-2 border-slate-100 text-slate-800 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
          >
            Create Own Helper
          </button>
          <button 
            onClick={activateAll}
            className="px-8 py-3 bg-purple-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-purple-200 hover:bg-purple-700 transition-all active:scale-95 flex items-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            Turn On All Essentials
          </button>
        </div>
      </header>

      {/* Intro Section */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 md:p-12 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-2/3 space-y-6">
            <h2 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">"Set it and forget it"</h2>
            <p className="text-slate-400 text-lg font-medium leading-relaxed">
              Smart Helpers are mini-assistants that handle your repeated tasks. They monitor your bills, help you save small amounts every day, and alert you about important money news so you don't have to check your phone constantly.
            </p>
            <div className="flex gap-4">
               <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                  <span className="text-emerald-400 font-black">{agents.filter(a => a.status === 'active').length}</span>
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Active Helpers</span>
               </div>
            </div>
          </div>
          <div className="lg:w-1/3 flex justify-center">
             <div className="w-40 h-40 bg-white/10 rounded-[2.5rem] flex items-center justify-center text-7xl shadow-inner border border-white/10 animate-bounce-slow">🤖</div>
          </div>
        </div>
      </section>

      {/* Helper Grid */}
      <div className="space-y-12">
        {categories.map(cat => (
          <div key={cat.id} className="space-y-6">
            <div className="flex items-center gap-3 px-2">
              <span className="text-2xl">{cat.icon}</span>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">{cat.title}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cat.helpers.map(h => {
                const isActive = agents.some(a => a.name === h.title);
                const currentAgent = agents.find(a => a.name === h.title);
                return (
                  <div key={h.title} className={`bg-white p-8 rounded-[2.5rem] border-2 transition-all group flex flex-col h-full ${isActive ? 'border-purple-600 shadow-xl shadow-purple-50' : 'border-slate-50 hover:border-slate-200 shadow-sm'}`}>
                    <div className="flex justify-between items-start mb-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-all ${isActive ? 'bg-purple-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
                        {h.icon}
                      </div>
                      {isActive && <SimpleStatus status={currentAgent?.status || 'active'} />}
                    </div>
                    
                    <div className="flex-1 space-y-2 mb-8">
                      <h4 className="text-xl font-black text-slate-900 group-hover:text-purple-600 transition-colors">{h.title}</h4>
                      <p className="text-slate-500 font-medium text-sm leading-relaxed">{h.desc}</p>
                    </div>

                    <button 
                      onClick={() => handleToggleHelper(h.title, h.role, h.brief)}
                      className={`w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${isActive ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                    >
                      {isActive ? 'Turn Off Helper' : 'Turn On Helper'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Manual Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-8 md:p-12 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">New Helper</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 transition-all">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleToggleHelper(newAgent.name, newAgent.role, newAgent.description); setIsModalOpen(false); }} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Helper Name</label>
                <input required className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-800 focus:border-purple-600 outline-none transition-all" placeholder="e.g. My Savings Guard" value={newAgent.name} onChange={e => setNewAgent({...newAgent, name: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">What should it do?</label>
                <textarea required rows={4} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 font-medium text-slate-700 focus:border-purple-600 outline-none transition-all resize-none leading-relaxed" placeholder="Tell the helper what to watch or do for you..." value={newAgent.description} onChange={e => setNewAgent({...newAgent, description: e.target.value})} />
              </div>

              <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-purple-600 transition-all shadow-xl active:scale-95">Save Helper</button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-bounce-slow { animation: bounce-slow 3s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default AiAgentsPage;
