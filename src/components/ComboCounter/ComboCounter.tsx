import React from 'react';

interface ComboCounterProps {
  combo: number;
  maxCombo: number;
}

export const ComboCounter: React.FC<ComboCounterProps> = ({ combo, maxCombo }) => {
  if (combo < 2) {
    return (
      <div className="flex flex-col items-center opacity-30 select-none">
        <span className="text-xs uppercase font-mono-rhythm tracking-widest text-slate-400">Combo</span>
        <span className="text-2xl font-mono-rhythm font-bold text-slate-500">0</span>
      </div>
    );
  }

  const isFever = combo >= 10;

  return (
    <div className="flex flex-col items-center select-none animate-pulse">
      <span className="text-[10px] uppercase font-mono-rhythm tracking-widest text-fuchsia-300 font-bold">
        {isFever ? '🔥 GROOVE COMBO' : 'COMBO'}
      </span>
      <div className="flex items-baseline gap-1">
        <span
          className={`font-disco text-4xl sm:text-5xl font-black ${
            isFever ? 'text-yellow-400 neon-glow-gold' : 'text-fuchsia-400 neon-glow-magenta'
          }`}
        >
          {combo}
        </span>
        <span className="text-xs font-mono-rhythm text-white/50">MAX {maxCombo}</span>
      </div>
    </div>
  );
};
