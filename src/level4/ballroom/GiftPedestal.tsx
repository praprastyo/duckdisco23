import React from 'react';
import { GameProgress } from '../types/level4Types';

interface GiftPedestalProps {
  progress: GameProgress;
  isUnlocked: boolean;
  onOpenGift: () => void;
}

export const GiftPedestal: React.FC<GiftPedestalProps> = ({
  progress,
  isUnlocked,
  onOpenGift,
}) => {
  const completedCount = [
    progress.typingCompleted,
    progress.puzzleCompleted,
    progress.shooterCompleted,
  ].filter(Boolean).length;

  const glowClass = isUnlocked
    ? 'ring-4 ring-yellow-400 shadow-[0_0_80px_rgba(250,204,21,0.9)] animate-pulse'
    : completedCount === 2
    ? 'shadow-[0_0_50px_rgba(236,72,153,0.7)]'
    : completedCount === 1
    ? 'shadow-[0_0_30px_rgba(6,182,212,0.5)]'
    : 'shadow-[0_0_15px_rgba(255,255,255,0.2)]';

  return (
    <div className="relative flex flex-col items-center">
      {/* 3 Progress Indicators Strip */}
      <div className="mb-4 flex items-center gap-2 sm:gap-3 bg-black/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 shadow-xl">
        <StatusBadge label="TYPEWRITER" cleared={progress.typingCompleted} icon="⌨️" />
        <span className="text-white/20 font-bold">•</span>
        <StatusBadge label="ARTIFACT" cleared={progress.puzzleCompleted} icon="📜" />
        <span className="text-white/20 font-bold">•</span>
        <StatusBadge label="CROSSHAIR" cleared={progress.shooterCompleted} icon="🎯" />
      </div>

      {/* Central Pedestal & Gift Box */}
      <div
        onClick={() => {
          if (isUnlocked) onOpenGift();
        }}
        className={`group relative flex flex-col items-center transition-all duration-500 ${
          isUnlocked ? 'cursor-pointer hover:scale-105 active:scale-95' : 'cursor-not-allowed opacity-90'
        }`}
      >
        {/* Floating Gift Box Visual */}
        <div className={`relative w-32 h-32 sm:w-36 sm:h-36 rounded-2xl flex items-center justify-center bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-600 transition-all duration-300 ${glowClass}`}>
          {/* Ribbon Decor */}
          <div className="absolute inset-y-0 w-6 bg-rose-500 shadow-md flex items-center justify-center">
            <div className="w-1 h-full bg-rose-300/40" />
          </div>
          <div className="absolute inset-x-0 h-6 bg-rose-500 shadow-md flex items-center justify-center">
            <div className="h-1 w-full bg-rose-300/40" />
          </div>
          <div className="absolute -top-3 w-10 h-6 rounded-full border-2 border-rose-400 bg-rose-500 shadow-lg" />

          {/* Central Emblem */}
          <div className="relative z-10 text-4xl drop-shadow-md">
            {isUnlocked ? '✨' : '🎁'}
          </div>
        </div>

        {/* Stone Pedestal Base */}
        <div className="w-44 h-8 mt-1 rounded-t-lg bg-gradient-to-b from-slate-700 to-slate-900 border-t-2 border-amber-400/40 flex items-center justify-center shadow-2xl">
          <div className="text-[9px] font-mono-rhythm text-amber-300 tracking-widest uppercase">
            {completedCount} / 3 SEALS BROKEN
          </div>
        </div>
      </div>

      {/* Call to Action Button */}
      <div className="mt-4 flex flex-col items-center gap-1.5">
        {isUnlocked ? (
          <>
            <span className="text-[10px] font-mono-rhythm text-yellow-300 font-bold uppercase tracking-widest animate-pulse">
              THE GIFT IS READY.
            </span>
            <button
              onClick={onOpenGift}
              className="px-7 py-3 rounded-full bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-black font-disco text-xs sm:text-sm font-bold tracking-widest uppercase shadow-[0_0_35px_rgba(250,204,21,0.9)] animate-bounce cursor-pointer hover:brightness-110 active:scale-95"
            >
              ✨ OPEN IT ✨
            </button>
          </>
        ) : (
          <span className="text-[11px] font-mono-rhythm text-white/50 uppercase tracking-widest">
            {3 - completedCount} SEALS REMAIN • DEFEAT RIVALS TO UNLOCK
          </span>
        )}
      </div>
    </div>
  );
};

const StatusBadge: React.FC<{ label: string; cleared: boolean; icon: string }> = ({
  label,
  cleared,
  icon,
}) => (
  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono-rhythm font-bold tracking-wider transition-all ${
    cleared
      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 shadow-[0_0_10px_rgba(52,211,153,0.3)]'
      : 'bg-white/5 text-white/40 border border-white/10'
  }`}>
    <span>{icon}</span>
    <span>{label}</span>
    <span>{cleared ? '✓' : '🔒'}</span>
  </div>
);
