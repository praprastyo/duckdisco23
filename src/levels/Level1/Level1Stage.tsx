import React, { useState, useEffect } from 'react';
import { BeatmapEvent } from '../../game/BeatmapRunner';
import { JudgementType } from '../../config/scoring';

interface Level1StageProps {
  currentBeat: number;
  currentCue: BeatmapEvent | null;
  lastJudgement?: JudgementType | null;
  combo: number;
  onArrowInput?: (action: 'tap') => void;
}

export const Level1Stage: React.FC<Level1StageProps> = ({
  currentBeat,
  currentCue,
  lastJudgement,
  combo,
}) => {
  const [isKicking, setIsKicking] = useState(false);
  const [isStumbled, setIsStumbled] = useState(false);

  useEffect(() => {
    if (!lastJudgement) return;
    if (lastJudgement !== 'miss') {
      setIsKicking(true);
      const t = setTimeout(() => setIsKicking(false), 380);
      return () => clearTimeout(t);
    } else {
      setIsStumbled(true);
      const t = setTimeout(() => setIsStumbled(false), 450);
      return () => clearTimeout(t);
    }
  }, [lastJudgement]);

  const isEven = currentBeat % 2 === 0;
  const isBall = currentBeat % 2 === 1;
  const obstaclePos = currentCue ? 'left-[29%]' : 'left-[82%]';

  return (
    <div className="relative w-full max-w-xl h-60 bg-gradient-to-b from-[#1a052e] via-[#2d0b42] to-[#401235] border-2 border-yellow-400/40 rounded-3xl p-3 overflow-hidden flex flex-col justify-between select-none pointer-events-none shadow-[0_0_40px_rgba(234,179,8,0.25)]">
      {/* Beach Sunset Sun */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-90">
        <div className="w-16 h-16 rounded-full bg-gradient-to-t from-yellow-400 via-pink-500 to-fuchsia-600 shadow-[0_0_30px_rgba(245,158,11,0.6)] flex items-end justify-center overflow-hidden">
          <div className="w-full space-y-1 pb-1">
            <div className="w-full h-0.5 bg-[#1a052e]" />
            <div className="w-full h-1 bg-[#1a052e]" />
          </div>
        </div>
      </div>


            <div className="absolute top-2 left-3 text-xl opacity-60">🌴</div>
      <div className="absolute top-2 right-3 text-xl opacity-50">🌴</div>
      <div className="absolute bottom-12 inset-x-0 h-6 border-b-2 border-cyan-400/40 opacity-40" />
      <div className="absolute bottom-0 inset-x-0 h-14 bg-gradient-to-t from-[#c28828] via-[#eab308]/40 to-transparent border-t border-yellow-400/30" />

      {/* TARGET HIT ZONE */}
      <div className="absolute bottom-2 left-[28%] -translate-x-1/2 flex flex-col items-center z-10">
        <span className="text-[8px] font-mono-rhythm text-yellow-300 font-black tracking-widest uppercase mb-0.5 animate-pulse">
          ⚡ HIT ZONE ⚡
        </span>
        <div className="w-14 h-8 rounded-[100%] border-2 border-dashed border-yellow-400 bg-yellow-400/20 shadow-[0_0_20px_#facc15] flex items-center justify-center animate-ping" />
        <div className="absolute bottom-0 w-14 h-8 rounded-[100%] border-2 border-yellow-300 bg-yellow-400/10 flex items-center justify-center">
          <span className="text-[9px] text-yellow-200 font-bold font-disco">TAP!</span>
        </div>
      </div>

      {/* DJ Quack Walking on Beach */}
      <div
        className={`absolute bottom-2 left-6 z-20 transition-all duration-150 ease-out ${
          isKicking ? '-translate-y-5 rotate-12 scale-110' : isStumbled ? 'translate-x-2 -rotate-12 opacity-80' : isEven ? '-translate-y-2' : 'translate-y-0'
        }`}
      >
        <svg width="60" height="70" viewBox="0 0 70 80" fill="none" className="drop-shadow-[0_0_12px_rgba(234,179,8,0.5)]">
          <path d="M 18 26 C 18 12, 52 12, 52 26" stroke="#f43f5e" strokeWidth="5" strokeLinecap="round" />
          <rect x="12" y="22" width="8" height="15" rx="3" fill="#1e1b4b" stroke="#e11d48" strokeWidth="1.5" />
          <rect x="50" y="22" width="8" height="15" rx="3" fill="#1e1b4b" stroke="#e11d48" strokeWidth="1.5" />
          <circle cx="35" cy="30" r="16" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
          <rect x="36" y="26" width="16" height="7" rx="2" fill="#06b6d4" stroke="#000" strokeWidth="1" />
          <ellipse cx="52" cy="34" rx="9" ry="5" fill="#f97316" />
          <ellipse cx="30" cy="50" rx="16" ry="12" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" />
          <path d="M 22 42 C 22 38, 38 38, 38 42 L 40 58 L 20 58 Z" fill="#4c0519" />
          {isKicking ? (
            <line x1="34" y1="58" x2="55" y2="48" stroke="#f97316" strokeWidth="4" strokeLinecap="round" />
          ) : (
            <>
              <line x1="26" y1="58" x2={isEven ? 18 : 28} y2="70" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
              <line x1="34" y1="58" x2={isEven ? 42 : 28} y2="70" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
            </>
          )}
        </svg>
      </div>

      {/* Approaching Beach Obstacle */}
      <div className={`absolute bottom-3 z-20 transition-all duration-300 ease-linear ${obstaclePos}`}>
        {isBall ? (
          <div className="w-9 h-9 rounded-full border-2 border-white shadow-[0_0_15px_#ec4899] animate-spin-slow bg-gradient-to-tr from-pink-500 via-yellow-400 to-cyan-400 flex items-center justify-center text-xs">
            🏐
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-rose-300 font-bold mb-0.5 animate-bounce">⚡ CRAB!</span>
            <div className="w-10 h-8 rounded-xl bg-gradient-to-r from-rose-600 to-pink-500 border border-pink-300 shadow-[0_0_12px_#f43f5e] flex items-center justify-center text-sm">
              🦀
            </div>
          </div>
        )}
      </div>

      {/* Header HUD */}
      <div className="relative z-30 flex justify-between items-center px-1">
        <span className="text-[10px] font-mono-rhythm text-yellow-300 font-black tracking-widest">
          🏖️ NEON DISCO BEACH WALK
        </span>
        <span className="text-[11px] font-mono-rhythm text-cyan-300 font-bold">
          {combo > 2 ? `🔥 ${combo}× BEACH COMBO` : '108 BPM'}
        </span>
      </div>

      {/* Instruction Banner */}
      <div className="relative z-30 text-center text-[9px] font-mono-rhythm text-white/80 tracking-wider bg-black/50 py-1 rounded-full border border-white/10">
        TEKAN <span className="text-yellow-300 font-black">SPACEBAR / TAP</span> TEPAT SAAT OBSTACLE MASUK KE LINGKARAN TARGET!
      </div>
    </div>
  );
};

