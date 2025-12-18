
import React, { useState, useEffect } from 'react';
import Logo from './Logo';

interface SecurityLockProps {
  onUnlock: () => void;
  title?: string;
  type?: 'pin' | 'biometric';
}

const SecurityLock: React.FC<SecurityLockProps> = ({ onUnlock, title = "Secure Access Required", type = "pin" }) => {
  const [pin, setPin] = useState('');
  const [isScanning, setIsScanning] = useState(type === 'biometric');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isScanning) {
      const timer = setTimeout(() => {
        onUnlock();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isScanning, onUnlock]);

  const handlePin = (num: string) => {
    if (pin.length < 6) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 6) {
        if (newPin === "123456") { // Mock check
          onUnlock();
        } else {
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 1000);
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[300] bg-slate-900/90 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="bg-white w-full max-w-md rounded-[4rem] p-12 shadow-2xl flex flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-4">
          <Logo size="sm" />
          <div className="text-center space-y-1">
            <h2 className="text-xl font-black text-slate-800">{title}</h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Encryption Active</p>
          </div>
        </div>

        {isScanning ? (
          <div className="flex flex-col items-center gap-8 py-10">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 border-4 border-purple-500 rounded-full animate-ping opacity-20"></div>
              <div className="absolute inset-0 flex items-center justify-center text-purple-600">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7"/><path d="M16 11l2 2 4-4"/><circle cx="9" cy="10" r="2"/><path d="M2 12a10 10 0 0 1 10-10"/></svg>
              </div>
              <div className="absolute inset-0 bg-purple-600/10 rounded-full animate-pulse"></div>
            </div>
            <p className="text-xs font-black uppercase text-purple-600 animate-pulse tracking-[0.2em]">Authenticating Biometrics...</p>
          </div>
        ) : (
          <div className="w-full space-y-10">
            <div className="flex justify-center gap-3">
              {[0, 1, 2, 3, 4, 5].map(i => (
                <div 
                  key={i} 
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    error ? 'bg-rose-500 animate-bounce' : 
                    pin.length > i ? 'bg-purple-600 scale-125' : 'bg-slate-100 shadow-inner'
                  }`}
                />
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0].map((n, i) => (
                <button 
                  key={i}
                  disabled={n === ''}
                  onClick={() => handlePin(n.toString())}
                  className={`w-full h-16 rounded-2xl flex items-center justify-center font-black text-xl transition-all ${
                    n === '' ? 'opacity-0 cursor-default' : 'bg-slate-50 hover:bg-purple-50 hover:text-purple-600 active:scale-90 shadow-sm'
                  }`}
                >
                  {n}
                </button>
              ))}
              <button 
                onClick={() => setPin(pin.slice(0, -1))}
                className="w-full h-16 rounded-2xl flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all active:scale-90"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/><line x1="18" y1="9" x2="12" y2="15"/><line x1="12" y1="9" x2="18" y2="15"/></svg>
              </button>
            </div>
          </div>
        )}

        {type === 'pin' && (
          <button 
            onClick={() => setIsScanning(true)}
            className="text-[10px] font-black uppercase text-purple-600 hover:bg-purple-50 px-6 py-3 rounded-xl transition-all tracking-widest"
          >
            Switch to Biometric Scan
          </button>
        )}
      </div>
    </div>
  );
};

export default SecurityLock;
