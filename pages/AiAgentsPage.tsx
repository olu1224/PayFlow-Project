
import React, { useState } from 'react';
import { User, AIAgent } from '../types';

interface AiAgentsPageProps {
  user: User;
  agents: AIAgent[];
  setAgents: React.Dispatch<React.SetStateAction<AIAgent[]>>;
}

const StatusBadge: React.FC<{ status: AIAgent['status'] }> = ({ status }) => {
  const configs = {
    active: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      label: 'Working',
      hoverClass: 'group-hover:animate-helper-pulse',
      icon: (
        <svg className="mr-1.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )
    },
    idle: {
      bg: 'bg-slate-100',
      text: 'text-slate-600',
      border: 'border-slate-200',
      label: 'On Break',
      hoverClass: 'group-hover:animate-helper-rock',
      icon: (
        <svg className="mr-1.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      )
    },
    deploying: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      border: 'border-indigo-200',
      label: 'Joining Hub',
      hoverClass: 'group-hover:animate-helper-spin',
      icon: (
        <svg className="mr-1.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" strokeOpacity="0.2"/>
          <path d="M12 2a10 10 0 0 1 10 10" />
        </svg>
      )
    }
  };

  const config = configs[status] || configs.idle;

  return (
    <div className={`
      group flex items-center px-4 py-1.5 rounded-full border shadow-sm transition-all duration-300
      ${config.bg} ${config.text} ${config.border} ${config.hoverClass}
    `}>
      <span className="text-[10px] font-black uppercase tracking-widest flex items-center">
        {config.icon}
        {config.label}
      </span>
    </div>
  );
};

