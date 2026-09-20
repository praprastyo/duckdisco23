import React from 'react';

interface Level2DancersProps {
  currentBeat: number;
  combo: number;
  songTime: number;
}

/** Vector SVG Big Disco Backup Dancer Duck */
const PodiumDancerSVG: React.FC<{
  suitColor: string;
  tieColor: string;
  isEven: boolean;
  flip?: boolean;
}> = ({ suitColor, tieColor, isEven, flip }) => (
  <div
    className={`flex flex-col items-center transition-transform duration-150 ${
      flip ? '-scale-x-100' : 'scale-x-100'
    } ${isEven ? '-translate-y-3 rotate-3' : 'translate-y-0 -rotate-3'}`}
  >
    <svg viewBox="0 0 70 85" className="w-18 h-22 filter drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]" fill="none">
      {/* Disco Sunglasses */}
      <circle cx="35" cy="24" r="14" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
      <rect x="30" y="20" width="18" height="7" rx="2" fill="#00ffff" />
      <ellipse cx="48" cy="26" rx="8" ry="4" fill="#f97316" />
      {/* Disco Suit Jacket */}
      <path d="M 22 38 C 22 30, 48 30, 48 38 L 52 60 C 52 64, 18 64, 18 60 Z" fill={suitColor} stroke="#ffffff" strokeWidth="1.5" />
      {/* Lapel & Tie */}
      <polygon points="31,38 35,48 39,38" fill="#ffffff" />
      <polygon points="33,42 35,54 37,42" fill={tieColor} />
      {/* Dancing arm raised high */}
      <path
        d={isEven ? "M 20 42 Q 10 30, 14 18" : "M 20 42 Q 12 48, 8 58"}
        stroke={suitColor}
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx={isEven ? 14 : 8} cy={isEven ? 18 : 58} r="4" fill="#f97316" />
      {/* Dancing shoes */}
      <ellipse cx="28" cy="65" rx="6" ry="3" fill="#ffffff" />
      <ellipse cx="42" cy="65" rx="6" ry="3" fill="#ffffff" />
    </svg>
    {/* Neon Glowing Podium Stand */}
    <div className="w-20 h-3 rounded-full bg-gradient-to-r from-cyan-400 via-white to-fuchsia-500 shadow-[0_0_15px_#06b6d4] -mt-1" />
  </div>
);

/** Vector SVG Big Spectator Duck Fan */
const FanDuckSVG: React.FC<{
  color: string;
  stickColor: string;
  isEven: boolean;
  banner?: string;
}> = ({ color, stickColor, isEven, banner }) => (
  <div className={`flex flex-col items-center transition-transform duration-150 ${isEven ? '-translate-y-2.5' : 'translate-y-0'}`}>
    {banner && (
      <div className="px-2 py-0.5 mb-1 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-400 text-black font-disco font-black text-[8px] tracking-wider shadow-[0_0_10px_#ec4899] animate-pulse whitespace-nowrap">
        {banner}
      </div>
    )}
    <div className="flex items-center gap-1.5">
      <div
        className="w-1.5 h-6 rounded-full transition-transform duration-100"
        style={{
          backgroundColor: stickColor,
          boxShadow: `0 0 10px ${stickColor}`,
          transform: isEven ? 'rotate(35deg)' : 'rotate(-20deg)',
        }}
      />
      <svg viewBox="0 0 45 50" className="w-11 h-13" fill="none">
        <circle cx="22" cy="16" r="11" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="18" y="13" width="12" height="5" rx="1.5" fill="#00ffff" />
        <ellipse cx="32" cy="18" rx="6" ry="3" fill="#f97316" />
        <path d="M 12 28 C 12 22, 32 22, 32 28 L 36 46 C 36 49, 8 49, 8 46 Z" fill={color} />
      </svg>
      <div
        className="w-1.5 h-6 rounded-full transition-transform duration-100"
        style={{
          backgroundColor: stickColor,
          boxShadow: `0 0 10px ${stickColor}`,
          transform: isEven ? 'rotate(-35deg)' : 'rotate(20deg)',
        }}
      />
    </div>
  </div>
);

export const Level2Dancers: React.FC<Level2DancersProps> = ({
  currentBeat,
  combo,
  songTime,
}) => {
  const isEven = currentBeat % 2 === 0;

  // Progressive crowd buildup
  const showLeftDancer = combo >= 8 || songTime >= 12;
  const showRightDancer = combo >= 16 || songTime >= 24;
  const showSideCrowd = combo >= 25 || songTime >= 40;
  const showBanners = combo >= 45 || songTime >= 65;
  const isCrowdFrenzy = combo >= 75 || songTime >= 95;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-12">
      {/* Left Podium Dancer */}
      {showLeftDancer && (
        <div className="absolute left-6 bottom-16 animate-fadeIn">
          <PodiumDancerSVG suitColor="#ec4899" tieColor="#06b6d4" isEven={isEven} />
          <span className="block text-center font-disco text-[9px] text-fuchsia-300 font-bold tracking-widest mt-1">
            DISCO DANCER
          </span>
        </div>
      )}

      {/* Right Podium Dancer */}
      {showRightDancer && (
        <div className="absolute right-6 bottom-16 animate-fadeIn">
          <PodiumDancerSVG suitColor="#06b6d4" tieColor="#facc15" isEven={!isEven} flip />
          <span className="block text-center font-disco text-[9px] text-cyan-300 font-bold tracking-widest mt-1">
            GROOVE DANCER
          </span>
        </div>
      )}

      {/* Left Flank Cheering Fan Crowd */}
      {showSideCrowd && (
        <div className="absolute left-2 top-20 flex flex-col gap-3 animate-fadeIn opacity-90">
          <FanDuckSVG color="#3b82f6" stickColor="#06b6d4" isEven={isEven} />
          {showBanners && (
            <FanDuckSVG color="#ec4899" stickColor="#f43f5e" isEven={!isEven} banner="HAPPY BIRTHDAY!" />
          )}
          {isCrowdFrenzy && (
            <FanDuckSVG color="#a855f7" stickColor="#c084fc" isEven={isEven} banner="146 BPM POP!" />
          )}
        </div>
      )}

      {/* Right Flank Cheering Fan Crowd */}
      {showSideCrowd && (
        <div className="absolute right-2 top-20 flex flex-col gap-3 animate-fadeIn opacity-90">
          <FanDuckSVG color="#10b981" stickColor="#34d399" isEven={!isEven} />
          {showBanners && (
            <FanDuckSVG color="#f59e0b" stickColor="#fbbf24" isEven={isEven} banner="DISCO FEVER!" />
          )}
          {isCrowdFrenzy && (
            <FanDuckSVG color="#06b6d4" stickColor="#38bdf8" isEven={!isEven} banner="QUACK ON BEAT!" />
          )}
        </div>
      )}
    </div>
  );
};