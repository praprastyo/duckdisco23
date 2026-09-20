import React from 'react';
import { BeatmapEvent } from '../../game/BeatmapRunner';

interface QuackTargetCircleProps {
  note: BeatmapEvent;
  songTime: number;
  opacity: number;
  onPointerDown: (e: React.PointerEvent, note: BeatmapEvent) => void;
}

const DEFAULT_APPROACH_DURATION = 0.85;

export const QuackTargetCircle: React.FC<QuackTargetCircleProps> = ({
  note,
  songTime,
  opacity,
  onPointerDown,
}) => {
  const duration = note.approachDuration || DEFAULT_APPROACH_DURATION;
  const remaining = note.time - songTime;
  const progress = 1 - remaining / duration;
  const clampedProgress = Math.max(0, Math.min(1.2, progress));

  // Approach ring shrinks smoothly from 2.4 down to 1.0 at hit moment
  const approachScale = Math.max(1.0, 2.4 - clampedProgress * 1.4);
  const diameter = note.size || 82;

  // Flash brightly when entering the hit window (delta <= 110ms)
  const isHitWindow = Math.abs(remaining) <= 0.11;

  return (
    <div
      onPointerDown={(e) => onPointerDown(e, note)}
      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 transition-opacity duration-150 active:scale-90"
      style={{
        left: `${note.x}%`,
        top: `${note.y}%`,
        width: `${diameter}px`,
        height: `${diameter}px`,
        opacity,
      }}
    >
      {/* Outer Approach Ring (Vibrant neon, shrinking in sync with audio) */}
      <div
        className={`absolute inset-0 rounded-full border-[3px] pointer-events-none will-change-transform ${
          isHitWindow
            ? 'border-yellow-300 shadow-[0_0_20px_#facc15,inset_0_0_10px_#facc15]'
            : 'border-cyan-400 shadow-[0_0_16px_#06b6d4,inset_0_0_8px_#06b6d4]'
        }`}
        style={{
          transform: `scale(${approachScale})`,
          opacity: Math.min(1, clampedProgress * 1.6),
        }}
      />

      {/* Main Target Body with Vinyl Grooves & Neon Ring */}
      <div
        className={`absolute inset-0 rounded-full border-4 transition-all duration-75 flex items-center justify-center overflow-hidden ${
          isHitWindow
            ? 'border-yellow-300 bg-gradient-to-br from-amber-900 via-indigo-950 to-slate-900 shadow-[0_0_35px_rgba(250,204,21,0.9)] scale-105'
            : 'border-yellow-400 bg-gradient-to-br from-[#1e1b4b] to-[#0f172a] shadow-[0_0_22px_rgba(250,204,21,0.6)]'
        }`}
      >
        {/* Outer subtle halo ring */}
        <div className="absolute inset-0 rounded-full bg-cyan-400/10 pointer-events-none" />

        {/* Concentric Vinyl Grooves */}
        <div className="absolute inset-1.5 rounded-full border border-white/15" />
        <div className="absolute inset-3 rounded-full border border-white/10" />
        <div className="absolute inset-4.5 rounded-full border border-white/10" />

        {/* Center Sequence Number with Golden Glow */}
        <div className="relative z-10 font-disco text-2xl sm:text-3xl font-black text-yellow-300 drop-shadow-[0_0_10px_#facc15] select-none pointer-events-none">
          {note.seq || note.promptText || '●'}
        </div>

        {/* Bottom POP tag */}
        <div className="absolute bottom-1 text-[8px] font-disco font-black text-cyan-300/90 tracking-widest select-none pointer-events-none">
          POP
        </div>
      </div>
    </div>
  );
};