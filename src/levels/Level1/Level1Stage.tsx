import React, { useState, useEffect } from 'react';
import { BeatmapEvent } from '../../game/BeatmapRunner';
import { JudgementType } from '../../config/scoring';

interface Level1StageProps {
  currentBeat: number;
  currentCue: BeatmapEvent | null;
  lastJudgement?: JudgementType | null;
  combo: number;
  onLaneSwitch?: (lane: 'left' | 'right') => void;
}

export const Level1Stage: React.FC<Level1StageProps> = ({
  currentBeat,
  currentCue,
  lastJudgement,
  combo,
  onLaneSwitch,
}) => {
  const [duckLane, setDuckLane] = useState<'left' | 'right'>('left');
  const [isDodging, setIsDodging] = useState(false);
  const [isHit, setIsHit] = useState(false);

  const switchLane = (lane: 'left' | 'right') => {
    setDuckLane(lane);
    setIsDodging(true);
    setTimeout(() => setIsDodging(false), 200);
    onLaneSwitch?.(lane);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        e.preventDefault();
        switchLane('left');
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault();
        switchLane('right');
      } else if (e.code === 'Space') {
        e.preventDefault();
        switchLane(duckLane === 'left' ? 'right' : 'left');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [duckLane]);

  useEffect(() => {
    if (!lastJudgement) return;
    if (lastJudgement === 'miss') {
      setIsHit(true);
      const t = setTimeout(() => setIsHit(false), 400);
      return () => clearTimeout(t);
    }
  }, [lastJudgement]);

  const isEvenBeat = currentBeat % 2 === 0;
  const obstacleLane: 'left' | 'right' = currentBeat % 4 < 2 ? 'right' : 'left';
  const hasObstacle = Boolean(currentCue);


  return (
    <div className="relative w-full max-w-xl h-64 bg-gradient-to-b from-[#38bdf8] via-[#7dd3fc] to-[#bae6fd] rounded-3xl p-3 overflow-hidden flex flex-col justify-between select-none shadow-2xl border-4 border-yellow-300">
      {/* Sky & Sun */}
      <div className="absolute top-0 inset-x-0 h-24 pointer-events-none">
        <div className="absolute top-2 right-6 w-12 h-12 rounded-full bg-yellow-300 shadow-[0_0_20px_#facc15] flex items-center justify-center text-lg">
          ☀️
        </div>
        <div className="absolute top-2 left-6 text-xl opacity-90">☁️</div>
        <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-[#0284c7] to-[#38bdf8] opacity-80" />
      </div>

      <div className="absolute top-6 left-2 text-2xl opacity-90 pointer-events-none">🌴</div>
      <div className="absolute top-8 right-2 text-2xl opacity-90 pointer-events-none">🌴</div>

      {/* 2-Lane Beach Track Floor */}
      <div className="absolute bottom-12 inset-x-0 h-28 bg-gradient-to-t from-[#eab308] via-[#fde047] to-[#fef08a] border-t-2 border-yellow-400">
        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 border-r-2 border-dashed border-yellow-600/40" />

        <div className="absolute top-0.5 left-1/4 -translate-x-1/2 text-[8px] font-mono-rhythm font-black text-yellow-800/60 uppercase">
          JALUR KIRI
        </div>
        <div className="absolute top-0.5 right-1/4 translate-x-1/2 text-[8px] font-mono-rhythm font-black text-yellow-800/60 uppercase">
          JALUR KANAN
        </div>

        {/* Dodge Line */}
        <div className="absolute bottom-2 inset-x-3 h-5 border-y border-dashed border-emerald-600 bg-emerald-400/20 flex items-center justify-center">
          <span className="text-[8px] font-mono-rhythm text-emerald-800 font-black tracking-wider uppercase">
            ⚡ GARIS HINDAR (DODGE LINE) ⚡
          </span>
        </div>

        {/* Approaching Coconut or Crab */}
        {hasObstacle && (
          <div
            className={`absolute z-20 transition-all duration-300 ${
              obstacleLane === 'left' ? 'left-[25%]' : 'left-[75%]'
            } bottom-4 -translate-x-1/2 flex flex-col items-center animate-bounce`}
          >
            <span className="text-2xl drop-shadow">{isEvenBeat ? '🥥' : '🦀'}</span>
          </div>
        )}

        {/* Duck in Lane */}
        <div
          className={`absolute bottom-2 z-30 transition-all duration-150 ${
            duckLane === 'left' ? 'left-[25%]' : 'left-[75%]'
          } -translate-x-1/2 ${
            isDodging ? 'scale-110 -translate-y-2' : isHit ? 'rotate-12 opacity-70' : isEvenBeat ? '-translate-y-1' : 'translate-y-0'
          }`}
        >
          <svg width="50" height="58" viewBox="0 0 60 70" fill="none">
            <rect x="30" y="16" width="16" height="7" rx="2" fill="#0284c7" />
            <circle cx="30" cy="22" r="14" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
            <ellipse cx="45" cy="24" rx="8" ry="4.5" fill="#f97316" />
            <ellipse cx="26" cy="40" rx="16" ry="12" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
            <circle cx="22" cy="38" r="3" fill="#f43f5e" />
            <ellipse cx="20" cy="54" rx="6" ry="3.5" fill="#f97316" />
            <ellipse cx="32" cy="54" rx="6" ry="3.5" fill="#f97316" />
          </svg>
        </div>
      </div>

      {/* Header Banner */}
      <div className="relative z-30 flex justify-between items-center bg-white/75 backdrop-blur-sm px-3 py-1 rounded-xl border border-white/60">
        <span className="text-[10px] font-mono-rhythm text-sky-950 font-black">
          🏖️ TROPICAL BEACH RUNNER
        </span>
        <span className="text-[11px] font-mono-rhythm text-amber-800 font-bold">
          {combo > 2 ? `🔥 ${combo}× DODGE COMBO` : '108 BPM'}
        </span>
      </div>

      {/* Big Lane Switching Buttons */}
      <div className="relative z-30 flex gap-2 pt-1 h-10 pointer-events-auto">
        <button
          type="button"
          tabIndex={-1}
          onFocus={(e) => e.currentTarget.blur()}
          onClick={() => switchLane('left')}
          className={`flex-1 rounded-xl font-disco font-bold text-xs uppercase shadow active:scale-95 flex items-center justify-center gap-1 ${
            duckLane === 'left' ? 'bg-amber-400 text-black border-2 border-amber-500' : 'bg-white/85 text-sky-950 border border-slate-300'
          }`}
        >
          ⬅️ JALUR KIRI (A / ←)
        </button>
        <button
          type="button"
          tabIndex={-1}
          onFocus={(e) => e.currentTarget.blur()}
          onClick={() => switchLane('right')}
          className={`flex-1 rounded-xl font-disco font-bold text-xs uppercase shadow active:scale-95 flex items-center justify-center gap-1 ${
            duckLane === 'right' ? 'bg-amber-400 text-black border-2 border-amber-500' : 'bg-white/85 text-sky-950 border border-slate-300'
          }`}
        >
          JALUR KANAN ➡️ (D / →)
        </button>
      </div>
    </div>
  );
};


