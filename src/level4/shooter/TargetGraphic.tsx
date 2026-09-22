import React from 'react';
import { TargetType } from '../types/level4Types';

export const TargetGraphic: React.FC<{ type: TargetType }> = ({ type }) => {
  if (type === 'bottle') {
    return (
      <div className="relative w-16 h-16 rounded-full bg-emerald-950/90 border-2 border-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.9)] flex items-center justify-center">
        <svg width="42" height="42" viewBox="0 0 40 40" fill="none">
          {/* Champagne / Disco Bottle */}
          <path d="M17 6 H23 V14 L27 20 V34 H13 V20 L17 14 Z" fill="#15803d" stroke="#4ade80" strokeWidth="1.5" />
          {/* Gold Foil Neck */}
          <rect x="17" y="6" width="6" height="6" fill="#facc15" stroke="#eab308" strokeWidth="1" />
          {/* Cork */}
          <rect x="18" y="3" width="4" height="3" rx="1" fill="#ca8a04" />
          {/* Bottle Label */}
          <rect x="15" y="21" width="10" height="9" rx="1" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
          <line x1="17" y1="25" x2="23" y2="25" stroke="#854d0e" strokeWidth="1" />
          {/* Glass Highlight Reflection */}
          <path d="M15 20 L18 15" stroke="#86efac" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M15 31 V22" stroke="#86efac" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-black font-mono text-[9px] font-black px-1.5 py-0.5 rounded-full shadow">
          +1
        </span>
      </div>
    );
  }

  if (type === 'cocktail') {
    return (
      <div className="relative w-16 h-16 rounded-full bg-rose-950/90 border-2 border-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.9)] flex items-center justify-center">
        <svg width="42" height="42" viewBox="0 0 40 40" fill="none">
          {/* Cocktail Glass V-shape */}
          <polygon points="10,12 30,12 20,24" fill="#f43f5e" stroke="#fb7185" strokeWidth="1.5" />
          {/* Stem & Base */}
          <line x1="20" y1="24" x2="20" y2="34" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          <line x1="14" y1="34" x2="26" y2="34" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          {/* Drink fill */}
          <polygon points="13,15 27,15 20,23" fill="#ec4899" />
          {/* Olive / Garnish */}
          <circle cx="20" cy="11" r="3" fill="#84cc16" stroke="#4d7c0f" strokeWidth="1" />
        </svg>
        <span className="absolute -bottom-1 -right-1 bg-rose-600 text-white font-mono text-[9px] font-black px-1.5 py-0.5 rounded-full shadow">
          -1
        </span>
      </div>
    );
  }

  if (type === 'cactus') {
    return (
      <div className="relative w-16 h-16 rounded-full bg-amber-950/90 border-2 border-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.9)] flex items-center justify-center">
        <svg width="42" height="42" viewBox="0 0 40 40" fill="none">
          {/* Terracotta Pot */}
          <polygon points="13,26 27,26 25,35 15,35" fill="#ea580c" stroke="#c2410c" strokeWidth="1" />
          <rect x="12" y="24" width="16" height="3" rx="1" fill="#f97316" />
          {/* Main Cactus Trunk */}
          <rect x="17" y="10" width="6" height="15" rx="3" fill="#16a34a" stroke="#15803d" strokeWidth="1" />
          {/* Left Branch */}
          <path d="M12 14 V19 H17" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {/* Right Branch */}
          <path d="M28 12 V17 H23" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {/* Spines */}
          <line x1="20" y1="12" x2="20" y2="14" stroke="#fef08a" strokeWidth="1" />
          <line x1="20" y1="17" x2="20" y2="19" stroke="#fef08a" strokeWidth="1" />
        </svg>
        <span className="absolute -bottom-1 -right-1 bg-rose-600 text-white font-mono text-[9px] font-black px-1.5 py-0.5 rounded-full shadow">
          -1
        </span>
      </div>
    );
  }

  // Mud / Poop Splat
  return (
    <div className="relative w-16 h-16 rounded-full bg-amber-950/90 border-2 border-amber-600 shadow-[0_0_25px_rgba(217,119,6,0.9)] flex items-center justify-center">
      <svg width="42" height="42" viewBox="0 0 40 40" fill="none">
        <path
          d="M20 7 C21 7 23 9 21 11 C18 13 13 16 13 20 C13 22 15 24 17 24 C13 26 10 29 10 32 C10 35 15 36 20 36 C25 36 30 35 30 32 C30 29 27 26 23 24 C25 24 27 22 27 20 C27 16 22 13 19 11 Z"
          fill="#78350f"
          stroke="#92400e"
          strokeWidth="1.2"
        />
        <path d="M16 28 Q20 26 24 28" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="17" cy="20" r="1.5" fill="#fef3c7" />
        <circle cx="23" cy="20" r="1.5" fill="#fef3c7" />
        <circle cx="17" cy="20" r="0.8" fill="#000" />
        <circle cx="23" cy="20" r="0.8" fill="#000" />
      </svg>
      <span className="absolute -bottom-1 -right-1 bg-rose-600 text-white font-mono text-[9px] font-black px-1.5 py-0.5 rounded-full shadow">
        -1
      </span>
    </div>
  );
};
