import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ScoreSummary } from '../game/ScoringEngine';
import { getLevelConfig } from '../config/levels';
import { SaveService } from '../services/SaveService';
import { AudioEngine } from '../audio/AudioEngine';
import { PrizeReveal3D } from '../three/PrizeReveal3D';

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
  const isL4 = levelId === 'level4';
  const isGoalMet = isL4 ? (summary.score >= 70000 && summary.accuracy >= 75) : summary.cleared;

  useEffect(() => {
    SaveService.recordLevelResult(levelId as 'level1' | 'level2' | 'level3' | 'level4', {
      score: summary.score,
      accuracy: summary.accuracy,
      maxCombo: summary.maxCombo,
      cleared: isGoalMet,
    });

    if (isGoalMet) {
      AudioEngine.getInstance().playSfx('reveal');
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.55 },
        colors: ['#facc15', '#ec4899', '#06b6d4', '#e879f9'],
      });
    }
  }, [levelId, summary, isGoalMet]);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 select-none z-20">
      <div className="w-full max-w-xl bg-gradient-to-b from-[#190f33]/95 to-[#0b0517]/95 border border-fuchsia-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(236,72,153,0.3)] backdrop-blur-xl text-center">
        <span className="text-xs font-mono-rhythm text-white/50 tracking-widest uppercase block mb-1">
          MISI 0{level.levelNumber} SELESAI
        </span>
        <h2 className={`font-disco text-3xl sm:text-5xl font-black mb-1 ${isGoalMet ? 'text-yellow-300 neon-glow-gold' : 'text-rose-400'}`}>
          {isGoalMet ? (isL4 ? 'SELAMAT! HADIAHMU TERBUKA! 🎉' : 'MISI BERHASIL DISELESAIKAN! ✨') : 'IRAMA TERLEPAS... AYO COBA LAGI!'}
        </h2>
        <p className="text-xs font-mono-rhythm text-cyan-300 tracking-wider mb-6">
          {summary.grade.label}
        </p>

        {isL4 && isGoalMet && (
          <div className="mb-6">
            <PrizeReveal3D />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 bg-black/40 border border-white/10 rounded-2xl p-4 mb-6">
          <div>
            <span className="text-[10px] font-mono-rhythm uppercase text-white/40 block">TOTAL SKOR</span>
            <span className="font-mono-rhythm text-2xl sm:text-3xl font-extrabold text-white">
              {summary.score.toLocaleString()}
            </span>
            {isL4 && <span className="text-[9px] font-mono-rhythm text-yellow-400 block mt-0.5">Target: 70.000 pts</span>}
          </div>
          <div>
            <span className="text-[10px] font-mono-rhythm uppercase text-white/40 block">AKURASI</span>
            <span className="font-mono-rhythm text-2xl sm:text-3xl font-extrabold text-cyan-400">
              {summary.accuracy.toFixed(1)}%
            </span>
            {isL4 && <span className="text-[9px] font-mono-rhythm text-cyan-300 block mt-0.5">Target: 75,0%</span>}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono-rhythm mb-6 bg-white/5 p-3 rounded-xl border border-white/5">
          <div><span className="text-[10px] text-yellow-400 block font-bold">SEMPURNA</span><span className="text-white text-base font-bold">{summary.perfect}</span></div>
          <div><span className="text-[10px] text-cyan-400 block font-bold">HEBAT</span><span className="text-white text-base font-bold">{summary.great}</span></div>
          <div><span className="text-[10px] text-emerald-400 block font-bold">BAGUS</span><span className="text-white text-base font-bold">{summary.good}</span></div>
          <div><span className="text-[10px] text-rose-400 block font-bold">MELESET</span><span className="text-white text-base font-bold">{summary.miss}</span></div>
        </div>

        <div className="flex justify-between items-center px-4 py-2 bg-black/30 rounded-lg text-xs font-mono-rhythm text-white/70 mb-6">
          <span>KOMBO IRAMA MAKSIMAL</span>
          <span className="font-bold text-yellow-400 text-sm">{summary.maxCombo}×</span>
        </div>

        {isGoalMet && !isL4 && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-yellow-500/20 via-fuchsia-500/20 to-cyan-500/20 border border-yellow-400/40 mb-8 flex items-center justify-center gap-4 animate-pulse">
            <span className="text-4xl">{level.id === 'level1' ? '🌈' : level.id === 'level2' ? '💿' : '🪞'}</span>
            <div className="text-left">
              <span className="text-[9px] uppercase font-mono-rhythm tracking-widest text-yellow-400 block font-bold">PETUNJUK HADIAH TERBUKA!</span>
              <span className="font-disco text-lg text-white tracking-wide">{level.collectibleName}</span>
            </div>
          </div>
        )}

        {isL4 && !isGoalMet && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-mono-rhythm mb-6">
            ⚠️ Skor belum cukup untuk membuka telur hadiah! (Dibutuhkan minimal 70.000 poin & 75% akurasi)
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button onClick={onRetry} className="py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-disco text-sm tracking-wider uppercase transition-colors cursor-pointer">
            COBA LAGI
          </button>
          <button onClick={onContinue} className="py-3.5 rounded-xl bg-gradient-to-r from-yellow-400 to-pink-500 text-black font-disco text-sm font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(234,179,8,0.4)] cursor-pointer">
            {isL4 ? 'SELESAI →' : 'PILIH MISI LAIN →'}
          </button>
        </div>
      </div>
    </div>
  );
};

