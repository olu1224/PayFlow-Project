
import React from 'react';

const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const containerSizes = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-5'
  };

  const markSizes = {
    sm: 'w-10 h-10 rounded-xl',
    md: 'w-16 h-16 rounded-[1.6rem]',
    lg: 'w-24 h-24 rounded-[2.2rem]'
  };

  const textSizes = {
    sm: 'text-2xl',
    md: 'text-5xl',
    lg: 'text-7xl'
  };

  const subTextSizes = {
    sm: 'text-[8px]',
    md: 'text-[11px]',
    lg: 'text-[13px]'
  };

  return (
    <div className={`flex items-center ${containerSizes[size]} group cursor-pointer select-none`}>
      {/* The Rounded Square Gradient Box from Image */}
      <div className={`${markSizes[size]} bg-slate-950 flex items-center justify-center shadow-[0_20px_50px_-10px_rgba(79,70,229,0.5)] group-hover:shadow-[0_25px_60px_-5px_rgba(34,211,238,0.6)] group-hover:-translate-y-1 transition-all duration-700 relative overflow-hidden ring-1 ring-white/20`}>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-500 opacity-100 animate-gradient-slow"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.4),transparent)]"></div>
        
        {/* Geometric "Z" Logo from Reference Image */}
        <svg width="55%" height="55%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 drop-shadow-2xl">
          <path d="M4 4.5H20L4 19.5H20" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <div className="flex flex-col">
        <h1 className={`${textSizes[size]} font-[1000] tracking-[-0.05em] text-slate-900 leading-none flex items-center`}>
          Zynctra<span className="text-indigo-600 ml-1">Pro</span>
        </h1>
        <div className="flex items-center gap-3 mt-1.5">
           <span className={`${subTextSizes[size]} font-black text-slate-400 tracking-[0.4em] uppercase opacity-80`}>Pan-African Grid</span>
           <div className="flex gap-1.5">
              <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-indigo-500"></span>
              <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-emerald-500"></span>
              <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-amber-500"></span>
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
          background-size: 200% 200%;
          animation: gradient-slow 8s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Logo;
