
import React from 'react';

const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const containerSizes = {
    sm: 'gap-2.5',
    md: 'gap-3.5',
    lg: 'gap-6'
  };

  const markSizes = {
    sm: 'w-10 h-10 rounded-xl',
    md: 'w-14 h-14 rounded-[1.4rem]',
    lg: 'w-20 h-20 rounded-[2rem]'
  };

  const textSizes = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl'
  };

  return (
    <div className={`flex items-center ${containerSizes[size]} group cursor-pointer select-none`}>
      <div className={`${markSizes[size]} bg-slate-950 flex items-center justify-center shadow-[0_15px_40px_-5px_rgba(147,51,234,0.5)] group-hover:shadow-[0_20px_50px_-5px_rgba(147,51,234,0.7)] group-hover:-translate-y-1 transition-all duration-700 relative overflow-hidden ring-2 ring-white/30`}>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-emerald-500 opacity-100 animate-gradient-fast"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.5),transparent)]"></div>
        <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 drop-shadow-2xl">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      </div>
      <div className="flex flex-col">
        <h1 className={`${textSizes[size]} font-[1000] tracking-[-0.05em] text-black leading-none`}>
          Pay<span className="text-purple-600">Flow</span>
        </h1>
        <div className="flex items-center gap-2 mt-1.5">
           <span className="text-[10px] font-[1000] text-purple-700 tracking-[0.4em] uppercase">Pan-African Hub</span>
           <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 opacity-40"></span>
           </div>
        </div>
      </div>
      <style>{`
        @keyframes gradient-fast {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-fast {
          background-size: 150% 150%;
          animation: gradient-fast 4s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Logo;
