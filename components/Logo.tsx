
import React from 'react';

const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const containerSizes = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-5'
  };

  const markSizes = {
    sm: 'w-10 h-10 rounded-[1.2rem]',
    md: 'w-12 h-12 rounded-[1.5rem]',
    lg: 'w-16 h-16 rounded-[2rem]'
  };

  const textSizes = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-5xl'
  };

  return (
    <div className={`flex items-center ${containerSizes[size]} group cursor-pointer select-none`}>
      <div className={`${markSizes[size]} bg-slate-950 flex items-center justify-center shadow-2xl shadow-purple-500/30 group-hover:scale-110 transition-all duration-700 relative overflow-hidden ring-4 ring-white/50`}>
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-700 via-indigo-600 to-emerald-500 opacity-100 animate-gradient-slow"></div>
        <svg width="65%" height="65%" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 drop-shadow-lg">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      </div>
      <div className="flex flex-col">
        <h1 className={`${textSizes[size]} font-[900] tracking-tighter text-slate-900 leading-none`}>
          Pay<span className="text-purple-600">Flow</span>
        </h1>
        <span className="text-[10px] font-black text-slate-400 mt-1 tracking-[0.4em] uppercase opacity-70">Pan-African Hub</span>
      </div>
      <style>{`
        @keyframes gradient-slow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-slow {
          background-size: 200% 200%;
          animation: gradient-slow 8s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Logo;
