
import React, { useState } from 'react';
import { User, RecurringPayment } from '../types';
import ServiceModal from '../components/ServiceModal';

interface RecurringPaymentsProps {
  user: User;
  recurringPayments: RecurringPayment[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onScheduleNew: (amount: number, name: string, category: string, isRecurring: boolean, schedule: any) => void;
}

const RecurringPayments: React.FC<RecurringPaymentsProps> = ({ user, recurringPayments, onToggle, onDelete, onScheduleNew }) => {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const handleScheduleClick = () => {
    // Open a picker first, or default to a common service
    setSelectedService('Electricity');
    setShowScheduleModal(true);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Wallet Automations</h1>
          <p className="text-slate-500 font-medium">Automatic payments and recurring settlements.</p>
        </div>
        <button 
          onClick={handleScheduleClick}
          className="bg-purple-600 text-white px-8 py-3.5 rounded-[1.5rem] font-black shadow-xl shadow-purple-100 hover:scale-105 transition-all flex items-center gap-2"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
          Schedule New
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recurringPayments.map(p => (
          <div key={p.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-purple-200 transition-all group flex flex-col h-full">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 ${p.active ? 'bg-purple-50 text-purple-600' : 'bg-slate-50 text-slate-400'} rounded-2xl flex items-center justify-center transition-all`}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 5.5a2.5 2.5 0 1 0-3.536-3.536L6.5 7.5M12 22v-3"/><path d="M12 2v3"/><path d="M22 12h-3"/><path d="M2 12h3"/></svg>
                </div>
                <div>
                   <h4 className="font-black text-slate-800 leading-tight text-lg">{p.name}</h4>
                   <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest bg-slate-50 px-2 py-0.5 rounded-lg">{p.category}</span>
                </div>
              </div>
              <button 
                onClick={() => onToggle(p.id)}
                className={`w-12 h-6 rounded-full transition-all relative ${p.active ? 'bg-purple-600' : 'bg-slate-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${p.active ? 'right-1' : 'left-1'}`}></div>
              </button>
            </div>

            <div className="space-y-4 mb-8 flex-1">
              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <div className="flex justify-between items-center py-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Next Payout</span>
                  <span className="font-black text-slate-800 text-sm">{user.currency} {p.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-1 mt-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Frequency</span>
                  <span className="font-black text-slate-800 text-sm capitalize">{p.frequency}</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 font-medium px-2">Next payment scheduled for <span className="font-bold text-slate-800">{p.startDate}</span></p>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-50">
               <button className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-black text-xs hover:bg-slate-50 transition-all">Configure</button>
               <button onClick={() => onDelete(p.id)} className="flex-1 py-3 bg-rose-50 text-rose-600 rounded-xl font-black text-xs border border-rose-100 hover:bg-rose-100 transition-all">Cancel Plan</button>
            </div>
          </div>
        ))}
        {recurringPayments.length === 0 && (
          <div className="col-span-full py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-400">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <p className="font-black text-xl text-slate-300 tracking-tight">No Active Automations</p>
            <p className="text-sm font-medium mt-2 max-w-xs text-center leading-relaxed">Automate your essential bills so you never miss a payment deadline again.</p>
            <button onClick={handleScheduleClick} className="mt-8 bg-purple-100 text-purple-600 px-8 py-3 rounded-2xl font-black text-sm hover:bg-purple-600 hover:text-white transition-all">Setup First Automation</button>
          </div>
        )}
      </div>

      {showScheduleModal && selectedService && (
        <ServiceModal 
          isOpen={true} 
          onClose={() => setShowScheduleModal(false)} 
          serviceName={selectedService}
          country={user.country}
          currency={user.currency}
          onComplete={(amt, name, isRec, schedule) => {
            onScheduleNew(amt, name, selectedService, true, schedule);
            setShowScheduleModal(false);
          }}
        />
      )}
    </div>
  );
};

export default RecurringPayments;
