import React, { useRef } from 'react';
import { RhythmEngine } from '../../game/RhythmEngine';
import { BeatmapEvent } from '../../game/BeatmapRunner';
import { QuackTargetCircle } from './QuackTargetCircle';
import { Level2Effects } from './Level2Effects';
import { useLevel2Game } from './useLevel2Game';

interface Level2StageProps {
  engine?: RhythmEngine | null;
  events?: BeatmapEvent[];
  currentBeat: number;
  combo: number;
  score?: number;
  accuracy?: number;
  missCount?: number;
  maxMisses?: number;
  isPlaying?: boolean;
  isComplete?: boolean;
  onTargetClick?: (noteId: string) => void;
}

export const Level2Stage: React.FC<Level2StageProps> = ({
  engine,
  events = [],
  currentBeat,
  combo,
  score = 0,
  accuracy = 100,
  missCount = 0,
  maxMisses = 15,
  isComplete = false,
  onTargetClick,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { songTime, particles, popups, sortedUpcoming, handlePointerDown } = useLevel2Game(
    engine,
    events,
    onTargetClick
  );

  const isFever = combo >= 100;
  const isNeon = combo >= 50;

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-5xl h-[480px] sm:h-[580px] bg-[#070312] border-2 rounded-3xl overflow-hidden select-none touch-none shadow-2xl transition-all duration-500 ${
        isFever
          ? 'border-yellow-400 shadow-[0_0_80px_rgba(250,204,21,0.6)]'
          : isNeon
          ? 'border-fuchsia-500 shadow-[0_0_50px_rgba(236,72,153,0.5)]'
          : 'border-cyan-500/50 shadow-[0_0_35px_rgba(6,182,212,0.3)]'
      }`}
    >
      {/* 2D Retro Disco Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:28px_28px]" />

      {/* Top Playfield HUD */}
      <div className="absolute top-4 inset-x-6 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/60 font-disco text-xs text-cyan-300 tracking-wider">
            🎯 QUACK BEAT POP • 146 BPM
          </span>
          {isFever && (
            <span className="px-3 py-1 rounded-full bg-yellow-500 text-black font-disco font-black text-xs tracking-widest animate-bounce">
              ⚡ QUACK FEVER ⚡
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs font-mono-rhythm">
          <span className="text-white/60">
            SCORE: <strong className="text-yellow-300 font-bold">{score.toLocaleString()}</strong>
          </span>
          <span className="text-white/60">
            ACCURACY: <strong className="text-cyan-300 font-bold">{accuracy.toFixed(1)}%</strong>
          </span>
          <span className="text-fuchsia-300 font-bold">
            COMBO: <strong className="text-fuchsia-400 text-sm font-black">{combo}×</strong>
          </span>
          <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-black/60 border border-white/15">
            <span className="text-white/50 text-[10px]">MISS:</span>
            <span
              className={`font-black text-xs ${
                missCount >= maxMisses - 3
                  ? 'text-rose-400 animate-pulse'
                  : missCount >= 8
                  ? 'text-amber-300'
                  : 'text-emerald-400'
              }`}
            >
              {missCount}/{maxMisses}
            </span>
          </div>
        </div>
      </div>

      {/* Safe Play Area (X: 8-92%, Y: 12-88%) */}
      <div className="absolute inset-x-[8%] inset-y-[12%] border border-white/5 rounded-2xl pointer-events-none" />

      {/* Visual Effects, Particles, Mascot, Reward */}
      <Level2Effects
        particles={particles}
        popups={popups}
        isComplete={isComplete}
        accuracy={accuracy}
        isBeatOdd={currentBeat % 2 === 1}
      />

      {/* Interactive Targets */}
      {sortedUpcoming.map((note, idx) => (
        <QuackTargetCircle
          key={note.id}
          note={note}
          songTime={songTime}
          opacity={idx === 0 ? 1.0 : idx === 1 ? 0.75 : 0.55}
          onPointerDown={handlePointerDown}
        />
      ))}

      {/* Footer hint */}
      <div className="absolute bottom-3 inset-x-0 text-center pointer-events-none">
        <span className="text-[10px] font-mono-rhythm text-white/50 tracking-widest uppercase bg-black/60 px-4 py-1.5 rounded-full border border-white/10">
          CLICK OR TAP THE CIRCLES AS THE OUTER RING CLOSES IN
        </span>
      </div>
    </div>
  );
};

