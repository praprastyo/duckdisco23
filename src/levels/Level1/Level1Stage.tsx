import React from 'react';
import { BeatmapEvent } from '../../game/BeatmapRunner';
import { JudgementType } from '../../config/scoring';

interface Level1StageProps {
  currentBeat: number;
  currentCue: BeatmapEvent | null;
  lastJudgement?: JudgementType | null;
  combo: number;
  onArrowInput?: (action: 'left' | 'right' | 'up' | 'down' | 'tap') => void;
}

export const Level1Stage: React.FC<Level1StageProps> = ({
  currentBeat,
  currentCue,
  lastJudgement,
  combo,
  onArrowInput,
}) => {
  const isEven = currentBeat % 2 === 0;
  // AyoDance arrow step determined by beat or cue
  const arrowSequence = ['left', 'up', 'right', 'down'];
  const activeDirection = currentCue?.action || arrowSequence[currentBeat % 4];

  // Hip sway & walking motion from behind
  const hipSway = isEven ? '-rotate-6 translate-x-3' : 'rotate-6 -translate-x-3';
  const footStep = isEven ? 'translate-y-1' : '-translate-y-2';

  return (
    <div className="relative w-full max-w-lg flex flex-col items-center select-none pointer-events-none">
      {/* Runway perspective vanishing point lines */}
      <div className="relative w-72 sm:w-96 h-48 sm:h-56 flex flex-col items-center justify-end overflow-hidden">
        {/* Catwalk Runway Floor */}
        <div
          className="absolute inset-x-4 bottom-0 h-44 bg-gradient-to-t from-fuchsia-600/30 via-cyan-500/15 to-transparent rounded-t-3xl border-x-2 border-fuchsia-400/40"
          style={{
            transform: 'perspective(300px) rotateX(45deg)',
            backgroundImage: 'repeating-linear-gradient(0deg, rgba(236,72,153,0.3) 0px, rgba(236,72,153,0.3) 2px, transparent 2px, transparent 20px)',
          }}
        />

        {/* Duck Backside Walking (Camera from behind) */}
        <div className={`relative z-10 transition-transform duration-100 ease-out ${hipSway} ${footStep}`}>
          <svg width="140" height="150" viewBox="0 0 140 150" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Headphones back band */}
            <path d="M 35 55 C 35 20, 105 20, 105 55" stroke="#f43f5e" strokeWidth="8" strokeLinecap="round" />
            {/* Earcups */}
            <rect x="25" y="48" width="14" height="26" rx="6" fill="#1e1b4b" stroke="#e11d48" strokeWidth="2" />
            <rect x="101" y="48" width="14" height="26" rx="6" fill="#1e1b4b" stroke="#e11d48" strokeWidth="2" />

            {/* Back of Head */}
            <circle cx="70" cy="65" r="34" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
            {/* Duck tail feathers wagging */}
            <polygon points="70,128 58,142 82,142" fill="#eab308" />

            {/* DJ Jacket back with neon duck emblem */}
            <path d="M 38 95 C 38 80, 102 80, 102 95 L 110 135 C 110 142, 30 142, 30 135 Z" fill="#3b0764" stroke="#c084fc" strokeWidth="2" />
            <circle cx="70" cy="110" r="14" fill="#581c87" stroke="#e879f9" strokeWidth="2" />
            <text x="64" y="115" fill="#facc15" fontSize="12" fontWeight="bold">🦆</text>

            {/* Walking feet from behind */}
            <ellipse cx={isEven ? 52 : 48} cy="144" rx="10" ry="5" fill="#ea580c" />
            <ellipse cx={isEven ? 88 : 92} cy="144" rx="10" ry="5" fill="#ea580c" />
          </svg>
        </div>
      </div>

      {/* AyoDance Arrow Cue Bar */}
      <div className="mt-3 flex flex-col items-center gap-2">
        <div className="flex items-center gap-3 bg-black/60 border border-fuchsia-500/40 px-5 py-2.5 rounded-2xl shadow-[0_0_20px_rgba(236,72,153,0.3)]">
          {[
            { dir: 'left', icon: '←' },
            { dir: 'up', icon: '↑' },
            { dir: 'down', icon: '↓' },
            { dir: 'right', icon: '→' },
            { dir: 'tap', icon: 'SPACE' },
          ].map((item) => {
            const isTarget = activeDirection === item.dir;
            return (
              <div
                key={item.dir}
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-disco font-black text-sm transition-all duration-100 ${
                  isTarget
                    ? 'bg-yellow-400 text-black scale-110 shadow-[0_0_15px_#facc15]'
                    : 'bg-white/10 text-white/50 border border-white/10'
                }`}
              >
                {item.icon}
              </div>
            );
          })}
        </div>

        {/* Mobile touch arrow keypad */}
        <div className="flex sm:hidden items-center gap-2 mt-2 pointer-events-auto">
          {['left', 'up', 'down', 'right', 'tap'].map((d) => (
            <button
              key={d}
              data-interactive="true"
              onClick={() => onArrowInput?.(d as 'left' | 'right' | 'up' | 'down' | 'tap')}
              className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 text-white font-bold text-xs active:bg-yellow-400 active:text-black"
            >
              {d === 'left' ? '←' : d === 'right' ? '→' : d === 'up' ? '↑' : d === 'down' ? '↓' : 'HIT'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
