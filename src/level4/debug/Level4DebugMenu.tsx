import React, { useState } from 'react';
import { DevModeService } from '../../services/DevModeService';
import { GameProgress, Level4Scene } from '../types/level4Types';

interface Level4DebugMenuProps {
  progress: GameProgress;
  isGiftUnlocked: boolean;
  currentScene: Level4Scene;
  onSetProgress: (progress: Partial<GameProgress>) => void;
  onNavigateScene: (scene: Level4Scene) => void;
  onReset: () => void;
}

export const Level4DebugMenu: React.FC<Level4DebugMenuProps> = ({
  progress,
  isGiftUnlocked,
  currentScene,
  onSetProgress,
  onNavigateScene,
  onReset,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const isDev = DevModeService.isEnabled();

  if (!isDev) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 select-none">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="px-3 py-1.5 rounded-xl bg-yellow-500 text-black font-mono-rhythm text-xs font-bold shadow-lg hover:scale-105 cursor-pointer"
        >
          🛠️ DEV MENU
        </button>
      ) : (
        <div className="bg-slate-900/95 border-2 border-yellow-400 p-4 rounded-2xl shadow-2xl text-white font-mono-rhythm text-xs w-64 flex flex-col gap-2 backdrop-blur-md">
          <div className="flex justify-between items-center pb-2 border-b border-white/10">
            <span className="font-bold text-yellow-400">LEVEL 4 DEV CONTROLS</span>
            <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white cursor-pointer">
              ✕
            </button>
          </div>

          <div className="text-[10px] text-white/50">
            SCENE: <span className="text-cyan-400">{currentScene}</span> | UNLOCKED:{' '}
            <span className={isGiftUnlocked ? 'text-emerald-400' : 'text-rose-400'}>
              {isGiftUnlocked ? 'YES' : 'NO'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <button
              onClick={() => onSetProgress({ typingCompleted: !progress.typingCompleted })}
              className={`p-1.5 rounded text-[10px] font-bold border cursor-pointer ${
                progress.typingCompleted ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' : 'bg-white/5 border-white/10 text-white/70'
              }`}
            >
              {progress.typingCompleted ? '✓ TYPING' : 'FAIL TYPING'}
            </button>

            <button
              onClick={() => onSetProgress({ puzzleCompleted: !progress.puzzleCompleted })}
              className={`p-1.5 rounded text-[10px] font-bold border cursor-pointer ${
                progress.puzzleCompleted ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' : 'bg-white/5 border-white/10 text-white/70'
              }`}
            >
              {progress.puzzleCompleted ? '✓ PUZZLE' : 'FAIL PUZZLE'}
            </button>

            <button
              onClick={() => onSetProgress({ shooterCompleted: !progress.shooterCompleted })}
              className={`p-1.5 rounded text-[10px] font-bold border cursor-pointer ${
                progress.shooterCompleted ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' : 'bg-white/5 border-white/10 text-white/70'
              }`}
            >
              {progress.shooterCompleted ? '✓ SHOOTER' : 'FAIL SHOOTER'}
            </button>

            <button
              onClick={() => onSetProgress({ typingCompleted: true, puzzleCompleted: true, shooterCompleted: true })}
              className="p-1.5 rounded bg-yellow-400/20 border border-yellow-400 text-yellow-300 text-[10px] font-bold cursor-pointer"
            >
              UNLOCK ALL 3
            </button>
          </div>

          <div className="pt-2 border-t border-white/10 flex flex-col gap-1">
            <span className="text-[9px] text-white/40 uppercase">WARP TO SCENE</span>
            <div className="grid grid-cols-2 gap-1">
              {(['ballroom', 'typing', 'puzzle', 'shooter', 'giftReveal', 'letter'] as Level4Scene[]).map((s) => (
                <button
                  key={s}
                  onClick={() => onNavigateScene(s)}
                  className="p-1 rounded bg-white/5 hover:bg-white/15 text-[10px] uppercase cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onReset}
            className="mt-1 p-1.5 rounded bg-rose-600/30 border border-rose-500 text-rose-300 text-[10px] font-bold hover:bg-rose-600/50 cursor-pointer"
          >
            RESET LEVEL 4 STATE
          </button>
        </div>
      )}
    </div>
  );
};
