
import React, { useState, useMemo } from 'react';
import { User, Transaction } from '../types';
import { t } from '../localization';

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
    if (sortField === field) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortOrder('desc'); }
  };

  const processedTransactions = useMemo(() => {
    let filtered = transactions.filter(tx => 
      tx.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      tx.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filterType !== 'all') {
      if (filterType === 'deposit') filtered = filtered.filter(tx => tx.category === 'Deposit');
      else filtered = filtered.filter(tx => tx.type === filterType);
    }
    return [...filtered].sort((a, b) => {
      if (sortField === 'amount') return sortOrder === 'asc' ? (a.amount - b.amount) : (b.amount - a.amount);
      return 0;
    });
  }, [transactions, searchTerm, sortField, sortOrder, filterType]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-24 px-4">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-[1000] text-slate-800 tracking-tight leading-none">{t('history_title', user.country)}</h1>
          <p className="text-slate-500 font-medium mt-2">{t('history_desc', user.country)}</p>
        </div>
      </header>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden flex flex-col h-[700px]">
        <div className="p-8 border-b border-slate-50 bg-white">
          <div className="flex flex-col md:flex-row gap-4">
            <input 
              type="text" 
              placeholder={t('history_search', user.country)} 
              className="flex-1 bg-slate-50 border-2 border-slate-50 rounded-[1.5rem] px-6 py-4 font-bold text-slate-700 outline-none focus:border-indigo-600 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select 
              className="bg-slate-50 border-2 border-slate-50 rounded-[1.5rem] px-6 py-4 font-black text-[10px] uppercase text-slate-500 outline-none"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as FilterType)}
            >
              <option value="all">{user.country === 'Senegal' ? 'Tout Afficher' : 'Show All'}</option>
              <option value="debit">{t('history_sent', user.country)}</option>
              <option value="credit">{t('history_received', user.country)}</option>
              <option value="deposit">{t('history_deposits', user.country)}</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="sticky top-0 z-20 bg-white/95 backdrop-blur-xl border-b border-slate-100">
              <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <th className="py-6 pl-10 cursor-pointer" onClick={() => handleSort('name')}>{t('history_for', user.country)}</th>
                <th className="py-6 cursor-pointer" onClick={() => handleSort('category')}>{t('history_cat', user.country)}</th>
                <th className="py-6 cursor-pointer" onClick={() => handleSort('date')}>{t('history_when', user.country)}</th>
                <th className="py-6 text-right pr-10 cursor-pointer" onClick={() => handleSort('amount')}>{t('history_amount', user.country)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {processedTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition-all">
                  <td className="py-6 pl-10">
                    <p className="font-black text-slate-800 text-sm">{tx.name}</p>
                    <p className="text-[8px] text-slate-400 uppercase tracking-widest mt-1">ID: {tx.id.toUpperCase()}</p>
                  </td>
                  <td className="py-6">
                    <span className="text-[9px] font-black uppercase bg-slate-100 text-slate-500 px-3 py-1 rounded-lg">{tx.category}</span>
                  </td>
                  <td className="py-6">
                    <span className="text-xs font-black text-slate-500">{tx.date}</span>
                  </td>
                  <td className="py-6 text-right pr-10">
                    <span className={`font-black text-lg ${tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {tx.type === 'credit' ? '+' : '-'}{currencySymbol}{tx.amount.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;
