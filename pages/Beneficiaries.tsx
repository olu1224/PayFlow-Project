
import React, { useState } from 'react';
import { User, Beneficiary } from '../types';

interface BeneficiariesProps {
  user: User;
  beneficiaries: Beneficiary[];
  onAdd: (b: Omit<Beneficiary, 'id'>) => void;
  onDelete: (id: string) => void;
}

const Beneficiaries: React.FC<BeneficiariesProps> = ({ user, beneficiaries, onAdd, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newB, setNewB] = useState<Omit<Beneficiary, 'id'>>({
    name: '', type: 'bank', category: 'Transfer', account: '', provider: '', country: user.country
  });

  const filtered = beneficiaries.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.provider.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    if (!newB.name || !newB.account || !newB.provider) return alert('Fill all fields');
    onAdd(newB);
    setShowAdd(false);
    setNewB({ name: '', type: 'bank', category: 'Transfer', account: '', provider: '', country: user.country });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Saved Beneficiaries</h1>
          <p className="text-slate-500 font-medium">{beneficiaries.length} beneficiaries saved</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-purple-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-purple-200 flex items-center gap-2 hover:scale-105 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Add Beneficiary
        </button>
      </header>

      {showAdd && (
        <div className="bg-white p-6 rounded-3xl border border-purple-200 shadow-xl space-y-4 animate-in slide-in-from-top-4">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <input placeholder="Name (e.g. My Phone)" className="bg-slate-50 border p-3 rounded-xl focus:outline-none" value={newB.name} onChange={e => setNewB({...newB, name: e.target.value})} />
             <input placeholder="Account / Phone" className="bg-slate-50 border p-3 rounded-xl focus:outline-none" value={newB.account} onChange={e => setNewB({...newB, account: e.target.value})} />
             <input placeholder="Provider (e.g. MTN)" className="bg-slate-50 border p-3 rounded-xl focus:outline-none" value={newB.provider} onChange={e => setNewB({...newB, provider: e.target.value})} />
           </div>
           <div className="flex justify-end gap-2">
             <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-slate-500 font-bold">Cancel</button>
             <button onClick={handleAdd} className="bg-purple-600 text-white px-6 py-2 rounded-xl font-bold">Save Beneficiary</button>
           </div>
        </div>
      )}

      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
           <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
           <input 
             type="text" 
             placeholder="Search by name, account, or provider..." 
             className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-purple-200"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(b => (
          <div key={b.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-purple-200 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <div>
                   <h4 className="font-black text-slate-800 leading-tight">{b.name}</h4>
                   <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest bg-slate-50 px-2 py-0.5 rounded-lg">{b.category}</span>
                </div>
              </div>
            </div>
            <div className="space-y-2 mb-6 text-xs font-bold">
              <div className="flex justify-between"><span className="text-slate-400">Provider:</span><span>{b.provider}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Account:</span><span>{b.account}</span></div>
            </div>
            <button onClick={() => onDelete(b.id)} className="w-full py-2.5 bg-red-50 text-red-600 rounded-xl font-bold text-xs border border-red-100 hover:bg-red-100 transition-all">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Beneficiaries;
