
import React from 'react';

const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizes = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl'
  };
  
  return (
    <div className={`flex items-center gap-4 font-bold ${sizes[size]} tracking-tight text-slate-900 group cursor-pointer`}>
      <div className="relative">
        <div className="absolute -inset-2 bg-gradient-to-tr from-purple-600 to-indigo-400 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-300"></div>
        
        <div className="relative bg-white border border-slate-100 p-2 rounded-2xl shadow-xl overflow-hidden ring-1 ring-slate-900/5">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-indigo-600/5"></div>
          <svg className="relative z-10" width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 4L26.3923 10V22L16 28L5.6077 22V10L16 4Z" fill="currentColor" fillOpacity="0.05" stroke="url(#paint0_linear)" strokeWidth="2.5" />
            <path d="M16 8L22 11.5V18.5L16 22L10 18.5V11.5L16 8Z" fill="url(#paint1_linear)" />
            <defs>
              <linearGradient id="paint0_linear" x1="5.6077" y1="4" x2="26.3923" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#9333EA" />
                <stop offset="1" stopColor="#4F46E5" />
              </linearGradient>
              <linearGradient id="paint1_linear" x1="10" y1="8" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#9333EA" />
                <stop offset="1" stopColor="#6366F1" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      
      <div className="flex flex-col leading-tight">
        <span className="flex items-center">
          Pay<span className="text-purple-600 font-black">Flow</span>
        </span>
        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 -mt-0.5 ml-0.5">Pro Fintech</span>
      </div>
    </div>
  );
};

export default Logo;
