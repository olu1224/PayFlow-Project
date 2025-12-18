
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
      {/* Background layer for shimmer effect on deploying */}
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

    // Simulate "activation" after a few seconds
    setTimeout(() => {
      setAgents(current => current.map(a => a.id === agent.id ? { ...a, status: 'active' } : a));
    }, 4000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
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
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">AI Agents</h1>
          <p className="text-slate-500 font-medium">Autonomous workers handling your finances 24/7.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white px-8 py-3.5 rounded-[1.5rem] font-black shadow-xl shadow-slate-200 hover:scale-105 transition-all flex items-center gap-2"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          Deploy New Agent
        </button>
      </header>

      <div className="bg-gradient-to-br from-purple-600 via-indigo-700 to-indigo-900 p-1 rounded-[3rem] shadow-2xl shadow-purple-200">
        <div className="bg-white/5 backdrop-blur-3xl p-10 rounded-[2.9rem] flex flex-col md:flex-row items-center gap-10">
          <div className="w-40 h-40 bg-white/10 rounded-[2.5rem] flex items-center justify-center flex-shrink-0 border border-white/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-transparent opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="relative z-10"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
          </div>
          <div className="space-y-4 text-center md:text-left">
             <h3 className="text-3xl font-black text-white leading-tight">Agent Factory</h3>
             <p className="text-purple-100/80 text-lg max-w-2xl font-medium leading-relaxed">
               Create specialized agents to monitor exchange rates, automate savings, or hunt for the best bills and investment opportunities across West Africa.
             </p>
             <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl border border-white/10 text-white text-xs font-bold">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  Real-time Execution
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl border border-white/10 text-white text-xs font-bold">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  Cross-Platform Access
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
        {agents.map(agent => (
          <div key={agent.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:border-purple-200 transition-all shadow-sm hover:shadow-xl group flex flex-col relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/></svg>
            </div>
            
            <div className="flex items-center justify-between mb-8 relative z-10">
              <StatusBadge status={agent.status} />
              <button 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all"
                onClick={() => setAgents(prev => prev.filter(a => a.id !== agent.id))}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
            </div>

            <div className="flex-1 space-y-3 relative z-10">
              <h4 className="font-black text-slate-800 text-2xl tracking-tight leading-tight group-hover:text-purple-600 transition-colors">{agent.name}</h4>
              <p className="text-xs text-purple-600 font-black uppercase tracking-widest">{agent.role}</p>
              <p className="text-slate-500 font-medium text-sm leading-relaxed pt-2">
                {agent.description}
              </p>
            </div>

            <div className="mt-10 pt-6 border-t border-slate-50 flex items-center justify-between relative z-10">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden transition-transform group-hover:-translate-y-1 group-hover:rotate-6">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${agent.id}-${i}`} alt="Avatar" />
                  </div>
                ))}
              </div>
              <button className={`px-6 py-3 rounded-2xl font-black text-xs transition-all active:scale-95 ${
                agent.status === 'active' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 hover:bg-slate-800' : 'bg-purple-600 text-white shadow-lg shadow-purple-100 hover:bg-purple-700'
              }`}>
                {agent.status === 'active' ? 'View Activity' : 'Deploying...'}
              </button>
            </div>
          </div>
        ))}

        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-50 p-8 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center group hover:bg-white hover:border-purple-300 transition-all min-h-[300px]"
        >
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" className="group-hover:stroke-purple-600 transition-colors"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          </div>
          <p className="font-black text-slate-400 group-hover:text-slate-800 transition-colors">Add New Agent</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 group-hover:text-purple-600 transition-colors mt-1">Deploy Custom Logic</p>
        </button>
      </div>

      {/* Deployment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Agent Deployment</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            <form onSubmit={handleDeploy} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Agent Identifier Name</label>
                <input 
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold text-slate-700 focus:ring-2 focus:ring-purple-600 outline-none transition-all"
                  placeholder="e.g. Arbitrage Hunter"
                  value={newAgent.name}
                  onChange={e => setNewAgent({...newAgent, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Specialized Role</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold text-slate-700 focus:ring-2 focus:ring-purple-600 outline-none transition-all appearance-none"
                  value={newAgent.role}
                  onChange={e => setNewAgent({...newAgent, role: e.target.value})}
                >
                  <option>Financial Intelligence</option>
                  <option>Auto-Budgeting</option>
                  <option>Bill Optimization</option>
                  <option>Crypto Arbitrage</option>
                  <option>Savings Automation</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mission Description</label>
                <textarea 
                  required
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-medium text-slate-600 focus:ring-2 focus:ring-purple-600 outline-none transition-all resize-none"
                  placeholder="Describe the specific task for this agent..."
                  value={newAgent.description}
                  onChange={e => setNewAgent({...newAgent, description: e.target.value})}
                />
              </div>

              <div className="bg-purple-50 p-6 rounded-3xl border border-purple-100 flex items-start gap-4">
                 <div className="w-10 h-10 bg-purple-600 text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-purple-200">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                 </div>
                 <div className="space-y-1">
                   <p className="text-xs font-black text-purple-700 uppercase tracking-tight">Autonomous Safety Protocol</p>
                   <p className="text-[10px] text-purple-600 font-medium leading-relaxed">Agent status defaults to <span className="font-bold">deploying</span>. Security checks take approx. 60 seconds before full activation.</p>
                 </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-purple-600 text-white py-5 rounded-[2rem] font-black hover:bg-purple-700 transition-all shadow-xl shadow-purple-100 flex items-center justify-center gap-3 group"
              >
                <span>Authorize & Deploy Agent</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiAgentsPage;
