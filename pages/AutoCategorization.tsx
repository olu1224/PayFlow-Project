
import React from 'react';
import { User, Transaction } from '../types';

const AutoCategorization: React.FC<{ user: User; transactions: Transaction[] }> = ({ user, transactions }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
            </div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">AI Auto-Categorization</h1>
          </div>
          <p className="text-slate-500 font-medium">Use AI to automatically categorize your transactions</p>
        </div>
        <button className="bg-purple-200 text-purple-700 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-purple-300 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
          Categorize All
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-2">
           <p className="text-sm font-bold text-slate-400">Total Transactions</p>
           <p className="text-4xl font-black text-slate-800">{transactions.length}</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-2">
           <p className="text-sm font-bold text-slate-400">Uncategorized</p>
           <p className="text-4xl font-black text-orange-500">0</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-2">
           <p className="text-sm font-bold text-slate-400">AI Suggestions</p>
           <p className="text-4xl font-black text-purple-600">0</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-40 flex flex-col items-center justify-center text-center space-y-6">
         <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-purple-400">
           <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
         </div>
         <div>
           <h3 className="text-2xl font-black text-slate-800">All transactions are categorized!</h3>
           <p className="text-slate-400 font-medium">Your transactions are properly organized.</p>
         </div>
      </div>
    </div>
  );
};

export default AutoCategorization;
