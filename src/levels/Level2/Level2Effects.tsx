import React from 'react';

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
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

interface Level2EffectsProps {
  particles: Particle[];
  popups: HitPopup[];
  isComplete?: boolean;
  accuracy: number;
  isBeatOdd: boolean;
}

export const Level2Effects: React.FC<Level2EffectsProps> = ({
  particles,
  popups,
  isComplete,
  accuracy,
  isBeatOdd,
}) => (
  <>
    {/* Large DJ Donald Duck Booth in Bottom-Left Corner (Vector SVG, No Emojis) */}
    <div
      className={`absolute left-4 bottom-3 z-16 flex items-end gap-2 pointer-events-none transition-transform duration-100 ${
        isBeatOdd ? '-translate-y-2' : 'translate-y-0'
      }`}
    >
      <div className="flex flex-col items-center">
        {/* DJ Donald Figure */}
        <svg width="75" height="85" viewBox="0 0 75 85" fill="none" className="filter drop-shadow-[0_0_14px_rgba(6,182,212,0.4)]">
          {/* Blue Sailor Cap */}
          <path d="M 24 10 C 24 3, 44 3, 44 10 Z" fill="#1e40af" stroke="#3b82f6" strokeWidth="1.5" />
          <path d="M 40 10 L 48 14 L 43 16 Z" fill="#0f172a" />
          {/* Over-ear DJ Headphones with Neon Glow */}
          <path d="M 16 28 C 16 12, 54 12, 54 28" stroke="#ec4899" strokeWidth="4" strokeLinecap="round" />
          <rect x="12" y="24" width="7" height="12" rx="3.5" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
          <rect x="51" y="24" width="7" height="12" rx="3.5" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
          {/* Sunglasses */}
          <rect x="30" y="20" width="18" height="8" rx="2" fill="#00ffff" />
          {/* White Duck Head */}
          <circle cx="34" cy="26" r="14" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
          {/* Duck Beak */}
          <ellipse cx="48" cy="28" rx="8" ry="4" fill="#f97316" />
          {/* Sailor Blue Body */}
          <ellipse cx="26" cy="48" rx="16" ry="14" fill="#1e40af" stroke="#3b82f6" strokeWidth="1.5" />
          {/* Red Bow Tie 🎀 */}
          <ellipse cx="34" cy="38" rx="4" ry="3" fill="#ef4444" />
        </svg>

        {/* DJ Booth Desk & Dual Vinyl Turntables */}
        <div className="w-36 h-10 -mt-3 bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-900 border border-cyan-400/80 rounded-xl p-1.5 flex items-center justify-between shadow-[0_0_20px_#06b6d4]">
          {/* Left Turntable Vinyl */}
          <div className="w-7 h-7 rounded-full bg-black border border-yellow-400/80 flex items-center justify-center animate-spin">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          </div>
          {/* LED Equalizer display */}
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex gap-0.5">
              <div className="w-1 h-3 bg-cyan-400 rounded-xs" />
              <div className="w-1 h-4 bg-yellow-400 rounded-xs" />
              <div className="w-1 h-2 bg-pink-500 rounded-xs" />
            </div>
            <span className="font-disco text-[7px] text-yellow-300 font-bold tracking-widest">
              DJ DONALD
            </span>
          </div>
          {/* Right Turntable Vinyl */}
          <div className="w-7 h-7 rounded-full bg-black border border-yellow-400/80 flex items-center justify-center animate-spin">
            <div className="w-2.5 h-2.5 rounded-full bg-pink-500" />
          </div>
        </div>
      </div>
    </div>

    {/* Hit Particles Layer */}
    {particles.map((p) => (
      <div
        key={p.id}
        className="absolute w-2.5 h-2.5 rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${p.x}%`,
          top: `${p.y}%`,
          backgroundColor: p.color,
          opacity: p.life,
          boxShadow: `0 0 8px ${p.color}`,
        }}
      />
    ))}

    {/* Judgement Text Popups */}
    {popups.map((pop) => (
      <div
        key={pop.id}
        className="absolute z-30 font-disco text-sm sm:text-base font-black tracking-widest pointer-events-none transform -translate-x-1/2 -translate-y-1/2 animate-scaleIn"
        style={{
          left: `${pop.x}%`,
          top: `${pop.y - 4}%`,
          color: pop.color,
          textShadow: `0 0 14px ${pop.color}`,
        }}
      >
        {pop.text}
      </div>
    ))}

    {/* Turbo Vinyl Reward Banner (100% Vector SVG Vinyl, Zero Emojis) */}
    {isComplete && accuracy >= 70 && (
      <div className="absolute inset-0 z-40 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
        {/* Glowing Vector Golden Vinyl Disc */}
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