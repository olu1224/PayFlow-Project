
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { User, CryptoAsset } from '../types';
import { Trade } from '../App';
import { t } from '../localization';

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
  
  const [historyFilter, setHistoryFilter] = useState<'all' | 'buy' | 'sell' | 'withdraw'>('all');
  const [historySearch, setHistorySearch] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setMarketAssets(prev => prev.map(asset => {
        const volatility = asset.id === 'usdt' ? 0.0001 : 0.0015;
        const changePercent = (Math.random() * 2 - 1) * volatility;
        const newPrice = asset.price * (1 + changePercent);
        const diff = newPrice - asset.openPrice;
        const perc = (diff / asset.openPrice) * 100;
        const isPos = perc >= 0;
        return { ...asset, prevPrice: asset.price, price: newPrice, change: `${isPos ? '+' : ''}${perc.toFixed(2)}%`, isPositive: isPos };
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
    if (!amt || amt <= 0) return;
    if (mode === 'withdraw') {
      if (!destinationAddress.trim() || !userAsset || userAsset.amount < amt) return;
      setIsProcessing(true);
      await new Promise(r => setTimeout(r, 2000));
      onWithdrawCrypto(activeAssetId, amt, destinationAddress, currentAsset.price);
      setIsProcessing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setTradeAmount('');
    } else {
      onTrade(activeAssetId, amt, currentAsset.price, mode === 'buy');
      setTradeAmount('');
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-[900] text-slate-900 tracking-tight leading-none">{t('crypto_title', user.country)}</h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs mt-2">{t('crypto_subtitle', user.country)}</p>
        </div>
        <div className="bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100 flex items-center gap-3 shadow-sm">
           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
           <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">{user.country === 'Senegal' ? 'Cours Global Synchronisé' : 'Global Rates Synchronized'}</span>
        </div>
      </header>

      {showSuccess && (
        <div className="bg-emerald-500 text-white p-6 rounded-[2rem] shadow-xl flex items-center justify-between animate-in slide-in-from-top-4">
          <p className="font-black">{t('crypto_success', user.country)}</p>
          <button onClick={() => setShowSuccess(false)} className="text-xs uppercase font-black">OK</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {marketAssets.map(asset => (
              <button 
                key={asset.id}
                onClick={() => setActiveAssetId(asset.id)}
                className={`p-8 rounded-[3rem] border-2 transition-all text-left relative overflow-hidden ${activeAssetId === asset.id ? 'bg-white border-indigo-600 shadow-2xl' : 'bg-white border-slate-100 hover:border-slate-200'}`}
              >
                <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center mb-6 ${asset.color}`}>
                  <span className="font-black text-2xl">{asset.symbol[0]}</span>
                </div>
                <p className="font-black text-slate-400 text-xs uppercase tracking-widest mb-1">{asset.name}</p>
                <p className="text-2xl font-[900] text-slate-900 tracking-tighter">${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                <div className={`inline-flex items-center gap-1 mt-4 px-3 py-1 rounded-xl text-[10px] font-black ${asset.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {asset.isPositive ? '▲' : '▼'} {asset.change}
                </div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-xl">
               <h3 className="text-2xl font-[900] text-slate-900 tracking-tight mb-8">{t('crypto_portfolio', user.country)}</h3>
               <div className="space-y-4">
                 {portfolio.map(p => (
                    <div key={p.id} className="flex justify-between items-center p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-black text-slate-400">{p.symbol[0]}</div>
                        <div>
                          <p className="font-black text-slate-800 text-sm">{p.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold">{p.amount.toFixed(4)} {p.symbol}</p>
                        </div>
                      </div>
                      <p className="font-black text-slate-900">${(p.amount * (marketAssets.find(a => a.id === p.id)?.price || 0)).toLocaleString()}</p>
                    </div>
                 ))}
               </div>
            </div>

            <div className="bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-xl h-[500px] flex flex-col">
               <h3 className="text-2xl font-[900] text-slate-900 tracking-tight mb-6">{t('crypto_ledger', user.country)}</h3>
               <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                 {filteredTrades.map(trade => (
                   <div key={trade.id} className="p-5 bg-slate-50 rounded-[1.8rem] border border-slate-100 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase ${trade.type === 'buy' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>{t(`crypto_${trade.type}`, user.country)}</span>
                        <p className="font-black text-slate-800 text-sm">{trade.asset}</p>
                     </div>
                     <p className="font-black text-xs">${(trade.amount * trade.priceUsd).toLocaleString()}</p>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-slate-900 p-8 rounded-[4rem] shadow-2xl sticky top-32 border border-slate-800">
          <div className="flex bg-white/5 p-1 rounded-2xl mb-8 border border-white/10">
            {(['buy', 'sell', 'withdraw'] as const).map(m => (
              <button 
                key={m} 
                onClick={() => setMode(m)}
                className={`flex-1 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${mode === m ? 'bg-white text-slate-900' : 'text-slate-400'}`}
              >
                {t(`crypto_${m}`, user.country)}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            <div className="space-y-2 px-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{user.country === 'Senegal' ? 'Valeur du Protocole' : 'Protocol Value'}</label>
              <div className="relative">
                <input 
                  type="number" 
                  className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-8 py-6 font-black text-3xl text-white outline-none focus:border-indigo-500 transition-all"
                  placeholder="0.00"
                  value={tradeAmount}
                  onChange={e => setTradeAmount(e.target.value)}
                />
                <span className="absolute right-8 top-1/2 -translate-y-1/2 text-white/20 font-black">{currentAsset.symbol}</span>
              </div>
            </div>

            {mode === 'withdraw' && (
              <div className="space-y-2 px-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{user.country === 'Senegal' ? 'Adresse de Destination' : 'Destination Address'}</label>
                <input 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-xs font-mono text-white outline-none"
                  placeholder="0x..."
                  value={destinationAddress}
                  onChange={e => setDestinationAddress(e.target.value)}
                />
              </div>
            )}

            <button 
              onClick={handleExecute}
              className={`w-full py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl transition-all ${mode === 'buy' ? 'bg-emerald-600' : mode === 'sell' ? 'bg-rose-600' : 'bg-indigo-600'} text-white active:scale-95`}
            >
              {t(`crypto_${mode}`, user.country)} {currentAsset.name}
            </button>
          </div>
        </div>
      </div>
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }`}</style>
    </div>
  );
};

export default CryptoHub;
