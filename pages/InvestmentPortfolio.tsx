
import React, { useState } from 'react';
import { User } from '../types';

const InvestmentPortfolio: React.FC<{ user: User }> = ({ user }) => {
  const [showCreate, setShowCreate] = useState(false);
  const [portfolios, setPortfolios] = useState<{ id: string; name: string; balance: number }[]>([]);
  const [newName, setNewName] = useState('');

  const handleCreate = () => {
    if (!newName) return;
    setPortfolios([...portfolios, { id: Date.now().toString(), name: newName, balance: 0 }]);
    setNewName('');
    setShowCreate(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Investment Portfolio</h1>
            <p className="text-slate-500 font-medium">AI-powered portfolio analysis and automatic rebalancing</p>
          </div>
        </div>
        {!showCreate && (
          <button 
            onClick={() => setShowCreate(true)}
            className="bg-purple-600 text-white px-6 py-2.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-purple-700 transition-all shadow-lg shadow-purple-100"
          >
            <span className="text-xl">+</span> New Portfolio
          </button>
        )}
      </header>

      {showCreate && (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center animate-in slide-in-from-top-4">
          <input 
            placeholder="Portfolio name (e.g., Retirement Fund)" 
            className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-3 focus:outline-none focus:ring-2 focus:ring-purple-200 font-medium"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <div className="flex gap-2 shrink-0">
            <button onClick={handleCreate} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800">Create</button>
            <button onClick={() => setShowCreate(false)} className="bg-white border border-slate-200 text-slate-600 px-8 py-3 rounded-xl font-bold hover:bg-slate-50">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-20 flex flex-col items-center justify-center text-center space-y-6">
        {portfolios.length === 0 ? (
          <>
            <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
               <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2"/><path d="M18 12H15"/><rect width="8" height="8" x="14" y="8" rx="2"/></svg>
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800">No Portfolios Yet</h3>
              <p className="text-slate-400 font-medium max-w-sm mx-auto">Create your first investment portfolio to get AI-powered rebalancing suggestions</p>
            </div>
            <button 
              onClick={() => setShowCreate(true)}
              className="bg-purple-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-purple-100 flex items-center gap-2"
            >
              <span className="text-xl">+</span> Create Portfolio
            </button>
          </>
        ) : (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolios.map(p => (
              <div key={p.id} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 text-left hover:border-purple-200 transition-all group">
                <p className="text-xs font-black text-purple-600 uppercase tracking-widest mb-1">Portfolio</p>
                <h4 className="text-xl font-black text-slate-800 mb-6">{p.name}</h4>
                <div className="flex justify-between items-end">
                   <div>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total Value</p>
                     <p className="text-2xl font-black text-slate-800 leading-none mt-1">{user.currency} {p.balance.toLocaleString()}</p>
                   </div>
                   <button className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-purple-600 group-hover:border-purple-200">
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestmentPortfolio;
