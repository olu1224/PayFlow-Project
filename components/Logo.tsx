
import React from 'react';

const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  };
  
  return (
    <div className={`flex items-center gap-3 font-black ${sizes[size]} tracking-tighter text-slate-900 group cursor-pointer`}>
      <div className="relative">
        <div className="absolute inset-0 bg-purple-600 blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
        <div className="relative bg-gradient-to-br from-purple-600 to-indigo-700 p-2 rounded-2xl shadow-xl shadow-purple-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
      </div>
      <span>Pay<span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">Flow</span><span className="text-slate-400 font-light ml-0.5">Pro</span></span>
    </div>
  );
};

export default Logo;
