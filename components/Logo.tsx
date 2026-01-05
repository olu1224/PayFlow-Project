
import React from 'react';

const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const containerSizes = {
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4'
  };

  const markSizes = {
    sm: 'w-10 h-10 rounded-xl',
    md: 'w-14 h-14 rounded-[1.4rem]',
    lg: 'w-20 h-20 rounded-[2rem]'
  };

  const textSizes = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-5xl'
  };

  return (
    <div className={`flex items-center ${containerSizes[size]} group cursor-pointer select-none`}>
      <div className={`${markSizes[size]} bg-slate-950 flex items-center justify-center shadow-[0_15px_40px_-5px_rgba(79,70,229,0.4)] group-hover:shadow-[0_20px_50px_-5px_rgba(34,211,238,0.5)] group-hover:-translate-y-1 transition-all duration-700 relative overflow-hidden ring-1 ring-white/20`}>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-cyan-500 opacity-100 animate-gradient-slow"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.3),transparent)]"></div>
        {/* Zynctra "Z" Geometric Logo */}
        <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 drop-shadow-2xl">
          <path d="M4 4h16l-12 16h12" />
        </svg>
      </div>
      <div className="flex flex-col">
        <h1 className={`${textSizes[size]} font-[1000] tracking-[-0.04em] text-slate-900 leading-none`}>
          Zynctra<span className="text-indigo-600"> Pro</span>
        </h1>
        <div className="flex items-center gap-2 mt-1">
           <span className="text-[10px] font-black text-slate-400 tracking-[0.3em] uppercase">Pan-African Grid</span>
           <div className="flex gap-1">
              <span className="w-1 h-1 rounded-full bg-indigo-500"></span>
              <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
              <span className="w-1 h-1 rounded-full bg-amber-500"></span>
           </div>
        </div>
      </div>
      <style>{`
        @keyframes gradient-slow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-slow {
          background-size: 150% 150%;
          animation: gradient-slow 6s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Logo;
