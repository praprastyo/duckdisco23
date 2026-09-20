import React from 'react';

interface Level2CameosProps {
  currentBeat: number;
  combo: number;
  songTime: number;
}

/** Vector SVG Big Roller-Skate Duck with Neon Speed Trail */
const SkaterDuckSVG: React.FC<{ isEven: boolean }> = ({ isEven }) => (
  <div className="flex flex-col items-center">
    {/* Speed Trail Behind Skater */}
    <div className="absolute -left-10 top-6 flex gap-1 pointer-events-none opacity-70">
      <div className="w-8 h-1 rounded-full bg-cyan-400 blur-xs animate-pulse" />
      <div className="w-5 h-1 rounded-full bg-pink-500 blur-xs animate-pulse" />
    </div>

    <svg viewBox="0 0 70 75" className="w-18 h-20 filter drop-shadow-[0_0_15px_#ec4899]" fill="none">
      <circle cx="34" cy="22" r="14" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
      <rect x="28" y="18" width="16" height="7" rx="2" fill="#00ffff" />
      <ellipse cx="46" cy="24" rx="8" ry="4" fill="#f97316" />
      <path d="M 22 36 C 22 28, 46 28, 46 36 L 50 52 L 18 52 Z" fill="#8b5cf6" stroke="#a78bfa" strokeWidth="1.5" />
      {/* Neon Roller Skates with glowing wheels */}
      <rect x="18" y="54" width="12" height="5" rx="2" fill="#f43f5e" />
      <circle cx="21" cy="63" r="4" fill="#06b6d4" stroke="#ffffff" strokeWidth="1" className="animate-spin" />
      <circle cx="27" cy="63" r="4" fill="#06b6d4" stroke="#ffffff" strokeWidth="1" className="animate-spin" />
      <rect x="36" y="54" width="12" height="5" rx="2" fill="#f43f5e" />
      <circle cx="39" cy="63" r="4" fill="#06b6d4" stroke="#ffffff" strokeWidth="1" className="animate-spin" />
      <circle cx="45" cy="63" r="4" fill="#06b6d4" stroke="#ffffff" strokeWidth="1" className="animate-spin" />
    </svg>
    <div className={`w-24 h-2 rounded-full bg-cyan-400/50 blur-xs transition-transform duration-150 ${isEven ? 'scale-x-125' : 'scale-x-90'}`} />
  </div>
);

/** Vector SVG Breakdance B-Boy Duck */
const BreakdancerDuckSVG: React.FC<{ isEven: boolean }> = ({ isEven }) => (
  <div className={`flex flex-col items-center transition-transform duration-150 ${isEven ? 'rotate-45 scale-115' : '-rotate-45 scale-105'}`}>
    <svg viewBox="0 0 65 65" className="w-16 h-16 filter drop-shadow-[0_0_14px_#facc15]" fill="none">
      <circle cx="32" cy="24" r="12" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
      <ellipse cx="44" cy="26" rx="7" ry="3.5" fill="#f97316" />
      <path d="M 20 38 C 20 30, 44 30, 44 38 L 48 54 L 16 54 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" />
      <ellipse cx="22" cy="56" rx="6" ry="3" fill="#f97316" />
      <ellipse cx="42" cy="56" rx="6" ry="3" fill="#f97316" />
    </svg>
    <span className="text-[8px] font-disco text-yellow-300 bg-black/85 px-2.5 py-0.5 rounded-full font-black border border-yellow-400/70 shadow-[0_0_8px_#facc15]">
      B-BOY SPIN
    </span>
  </div>
);

/** Vector SVG Soaring Party Glider Duck */
const PartyGliderDuckSVG: React.FC<{ beat: number }> = ({ beat }) => (
  <div className="flex flex-col items-center">
    {/* Festive Vector Balloons */}
    <div className="flex -space-x-1 mb-1 animate-bounce">
      <div className="w-5 h-6 rounded-full bg-pink-500 border border-white/70 shadow-[0_0_10px_#ec4899]" />
      <div className="w-6 h-7 rounded-full bg-yellow-400 border border-white/70 shadow-[0_0_10px_#facc15]" />
      <div className="w-5 h-6 rounded-full bg-cyan-400 border border-white/70 shadow-[0_0_10px_#06b6d4]" />
    </div>
    {/* Glider Airplane Body */}
    <svg viewBox="0 0 75 48" className="w-20 h-14 filter drop-shadow-[0_0_14px_#38bdf8]" fill="none">
      {/* Glider Wings */}
      <polygon points="5,16 38,5 70,16 38,24" fill="#06b6d4" stroke="#e0f2fe" strokeWidth="2" />
      {/* Pilot Donald Duck */}
      <circle cx="38" cy="24" r="9" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.2" />
      <rect x="34" y="22" width="10" height="4.5" rx="1.5" fill="#0f172a" />
      <ellipse cx="46" cy="26" rx="4.5" ry="2.2" fill="#f97316" />
      <path d="M 30 32 C 30 28, 46 28, 46 32 L 48 42 L 28 42 Z" fill="#1e40af" stroke="#3b82f6" strokeWidth="1" />
    </svg>
  </div>
);

export const Level2Cameos: React.FC<Level2CameosProps> = ({ currentBeat, combo, songTime }) => {
  const isEven = currentBeat % 2 === 0;

  const showSkater = combo >= 10 || songTime >= 15;
  const showBreakdancer = combo >= 20 || songTime >= 35;
  const showGlider = combo >= 35 || songTime >= 55;

  const skaterX = `${((songTime * 16) % 120) - 14}%`;
  const gliderX = `${110 - ((songTime * 10) % 126)}%`;

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