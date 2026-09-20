import React from 'react';

interface BeachCameosProps {
  beat: number;
  combo: number;
  isHit?: boolean;
}

/** Vector SVG Disco Seagull */
const SeagullSVG: React.FC<{ wingUp?: boolean }> = ({ wingUp }) => (
  <svg viewBox="0 0 48 32" className="w-9 h-6 filter drop-shadow" fill="none">
    <ellipse cx="24" cy="18" rx="10" ry="5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
    <circle cx="34" cy="15" r="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
    <path d="M 38 15 L 44 17 L 38 18 Z" fill="#f59e0b" />
    <rect x="33" y="13" width="5" height="3" rx="1" fill="#0f172a" />
    <line x1="31" y1="14" x2="33" y2="14" stroke="#0f172a" strokeWidth="1" />
    {wingUp ? (
      <path d="M 22 17 Q 16 2, 8 4 Q 14 12, 20 18" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
    ) : (
      <path d="M 22 18 Q 16 28, 8 26 Q 14 22, 20 19" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
    )}
    <path d="M 14 18 L 8 16 L 10 19 L 7 21 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
  </svg>
);

/** Vector SVG Donald Duck Surfer on Neon Surfboard */
const SurferDuckSVG: React.FC<{ tilt?: boolean }> = ({ tilt }) => (
  <div className="flex flex-col items-center">
    <svg viewBox="0 0 64 64" className="w-14 h-14 filter drop-shadow" fill="none">
      <ellipse cx="28" cy="10" rx="10" ry="4" fill="#1d4ed8" stroke="#1e3a8a" strokeWidth="1.5" />
      <path d="M 20 10 C 20 4, 36 4, 36 10 Z" fill="#2563eb" />
      <path d="M 36 10 Q 42 12, 44 16" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
      <circle cx="28" cy="22" r="11" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
      <path d="M 36 21 C 44 20, 48 24, 42 27 C 36 28, 35 25, 36 21 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
      <rect x="26" y="19" width="10" height="5" rx="1.5" fill="#0f172a" />
      <line x1="22" y1="21" x2="26" y2="21" stroke="#0f172a" strokeWidth="1.5" />
      <path d="M 18 32 C 18 28, 38 28, 38 32 L 40 46 C 40 49, 16 49, 16 46 Z" fill="#1e40af" stroke="#172554" strokeWidth="1.5" />
      <path d="M 22 31 L 28 39 L 34 31 Z" fill="#f8fafc" stroke="#fbbf24" strokeWidth="1" />
      <path d="M 24 37 L 28 39 L 24 41 Z M 32 37 L 28 39 L 32 41 Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />
      <circle cx="28" cy="39" r="1.5" fill="#dc2626" />
      <ellipse cx="23" cy="50" rx="5" ry="2" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
      <ellipse cx="33" cy="50" rx="5" ry="2" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
    </svg>
    <div
      className={`w-16 h-3 -mt-3 rounded-full bg-gradient-to-r from-fuchsia-500 via-yellow-400 to-cyan-400 border border-white shadow-[0_0_12px_#06b6d4] flex items-center justify-between px-2 transition-transform duration-200 ${
        tilt ? 'rotate-6' : '-rotate-6'
      }`}
    >
      <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
      <div className="w-1.5 h-1.5 rounded-full bg-cyan-200" />
    </div>
    <svg viewBox="0 0 60 12" className="w-16 h-3 -mt-0.5" fill="none">
      <path d="M 2 10 Q 12 2, 22 10 Q 32 2, 42 10 Q 52 2, 58 10" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="8" cy="4" r="1.5" fill="#e0f2fe" />
      <circle cx="50" cy="3" r="1.5" fill="#e0f2fe" />
    </svg>
  </div>
);

