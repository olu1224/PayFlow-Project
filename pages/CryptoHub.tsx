
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { User, CryptoAsset } from '../types';
import { Trade } from '../App';

interface CryptoHubProps {
  user: User;
  portfolio: CryptoAsset[];
  trades: Trade[];
  onTrade: (id: string, amount: number, price: number, isBuy: boolean) => void;
  onWithdrawCrypto: (assetId: string, amount: number, address: string, priceUsd: number) => void;
}

interface MarketAsset {
  id: string;
  name: string;
  symbol: string;
  price: number;
  prevPrice: number;
  openPrice: number;
  change: string;
  isPositive: boolean;
  color: string;
  network: string;
}

const CryptoHub: React.FC<CryptoHubProps> = ({ user, portfolio, trades, onTrade, onWithdrawCrypto }) => {
  const [marketAssets, setMarketAssets] = useState<MarketAsset[]>([
    { id: 'btc', name: 'Bitcoin', symbol: 'BTC', price: 42350, prevPrice: 42350, openPrice: 41200, change: '+2.4%', isPositive: true, color: 'bg-orange-100 text-orange-600', network: 'Bitcoin Network' },
    { id: 'eth', name: 'Ethereum', symbol: 'ETH', price: 2240, prevPrice: 2240, openPrice: 2280, change: '-1.2%', isPositive: false, color: 'bg-blue-100 text-blue-600', network: 'ERC-20' },
    { id: 'usdt', name: 'Tether', symbol: 'USDT', price: 1.0001, prevPrice: 1.0001, openPrice: 1.00, change: '+0.01%', isPositive: true, color: 'bg-emerald-100 text-emerald-600', network: 'TRC-20 / ERC-20' },
  ]);

  const [activeAssetId, setActiveAssetId] = useState('btc');
  const [tradeAmount, setTradeAmount] = useState('');
  const [mode, setMode] = useState<'buy' | 'sell' | 'withdraw'>('buy');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // History Filter State
  const [historyFilter, setHistoryFilter] = useState<'all' | 'buy' | 'sell' | 'withdraw'>('all');
  const [historySearch, setHistorySearch] = useState('');

  // Simulation Engine: Fluctuate prices every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketAssets(prev => prev.map(asset => {
        // Tether fluctuates much less
        const volatility = asset.id === 'usdt' ? 0.0001 : 0.0015;
        const changePercent = (Math.random() * 2 - 1) * volatility;
        const newPrice = asset.price * (1 + changePercent);
        
        // Calculate new 24h change
        const diff = newPrice - asset.openPrice;
        const perc = (diff / asset.openPrice) * 100;
        const isPos = perc >= 0;
        const changeStr = `${isPos ? '+' : ''}${perc.toFixed(2)}%`;

        return {
          ...asset,
          prevPrice: asset.price,
          price: newPrice,
          change: changeStr,
          isPositive: isPos
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const currentAsset = marketAssets.find(a => a.id === activeAssetId)!;
  const userAsset = portfolio.find(p => p.id === activeAssetId);

  const filteredTrades = useMemo(() => {
    return trades.filter(t => {
      const matchesFilter = historyFilter === 'all' || t.type === historyFilter;
      const matchesSearch = t.asset.toLowerCase().includes(historySearch.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [trades, historyFilter, historySearch]);

  const handleExecute = async () => {
    const amt = parseFloat(tradeAmount);
    if (!amt || amt <= 0) return alert('Please enter a valid amount');

    if (mode === 'withdraw') {
      if (!destinationAddress.trim()) return alert('Please enter a destination wallet address');
      if (!userAsset || userAsset.amount < amt) return alert('Insufficient crypto balance for withdrawal');
      
      setIsProcessing(true);
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      onWithdrawCrypto(activeAssetId, amt, destinationAddress, currentAsset.price);
      
      setIsProcessing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
      
      setTradeAmount('');
      setDestinationAddress('');
    } else {
      onTrade(activeAssetId, amt, currentAsset.price, mode === 'buy');
      setTradeAmount('');
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-[900] text-slate-900 tracking-tight leading-none">Crypto Hub</h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs mt-2">Native African Liquidity Pool Active</p>
        </div>
        <div className="bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100 flex items-center gap-3 shadow-sm shadow-emerald-100/50">
           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse ring-4 ring-emerald-500/20"></div>
           <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Global Rates Synchronized</span>
        </div>
      </header>

      {showSuccess && (
        <div className="bg-emerald-500 text-white p-8 rounded-[3rem] shadow-2xl flex items-center justify-between animate-in slide-in-from-top-4 duration-500">
           <div className="flex items-center gap-6">
             <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
               <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6 9 17l-5-5"/></svg>
             </div>
             <div>
               <p className="font-black text-xl">Transaction Finalized</p>
               <p className="text-emerald-50 text-sm font-medium">Network confirmation pending on local rails.</p>
             </div>
           </div>
           <button onClick={() => setShowSuccess(false)} className="px-6 py-3 bg-black/10 hover:bg-black/20 rounded-2xl text-[10px] font-black uppercase transition-all tracking-widest">Acknowledge</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-8">
          {/* Market Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {marketAssets.map(asset => {
              const priceDirection = asset.price > asset.prevPrice ? 'up' : asset.price < asset.prevPrice ? 'down' : 'stable';
              return (
                <button 
                  key={asset.id}
                  onClick={() => setActiveAssetId(asset.id)}
                  className={`p-8 rounded-[3rem] border-2 transition-all text-left group relative overflow-hidden ${activeAssetId === asset.id ? 'bg-white border-purple-600 shadow-2xl -translate-y-1' : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'}`}
                >
                  <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-6 ${asset.color}`}>
                    <span className="font-black text-2xl">{asset.symbol[0]}</span>
                  </div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-start">
                      <p className="font-black text-slate-400 text-xs uppercase tracking-widest mb-1">{asset.name}</p>
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    </div>
                    
                    <p className={`text-3xl font-[900] text-slate-900 mt-1 tracking-tighter transition-colors duration-1000 ${priceDirection === 'up' ? 'text-emerald-600' : priceDirection === 'down' ? 'text-rose-600' : ''}`}>
                      ${asset.price.toLocaleString(undefined, { minimumFractionDigits: asset.id === 'usdt' ? 4 : 2, maximumFractionDigits: asset.id === 'usdt' ? 4 : 2 })}
                    </p>

                    <div className={`inline-flex items-center gap-1 mt-4 px-3 py-1.5 rounded-xl text-[10px] font-black transition-all ${asset.isPositive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                      {asset.isPositive ? '▲' : '▼'} {asset.change}
                    </div>
                  </div>
                  {/* Subtle Background Price Indicator */}
                  <div className={`absolute bottom-0 right-0 h-1 transition-all duration-1000 ${priceDirection === 'up' ? 'bg-emerald-400/20 w-full' : priceDirection === 'down' ? 'bg-rose-400/20 w-full' : 'w-0'}`}></div>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Holdings Dashboard */}
            <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl flex flex-col">
               <div className="flex items-center justify-between mb-10">
                 <div>
                   <h3 className="text-2xl font-[900] text-slate-900 tracking-tight">Your Portfolio</h3>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Live Valuation Active</p>
                 </div>
                 <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shadow-sm border border-purple-100">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                 </div>
               </div>
               <div className="space-y-4 flex-1">
                 {portfolio.map(p => {
                   const livePrice = marketAssets.find(a => a.id === p.id)?.price || 0;
                   const valuation = p.amount * livePrice;
                   return (
                    <div key={p.id} className="flex justify-between items-center p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 group hover:bg-white hover:border-purple-200 transition-all cursor-default relative overflow-hidden">
                      <div className="flex items-center gap-5 relative z-10">
                        <div className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400 group-hover:text-purple-600 group-hover:border-purple-100 transition-all text-xl">{p.symbol[0]}</div>
                        <div>
                          <p className="font-black text-slate-800 text-base leading-tight">{p.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">{p.amount.toFixed(4)} {p.symbol}</p>
                        </div>
                      </div>
                      <div className="text-right relative z-10">
                         <p className="font-black text-slate-900 text-lg tracking-tight tabular-nums">${valuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                         <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">Market Value</p>
                      </div>
                    </div>
                  );
                 })}
               </div>
            </div>

            {/* Trade History Section - ACTIVITY LEDGER */}
            <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl flex flex-col overflow-hidden h-[600px]">
               <div className="flex flex-col gap-6 mb-8 shrink-0">
                 <div className="flex items-center justify-between">
                   <div>
                     <h3 className="text-2xl font-[900] text-slate-900 tracking-tight">Activity Ledger</h3>
                     <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">Real-time Trade History</p>
                   </div>
                   <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">Immutable</span>
                 </div>
                 
                 {/* Filter Tools */}
                 <div className="space-y-4">
                   <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
                     {(['all', 'buy', 'sell', 'withdraw'] as const).map(f => (
                       <button 
                         key={f} 
                         onClick={() => setHistoryFilter(f)}
                         className={`flex-1 py-2 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all ${historyFilter === f ? 'bg-white text-purple-600 shadow-sm ring-1 ring-black/5' : 'text-slate-400 hover:text-slate-600'}`}
                       >
                         {f}
                       </button>
                     ))}
                   </div>
                   <div className="relative">
                     <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                     <input 
                       type="text" 
                       placeholder="Filter by asset..." 
                       className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-4 py-2 text-[10px] font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-200"
                       value={historySearch}
                       onChange={e => setHistorySearch(e.target.value)}
                     />
                   </div>
                 </div>
               </div>

               <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                 {filteredTrades.length > 0 ? filteredTrades.map(trade => (
                   <div key={trade.id} className="flex items-center justify-between p-6 bg-slate-50/30 rounded-[2rem] border border-slate-100 hover:bg-slate-50 hover:shadow-lg transition-all group animate-in slide-in-from-right-2">
                     <div className="flex items-center gap-5">
                       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-[10px] font-black uppercase border-2 shadow-sm ${
                         trade.type === 'buy' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                         trade.type === 'sell' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                         'bg-purple-50 text-purple-600 border-purple-100'
                       }`}>
                         {trade.type}
                       </div>
                       <div>
                         <p className="font-black text-slate-800 text-sm">{trade.amount.toFixed(4)} {trade.asset}</p>
                         <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">{trade.date}</p>
                       </div>
                     </div>
                     <div className="text-right">
                       <p className="font-black text-slate-900 text-sm tracking-tight">
                         {trade.type === 'withdraw' ? '--' : `$${(trade.amount * trade.priceUsd).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                       </p>
                       <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                         {trade.type === 'withdraw' ? 'External Network' : `@ ${trade.priceUsd.toLocaleString()}`}
                       </p>
                     </div>
                   </div>
                 )) : (
                    <div className="h-full flex flex-col items-center justify-center text-center py-20 opacity-30 grayscale space-y-6">
                      <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg></div>
                      <p className="text-xs font-black uppercase tracking-[0.3em]">No Recorded Events</p>
                    </div>
                 )}
               </div>
            </div>
          </div>
        </div>

        {/* PRO EXECUTION TERMINAL */}
        <div className="lg:col-span-4 bg-slate-900 p-1.5 rounded-[4rem] shadow-2xl sticky top-32 border border-slate-800 overflow-hidden">
          <div className="bg-slate-950 p-10 rounded-[3.8rem] relative z-10">
            {/* Mode Switcher */}
            <div className="flex bg-white/5 p-1.5 rounded-[1.8rem] mb-10 border border-white/10">
              {(['buy', 'sell', 'withdraw'] as const).map(m => (
                <button 
                  key={m}
                  onClick={() => { setMode(m); setTradeAmount(''); }}
                  className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${mode === m ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-white'}`}
                >
                  {m}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-6 mb-10">
              <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-2xl ring-4 ring-white/5 ${currentAsset.color} transition-all duration-500 group-hover:rotate-12`}>
                 <span className="text-3xl font-black">{currentAsset.symbol[0]}</span>
              </div>
              <div>
                <h3 className="text-2xl font-[900] text-white tracking-tight leading-none capitalize">{mode} {currentAsset.name}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-3">{currentAsset.network}</p>
              </div>
            </div>

            <div className="space-y-8">
              {/* Amount Field */}
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Protocol Value</label>
                  <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Bal: {userAsset?.amount.toFixed(4) || '0.00'}</p>
                </div>
                <div className="relative">
                  <input 
                    type="number" 
                    className="w-full bg-white/5 border-2 border-white/10 rounded-[2.5rem] px-10 py-8 font-black text-4xl text-white focus:ring-8 focus:ring-purple-500/10 focus:border-purple-500 focus:outline-none transition-all placeholder-white/5 tracking-tighter"
                    placeholder="0.00"
                    value={tradeAmount}
                    onChange={e => setTradeAmount(e.target.value)}
                  />
                  <div className="absolute right-10 top-1/2 -translate-y-1/2 text-white/20 font-black text-2xl tracking-tighter uppercase">
                    {currentAsset.symbol}
                  </div>
                </div>
              </div>

              {/* Destination Address Field - Only for Withdrawal */}
              {mode === 'withdraw' && (
                <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Remote Endpoint (Address)</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 font-mono text-xs text-white focus:ring-4 focus:ring-purple-500/20 outline-none transition-all placeholder-white/5"
                      placeholder={`Target ${currentAsset.symbol} Wallet...`}
                      value={destinationAddress}
                      onChange={e => setDestinationAddress(e.target.value)}
                    />
                  </div>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">Ensure valid <span className="text-purple-400">{currentAsset.network}</span> compatibility.</p>
                </div>
              )}
              
              <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-md">
                <div className="flex items-center justify-between">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{mode === 'withdraw' ? 'Network Commission' : 'Local Fiat Value'}</span>
                   <p className="text-xl font-black text-white tracking-tight tabular-nums">
                      {mode === 'withdraw' ? `0.0005 ${currentAsset.symbol}` : `${user.currency} ${(parseFloat(tradeAmount || '0') * currentAsset.price * (user.currency === 'NGN' ? 1550 : user.currency === 'GHS' ? 12 : 610)).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                   </p>
                </div>
              </div>

              <button 
                onClick={handleExecute}
                disabled={isProcessing || !tradeAmount}
                className={`w-full py-7 rounded-[2.5rem] font-black shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all flex items-center justify-center gap-4 group active:scale-95 disabled:opacity-50 ${
                  mode === 'buy' ? 'bg-emerald-500 hover:bg-emerald-600' : 
                  mode === 'sell' ? 'bg-rose-500 hover:bg-rose-600' : 
                  'bg-purple-600 hover:bg-purple-700'
                } text-white uppercase tracking-[0.25em] text-xs`}
              >
                {isProcessing ? 'Synchronizing Node...' : `Initiate ${mode}`}
              </button>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default CryptoHub;
