import React from 'react';

interface Level2CameosProps {
  currentBeat: number;
  combo: number;
  songTime: number;
}

/** Vector SVG Big Roller-Skate Duck */
const SkaterDuckSVG: React.FC<{ isEven: boolean }> = ({ isEven }) => (
  <div className="flex flex-col items-center">
    <svg viewBox="0 0 65 70" className="w-16 h-18 filter drop-shadow-[0_0_12px_#ec4899]" fill="none">
      <circle cx="32" cy="20" r="14" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
      <rect x="26" y="16" width="16" height="7" rx="2" fill="#00ffff" />
      <ellipse cx="44" cy="22" rx="7" ry="3.5" fill="#f97316" />
      <path d="M 20 34 C 20 26, 44 26, 44 34 L 48 50 L 16 50 Z" fill="#8b5cf6" stroke="#a78bfa" strokeWidth="1.5" />
      {/* Neon Roller Skates */}
      <rect x="16" y="52" width="12" height="5" rx="2" fill="#f43f5e" />
      <circle cx="19" cy="61" r="3.5" fill="#06b6d4" stroke="#ffffff" strokeWidth="1" />
      <circle cx="25" cy="61" r="3.5" fill="#06b6d4" stroke="#ffffff" strokeWidth="1" />
      <rect x="34" y="52" width="12" height="5" rx="2" fill="#f43f5e" />
      <circle cx="37" cy="61" r="3.5" fill="#06b6d4" stroke="#ffffff" strokeWidth="1" />
      <circle cx="43" cy="61" r="3.5" fill="#06b6d4" stroke="#ffffff" strokeWidth="1" />
    </svg>
    <div className={`w-20 h-1.5 rounded-full bg-cyan-400/40 blur-xs transition-transform duration-150 ${isEven ? 'scale-x-125' : 'scale-x-90'}`} />
  </div>
);

/** Vector SVG Breakdance Duck */
const BreakdancerDuckSVG: React.FC<{ isEven: boolean }> = ({ isEven }) => (
  <div className={`flex flex-col items-center transition-transform duration-150 ${isEven ? 'rotate-45 scale-110' : '-rotate-45 scale-100'}`}>
    <svg viewBox="0 0 60 60" className="w-15 h-15 filter drop-shadow-[0_0_12px_#facc15]" fill="none">
      <circle cx="30" cy="22" r="11" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
      <ellipse cx="42" cy="24" rx="7" ry="3.5" fill="#f97316" />
      <path d="M 18 36 C 18 28, 42 28, 42 36 L 46 52 L 14 52 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" />
      <ellipse cx="20" cy="54" rx="5" ry="2.5" fill="#f97316" />
      <ellipse cx="40" cy="54" rx="5" ry="2.5" fill="#f97316" />
    </svg>
    <span className="text-[8px] font-disco text-yellow-300 bg-black/80 px-2 py-0.5 rounded-full font-bold border border-yellow-400/50">
      BREAKDANCE
    </span>
  </div>
);

/** Vector SVG Party Balloon Glider (Zero emojis) */
const PartyGliderDuckSVG: React.FC<{ beat: number }> = ({ beat }) => (
  <div className="flex flex-col items-center">
    <div className="flex items-center gap-2">
      {/* Colorful Vector Balloons */}
      <div className="flex -space-x-1.5 mb-1 animate-bounce">
        <div className="w-4 h-5 rounded-full bg-pink-500 border border-white/60 shadow-[0_0_8px_#ec4899]" />
        <div className="w-5 h-6 rounded-full bg-yellow-400 border border-white/60 shadow-[0_0_8px_#facc15]" />
        <div className="w-4 h-5 rounded-full bg-cyan-400 border border-white/60 shadow-[0_0_8px_#06b6d4]" />
      </div>
    </div>
    {/* Glider Duck */}
    <svg viewBox="0 0 70 45" className="w-18 h-12 filter drop-shadow-[0_0_12px_#38bdf8]" fill="none">
      {/* Glider Wing */}
      <polygon points="5,15 35,5 65,15 35,22" fill="#06b6d4" stroke="#e0f2fe" strokeWidth="1.5" />
      {/* Pilot Duck */}
      <circle cx="35" cy="24" r="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
      <rect x="32" y="22" width="9" height="4" rx="1" fill="#0f172a" />
      <ellipse cx="42" cy="25" rx="4" ry="2" fill="#f97316" />
      <path d="M 28 32 C 28 28, 42 28, 42 32 L 44 42 L 26 42 Z" fill="#1e40af" />
    </svg>
  </div>
);

export const Level2Cameos: React.FC<Level2CameosProps> = ({ currentBeat, combo, songTime }) => {
  const isEven = currentBeat % 2 === 0;

  const showSkater = combo >= 10 || songTime >= 15;
  const showBreakdancer = combo >= 20 || songTime >= 35;
  const showGlider = combo >= 35 || songTime >= 60;

  const skaterX = `${((songTime * 15) % 118) - 12}%`;
  const gliderX = `${108 - ((songTime * 9) % 124)}%`;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-14">
      {/* Roller-Skate Disco Duck cruising across bottom floor */}
      {showSkater && (
        <div className="absolute bottom-6 transition-all duration-300 ease-linear z-15" style={{ left: skaterX }}>
          <SkaterDuckSVG isEven={isEven} />
        </div>
      )}

      {/* Breakdance B-Boy Duck performing on bottom right floor */}
      {showBreakdancer && (
        <div className="absolute right-12 bottom-6 z-15 animate-bounce">
          <BreakdancerDuckSVG isEven={isEven} />
        </div>
      )}

      {/* Soaring Party Glider Duck across top */}
      {showGlider && (
        <div className="absolute top-10 transition-all duration-500 ease-linear z-15" style={{ left: gliderX }}>
          <PartyGliderDuckSVG beat={currentBeat} />
        </div>
      )}
    </div>
  );
};