/** Vector SVG Donald Duck Paparazzi with Camera */
const PaparazziDuckSVG: React.FC<{ isFlashing?: boolean }> = ({ isFlashing }) => (
  <div className="relative flex flex-col items-center">
    {isFlashing && (
      <div className="absolute -top-10 -right-6 w-24 h-24 rounded-full bg-cyan-100/90 blur-xl pointer-events-none animate-ping" />
    )}
    <svg viewBox="0 0 64 64" className="w-14 h-14 filter drop-shadow" fill="none">
      <ellipse cx="30" cy="10" rx="10" ry="4" fill="#1d4ed8" stroke="#1e3a8a" strokeWidth="1.5" />
      <path d="M 22 10 C 22 4, 38 4, 38 10 Z" fill="#2563eb" />
      <path d="M 38 10 Q 44 12, 46 16" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
      <circle cx="30" cy="22" r="11" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
      <circle cx="33" cy="20" r="3" fill="#0f172a" />
      <circle cx="34" cy="19" r="1" fill="#ffffff" />
      <path d="M 38 22 C 46 22, 48 26, 42 28 C 37 29, 37 26, 38 22 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
      <path d="M 20 32 C 20 28, 40 28, 40 32 L 42 48 C 42 51, 18 51, 18 48 Z" fill="#1e40af" stroke="#172554" strokeWidth="1.5" />
      <path d="M 26 36 L 30 38 L 26 40 Z M 34 36 L 30 38 L 34 40 Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />
      <circle cx="30" cy="38" r="1.5" fill="#dc2626" />
      <rect x="34" y="26" width="18" height="13" rx="2" fill="#1e293b" stroke="#475569" strokeWidth="1.2" />
      <circle cx="43" cy="32" r="4.5" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
      <circle cx="43" cy="32" r="2" fill="#0f172a" />
      <rect x="36" y="23" width="6" height="3.5" rx="1" fill={isFlashing ? '#ffffff' : '#94a3b8'} stroke="#cbd5e1" strokeWidth="1" />
      <ellipse cx="36" cy="33" rx="3" ry="2" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
      <ellipse cx="25" cy="52" rx="5" ry="2" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
      <ellipse cx="35" cy="52" rx="5" ry="2" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
    </svg>
  </div>
);

/** Vector SVG Donald Duck Barista holding Tropical Cocktail */
const BeachBaristaDuckSVG: React.FC = () => (
  <div className="flex flex-col items-center">
    <svg viewBox="0 0 64 64" className="w-14 h-14 filter drop-shadow" fill="none">
      <ellipse cx="28" cy="10" rx="10" ry="4" fill="#1d4ed8" stroke="#1e3a8a" strokeWidth="1.5" />
      <path d="M 20 10 C 20 4, 36 4, 36 10 Z" fill="#2563eb" />
      <path d="M 36 10 Q 42 12, 44 16" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
      <circle cx="28" cy="22" r="11" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
      <ellipse cx="25" cy="19" rx="2" ry="3" fill="#0f172a" />
      <circle cx="25.5" cy="18" r="0.8" fill="#ffffff" />
      <path d="M 18 22 C 10 22, 8 26, 14 28 C 19 29, 19 26, 18 22 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
      <path d="M 18 32 C 18 28, 38 28, 38 32 L 40 48 C 40 51, 16 51, 16 48 Z" fill="#1e40af" stroke="#172554" strokeWidth="1.5" />
      <path d="M 24 35 L 28 37 L 24 39 Z M 32 35 L 28 37 L 32 39 Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />
      <circle cx="28" cy="37" r="1.5" fill="#dc2626" />
      <path d="M 36 34 C 36 29, 48 29, 48 34 C 48 43, 36 43, 36 34 Z" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
      <ellipse cx="42" cy="33" rx="5" ry="2" fill="#ec4899" />
      <line x1="42" y1="33" x2="48" y2="23" stroke="#eab308" strokeWidth="2" strokeLinecap="round" />
      <path d="M 40 28 Q 44 24, 46 29 Z" fill="#06b6d4" stroke="#0891b2" strokeWidth="1" />
      <ellipse cx="23" cy="52" rx="5" ry="2" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
      <ellipse cx="33" cy="52" rx="5" ry="2" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
    </svg>
  </div>
);

/** Vector SVG Security Bouncer Duck */
const SecurityDuckSVG: React.FC = () => (
  <div className="flex flex-col items-center">
    <svg viewBox="0 0 64 64" className="w-14 h-14 filter drop-shadow" fill="none">
      <circle cx="32" cy="20" r="11" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
      <rect x="25" y="17" width="14" height="6" rx="1.5" fill="#0f172a" />
      <line x1="22" y1="19" x2="25" y2="19" stroke="#0f172a" strokeWidth="1.5" />
      <line x1="39" y1="19" x2="42" y2="19" stroke="#0f172a" strokeWidth="1.5" />
      <path d="M 28 24 C 28 21, 36 21, 36 24 C 36 28, 28 28, 28 24 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
      <path d="M 16 31 C 16 26, 48 26, 48 31 L 50 50 C 50 53, 14 53, 14 50 Z" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
      <path d="M 28 30 L 32 40 L 36 30 Z" fill="#f8fafc" />
      <path d="M 31 32 L 33 32 L 32.5 42 Z" fill="#020617" />
      <polygon points="20,34 23,32 26,34 25,38 21,38" fill="#eab308" stroke="#ca8a04" strokeWidth="0.8" />
      <ellipse cx="26" cy="54" rx="5" ry="2" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
      <ellipse cx="38" cy="54" rx="5" ry="2" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
    </svg>
  </div>
);

