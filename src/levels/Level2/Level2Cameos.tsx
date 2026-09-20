import React from 'react';

interface Level2CameosProps {
  currentBeat: number;
  combo: number;
  songTime: number;
}

const SkaterDuck: React.FC<{ isEven: boolean }> = ({ isEven }) => (
  <div className="flex flex-col items-center">
    <svg viewBox="0 0 50 50" className="w-12 h-12 drop-shadow-[0_0_8px_#ec4899]" fill="none">
      <circle cx="25" cy="18" r="9" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
      <rect x="22" y="16" width="10" height="4" rx="1" fill="#00ffff" />
      <ellipse cx="32" cy="19" rx="5" ry="2.5" fill="#f97316" />
      <path d="M 16 28 C 16 22, 34 22, 34 28 L 36 40 L 14 40 Z" fill="#8b5cf6" />
      <circle cx="18" cy="46" r="3" fill="#06b6d4" />
      <circle cx="32" cy="46" r="3" fill="#06b6d4" />
    </svg>
    <div className={`w-10 h-1 rounded-full bg-cyan-400/40 blur-xs ${isEven ? 'scale-x-125' : 'scale-x-90'}`} />
  </div>
);

const SpectatorDuck: React.FC<{ color: string; stickColor: string; isEven: boolean; banner?: string }> = ({
  color,
  stickColor,
  isEven,
  banner,
}) => (
  <div className={`flex flex-col items-center transition-transform duration-150 ${isEven ? '-translate-y-2' : 'translate-y-0'}`}>
    {banner && (
      <div className="px-1.5 py-0.5 mb-1 rounded bg-gradient-to-r from-pink-500 to-yellow-400 text-black font-disco font-black text-[7px] shadow-[0_0_8px_#f43f5e] animate-pulse whitespace-nowrap">
        {banner}
      </div>
    )}
    <div className="flex items-center gap-1">
      <div className="w-1 h-3 rounded-full" style={{ backgroundColor: stickColor, boxShadow: `0 0 5px ${stickColor}` }} />
      <svg viewBox="0 0 30 35" className="w-7 h-9" fill="none">
        <circle cx="15" cy="12" r="7" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
        <rect x="12" y="10" width="7" height="3" rx="1" fill="#00ffff" />
        <ellipse cx="21" cy="13" rx="4" ry="2" fill="#f97316" />
        <path d="M 8 18 C 8 15, 22 15, 22 18 L 24 32 L 6 32 Z" fill={color} />
      </svg>
      <div className="w-1 h-3 rounded-full" style={{ backgroundColor: stickColor, boxShadow: `0 0 5px ${stickColor}` }} />
    </div>
  </div>
);

export const Level2Cameos: React.FC<Level2CameosProps> = ({ currentBeat, combo, songTime }) => {
  const isEven = currentBeat % 2 === 0;

  const showCheerleaders = combo >= 6 || songTime >= 8;
  const showSkater = combo >= 12 || songTime >= 20;
  const showDrone = combo >= 30 || songTime >= 50;
  const showMegaCrowd = combo >= 50 || songTime >= 80;

  const skaterX = `${((songTime * 14) % 115) - 10}%`;
  const droneX = `${105 - ((songTime * 9) % 120)}%`;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10">
      {/* 1. Left Sideline Spectator Ducks */}
      {showCheerleaders && (
        <div className="absolute left-2 top-20 flex flex-col gap-2 opacity-85 animate-fadeIn">
          <SpectatorDuck color="#3b82f6" stickColor="#06b6d4" isEven={isEven} />
          {showMegaCrowd && (
            <SpectatorDuck color="#ec4899" stickColor="#f43f5e" isEven={!isEven} banner="HAPPY BIRTHDAY! 🎉" />
          )}
          {songTime >= 30 && <SpectatorDuck color="#8b5cf6" stickColor="#a855f7" isEven={isEven} />}
        </div>
      )}

      {/* 2. Right Sideline Spectator Ducks */}
      {showCheerleaders && (
        <div className="absolute right-2 top-20 flex flex-col gap-2 opacity-85 animate-fadeIn">
          <SpectatorDuck color="#10b981" stickColor="#34d399" isEven={!isEven} />
          {showMegaCrowd && (
            <SpectatorDuck color="#f59e0b" stickColor="#fbbf24" isEven={isEven} banner="146 BPM FEVER! 🔥" />
          )}
          {songTime >= 45 && <SpectatorDuck color="#06b6d4" stickColor="#38bdf8" isEven={!isEven} />}
        </div>
      )}

      {/* 3. Roller-Skate Disco Duck cruising on bottom floor */}
      {showSkater && (
        <div className="absolute bottom-5 transition-all duration-300 ease-linear z-15" style={{ left: skaterX }}>
          <SkaterDuck isEven={isEven} />
        </div>
      )}

      {/* 4. Flying Party Drone Duck carrying birthday balloons */}
      {showDrone && (
        <div className="absolute top-10 transition-all duration-500 ease-linear z-15 flex flex-col items-center" style={{ left: droneX }}>
          <div className="w-8 h-8 rounded-full border border-cyan-400 bg-cyan-950/80 flex items-center justify-center shadow-[0_0_10px_#06b6d4]">
            <span className="text-sm">🦆</span>
          </div>
          <div className="flex gap-0.5 -mt-1 animate-bounce">
            <span className="text-[9px]">🎈</span>
            <span className="text-[9px]">🎁</span>
          </div>
        </div>
      )}
    </div>
  );
};
