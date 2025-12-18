
import React from 'react';
import { User, Transaction } from '../types';

const Analytics: React.FC<{ user: User; transactions: Transaction[] }> = ({ user, transactions }) => {
  const categories = [
    { name: 'Electricity', amount: 32000, percentage: 44.1, color: 'bg-orange-500' },
    { name: 'Cable TV', amount: 21000, percentage: 28.9, color: 'bg-purple-500' },
    { name: 'Internet', amount: 12500, percentage: 17.2, color: 'bg-cyan-500' },
    { name: 'Mobile Data', amount: 4000, percentage: 5.5, color: 'bg-blue-500' },
    { name: 'Airtime', amount: 2000, percentage: 2.7, color: 'bg-teal-500' },
  ];

  const totalSpent = categories.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
            </div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">Analytics Dashboard</h1>
          </div>
          <p className="text-slate-500 font-medium">Visualize your spending patterns and insights</p>
        </div>
        <select className="bg-white border border-slate-200 rounded-xl px-4 py-2 font-bold text-slate-500 text-sm focus:outline-none">
           <option>All Time</option>
           <option>This Month</option>
           <option>Last Month</option>
        </select>
      </header>

      <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-12">
        <h2 className="text-2xl font-black text-slate-800">Spending by Category</h2>
        
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="relative w-64 h-64 shrink-0">
            {/* Simple CSS-based Pie Chart representation */}
            <div className="w-full h-full rounded-full border-[32px] border-purple-500 relative">
               <div className="absolute inset-0 rounded-full border-[32px] border-orange-500 clip-pie" style={{ transform: 'rotate(0deg)' }}></div>
               <div className="absolute inset-0 rounded-full border-[32px] border-cyan-500 clip-pie-small" style={{ transform: 'rotate(160deg)' }}></div>
            </div>
            <style>{`
              .clip-pie { clip-path: polygon(50% 50%, 100% 0, 100% 100%, 0 100%, 0 0); }
              .clip-pie-small { clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 10%); }
            `}</style>
          </div>

          <div className="flex-1 w-full space-y-4">
            {categories.map((cat, i) => (
              <div key={i} className="flex items-center gap-4 group">
                 <div className={`w-3 h-3 rounded-md shrink-0 ${cat.color}`}></div>
                 <div className="flex-1 bg-slate-50 rounded-2xl p-4 flex items-center justify-between group-hover:bg-slate-100 transition-colors">
                    <span className="font-bold text-slate-700">{cat.name}</span>
                    <div className="text-right">
                       <p className="font-black text-slate-800">{user.currency === 'NGN' ? '₦' : 'GH₵'}{cat.amount.toLocaleString()}</p>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{cat.percentage}%</p>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Monthly Spending Trend</h2>
          <p className="text-slate-400 text-sm font-bold mt-1">Average: {user.currency === 'NGN' ? '₦' : 'GH₵'}36,275/month &nbsp; Total: {user.currency === 'NGN' ? '₦' : 'GH₵'}{totalSpent.toLocaleString()}</p>
        </div>
        
        <div className="h-64 w-full flex items-end gap-1">
          {[20, 30, 15, 45, 60, 40, 80, 95, 70, 85, 100].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="w-full bg-purple-500 rounded-t-xl transition-all group-hover:bg-purple-600 group-hover:scale-y-105" style={{ height: `${h}%` }}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
