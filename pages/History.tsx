
import React, { useState } from 'react';
import { User, Transaction } from '../types';

const History: React.FC<{ user: User; transactions: Transaction[] }> = ({ user, transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const currencySymbol = user.currency === 'NGN' ? '₦' : user.currency === 'GHS' ? 'GH₵' : 'CFA';

  const filtered = transactions.filter(tx => 
    tx.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    tx.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Transaction History</h1>
          <p className="text-slate-500 font-medium">Detailed log of all your activities.</p>
        </div>
        <button className="bg-white border border-slate-200 px-6 py-2.5 rounded-2xl font-bold text-sm shadow-sm hover:bg-slate-50 flex items-center gap-2 transition-all active:scale-95">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          Export Statement
        </button>
      </header>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[700px]">
        <div className="p-6 space-y-6 border-b border-slate-50 shrink-0">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input 
                type="text" 
                placeholder="Filter by name, provider or category..." 
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 font-bold text-sm focus:outline-none hover:bg-slate-100 transition-colors">
                <option>All Types</option>
                <option>Debits</option>
                <option>Credits</option>
              </select>
              <select className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 font-bold text-sm focus:outline-none hover:bg-slate-100 transition-colors">
                <option>This Month</option>
                <option>Last 30 Days</option>
                <option>Last 3 Months</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white shadow-sm border-b border-slate-100">
                <th className="py-4 pl-8 bg-white/95 backdrop-blur-sm">Description</th>
                <th className="py-4 bg-white/95 backdrop-blur-sm">Category</th>
                <th className="py-4 bg-white/95 backdrop-blur-sm">Date & Time</th>
                <th className="py-4 bg-white/95 backdrop-blur-sm">Status</th>
                <th className="py-4 text-right pr-8 bg-white/95 backdrop-blur-sm">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(tx => (
                <tr key={tx.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="py-5 pl-8">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${tx.type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600'}`}>
                        {tx.type === 'credit' ? '+' : '-'}
                      </div>
                      <span className="font-bold text-slate-800">{tx.name}</span>
                    </div>
                  </td>
                  <td className="py-5">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-tight bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">{tx.category}</span>
                  </td>
                  <td className="py-5">
                    <span className="text-xs font-medium text-slate-500">{tx.date}</span>
                  </td>
                  <td className="py-5">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg shadow-sm ${
                      tx.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                      tx.status === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                      'bg-rose-50 text-rose-600 border border-rose-100'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-5 text-right pr-8">
                    <span className={`font-black tabular-nums ${tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-800'}`}>
                      {tx.type === 'credit' ? '+' : '-'}{currencySymbol}{tx.amount.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filtered.length === 0 && (
            <div className="py-40 flex flex-col items-center justify-center text-slate-300">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                 <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m21 21-4.3-4.3"/><circle cx="11" cy="11" r="8"/></svg>
               </div>
               <p className="font-black text-xl tracking-tight">No transactions found</p>
               <p className="text-sm font-medium mt-1">Try adjusting your filters or search term.</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
};

export default History;
