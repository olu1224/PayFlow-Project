
import React, { useState, useEffect, useRef } from 'react';

interface ScanPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (amount: number, merchant: string) => void;
}

const ScanPayModal: React.FC<ScanPayModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(true);
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

  const simulateScan = () => {
    setIsScanning(false);
    // Mocking a retail environment scan result
    const merchants = ['Mall of Africa', 'Vending Pro #82', 'The Bistro GHC', 'QuickMart SN'];
    setScannedMerchant(merchants[Math.floor(Math.random() * merchants.length)]);
  };

  const handlePay = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    onComplete(parseFloat(amount), scannedMerchant || 'Retail Store');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[3.5rem] overflow-hidden shadow-2xl flex flex-col h-[85dvh] border border-white/20">
        <div className="p-8 pb-4 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Scan to Pay</h2>
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-1">Authorized Grid Terminal</p>
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
                <div className="w-64 h-64 border-4 border-indigo-400 rounded-[3rem] relative shadow-[0_0_100px_rgba(79,70,229,0.5)]">
                  <div className="absolute inset-0 border-2 border-white/20 rounded-[2.8rem] animate-pulse"></div>
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-indigo-400 shadow-[0_0_15px_#4f46e5] animate-scan-line"></div>
                </div>
              </div>
              <div className="absolute bottom-10 left-0 right-0 px-10 text-center">
                <p className="text-white font-black text-xs uppercase tracking-widest animate-pulse">Position QR Code in Grid</p>
                <button 
                  onClick={simulateScan} 
                  className="mt-6 bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-white/20"
                >
                  Force Scan (Simulator)
                </button>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-10 bg-slate-50 animate-in zoom-in-95">
               <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl">
                 <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
               </div>
               <h3 className="text-2xl font-black text-slate-900 tracking-tight">{scannedMerchant}</h3>
               <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">Verified Merchant Node</p>
               
               <div className="w-full mt-10 space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payment Value</label>
                  <input 
                    autoFocus
                    type="number" 
                    className="w-full bg-white border-2 border-indigo-100 rounded-[2rem] px-8 py-6 font-black text-4xl text-slate-900 focus:border-indigo-600 outline-none transition-all text-center tracking-tighter"
                    placeholder="0.00"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                  />
                  <button 
                    onClick={handlePay}
                    className="w-full bg-indigo-600 text-white py-6 rounded-[2rem] font-[1000] text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-indigo-700 active:scale-95 transition-all mt-4"
                  >
                    Authorize Payment
                  </button>
                  <button 
                    onClick={() => setIsScanning(true)} 
                    className="w-full text-slate-400 font-black text-[10px] uppercase tracking-widest pt-2"
                  >
                    Retry Scan
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
