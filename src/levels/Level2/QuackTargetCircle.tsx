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

  // Approach ring shrinks smoothly from ~2.2 down to 1.0 at note.time
  const approachScale = Math.max(1.0, 2.2 - clampedProgress * 1.2);
  const diameter = note.size || 82;

  return (
    <div
      onPointerDown={(e) => onPointerDown(e, note)}
      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 transition-opacity duration-150 active:scale-95"
      style={{
        left: `${note.x}%`,
        top: `${note.y}%`,
        width: `${diameter}px`,
        height: `${diameter}px`,
        opacity,
      }}
    >
      {/* Outer Approach Ring (Shrinks strictly with audio playback time) */}
      <div
        className="absolute inset-0 rounded-full border-2 border-cyan-400 pointer-events-none will-change-transform"
        style={{
          transform: `scale(${approachScale})`,
          boxShadow: '0 0 14px #06b6d4, inset 0 0 8px #06b6d4',
          opacity: Math.min(1, clampedProgress * 1.4),
        }}
      />

      {/* Main Circular Target */}
      <div className="absolute inset-0 rounded-full border-4 border-yellow-400 bg-gradient-to-br from-[#1e1b4b] to-[#0f172a] shadow-[0_0_24px_rgba(250,204,21,0.7)] flex items-center justify-center overflow-hidden">
        {/* Concentric Vinyl Grooves */}
        <div className="absolute inset-1 rounded-full border border-white/10" />
        <div className="absolute inset-2.5 rounded-full border border-white/10" />

        {/* Center Sequence Number */}
        <div className="relative z-10 font-disco text-xl sm:text-2xl font-black text-yellow-300 drop-shadow-[0_0_8px_#facc15]">
          {note.seq || note.promptText || '●'}
        </div>

        {/* Sub-label duck footprint detail */}
        <div className="absolute bottom-1 text-[8px] text-cyan-300/80 font-mono-rhythm select-none pointer-events-none">
          POP
        </div>
      </div>
    </div>
  );
};
