
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
      border: 'border-emerald-100',
      hoverShadow: 'hover:shadow-emerald-200/50',
      hoverClass: 'hover:animate-pulse-subtle',
      icon: (
        <svg className="transition-transform duration-500 group-hover:scale-125" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      )
    },
    idle: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-100',
      hoverShadow: 'hover:shadow-amber-200/50',
      hoverClass: 'hover:animate-rock-subtle',
      icon: (
        <svg className="transition-transform duration-700 group-hover:rotate-180" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      )
    },
    deploying: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-100',
      hoverShadow: 'hover:shadow-blue-200/50',
      hoverClass: 'hover:animate-shimmer-subtle',
      icon: (
        <svg className="animate-spin duration-1000 group-hover:animate-[spin_0.4s_linear_infinite]" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      )
    }
  };

  const config = configs[status] || configs.idle;

  return (
    <div className={`group flex items-center gap-1.5 px-4 py-1.5 rounded-full border ${config.bg} ${config.text} ${config.border} transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 hover:shadow-lg ${config.hoverShadow} ${config.hoverClass} cursor-default select-none relative overflow-hidden`}>
      <span className="relative z-10 flex items-center gap-1.5">
        {config.icon}
        <span className="text-[10px] font-black uppercase tracking-widest">{status}</span>
      </span>
      {status === 'deploying' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shimmer-sweep"></div>
      )}
    </div>
  );
};

const AiAgentsPage: React.FC<AiAgentsPageProps> = ({ user, agents, setAgents }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAgent, setNewAgent] = useState({
    name: '',
    role: 'Financial Intelligence',
    description: ''
  });

  const handleDeploy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgent.name.trim() || !newAgent.description.trim()) return;

    const agent: AIAgent = {
      id: Math.random().toString(36).substr(2, 9),
      name: newAgent.name,
      role: newAgent.role,
      status: 'deploying',
      description: newAgent.description
    };

    setAgents([agent, ...agents]);
    setIsModalOpen(false);
    setNewAgent({ name: '', role: 'Financial Intelligence', description: '' });

    setTimeout(() => {
      setAgents(current => current.map(a => a.id === agent.id ? { ...a, status: 'active' } : a));
    }, 4000);
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      <style>{`
        @keyframes pulse-subtle {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          50% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
        }
        @keyframes rock-subtle {
          0%, 100% { transform: rotate(0deg) scale(1.1) translateY(-2px); }
          25% { transform: rotate(2deg) scale(1.1) translateY(-2px); }
          75% { transform: rotate(-2deg) scale(1.1) translateY(-2px); }
        }
        @keyframes shimmer-sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .hover\:animate-pulse-subtle:hover {
          animation: pulse-subtle 1.5s infinite;
        }
        .hover\:animate-rock-subtle:hover {
          animation: rock-subtle 0.5s infinite ease-in-out;
        }
        .group-hover\:animate-shimmer-sweep {
          animation: shimmer-sweep 1.5s infinite;
        }
      `}</style>

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-[900] text-slate-900 tracking-tight leading-none">AI Agents</h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-2">Autonomous Hub Grid Active</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white px-10 py-4 rounded-[2rem] font-black shadow-2xl hover:scale-105 transition-all flex items-center gap-3 uppercase tracking-widest text-[10px]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          Deploy Protocol
        </button>
      </header>

      <div className="bg-slate-900 p-1.5 rounded-[4rem] shadow-2xl">
        <div className="bg-[#0D1525] p-12 md:p-16 rounded-[3.8rem] flex flex-col md:flex-row items-center gap-12 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600 rounded-full blur-[150px] opacity-10 -mr-48 -mt-48"></div>
          <div className="w-48 h-48 bg-white/5 rounded-[3rem] flex items-center justify-center flex-shrink-0 border border-white/10 relative overflow-hidden group">
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-40"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/></svg>
          </div>
          <div className="space-y-6 text-center md:text-left relative z-10">
             <h3 className="text-4xl font-[900] text-white tracking-tighter leading-none">Agent Synthesis Factory</h3>
             <p className="text-slate-400 text-lg max-w-3xl font-bold leading-relaxed">
               Construct specialized neural workers to automate utility settlements, cross-border arbitrage, or enterprise-grade invoice tracking across the regional grid.
             </p>
             <div className="flex flex-wrap gap-4 pt-4 justify-center md:justify-start">
                <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/10 text-white text-[10px] font-black uppercase tracking-widest">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  Neural Scoring
                </div>
                <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/10 text-white text-[10px] font-black uppercase tracking-widest">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  Multi-Node API
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
        {agents.map(agent => (
          <div key={agent.id} className="bg-white p-10 rounded-[3.5rem] border border-slate-100 hover:border-purple-200 transition-all shadow-sm hover:shadow-2xl group flex flex-col relative overflow-hidden h-full">
            <div className="flex items-center justify-between mb-10 relative z-10">
              <StatusBadge status={agent.status} />
              <button 
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all"
                onClick={() => setAgents(prev => prev.filter(a => a.id !== agent.id))}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
            </div>

            <div className="flex-1 space-y-4 relative z-10">
              <h4 className="font-[900] text-slate-900 text-3xl tracking-tighter leading-none">{agent.name}</h4>
              <p className="text-[10px] text-purple-600 font-black uppercase tracking-[0.3em]">{agent.role}</p>
              <p className="text-slate-500 font-bold text-sm leading-relaxed pt-4">
                {agent.description}
              </p>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between relative z-10">
              <div className="flex -space-x-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center overflow-hidden transition-transform group-hover:-translate-y-2">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${agent.id}-${i}`} alt="Avatar" />
                  </div>
                ))}
              </div>
              <button className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 ${
                agent.status === 'active' ? 'bg-slate-900 text-white shadow-xl hover:bg-slate-800' : 'bg-purple-600 text-white shadow-xl'
              }`}>
                {agent.status === 'active' ? 'Audit Logs' : 'Syncing...'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[4rem] p-12 md:p-16 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-4xl font-[900] text-slate-900 tracking-tighter">Protocol Deployment</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-4 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-all">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>

            <form onSubmit={handleDeploy} className="space-y-8">
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Agent Handle</label>
                <input required className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] px-8 py-6 font-black text-slate-900 focus:border-purple-600 outline-none transition-all" placeholder="e.g. Settlement Ghost" value={newAgent.name} onChange={e => setNewAgent({...newAgent, name: e.target.value})} />
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Logic Class</label>
                <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] px-8 py-6 font-black text-slate-900 focus:border-purple-600 outline-none transition-all appearance-none" value={newAgent.role} onChange={e => setNewAgent({...newAgent, role: e.target.value})}>
                  <option>Financial Intelligence</option>
                  <option>Auto-Budgeting</option>
                  <option>Bill Optimization</option>
                  <option>Crypto Arbitrage</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Execution Brief</label>
                <textarea required rows={3} className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] px-8 py-6 font-bold text-slate-700 focus:border-purple-600 outline-none transition-all resize-none" placeholder="Describe instructions..." value={newAgent.description} onChange={e => setNewAgent({...newAgent, description: e.target.value})} />
              </div>

              <button type="submit" className="w-full bg-purple-600 text-white py-7 rounded-[2.5rem] font-black hover:bg-purple-700 transition-all shadow-2xl uppercase tracking-[0.2em] text-xs">Authorize & Deploy</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiAgentsPage;
