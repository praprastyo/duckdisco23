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
    {/* DJ Donald 2D Mascot in Corner */}
    <div
      className={`absolute left-5 bottom-4 z-10 flex items-end gap-2 pointer-events-none transition-transform duration-100 ${
        isBeatOdd ? '-translate-y-2' : 'translate-y-0'
      }`}
    >
      <svg width="60" height="70" viewBox="0 0 60 70" fill="none">
        <path d="M 20 8 C 20 2, 36 2, 36 8 Z" fill="#1e40af" stroke="#3b82f6" strokeWidth="1" />
        <path d="M 33 8 L 40 12 L 36 14 Z" fill="#0f172a" />
        <rect x="26" y="16" width="16" height="7" rx="2" fill="#00ffff" />
        <circle cx="26" cy="22" r="13" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <ellipse cx="40" cy="24" rx="7" ry="4" fill="#f97316" />
        <ellipse cx="20" cy="40" rx="14" ry="12" fill="#1e40af" stroke="#3b82f6" strokeWidth="1.5" />
        <ellipse cx="26" cy="32" rx="3.5" ry="2.5" fill="#ef4444" />
        <circle cx="44" cy="44" r="9" fill="#111827" stroke="#eab308" strokeWidth="1.5" />
        <circle cx="44" cy="44" r="3" fill="#ef4444" />
      </svg>
      <span className="font-disco text-[10px] text-cyan-300/80 tracking-widest uppercase">
        DJ DONALD
      </span>
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

    {/* Turbo Vinyl Reward Banner */}
    {isComplete && accuracy >= 70 && (
      <div className="absolute inset-0 z-40 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
        <div className="w-24 h-24 rounded-full border-4 border-yellow-400 bg-gradient-to-tr from-yellow-500/30 to-amber-500/40 flex items-center justify-center text-5xl mb-4 shadow-[0_0_50px_rgba(250,204,21,0.8)] animate-spin">
          💿
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
