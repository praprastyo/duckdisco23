import React from 'react';

interface ScoreDisplayProps {
  score: number;
  accuracy: number;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, accuracy }) => {
  return (
    <div className="flex items-center gap-6 select-none bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
      <div className="flex flex-col items-start">
        <span className="text-[9px] uppercase font-mono-rhythm tracking-widest text-white/50">Score</span>
        <span className="font-mono-rhythm text-lg sm:text-xl font-bold text-white tracking-wider">
          {score.toLocaleString()}
        </span>
      </div>

      <div className="w-[1px] h-6 bg-white/10" />

      <div className="flex flex-col items-start">
        <span className="text-[9px] uppercase font-mono-rhythm tracking-widest text-white/50">Accuracy</span>
        <span className="font-mono-rhythm text-lg sm:text-xl font-bold text-cyan-400">
          {accuracy.toFixed(1)}%
        </span>
      </div>
    </div>
  );
};
