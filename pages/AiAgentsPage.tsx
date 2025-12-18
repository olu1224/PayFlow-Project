
import React from 'react';
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
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      )
    },
    idle: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-100',
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      )
    },
    deploying: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-100',
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      )
    }
  };

  const config = configs[status] || configs.idle;

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${config.bg} ${config.text} ${config.border} transition-all duration-300`}>
      {config.icon}
      <span className="text-[10px] font-black uppercase tracking-widest">{status}</span>
    </div>
  );
};

const AiAgentsPage: React.FC<AiAgentsPageProps> = ({ user, agents, setAgents }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">AI Agents</h1>
          <p className="text-slate-500 font-medium">Autonomous workers handling your finances 24/7.</p>
        </div>
        <button className="bg-slate-900 text-white px-8 py-3.5 rounded-[1.5rem] font-black shadow-xl shadow-slate-200 hover:scale-105 transition-all flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          Deploy New Agent
        </button>
      </header>

      <div className="bg-gradient-to-br from-purple-600 via-indigo-700 to-indigo-900 p-1 rounded-[3rem] shadow-2xl shadow-purple-200">
        <div className="bg-white/5 backdrop-blur-3xl p-10 rounded-[2.9rem] flex flex-col md:flex-row items-center gap-10">
          <div className="w-40 h-40 bg-white/10 rounded-[2.5rem] flex items-center justify-center flex-shrink-0 border border-white/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
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
          <div key={agent.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:border-purple-200 transition-all shadow-sm hover:shadow-xl group flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none">
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
              <h4 className="font-black text-slate-800 text-2xl tracking-tight leading-tight">{agent.name}</h4>
              <p className="text-xs text-purple-600 font-black uppercase tracking-widest">{agent.role}</p>
              <p className="text-slate-500 font-medium text-sm leading-relaxed pt-2">
                {agent.description}
              </p>
            </div>

            <div className="mt-10 pt-6 border-t border-slate-50 flex items-center justify-between relative z-10">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${agent.id}-${i}`} alt="Avatar" />
                  </div>
                ))}
              </div>
              <button className={`px-6 py-3 rounded-2xl font-black text-xs transition-all ${
                agent.status === 'active' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'bg-purple-600 text-white shadow-lg shadow-purple-100'
              }`}>
                {agent.status === 'active' ? 'View Activity' : 'Deploy Now'}
              </button>
            </div>
          </div>
        ))}

        {/* Placeholder for "Add New" */}
        <button className="bg-slate-50 p-8 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center group hover:bg-white hover:border-purple-300 transition-all min-h-[300px]">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" className="group-hover:stroke-purple-600 transition-colors"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          </div>
          <p className="font-black text-slate-400 group-hover:text-slate-800 transition-colors">Add New Agent</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 group-hover:text-purple-600 transition-colors mt-1">Deploy Custom Logic</p>
        </button>
      </div>
    </div>
  );
};

export default AiAgentsPage;
