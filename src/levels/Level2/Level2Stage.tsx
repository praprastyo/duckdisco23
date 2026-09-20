import React, { useState, useEffect } from 'react';
import { BeatmapEvent } from '../../game/BeatmapRunner';
import { JudgementType } from '../../config/scoring';

interface Level2StageProps {
  currentBeat: number;
  currentCue: BeatmapEvent | null;
  lastJudgement?: JudgementType | null;
  combo: number;
}

export const Level2Stage: React.FC<Level2StageProps> = ({
  currentBeat,
  lastJudgement,
  combo,
}) => {
  const [isJumping, setIsJumping] = useState(false);

  useEffect(() => {
    if (lastJudgement && lastJudgement !== 'miss') {
      setIsJumping(true);
      const t = setTimeout(() => setIsJumping(false), 450);
      return () => clearTimeout(t);
    }
  }, [lastJudgement]);

  const isLegStep = currentBeat % 2 === 0;

  // Freestyle levels based on combo:
  // Level 0: Standard Jump
  // Level 1 (Combo 4-7): 360 Backflip
  // Level 2 (Combo 8-12): Air Breakdance Spin
  // Level 3 (Combo 13+): Rainbow Helicopter Flight Pose
  let freestyleClass = '';
  let freestyleLabel = '';

  if (isJumping) {
    if (combo >= 13) {
      freestyleClass = '-translate-y-20 rotate-[720deg] scale-125';
      freestyleLabel = '🌪️ RAINBOW HELICOPTER!';
    } else if (combo >= 8) {
      freestyleClass = '-translate-y-16 rotate-[360deg] scale-110';
      freestyleLabel = '🤸 BREAKDANCE SPIN!';
    } else if (combo >= 4) {
      freestyleClass = '-translate-y-14 -rotate-[360deg]';
      freestyleLabel = '🔄 360 BACKFLIP!';
    } else {
      freestyleClass = '-translate-y-12';
      freestyleLabel = '🦘 HOP!';
    }
  }

  return (
    <div className="relative w-full max-w-lg h-56 bg-black/60 border border-cyan-500/40 rounded-3xl p-4 overflow-hidden flex flex-col justify-between select-none pointer-events-none shadow-[0_0_30px_rgba(6,182,212,0.25)]">
      {/* Top Runner HUD */}
      <div className="flex justify-between items-center z-10">
        <span className="text-[10px] font-mono-rhythm text-cyan-300 tracking-widest font-bold">
          🦖 CHROME DINO DISCO RUNNER
        </span>
        {freestyleLabel && isJumping && (
          <span className="text-xs font-disco text-yellow-300 animate-bounce tracking-wider">
            {freestyleLabel}
          </span>
        )}
      </div>

      {/* Runner Arena */}
      <div className="relative w-full h-36 flex items-end">
        {/* Ground Line */}
        <div className="absolute bottom-4 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_#06b6d4]" />

        {/* Dino Running Duck */}
        <div
          className={`absolute left-10 bottom-4 transition-all duration-200 ease-out ${
            isJumping ? freestyleClass : ''
          }`}
        >
          <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Blue Sailor Cap */}
            <path d="M 28 8 C 28 2, 42 2, 42 8 Z" fill="#1e40af" stroke="#2563eb" strokeWidth="1" />
            <path d="M 39 8 L 45 12 L 42 14 Z" fill="#0f172a" />
            {/* Sunglasses */}
            <rect x="36" y="16" width="16" height="7" rx="2" fill="#00ffff" />
            {/* Donald White Feather Head */}
            <circle cx="34" cy="22" r="14" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
            {/* Duck Beak */}
            <ellipse cx="50" cy="24" rx="8" ry="4" fill="#f97316" />
            {/* Sailor Blue Body */}
            <ellipse cx="26" cy="40" rx="16" ry="12" fill="#1e40af" stroke="#3b82f6" strokeWidth="1.5" />
            {/* Red Bow Tie 🎀 */}
            <ellipse cx="34" cy="32" rx="3.5" ry="2.5" fill="#ef4444" />
            {/* Running legs (animated like chrome dino) */}
            <line x1="22" y1="52" x2={isLegStep ? 16 : 26} y2="64" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
            <line x1="30" y1="52" x2={isLegStep ? 36 : 22} y2="64" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
          </svg>

        </div>

        {/* Incoming Obstacle (Cactus / Neon Disco Block) */}
        <div
          className="absolute bottom-4 right-10 flex flex-col items-center transition-all"
          style={{
            transform: `translateX(-${(currentBeat % 4) * 45}px)`,
          }}
        >
          <div className="w-6 h-10 bg-gradient-to-t from-pink-600 to-fuchsia-400 border border-fuchsia-300 rounded-t-lg shadow-[0_0_12px_#ec4899] flex items-center justify-center">
            <span className="text-[10px]">🌵</span>
          </div>
        </div>
      </div>

      {/* Instructions footer */}
      <div className="text-center text-[10px] font-mono-rhythm text-white/50 tracking-widest">
        SPACEBAR / TAP TO JUMP • KEEP COMBO FOR INSANE FREESTYLE TRICKS
      </div>
    </div>
  );
};