const AiAgentsPage: React.FC<AiAgentsPageProps> = ({ user, agents, setAgents }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAgent, setNewAgent] = useState({
    name: '',
    role: 'Money Manager',
    description: ''
  });

  const templateCategories = [
    {
      title: 'Daily Life & Utilities',
      templates: [
        { title: 'Bill Reminder', icon: '⏰', desc: 'Alerts you before your DSTV or Power bills are due.', role: 'Utility Helper', brief: 'Remind me 2 days before any recurring bills are due.' },
        { title: 'Food Budgeter', icon: '🥗', desc: 'Alerts you when you spend over 50k on dining in a week.', role: 'Lifestyle Coach', brief: 'Track my food/lifestyle spending and warn me if I exceed 50,000 this week.' },
        { title: 'Travel Planner', icon: '✈️', desc: 'Helps you set aside money for your next cross-border trip.', role: 'Travel Assistant', brief: 'Help me save for a trip to Senegal by setting aside 10% of every credit.' },
      ]
    },
    {
      title: 'Wealth & Markets',
      templates: [
        { title: 'Crypto Watcher', icon: '📈', desc: 'Notifies you when Bitcoin or ETH prices change significantly.', role: 'Market Expert', brief: 'Watch Bitcoin price and alert me if it drops below $40,000.' },
        { title: 'Dollar Tracker', icon: '💵', desc: 'Watches the exchange rate for NGN or GHS vs USD.', role: 'FX Analyst', brief: 'Track the local NGN/USD rate and notify me of major shifts.' },
        { title: 'Savings Coach', icon: '🎯', desc: 'Gives tips to help reach your savings goals faster.', role: 'Savings Assistant', brief: 'Check my balance weekly and suggest how much I can save.' },
      ]
    },
    {
      title: 'Business Management',
      templates: [
        { title: 'Invoice Guard', icon: '📄', desc: 'Reminds you to follow up on client payments that are overdue.', role: 'Admin Helper', brief: 'Scan my pending invoices every Monday and list which clients are yet to pay.' },
        { title: 'Inventory Saver', icon: '📦', desc: 'Helps save profit for your next bulk stock purchase.', role: 'Business Partner', brief: 'Automatically move 5% of my business income to a separate stock-restock goal.' },
        { title: 'Tax Assistant', icon: '🏛️', desc: 'Calculates VAT or small business tax estimates.', role: 'Compliance Officer', brief: 'Estimate my monthly tax obligation based on my business transactions.' },
      ]
    }
  ];

  const handleDeploy = (name: string, role: string, description: string) => {
    const agent: AIAgent = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      role,
      status: 'deploying',
      description
    };

    setAgents([agent, ...agents]);
    setIsModalOpen(false);
    setNewAgent({ name: '', role: 'Money Manager', description: '' });

    setTimeout(() => {
      setAgents(current => current.map(a => a.id === agent.id ? { ...a, status: 'active' } : a));
    }, 3000);
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 animate-in fade-in duration-500 pb-20 px-4">
      <style>{`
        @keyframes helper-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes helper-rock {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(5deg); }
          75% { transform: rotate(-5deg); }
        }
        @keyframes helper-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-helper-pulse { animation: helper-pulse 2s infinite ease-in-out; }
        .animate-helper-rock { animation: helper-rock 0.5s infinite ease-in-out; }
        .animate-helper-spin { animation: helper-spin 1.5s linear infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-[900] text-slate-900 tracking-tight leading-none">Smart Helpers</h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[11px] mt-2">Personalize your AI workforce for daily money tasks</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white px-8 py-4 rounded-[1.8rem] font-black shadow-xl hover:bg-purple-600 transition-all flex items-center gap-3 uppercase tracking-widest text-[11px] active:scale-95"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14"/></svg>
          Build Custom Helper
        </button>
      </header>

      {/* Hero / Info Section */}
      <section className="bg-white border border-slate-100 p-8 md:p-14 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-50 rounded-full blur-[100px] -mr-40 -mt-40 opacity-50"></div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Your AI Support Team</h2>
              <p className="text-slate-600 font-medium text-lg leading-relaxed max-w-lg">
                Think of these as digital assistants that live inside your PayFlow wallet. They monitor transactions, analyze markets, and send you alerts so you can focus on growing your wealth.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 flex flex-col gap-3">
                <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm text-lg">🤖</div>
                <p className="font-black text-slate-800 text-[10px] uppercase tracking-wider">No Code Needed</p>
              </div>
              <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 flex flex-col gap-3">
                <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm text-lg">🔒</div>
                <p className="font-black text-slate-800 text-[10px] uppercase tracking-wider">Bank-Grade Privacy</p>
              </div>
              <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 flex flex-col gap-3">
                <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm text-lg">🌍</div>
                <p className="font-black text-slate-800 text-[10px] uppercase tracking-wider">West-Africa Ready</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
             <div className="flex items-center justify-between">
                <h3 className="font-black text-slate-400 uppercase tracking-[0.3em] text-[10px]">Select a Template to Start</h3>
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping"></span>
             </div>
             <div className="space-y-10 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                {templateCategories.map((cat, idx) => (
                  <div key={idx} className="space-y-4">
                    <h4 className="font-black text-slate-900 text-sm border-b border-slate-100 pb-2">{cat.title}</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {cat.templates.map(tmp => (
                        <button 
                          key={tmp.title}
                          onClick={() => handleDeploy(tmp.title, tmp.role, tmp.brief)}
                          className="flex items-center gap-5 p-5 rounded-3xl bg-slate-50/50 border border-slate-100 hover:border-purple-600 hover:bg-white hover:shadow-xl transition-all text-left group"
                        >
                          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-3xl group-hover:scale-110 transition-transform">
                            {tmp.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-black text-slate-900 text-base">{tmp.title}</p>
                            <p className="text-[11px] text-slate-500 font-medium leading-tight mt-1">{tmp.desc}</p>
                          </div>
                          <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-300 group-hover:text-purple-600 group-hover:border-purple-200 transition-all">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* Active Helpers Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
           <h3 className="text-xl font-[900] text-slate-900 tracking-tight">Active Deployment Hub</h3>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Managing {agents.length} Assistants</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agents.map(agent => (
            <div key={agent.id} className="bg-white p-8 rounded-[3.5rem] border border-slate-100 hover:border-purple-300 transition-all shadow-sm hover:shadow-2xl group flex flex-col relative overflow-hidden">
              <div className="flex justify-between items-start mb-8">
                <StatusBadge status={agent.status} />
                <button 
                  onClick={() => setAgents(prev => prev.filter(a => a.id !== agent.id))}
                  className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                  title="Remove Helper"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h4 className="font-[900] text-slate-900 text-3xl tracking-tighter leading-none">{agent.name}</h4>
                  <p className="text-[10px] text-purple-600 font-black uppercase tracking-[0.25em] mt-3 inline-block bg-purple-50 px-3 py-1 rounded-full">{agent.role}</p>
                </div>
                <p className="text-slate-500 font-bold text-sm leading-relaxed pt-2">
                  "{agent.description}"
                </p>
              </div>

              <div className="mt-10 pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-9 h-9 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-sm group-hover:scale-110 transition-transform">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${agent.id}-${i}`} alt="Avatar" />
                    </div>
                  ))}
                  <div className="w-9 h-9 rounded-full border-4 border-white bg-slate-900 text-[10px] font-black text-white flex items-center justify-center shadow-sm">AI</div>
                </div>
                <button className="text-[10px] font-black uppercase text-slate-400 hover:text-purple-600 transition-colors flex items-center gap-1.5 group/btn">
                  Activity Logs
                  <svg className="group-hover/btn:translate-x-1 transition-transform" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </button>
              </div>
            </div>
          ))}

          {agents.length === 0 && (
            <div className="col-span-full py-32 bg-slate-50/50 rounded-[4rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-24 h-24 bg-white rounded-[2.5rem] shadow-xl flex items-center justify-center text-slate-200 text-5xl">
                 🤖
              </div>
              <div>
                 <h3 className="text-2xl font-black text-slate-800 tracking-tight">Your AI Hub is Idle</h3>
                 <p className="text-slate-400 font-medium text-base mt-2 max-w-xs mx-auto">Click a template or build a custom helper to start automating your West African financial grid.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-purple-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-widest"
              >
                Create My First Helper
              </button>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[3.5rem] p-10 md:p-14 shadow-2xl animate-in zoom-in-95 duration-300 border border-white">
            <div className="flex justify-between items-center mb-10">
              <div className="space-y-1">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Custom Helper</h2>
                <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest">Personalize Your AI</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-all">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleDeploy(newAgent.name, newAgent.role, newAgent.description); }} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Helper Identity</label>
                <input required className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-8 py-5 font-bold text-slate-900 focus:border-purple-600 focus:bg-white outline-none transition-all shadow-inner" placeholder="e.g. Wealth Guard" value={newAgent.name} onChange={e => setNewAgent({...newAgent, name: e.target.value})} />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Specialization</label>
                <select className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-8 py-5 font-bold text-slate-900 focus:border-purple-600 focus:bg-white outline-none appearance-none shadow-inner" value={newAgent.role} onChange={e => setNewAgent({...newAgent, role: e.target.value})}>
                  <option>Money Manager</option>
                  <option>Savings Assistant</option>
                  <option>Crypto Tracker</option>
                  <option>Utility Bill Guard</option>
                  <option>Business Auditor</option>
                  <option>Travel Expense Tracker</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Objective (What should it do?)</label>
                <textarea required rows={4} className="w-full bg-slate-50 border-2 border-slate-50 rounded-3xl px-8 py-6 font-medium text-slate-700 focus:border-purple-600 focus:bg-white outline-none transition-all resize-none shadow-inner" placeholder="Describe in simple terms what you want the AI to monitor or help with..." value={newAgent.description} onChange={e => setNewAgent({...newAgent, description: e.target.value})} />
              </div>

              <button type="submit" className="w-full bg-slate-900 text-white py-6 rounded-[2.2rem] font-[900] hover:bg-purple-600 transition-all shadow-2xl uppercase tracking-[0.25em] text-[11px] active:scale-95 shadow-purple-500/10">Activate Neural Deployment</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiAgentsPage;
