import React, { useState, useEffect } from 'react';
import { BeatmapEvent } from '../../game/BeatmapRunner';
import { JudgementType } from '../../config/scoring';

interface Level3StageProps {
  currentBeat: number;
  currentCue: BeatmapEvent | null;
  lastJudgement?: JudgementType | null;
  combo: number;
}

export const Level3Stage: React.FC<Level3StageProps> = ({
  currentBeat,
  lastJudgement,
}) => {
  const [isFlapping, setIsFlapping] = useState(false);

  useEffect(() => {
    if (lastJudgement && lastJudgement !== 'miss') {
      setIsFlapping(true);
      const t = setTimeout(() => setIsFlapping(false), 300);
      return () => clearTimeout(t);
    }
  }, [lastJudgement]);

  // Blackout breakdown effect during bar 8-10
  const isBlackout = (currentBeat >= 32 && currentBeat <= 42);
  const duckY = isFlapping ? '-translate-y-8 -rotate-12' : 'translate-y-6 rotate-12';

  return (
    <div className={`relative w-full max-w-lg h-56 rounded-3xl p-4 overflow-hidden flex flex-col justify-between select-none pointer-events-none transition-all duration-300 ${
      isBlackout
        ? 'bg-black border-2 border-dashed border-rose-500 shadow-[0_0_50px_rgba(244,63,94,0.5)]'
        : 'bg-black/70 border border-fuchsia-500/50 shadow-[0_0_30px_rgba(236,72,153,0.3)]'
    }`}>
      {/* Top HUD */}
      <div className="flex justify-between items-center z-10">
        <span className="text-[10px] font-mono-rhythm text-fuchsia-300 tracking-widest font-bold">
          🪽 FLAPPY DISCO DUCK
        </span>
        {isBlackout && (
          <span className="text-[11px] font-disco text-rose-400 animate-ping font-bold">
            ⚠️ BLACKOUT BREAKDOWN! TRUST YOUR EARS!
          </span>
        )}
      </div>

      {/* Flappy Flight Zone */}
      <div className="relative w-full h-36 flex items-center justify-between overflow-hidden">
        {/* Neon Laser Upper Gate */}
        <div
          className="absolute top-0 right-16 w-8 h-12 bg-gradient-to-b from-cyan-400 to-transparent border-x border-cyan-300 shadow-[0_0_15px_#06b6d4] transition-all"
          style={{ transform: `translateX(-${(currentBeat % 4) * 40}px)` }}
        />
        {/* Neon Laser Lower Gate */}
        <div
          className="absolute bottom-0 right-16 w-8 h-12 bg-gradient-to-t from-fuchsia-500 to-transparent border-x border-fuchsia-300 shadow-[0_0_15px_#ec4899] transition-all"
          style={{ transform: `translateX(-${(currentBeat % 4) * 40}px)` }}
        />

        {/* Flappy Duck Flying Mascot (Donald Sailor Style) */}
        <div className={`absolute left-16 transition-transform duration-200 ease-out ${duckY}`}>
          <svg width="65" height="55" viewBox="0 0 65 55" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Sailor Cap */}
            <path d="M 26 4 C 26 0, 38 0, 38 4 Z" fill="#1e40af" stroke="#2563eb" strokeWidth="1" />
            <path d="M 36 4 L 42 7 L 39 9 Z" fill="#0f172a" />
            {/* Sunglasses */}
            <rect x="34" y="10" width="14" height="6" rx="2" fill="#00ffff" />
            {/* Donald White Feather Head */}
            <circle cx="32" cy="16" r="12" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
            {/* Duck Bill */}
            <ellipse cx="46" cy="18" rx="7" ry="4" fill="#f97316" />
            {/* Sailor Blue Body */}
            <ellipse cx="24" cy="30" rx="14" ry="10" fill="#1e40af" stroke="#3b82f6" strokeWidth="1.5" />
            {/* Red Bow Tie 🎀 */}
            <ellipse cx="32" cy="24" rx="3" ry="2" fill="#ef4444" />
            {/* Flapping Wing (White Feather) */}
            <path
              d={isFlapping ? 'M 18 28 C 18 10, 32 10, 32 28 Z' : 'M 18 30 C 18 46, 32 46, 32 30 Z'}
              fill="#ffffff"
              stroke="#cbd5e1"
              strokeWidth="1.5"
            />
          </svg>
        </div>

      </div>

      <div className="text-center text-[10px] font-mono-rhythm text-white/50 tracking-widest">
        SPACEBAR / TAP TO FLAP ON THE BEAT • CRUISE THROUGH NEON GATES
      </div>
    </div>
  );
};
