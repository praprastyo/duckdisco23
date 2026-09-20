import React from 'react';

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  vRot: number;
  color: string;
  life: number;
}

export interface HitPopup {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  createdAt: number;
}

export interface Shockwave {
  id: string;
  x: number;
  y: number;
  color: string;
  createdAt: number;
}

interface Level2EffectsProps {
  particles: Particle[];
  popups: HitPopup[];
  shockwaves?: Shockwave[];
  isComplete?: boolean;
  accuracy: number;
  isBeatOdd: boolean;
}

export const Level2Effects: React.FC<Level2EffectsProps> = ({
  particles,
  popups,
  shockwaves = [],
  isComplete,
  accuracy,
  isBeatOdd,
}) => (
  <>
    {/* Large DJ Donald Duck Booth in Bottom-Left Corner */}
    <div
      className={`absolute left-4 bottom-3 z-16 flex items-end gap-2 pointer-events-none transition-transform duration-100 ${
        isBeatOdd ? '-translate-y-2.5 scale-105' : 'translate-y-0 scale-100'
      }`}
    >
      <div className="flex flex-col items-center">
        {/* DJ Donald Vector Figure */}
        <svg width="85" height="95" viewBox="0 0 75 85" fill="none" className="filter drop-shadow-[0_0_16px_rgba(6,182,212,0.5)]">
          <path d="M 24 10 C 24 3, 44 3, 44 10 Z" fill="#1e40af" stroke="#3b82f6" strokeWidth="1.5" />
          <path d="M 40 10 L 48 14 L 43 16 Z" fill="#0f172a" />
          {/* Over-ear DJ Headphones with Neon Glow */}
          <path d="M 16 28 C 16 12, 54 12, 54 28" stroke="#ec4899" strokeWidth="4" strokeLinecap="round" />
          <rect x="12" y="24" width="7" height="12" rx="3.5" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
          <rect x="51" y="24" width="7" height="12" rx="3.5" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
          {/* Sunglasses */}
          <rect x="30" y="20" width="18" height="8" rx="2" fill="#00ffff" />
          <circle cx="34" cy="26" r="14" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
          <ellipse cx="48" cy="28" rx="8" ry="4" fill="#f97316" />
          <ellipse cx="26" cy="48" rx="16" ry="14" fill="#1e40af" stroke="#3b82f6" strokeWidth="1.5" />
          <ellipse cx="34" cy="38" rx="4" ry="3" fill="#ef4444" />
        </svg>

        {/* DJ Console Desk with Glowing Equalizer & Turntables */}
        <div className="w-40 h-11 -mt-3 bg-gradient-to-r from-gray-950 via-indigo-950 to-gray-950 border-2 border-cyan-400 rounded-xl p-1.5 flex items-center justify-between shadow-[0_0_25px_#06b6d4]">
          <div className="w-8 h-8 rounded-full bg-black border border-yellow-400 flex items-center justify-center animate-spin">
            <div className="w-3 h-3 rounded-full bg-cyan-400" />
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex gap-0.5">
              <div className="w-1 h-3.5 bg-cyan-400 rounded-xs animate-pulse" />
              <div className="w-1 h-5 bg-yellow-400 rounded-xs animate-pulse" />
              <div className="w-1 h-3 bg-pink-500 rounded-xs animate-pulse" />
            </div>
            <span className="font-disco text-[8px] text-yellow-300 font-bold tracking-widest">
              DJ DONALD
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-black border border-yellow-400 flex items-center justify-center animate-spin">
            <div className="w-3 h-3 rounded-full bg-pink-500" />
          </div>
        </div>
      </div>
    </div>

    {/* Expanding Neon Shockwave Rings */}
    {shockwaves.map((sw) => {
      const age = performance.now() - sw.createdAt;
      const progress = Math.min(1, age / 400);
      const scale = 0.6 + progress * 2.2;
      const opacity = 1 - progress;

      return (
        <div
          key={sw.id}
          className="absolute rounded-full border-2 pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${sw.x}%`,
            top: `${sw.y}%`,
            width: '82px',
            height: '82px',
            borderColor: sw.color,
            boxShadow: `0 0 20px ${sw.color}`,
            transform: `translate(-50%, -50%) scale(${scale})`,
            opacity,
          }}
        />
      );
    })}

    {/* Explosive Particles Layer */}
    {particles.map((p) => (
      <div
        key={p.id}
        className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${p.x}%`,
          top: `${p.y}%`,
          width: `${p.size}px`,
          height: `${p.size}px`,
          backgroundColor: p.color,
          boxShadow: `0 0 10px ${p.color}, 0 0 20px ${p.color}`,
          borderRadius: p.size > 7 ? '2px' : '9999px',
          transform: `translate(-50%, -50%) rotate(${p.rot}deg)`,
          opacity: p.life,
        }}
      />
    ))}

    {/* Big Judgement Text Popups */}
    {popups.map((pop) => (
      <div
        key={pop.id}
        className="absolute z-30 font-disco text-2xl sm:text-3xl font-black tracking-widest pointer-events-none transform -translate-x-1/2 -translate-y-1/2 animate-scaleIn"
        style={{
          left: `${pop.x}%`,
          top: `${pop.y - 6}%`,
          color: pop.color,
          textShadow: `0 0 20px ${pop.color}, 0 0 35px ${pop.color}`,
        }}
      >
        {pop.text}
      </div>
    ))}

    {/* Turbo Vinyl Reward Banner */}
    {isComplete && accuracy >= 70 && (
      <div className="absolute inset-0 z-40 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
        <div className="w-28 h-28 rounded-full border-4 border-yellow-400 bg-black shadow-[0_0_50px_rgba(250,204,21,0.8)] flex items-center justify-center mb-4 animate-spin">
          <svg viewBox="0 0 80 80" className="w-full h-full p-2" fill="none">
            <circle cx="40" cy="40" r="36" stroke="#ca8a04" strokeWidth="2" />
            <circle cx="40" cy="40" r="28" stroke="#ca8a04" strokeWidth="1" />
            <circle cx="40" cy="40" r="20" stroke="#ca8a04" strokeWidth="1" />
            <circle cx="40" cy="40" r="12" fill="#eab308" />
            <circle cx="40" cy="40" r="4" fill="#000000" />
          </svg>
        </div>
        <span className="text-xs font-mono-rhythm text-yellow-300 font-bold uppercase tracking-widest mb-1">
          LEVEL REWARD UNLOCKED
        </span>
        <h3 className="font-disco text-3xl sm:text-4xl text-white neon-glow-gold mb-2">
          TURBO VINYL UNLOCKED!
        </h3>
        <p className="font-body text-white/80 text-sm max-w-sm mb-4">
          Flawless rhythm clicking! You conquered Quack Beat Pop and earned the Turbo Vinyl.
        </p>
      </div>
    )}
  </>
);