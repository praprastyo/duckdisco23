import React from 'react';
import { JudgementType } from '../../config/scoring';
import { PrizeReveal3D } from '../../three/PrizeReveal3D';

interface Level4StageProps {
  currentBeat: number;
  lastJudgement?: JudgementType | null;
  combo: number;
  score: number;
  accuracy: number;
  isCompleted?: boolean;
}

export const Level4Stage: React.FC<Level4StageProps> = ({
  currentBeat,
  combo,
  score,
  accuracy,
  isCompleted = false,
}) => {
  const isEven = currentBeat % 2 === 0;
  const isGoalMet = score >= 70000 && accuracy >= 75;

  // Disco formation backup dancers
  const dancers = [-2, -1, 1, 2];

  if (isCompleted && isGoalMet) {
    return (
      <div className="w-full max-w-xl flex flex-col items-center">
        <PrizeReveal3D />
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-xl flex flex-col items-center select-none pointer-events-none">
      {/* Score Goal Threshold Banner */}
      <div className="mb-2 px-4 py-1.5 rounded-full bg-black/60 border border-yellow-500/50 backdrop-blur-md flex items-center gap-3 text-[11px] font-mono-rhythm">
        <span className="text-yellow-400 font-bold">👑 REVEAL REQUIREMENT:</span>
        <span className={score >= 70000 ? 'text-emerald-400 font-bold' : 'text-white/70'}>
          SCORE {score.toLocaleString()} / 70,000
        </span>
        <span className="text-white/30">•</span>
        <span className={accuracy >= 75 ? 'text-cyan-400 font-bold' : 'text-white/70'}>
          ACC {accuracy.toFixed(1)}% / 75%
        </span>
      </div>

      {/* Main Disco Floor Formation */}
      <div className="relative w-full h-52 flex items-center justify-center">
        {/* Backup Dancers in formation */}
        {dancers.map((offset) => {
          const delayBeat = offset % 2 === 0 ? isEven : !isEven;
          const pose = delayBeat ? '-translate-y-3 rotate-6' : 'translate-y-1 -rotate-6';
          return (
            <div
              key={offset}
              className={`absolute bottom-4 transition-transform duration-150 ${pose}`}
              style={{ transform: `translateX(${offset * 75}px)` }}
            >
              <svg width="45" height="55" viewBox="0 0 50 60" fill="none">
                <circle cx="25" cy="18" r="12" fill="#facc15" stroke="#ca8a04" />
                <ellipse cx="36" cy="20" rx="6" ry="3" fill="#f97316" />
                <rect x="18" y="14" width="14" height="6" rx="2" fill="#ec4899" />
                <path d="M 12 32 C 12 24, 38 24, 38 32 L 44 58 L 6 58 Z" fill="#4c0519" />
                {/* Disco finger point pose */}
                <line x1="38" y1="32" x2="48" y2="16" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          );
        })}

        {/* Center Golden Disco Mascot */}
        <div className={`relative z-10 transition-transform duration-100 ${isEven ? '-translate-y-4 scale-110' : 'translate-y-0'}`}>
          <svg width="85" height="100" viewBox="0 0 85 100" fill="none">
            <circle cx="42" cy="30" r="22" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
            <rect x="28" y="24" width="28" height="10" rx="3" fill="#00ffff" />
            <ellipse cx="60" cy="32" rx="10" ry="5" fill="#f97316" />
            <path d="M 22 52 C 22 40, 62 40, 62 52 L 72 94 L 12 94 Z" fill="#eab308" stroke="#facc15" strokeWidth="2" />
            {/* Double disco point arms */}
            <line x1="22" y1="52" x2="6" y2="28" stroke="#facc15" strokeWidth="4" strokeLinecap="round" />
            <line x1="62" y1="52" x2="78" y2="28" stroke="#facc15" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <div className="text-[10px] font-mono-rhythm text-yellow-300 tracking-widest uppercase">
        FINAL GRAND FINALE • HIT 70,000 PTS TO CRACK THE 3D GOLDEN EGG
      </div>
    </div>
  );
};
