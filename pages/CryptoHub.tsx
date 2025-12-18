
import React, { useState } from 'react';
import { User, CryptoAsset } from '../types';

interface CryptoHubProps {
  user: User;
  portfolio: CryptoAsset[];
  onTrade: (id: string, amount: number, price: number, isBuy: boolean) => void;
}

const CryptoHub: React.FC<CryptoHubProps> = ({ user, portfolio, onTrade }) => {
  const [activeAsset, setActiveAsset] = useState('btc');
  const [tradeAmount, setTradeAmount] = useState('');

  const assets = [
    { id: 'btc', name: 'Bitcoin', symbol: 'BTC', price: 42350, change: '+2.4%', color: 'bg-orange-100 text-orange-600' },
    { id: 'eth', name: 'Ethereum', symbol: 'ETH', price: 2240, change: '-1.2%', color: 'bg-blue-100 text-blue-600' },
    { id: 'usdt', name: 'Tether', symbol: 'USDT', price: 1, change: '0.0%', color: 'bg-emerald-100 text-emerald-600' },
  ];

  const currentAsset = assets.find(a => a.id === activeAsset)!;
  const inPortfolio = portfolio.find(p => p.id === activeAsset);

  const handleExecute = (isBuy: boolean) => {
    const amt = parseFloat(tradeAmount);
    if (!amt || amt <= 0) return alert('Enter a valid amount');
    onTrade(activeAsset, amt, currentAsset.price, isBuy);
    setTradeAmount('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Crypto Hub</h1>
        <p className="text-slate-500 font-medium">Securely buy and sell digital assets in {user.country}.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {assets.map(asset => (
              <button 
                key={asset.id}
                onClick={() => setActiveAsset(asset.id)}
                className={`p-4 rounded-3xl border transition-all text-left ${activeAsset === asset.id ? 'bg-white border-purple-600 shadow-xl' : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${asset.color}`}>
                  <span className="font-black">{asset.symbol[0]}</span>
                </div>
                <p className="font-black text-slate-800">{asset.name}</p>
                <p className="text-lg font-black text-slate-900 mt-1">${asset.price.toLocaleString()}</p>
                <p className={`text-xs font-bold ${asset.change.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>{asset.change}</p>
              </button>
            ))}
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
             <h3 className="font-black text-slate-800 mb-6">Your Holdings</h3>
             <div className="space-y-4">
               {portfolio.map(p => (
                 <div key={p.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center font-black text-slate-400">{p.symbol[0]}</div>
                     <div>
                       <p className="font-black text-slate-800">{p.name}</p>
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{p.amount} {p.symbol}</p>
                     </div>
                   </div>
                   <p className="font-black text-slate-800 text-sm">${(p.amount * (assets.find(a => a.id === p.id)?.price || 0)).toLocaleString()}</p>
                 </div>
               ))}
               {portfolio.length === 0 && <p className="text-center text-slate-400 py-4 font-bold">No assets in portfolio</p>}
             </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-2xl flex flex-col h-fit sticky top-8">
          <h3 className="text-lg font-black text-slate-800 mb-6">Trade {currentAsset.symbol}</h3>
          <div className="space-y-4 mb-8">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Trade Amount ({currentAsset.symbol})</label>
              <input 
                type="number" 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 font-black text-2xl focus:ring-2 focus:ring-purple-600 focus:outline-none"
                placeholder="0.00"
                value={tradeAmount}
                onChange={e => setTradeAmount(e.target.value)}
              />
            </div>
            <p className="text-xs text-slate-400 text-center font-bold">≈ {user.currency} {(parseFloat(tradeAmount || '0') * currentAsset.price * 1500).toLocaleString()}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <button onClick={() => handleExecute(true)} className="bg-emerald-500 text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all">Buy</button>
             <button onClick={() => handleExecute(false)} className="bg-red-500 text-white py-4 rounded-2xl font-black shadow-lg shadow-red-100 hover:bg-red-600 transition-all">Sell</button>
          </div>
          <p className="text-[10px] text-slate-400 text-center mt-6 uppercase tracking-widest font-black">Powered by PayFlow Crypto engine</p>
        </div>
      </div>
    </div>
  );
};

export default CryptoHub;
