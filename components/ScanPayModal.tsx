
import React, { useState, useEffect, useRef } from 'react';

interface ScanPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (amount: number, merchant: string) => void;
}

const ScanPayModal: React.FC<ScanPayModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [status, setStatus] = useState<'idle' | 'detecting' | 'parsing'>('idle');
  const [scannedMerchant, setScannedMerchant] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [isOpen]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setHasPermission(true);
      }
    } catch (err) {
      setHasPermission(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const simulateScan = async (isDemo: boolean = false) => {
    setStatus('detecting');
    await new Promise(r => setTimeout(r, 1200));
    setStatus('parsing');
    await new Promise(r => setTimeout(r, 800));

    setIsScanning(false);
    
    if (isDemo) {
      // Simulate scanning the specific Demo QR
      setScannedMerchant('Zynctra Demo Node (Alpha)');
      setAmount('25000');
    } else {
      const merchants = ['PayFlow Merchant #402', 'Lagos Grid Terminal', 'Accra Central Hub', 'Dakar Retail Node'];
      setScannedMerchant(merchants[Math.floor(Math.random() * merchants.length)]);
      setAmount('');
    }
    
    setStatus('idle');
  };

  const handlePay = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    onComplete(parseFloat(amount), scannedMerchant || 'PayFlow Store');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[3.5rem] overflow-hidden shadow-2xl flex flex-col h-[85dvh] border border-white/10">
        <div className="p-8 pb-4 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-2xl font-[1000] text-slate-900 tracking-tighter">Scan to Pay</h2>
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-1">Authorized PayFlow Terminal</p>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-all">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="flex-1 relative bg-slate-900 overflow-hidden">
          {isScanning ? (
            <>
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover grayscale brightness-75" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className={`w-64 h-64 border-4 transition-all duration-500 rounded-[3rem] relative shadow-[0_0_100px_rgba(99,102,241,0.4)] ${status !== 'idle' ? 'border-emerald-400 scale-105' : 'border-indigo-500'}`}>
                  <div className="absolute inset-0 border-2 border-white/10 rounded-[2.8rem] animate-pulse"></div>
                  <div className={`absolute top-1/2 left-0 right-0 h-0.5 shadow-[0_0_15px_#6366f1] animate-scan-line ${status !== 'idle' ? 'bg-emerald-400' : 'bg-indigo-500'}`}></div>
                </div>
              </div>
              <div className="absolute bottom-10 left-0 right-0 px-10 flex flex-col gap-3 text-center">
                <p className="text-white font-black text-[10px] uppercase tracking-[0.3em] animate-pulse mb-2">
                  {status === 'detecting' ? 'Analyzing Protocol...' : status === 'parsing' ? 'Extracting Identity...' : 'Align QR within Grid'}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => simulateScan(false)} 
                    disabled={status !== 'idle'}
                    className="bg-white/10 backdrop-blur-md text-white px-6 py-4 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-white/20 transition-all disabled:opacity-50 border border-white/10"
                  >
                    Random Scan
                  </button>
                  <button 
                    onClick={() => simulateScan(true)} 
                    disabled={status !== 'idle'}
                    className="bg-indigo-600 text-white px-6 py-4 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-2xl"
                  >
                    Scan Demo QR
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-10 bg-slate-50 animate-in zoom-in-95">
               <div className="w-24 h-24 bg-white text-indigo-600 rounded-[2.2rem] shadow-xl border border-slate-100 flex items-center justify-center mb-8 relative">
                 <div className="absolute inset-0 bg-indigo-500/5 rounded-[2.2rem] animate-pulse"></div>
                 <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
               </div>
               <h3 className="text-3xl font-[1000] text-slate-900 tracking-tighter text-center px-4">{scannedMerchant}</h3>
               <p className="text-indigo-600 font-black uppercase tracking-[0.3em] text-[10px] mt-2">Verified Settle Node</p>
               
               <div className="w-full mt-10 space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Settlement Value</label>
                    <input 
                      autoFocus
                      type="number" 
                      className="w-full bg-white border-2 border-slate-100 rounded-[2rem] px-8 py-6 font-[1000] text-4xl text-slate-900 focus:border-indigo-600 outline-none transition-all text-center tracking-tighter shadow-inner"
                      placeholder="0.00"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={handlePay}
                    className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-[1000] text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-indigo-600 active:scale-95 transition-all mt-4"
                  >
                    Authorize Payout
                  </button>
                  <button 
                    onClick={() => setIsScanning(true)} 
                    className="w-full text-slate-400 font-black text-[10px] uppercase tracking-widest pt-4"
                  >
                    Rescan Grid
                  </button>
               </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes scan-line {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
        .animate-scan-line {
          position: absolute;
          animation: scan-line 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ScanPayModal;
