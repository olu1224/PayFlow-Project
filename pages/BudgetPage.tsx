
import React, { useState } from 'react';
import { User, BudgetGoal } from '../types';
import { generateBudgetStrategy } from '../geminiService';

interface BudgetPageProps {
  user: User;
  goals: BudgetGoal[];
  onAddGoal: (goal: Omit<BudgetGoal, 'id'>) => void;
}

const BudgetPage: React.FC<BudgetPageProps> = ({ user, goals, onAddGoal }) => {
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', target: '', color: 'bg-purple-600' });

  const getStrategy = async () => {
    setLoading(true);
    try {
      // Fix: Passed user.country as required by generateBudgetStrategy (Expected 4 arguments)
      const res = await generateBudgetStrategy(goals, user.balance, user.currency, user.country);
      setStrategy(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.target) return;
    onAddGoal({ 
      title: newGoal.title, 
      target: parseFloat(newGoal.target), 
      current: 0, 
      color: newGoal.color 
    });
    setShowAdd(false);
    setNewGoal({ title: '', target: '', color: 'bg-purple-600' });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Budgets & Goals</h1>
          <p className="text-slate-500 font-medium">Plan your financial future with AI-driven strategies.</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-white border border-slate-200 text-slate-800 px-6 py-3 rounded-2xl font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Add Goal
        </button>
      </header>

      {showAdd && (
        <div className="bg-white p-6 rounded-3xl border border-purple-200 shadow-xl space-y-4 animate-in slide-in-from-top-4">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <input placeholder="Goal Title" className="bg-slate-50 border p-3 rounded-xl focus:outline-none font-bold" value={newGoal.title} onChange={e => setNewGoal({...newGoal, title: e.target.value})} />
             <input type="number" placeholder="Target Amount" className="bg-slate-50 border p-3 rounded-xl focus:outline-none font-bold" value={newGoal.target} onChange={e => setNewGoal({...newGoal, target: e.target.value})} />
           </div>
           <div className="flex justify-end gap-2">
             <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-slate-500 font-bold">Cancel</button>
             <button onClick={handleAddGoal} className="bg-purple-600 text-white px-6 py-2 rounded-xl font-bold">Create Goal</button>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
             <div className="flex items-center justify-between mb-8">
                <h3 className="font-black text-slate-800">Active Goals</h3>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">{goals.length} Active</span>
             </div>
             
             <div className="space-y-8">
                {goals.map((goal) => (
                  <div key={goal.id} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <div>
                        <h4 className="font-bold text-slate-800">{goal.title}</h4>
                        <p className="text-xs text-slate-500 font-medium">{user.currency} {goal.current.toLocaleString()} / {goal.target.toLocaleString()}</p>
                      </div>
                      <span className="text-sm font-black text-slate-800">{Math.round((goal.current / goal.target) * 100)}%</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${goal.color} rounded-full transition-all duration-1000`} 
                        style={{ width: `${Math.min(100, (goal.current / goal.target) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden flex flex-col h-fit">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
              AI Strategizer
            </h3>
            {strategy ? (
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/20 text-sm leading-relaxed whitespace-pre-wrap mb-4">
                {strategy}
              </div>
            ) : (
              <p className="text-indigo-100 text-sm mb-6">Get a tailored plan for your West African goals.</p>
            )}
            <button 
              onClick={getStrategy}
              disabled={loading}
              className="w-full bg-white text-indigo-700 py-3 rounded-2xl font-black shadow-lg hover:scale-105 transition-all disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : (strategy ? 'Refresh Strategy' : 'Generate Strategy')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetPage;
