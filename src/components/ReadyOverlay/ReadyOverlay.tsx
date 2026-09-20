import React from 'react';
import { LevelConfig } from '../../config/levels';
import { GameStatus } from '../../game/RhythmEngine';

interface ReadyOverlayProps {
  status: GameStatus;
  level: LevelConfig;
}

export const ReadyOverlay: React.FC<ReadyOverlayProps> = ({ status, level }) => {
  if (status === 'loading') {
    return (
      <div className="absolute inset-0 z-40 bg-black/90 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-full border-4 border-fuchsia-500 border-t-transparent animate-spin mb-4" />
        <h3 className="font-disco text-xl text-yellow-300 mb-1">WARMING UP THE QUACK...</h3>
        <span className="text-xs font-mono-rhythm text-white/50 tracking-widest uppercase">DECODING AUDIO</span>
      </div>
    );
  }

  if (status === 'readyToStart') {
    return (
      <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center cursor-pointer">
        <span className="text-xs font-mono-rhythm text-fuchsia-400 font-bold uppercase mb-1">
          NIGHT 0{level.levelNumber} • {level.dateDisplay}
        </span>
        <h2 className="font-disco text-4xl sm:text-6xl text-white neon-glow-magenta mb-4">{level.title}</h2>
        <div className="max-w-sm bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 text-left space-y-1 text-xs font-mono-rhythm text-white/80">
          {level.instructions.map((inst, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">0{i + 1}.</span>
              <span>{inst}</span>
            </div>
          ))}
        </div>
        <div className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-yellow-400 to-pink-500 text-black font-disco text-base font-bold shadow-[0_0_30px_rgba(234,179,8,0.5)] animate-pulse">
          LISTEN TO THE BEAT • TAP TO START
        </div>
      </div>
    );
  }

  return null;
};
