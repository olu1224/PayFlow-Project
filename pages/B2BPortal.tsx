
import React, { useState } from 'react';
import { User, Invoice } from '../types';

const B2BPortal: React.FC<{ user: User }> = ({ user }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: '1', clientName: 'Globex Corp', amount: 250000, dueDate: '2024-12-15', status: 'pending' },
    { id: '2', clientName: 'Sokoto Energy', amount: 800000, dueDate: '2024-11-20', status: 'paid' },
    { id: '3', clientName: 'Lagos Tech Hub', amount: 150000, dueDate: '2024-12-01', status: 'overdue' }
  ]);
  const [showBulk, setShowBulk] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [bulkData, setBulkData] = useState('');
  
  const [newInvoice, setNewInvoice] = useState({
    clientName: '',
    amount: '',
    dueDate: ''
  });

  const handleBulkTransfer = () => {
    if (!bulkData.trim()) return;
    alert(`Processing batch disbursement to ${bulkData.split('\n').length} recipients...`);
    setShowBulk(false);
    setBulkData('');
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvoice.clientName || !newInvoice.amount || !newInvoice.dueDate) return;
    
    const invoice: Invoice = {
      id: Math.random().toString(36).substr(2, 9),
      clientName: newInvoice.clientName,
      amount: parseFloat(newInvoice.amount),
      dueDate: newInvoice.dueDate,
      status: 'pending'
    };
    
    setInvoices([invoice, ...invoices]);
    setShowInvoiceModal(false);
    setNewInvoice({ clientName: '', amount: '', dueDate: '' });
  };

  const stats = [
    { label: 'Receivables', value: 400000, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Total Invoiced', value: 1200000, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Paid This Month', value: 800000, color: 'text-emerald-600', bg: 'bg-emerald-50' }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">B2B Portal</h1>
          <p className="text-slate-500 font-medium">Enterprise tools for West African business growth.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowBulk(true)} 
            className="bg-white border border-slate-200 text-slate-800 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="19" cy="11" r="2"/></svg>
            Bulk Pay
          </button>
          <button 
            onClick={() => setShowInvoiceModal(true)}
            className="bg-purple-600 text-white px-8 py-3 rounded-2xl font-black shadow-xl shadow-purple-100 hover:scale-105 transition-all flex items-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
            Create Invoice
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <div key={i} className={`p-8 rounded-[2.5rem] ${s.bg} border border-white shadow-sm flex flex-col gap-2`}>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{s.label}</p>
            <p className={`text-3xl font-black ${s.color}`}>{user.currency} {s.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-800">Recent Invoices</h3>
              <div className="flex gap-2">
                <button className="text-[10px] font-black uppercase bg-slate-50 px-3 py-1 rounded-lg text-slate-500">All</button>
                <button className="text-[10px] font-black uppercase text-slate-400 hover:text-purple-600 px-3 py-1">Pending</button>
              </div>
            </div>
            <div className="space-y-4">
              {invoices.map(inv => (
                <div key={inv.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:border-purple-200 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${inv.status === 'paid' ? 'bg-emerald-100 text-emerald-600' : inv.status === 'overdue' ? 'bg-rose-100 text-rose-600' : 'bg-white text-slate-300'}`}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    </div>
                    <div>
                      <p className="font-black text-slate-800 group-hover:text-purple-600 transition-colors">{inv.clientName}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Due: {inv.dueDate}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-800">{user.currency} {inv.amount.toLocaleString()}</p>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${
                      inv.status === 'paid' ? 'bg-emerald-100 text-emerald-600' : 
                      inv.status === 'overdue' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600 rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>
            <h3 className="text-lg font-black mb-6 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              Growth Insights
            </h3>
            <div className="space-y-6">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Monthly Volume</p>
                <p className="text-2xl font-black">{user.currency} 4,250,000</p>
                <div className="h-1 bg-white/10 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-emerald-500 w-3/4"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Clients</p>
                   <p className="text-xl font-black">128</p>
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tax Status</p>
                   <p className="text-xl font-black text-emerald-400 italic">Clear</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black text-slate-800 mb-2">Export Reports</h3>
            <p className="text-xs text-slate-400 font-medium mb-6">Generate FIRS (NG) or GRA (GH) compliant tax reports for the current quarter.</p>
            <button className="w-full bg-slate-50 border border-slate-200 py-4 rounded-2xl font-black text-sm text-slate-700 hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              Download PDF Report
            </button>
          </div>
        </div>
      </div>

      {/* New Invoice Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-800">New Client Invoice</h2>
              <button onClick={() => setShowInvoiceModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <form onSubmit={handleCreateInvoice} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Client Name</label>
                <input 
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-bold text-slate-700 focus:ring-2 focus:ring-purple-200 outline-none"
                  placeholder="e.g. Acme Africa Ltd"
                  value={newInvoice.clientName}
                  onChange={e => setNewInvoice({...newInvoice, clientName: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Amount ({user.currency})</label>
                  <input 
                    required
                    type="number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-bold text-slate-700 focus:ring-2 focus:ring-purple-200 outline-none"
                    placeholder="0.00"
                    value={newInvoice.amount}
                    onChange={e => setNewInvoice({...newInvoice, amount: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Due Date</label>
                  <input 
                    required
                    type="date"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-bold text-slate-700 focus:ring-2 focus:ring-purple-200 outline-none"
                    value={newInvoice.dueDate}
                    onChange={e => setNewInvoice({...newInvoice, dueDate: e.target.value})}
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="w-full bg-purple-600 text-white py-5 rounded-[2rem] font-black hover:bg-purple-700 transition-all shadow-xl shadow-purple-100"
              >
                Send Invoice
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Disbursement Modal */}
      {showBulk && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Bulk Disbursement</h3>
                <button onClick={() => setShowBulk(false)} className="text-slate-400 hover:text-slate-600"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
             </div>
             <p className="text-sm text-slate-500 font-medium mb-8">Process multiple payments at once. Useful for payroll or vendor settlements.</p>
             <div className="space-y-6">
                <div className="bg-slate-900 rounded-3xl p-6 text-white mb-6">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Instructions</p>
                   <p className="text-xs font-mono opacity-80">Enter data in format: ACCOUNT,AMOUNT,BANK_CODE</p>
                   <p className="text-xs font-mono opacity-80 mt-1">Example: 0123456789,50000,058</p>
                </div>
                <textarea 
                  className="w-full h-48 bg-slate-50 border border-slate-200 rounded-[2rem] p-8 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                  placeholder="Paste CSV data here..."
                  value={bulkData}
                  onChange={e => setBulkData(e.target.value)}
                ></textarea>
                <div className="flex gap-4">
                  <button onClick={handleBulkTransfer} className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-slate-800 transition-all">Execute Batch</button>
                  <button onClick={() => setShowBulk(false)} className="px-10 bg-white border border-slate-200 text-slate-500 py-4 rounded-2xl font-black hover:bg-slate-50 transition-all">Cancel</button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default B2BPortal;
