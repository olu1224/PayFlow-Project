
import React, { useState, useMemo } from 'react';
import { User, Transaction } from '../types';

type SortField = 'name' | 'category' | 'date' | 'amount';
type SortOrder = 'asc' | 'desc';
type FilterType = 'all' | 'debit' | 'credit' | 'deposit';

const History: React.FC<{ user: User; transactions: Transaction[] }> = ({ user, transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterType, setFilterType] = useState<FilterType>('all');

  const currencySymbol = user.currency === 'NGN' ? '₦' : user.currency === 'GHS' ? 'GH₵' : 'CFA';

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const processedTransactions = useMemo(() => {
    let filtered = transactions.filter(tx => 
      tx.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      tx.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterType !== 'all') {
      if (filterType === 'deposit') {
        filtered = filtered.filter(tx => tx.category === 'Deposit');
      } else {
        filtered = filtered.filter(tx => tx.type === filterType);
      }
    }

    return [...filtered].sort((a, b) => {
      if (sortField === 'amount') return sortOrder === 'asc' ? (a.amount - b.amount) : (b.amount - a.amount);
      if (sortField === 'date') {
        const isAJustNow = a.date === 'Just now';
        const isBJustNow = b.date === 'Just now';
        if (isAJustNow && !isBJustNow) return sortOrder === 'desc' ? -1 : 1;
        if (!isAJustNow && isBJustNow) return sortOrder === 'desc' ? 1 : -1;
        return 0;
      }
      const valA = String(a[sortField]).toLowerCase();
      const valB = String(b[sortField]).toLowerCase();
      return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  }, [transactions, searchTerm, sortField, sortOrder, filterType]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <svg className="ml-1.5 opacity-20" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>;
    return sortOrder === 'asc' 
      ? <svg className="ml-1.5 text-purple-600" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="m18 15-6-6-6 6"/></svg>
      : <svg className="ml-1.5 text-purple-600" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="m6 9 6 6 6-6"/></svg>;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-24 px-4 md:px-0">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none">Your History</h1>
          <p className="text-slate-500 font-medium mt-2 italic">A complete list of your account activity.</p>
        </div>
        <button className="bg-white border border-slate-200 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:bg-slate-50 flex items-center justify-center gap-2 transition-all">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          Download PDF
        </button>
      </header>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden flex flex-col h-[750px]">
        <div className="p-8 space-y-6 border-b border-slate-50 bg-white z-30">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group">
              <svg className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input 
                type="text" 
                placeholder="Search by name or category..." 
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-[1.5rem] pl-14 pr-6 py-4 font-bold text-slate-700 focus:outline-none focus:border-purple-600 focus:bg-white transition-all shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="bg-slate-50 border-2 border-slate-50 rounded-[1.5rem] px-6 py-4 font-black text-[10px] uppercase tracking-widest text-slate-500 focus:outline-none focus:border-purple-600"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as FilterType)}
            >
              <option value="all">Show All</option>
              <option value="debit">Money Sent</option>
              <option value="credit">Money Received</option>
              <option value="deposit">Deposits</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar relative">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="sticky top-0 z-20">
              <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 bg-white/95 backdrop-blur-xl border-b border-slate-100">
                <th className="py-5 pl-10 cursor-pointer select-none group" onClick={() => handleSort('name')}>
                  <div className="flex items-center">What was it for? <SortIcon field="name" /></div>
                </th>
                <th className="py-5 cursor-pointer select-none group" onClick={() => handleSort('category')}>
                  <div className="flex items-center">Category <SortIcon field="category" /></div>
                </th>
                <th className="py-5 cursor-pointer select-none group" onClick={() => handleSort('date')}>
                  <div className="flex items-center">When? <SortIcon field="date" /></div>
                </th>
                <th className="py-5 text-right pr-10 cursor-pointer select-none group" onClick={() => handleSort('amount')}>
                  <div className="flex items-center justify-end">Amount <SortIcon field="amount" /></div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {processedTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition-all group">
                  <td className="py-6 pl-10">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${tx.type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                        {tx.type === 'credit' ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m19 12-7-7-7 7"/><path d="M12 19V5"/></svg> : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m5 12 7 7 7-7"/><path d="M12 5v14"/></svg>}
                      </div>
                      <div>
                        <p className="font-black text-slate-800 text-base leading-none group-hover:text-purple-600 transition-colors">{tx.name}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1.5 opacity-60">ID: {tx.id.toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-6">
                    <span className="text-[10px] font-black uppercase bg-slate-50 text-slate-500 px-3 py-1.5 rounded-xl border border-slate-100">{tx.category}</span>
                  </td>
                  <td className="py-6">
                    <span className="text-xs font-black text-slate-500">{tx.date}</span>
                  </td>
                  <td className="py-6 text-right pr-10">
                    <div className="flex flex-col items-end">
                      <span className={`font-black text-lg tracking-tighter ${tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-900'}`}>
                        {tx.type === 'credit' ? '+' : '-'}{currencySymbol}{tx.amount.toLocaleString()}
                      </span>
                      <span className="text-[9px] font-bold text-slate-300 uppercase mt-1">Settled</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {processedTransactions.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 p-20 text-center">
               <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-4">
                 <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
               </div>
               <p className="font-black text-xl text-slate-400">No records found</p>
               <button onClick={() => { setSearchTerm(''); setFilterType('all'); }} className="mt-4 text-[10px] font-black uppercase tracking-widest text-purple-600 hover:bg-purple-50 px-6 py-2 rounded-xl transition-all">Clear Search</button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default History;
