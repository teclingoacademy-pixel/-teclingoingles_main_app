import React from 'react';

interface TeclingoLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
}

export const TeclingoLogo: React.FC<TeclingoLogoProps> = ({ size = 'md', showBadge = true }) => {
  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Metallic "TC" Monogram */}
      <div 
        className={`relative flex items-center justify-center shrink-0 rounded-xl overflow-hidden shadow-lg ${
          isSmall ? 'w-9 h-9' : isLarge ? 'w-14 h-14' : 'w-11 h-11'
        } bg-gradient-to-b from-[#2A2E33] via-[#1A1D20] to-[#0F1113] border border-[#8A95A5]/40`}
        style={{
          boxShadow: '0 4px 14px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.25)',
        }}
      >
        <svg 
          viewBox="0 0 120 120" 
          className="w-4/5 h-4/5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="tcMetal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="35%" stopColor="#C8D0DC" />
              <stop offset="65%" stopColor="#7E8A99" />
              <stop offset="100%" stopColor="#BAC4D0" />
            </linearGradient>
            <linearGradient id="tcStroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#404752" />
            </linearGradient>
            <filter id="metalGlow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000" floodOpacity="0.9" />
            </filter>
          </defs>

          {/* Geometric interlocking TC symbol */}
          {/* T Top bar and stem */}
          <path
            d="M 22 28 L 78 28 C 84 28 88 32 86 38 L 84 42 C 82 44 79 46 74 46 L 58 46 L 42 92 C 40 98 34 100 28 98 L 24 96 C 20 94 20 88 22 84 L 38 46 L 24 46 C 18 46 16 40 18 34 Z"
            fill="url(#tcMetal)"
            stroke="url(#tcStroke)"
            strokeWidth="1.5"
            filter="url(#metalGlow)"
          />

          {/* C interlocking curve */}
          <path
            d="M 72 32 C 86 32 98 42 98 56 L 98 62 C 98 70 94 76 86 80 L 64 80 C 60 80 58 84 60 88 L 62 90 C 64 94 68 96 74 96 L 94 96 C 100 96 102 102 98 106 L 94 108 C 88 112 60 112 50 106 C 42 98 42 86 48 74 L 56 58 C 60 48 68 40 78 36 Z"
            fill="none"
            stroke="url(#tcMetal)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#metalGlow)"
          />
        </svg>

        {/* Diagonal metallic shine highlight */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
      </div>

      {/* Brand Text */}
      <div className="flex flex-col leading-tight">
        <div className="flex items-baseline gap-2">
          <span
            className={`font-black tracking-widest text-white uppercase ${
              isSmall ? 'text-lg' : isLarge ? 'text-3xl' : 'text-2xl'
            }`}
          >
            Teclingo
          </span>
          <span
            className={`font-serif italic text-[#39FF14] low-glow ${
              isSmall ? 'text-lg' : isLarge ? 'text-2xl' : 'text-xl'
            }`}
          >
            inglés.com
          </span>
        </div>
        {showBadge && (
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#8A95A5] flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-pulse" />
            Digital Interactive Booklet
          </span>
        )}
      </div>
    </div>
  );
};