/** Vector SVG VIP Disco Duck with Golden Crown */
const VipDuckSVG: React.FC = () => (
  <div className="flex flex-col items-center">
    <svg viewBox="0 0 64 64" className="w-14 h-14 filter drop-shadow" fill="none">
      <polygon points="23,12 25,5 29,9 33,4 37,9 41,5 43,12" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
      <circle cx="25" cy="5" r="1.5" fill="#ec4899" />
      <circle cx="33" cy="4" r="1.5" fill="#06b6d4" />
      <circle cx="41" cy="5" r="1.5" fill="#ec4899" />
      <circle cx="33" cy="22" r="11" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
      <polygon points="26,17 28,21 32,21 29,23 30,27 26,24 22,27 23,23 20,21 24,21" fill="#f43f5e" />
      <polygon points="36,17 38,21 42,21 39,23 40,27 36,24 32,27 33,23 30,21 34,21" fill="#f43f5e" />
      <path d="M 30 25 C 30 22, 38 22, 38 25 C 38 29, 30 29, 30 25 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
      <path d="M 18 33 C 18 28, 48 28, 48 33 L 49 50 C 49 53, 17 53, 17 50 Z" fill="#a855f7" stroke="#7e22ce" strokeWidth="1.5" />
      <path d="M 28 32 L 33 42 L 38 32 Z" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
      <ellipse cx="27" cy="54" rx="5" ry="2" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
      <ellipse cx="39" cy="54" rx="5" ry="2" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
    </svg>
  </div>
);

export const BeachCameos: React.FC<BeachCameosProps> = ({ beat, combo, isHit }) => {
  const isEven = beat % 2 === 0;
  const isFever = combo >= 15;

  // Surfer duck travels across ocean based on beat
  const surferLeft = `${((beat * 8) % 110) - 10}%`;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10">
      {/* 1. Disco Seagulls Flying Across Sky (Vector SVG) */}
      <div
        className="absolute top-10 flex gap-12 transition-all duration-700 ease-linear"
        style={{ left: `${((beat * 6) % 120) - 20}%` }}
      >
        <div className={`flex items-center transition-transform duration-200 ${isEven ? '-translate-y-2 rotate-6' : 'translate-y-2 -rotate-6'}`}>
          <SeagullSVG wingUp={isEven} />
        </div>
        <div className={`flex items-center transition-transform duration-200 ${!isEven ? '-translate-y-3' : 'translate-y-1'}`}>
          <SeagullSVG wingUp={!isEven} />
        </div>
      </div>

      {/* 2. Surfer Donald Duck Riding Ocean Waves (Vector SVG) */}
      <div
        className="absolute top-[63%] transition-all duration-300 ease-out"
        style={{ left: surferLeft }}
      >
        <div className={`flex flex-col items-center ${isEven ? '-translate-y-4 rotate-12 scale-110' : 'translate-y-0 -rotate-6'}`}>
          <SurferDuckSVG tilt={isEven} />
        </div>
      </div>

      {/* 3. Paparazzi Donald Duck with Camera Flashes (Vector SVG) */}
      <div className="absolute bottom-2 left-2 sm:left-6 flex flex-col items-center">
        <div className={`flex items-end ${isEven ? 'scale-105' : 'scale-95'}`}>
          <PaparazziDuckSVG isFlashing={isEven || isHit} />
        </div>
        <span className="text-[8px] font-mono-rhythm text-yellow-300 bg-black/60 px-1.5 py-0.2 rounded-full font-bold">
          PAPARAZZI
        </span>
      </div>

      {/* 4. Coconut Drink Barista Duck (Vector SVG) */}
      <div className="absolute bottom-2 right-2 sm:right-6 flex flex-col items-center">
        <div className={`flex items-end ${!isEven ? 'scale-110 -rotate-6' : 'scale-100 rotate-6'}`}>
          <BeachBaristaDuckSVG />
        </div>
        <span className="text-[8px] font-mono-rhythm text-cyan-300 bg-black/60 px-1.5 py-0.2 rounded-full font-bold">
          BEACH BAR
        </span>
      </div>

      {/* 5. Club Bouncer Security Duck (Vector SVG) */}
      {combo >= 10 && (
        <div className="absolute bottom-16 left-4 sm:left-14 flex flex-col items-center animate-fadeIn">
          <div className={`flex flex-col items-center ${isEven ? 'translate-y-1' : '-translate-y-2'}`}>
            <SecurityDuckSVG />
            <div className="w-11 h-3 -mt-1 bg-black rounded border border-yellow-400 flex items-center justify-center">
              <span className="text-[6px] font-bold text-yellow-300">SECURITY</span>
            </div>
          </div>
        </div>
      )}

      {/* 6. VIP Beach Party Duck (Vector SVG) */}
      {isFever && (
        <div className="absolute bottom-16 right-4 sm:right-14 flex flex-col items-center animate-bounce">
          <VipDuckSVG />
          <span className="text-[8px] font-bold text-fuchsia-300 bg-black/70 px-1.5 rounded-full -mt-1">VIP DUCK</span>
        </div>
      )}
    </div>
  );
};
