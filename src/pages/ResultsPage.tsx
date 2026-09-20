import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ScoreSummary } from '../game/ScoringEngine';
import { getLevelConfig } from '../config/levels';
import { SaveService } from '../services/SaveService';
import { AudioEngine } from '../audio/AudioEngine';

interface ResultsPageProps {
  levelId: string;
  summary: ScoreSummary;
  onRetry: () => void;
  onContinue: () => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  levelId,
  summary,
  onRetry,
  onContinue,
}) => {
  const level = getLevelConfig(levelId)!;

  useEffect(() => {
    // Record to persistent storage
    SaveService.recordLevelResult(levelId as 'level1' | 'level2' | 'level3' | 'level4', {
      score: summary.score,
      accuracy: summary.accuracy,
      maxCombo: summary.maxCombo,
      cleared: summary.cleared,
    });

    if (summary.cleared) {
      AudioEngine.getInstance().playSfx('reveal');
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#facc15', '#ec4899', '#06b6d4', '#e879f9'],
      });
    }
  }, [levelId, summary]);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 select-none z-10">
      <div className="w-full max-w-xl bg-gradient-to-b from-[#190f33]/95 to-[#0b0517]/95 border border-fuchsia-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(236,72,153,0.3)] backdrop-blur-xl text-center">
        {/* Clearance Banner */}
        <span className="text-xs font-mono-rhythm text-white/50 tracking-widest uppercase block mb-1">
          NIGHT 0{level.levelNumber} COMPLETE
        </span>
        <h2
          className={`font-disco text-4xl sm:text-5xl font-black mb-1 ${
            summary.cleared ? 'text-yellow-300 neon-glow-gold' : 'text-rose-400'
          }`}
        >
          {summary.cleared ? 'LEVEL CLEARED!' : 'OFF-BEAT QUACK...'}
        </h2>
        <p className="text-xs font-mono-rhythm text-cyan-300 tracking-wider mb-6">
          {summary.grade.label}
        </p>

        {/* Big Score and Accuracy */}
        <div className="grid grid-cols-2 gap-4 bg-black/40 border border-white/10 rounded-2xl p-4 mb-6">
          <div>
            <span className="text-[10px] font-mono-rhythm uppercase text-white/40 block">TOTAL SCORE</span>
            <span className="font-mono-rhythm text-2xl sm:text-3xl font-extrabold text-white">
              {summary.score.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-mono-rhythm uppercase text-white/40 block">ACCURACY</span>
            <span className="font-mono-rhythm text-2xl sm:text-3xl font-extrabold text-cyan-400">
              {summary.accuracy.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Breakdown details */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono-rhythm mb-6 bg-white/5 p-3 rounded-xl border border-white/5">
          <div>
            <span className="text-[10px] text-yellow-400 block font-bold">PERFECT</span>
            <span className="text-white text-base font-bold">{summary.perfect}</span>
          </div>
          <div>
            <span className="text-[10px] text-cyan-400 block font-bold">GREAT</span>
            <span className="text-white text-base font-bold">{summary.great}</span>
          </div>
          <div>
            <span className="text-[10px] text-emerald-400 block font-bold">GOOD</span>
            <span className="text-white text-base font-bold">{summary.good}</span>
          </div>
          <div>
            <span className="text-[10px] text-rose-400 block font-bold">MISS</span>
            <span className="text-white text-base font-bold">{summary.miss}</span>
          </div>
        </div>

        {/* Max Combo */}
        <div className="flex justify-between items-center px-4 py-2 bg-black/30 rounded-lg text-xs font-mono-rhythm text-white/70 mb-6">
          <span>MAX GROOVE COMBO</span>
          <span className="font-bold text-yellow-400 text-sm">{summary.maxCombo}×</span>
        </div>

        {/* Collectible Earned Banner */}
        {summary.cleared && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-yellow-500/20 via-fuchsia-500/20 to-cyan-500/20 border border-yellow-400/40 mb-8 flex items-center justify-center gap-4 animate-pulse">
            <span className="text-4xl">
              {level.id === 'level1' ? '🪶' : level.id === 'level2' ? '💿' : level.id === 'level3' ? '🪞' : '🦆'}
            </span>
            <div className="text-left">
              <span className="text-[9px] uppercase font-mono-rhythm tracking-widest text-yellow-400 block font-bold">
                ARTIFACT UNLOCKED!
              </span>
              <span className="font-disco text-lg text-white tracking-wide">
                {level.collectibleName}
              </span>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={onRetry}
            className="py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-disco text-sm tracking-wider uppercase transition-colors"
          >
            PLAY AGAIN
          </button>
          <button
            onClick={onContinue}
            className="py-3.5 rounded-xl bg-gradient-to-r from-yellow-400 to-pink-500 text-black font-disco text-sm font-bold tracking-wider uppercase hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(234,179,8,0.4)]"
          >
            LEVEL SELECT →
          </button>
        </div>
      </div>
    </div>
  );
};
