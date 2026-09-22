import React, { useState } from 'react';
import { GameProgress, DuckNpcId } from '../types/level4Types';
import { DuckNpc } from './DuckNpc';
import { GiftPedestal } from './GiftPedestal';

interface BallroomHubProps {
  progress: GameProgress;
  isUnlocked: boolean;
  onSelectGame: (game: DuckNpcId) => void;
  onOpenGift: () => void;
  onExit: () => void;
}

export const BallroomHub: React.FC<BallroomHubProps> = ({
  progress,
  isUnlocked,
  onSelectGame,
  onOpenGift,
  onExit,
}) => {
  const [npcDialogue, setNpcDialogue] = useState<string | null>(null);

  const handleNpcClick = (id: DuckNpcId) => {
    if (id === 'typing' && progress.typingCompleted) {
      setNpcDialogue('Typing Duck: "Fine. You type faster. This time." 🕶️');
      return;
    }
    if (id === 'puzzle' && progress.puzzleCompleted) {
      setNpcDialogue('Puzzle Duck: "The ancient clues approve." 📜');
      return;
    }
    if (id === 'cowboy' && progress.shooterCompleted) {
      setNpcDialogue('Cowboy Duck: "Fast hands, partner." 🤠');
      return;
    }
    onSelectGame(id);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#09041a] text-white flex flex-col justify-between p-4 select-none overflow-hidden">
      {/* Ceiling Disco Ball */}
      <div className="absolute top-0 inset-x-0 flex justify-around pointer-events-none z-10">
        <div className="w-16 h-28 bg-gradient-to-b from-amber-400/20 to-transparent blur-md" />
        <div className="flex flex-col items-center">
          <div className="w-0.5 h-10 bg-slate-500" />
          <div className="w-12 h-12 rounded-full bg-slate-200 border-2 border-slate-400 shadow-[0_0_30px_rgba(255,255,255,0.8)] flex items-center justify-center text-xl animate-spin">
            🪩
          </div>
        </div>
        <div className="w-16 h-28 bg-gradient-to-b from-fuchsia-400/20 to-transparent blur-md" />
      </div>

      {/* Header HUD */}
      <div className="relative z-20 flex items-center justify-between w-full max-w-6xl mx-auto">
        <button
          onClick={onExit}
          className="px-3.5 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 border border-white/10 text-xs font-mono-rhythm text-white/80 transition-all cursor-pointer"
        >
          ← EXIT
        </button>

        <div className="text-center">
          <span className="text-[10px] font-mono-rhythm text-yellow-400 font-bold tracking-widest block uppercase">
            LEVEL 4 • BALLROOM HUB
          </span>
          <span className="font-disco text-sm sm:text-base text-white">
            {isUnlocked ? '🎉 ALL RIVALS DEFEATED! UNLOCK THE GIFT!' : 'DEFEAT 3 DUCK RIVALS IN ANY ORDER'}
          </span>
        </div>

        <div className="text-right text-[10px] font-mono-rhythm text-white/60">
          ORDER: <span className="text-cyan-400 font-bold">FREE CHOICE</span>
        </div>
      </div>

      {/* NPC Dialogue Toast */}
      {npcDialogue && (
        <div
          onClick={() => setNpcDialogue(null)}
          className="relative z-30 self-center max-w-md my-2 px-4 py-2 rounded-xl bg-black/80 border border-yellow-400/60 shadow-lg text-xs font-mono-rhythm text-yellow-300 flex items-center justify-between gap-3 cursor-pointer animate-fadeIn"
        >
          <span>{npcDialogue}</span>
          <span className="text-white/40 text-[10px]">✕</span>
        </div>
      )}

      {/* Main Playfield */}
      <div className="relative z-15 flex-1 flex flex-col items-center justify-center w-full max-w-6xl mx-auto my-2">
        {/* Floor Grid */}
        <div className="absolute inset-0 max-h-[480px] my-auto rounded-3xl bg-gradient-to-b from-[#140b2e] to-[#0b0518] border-2 border-yellow-500/20 overflow-hidden shadow-2xl flex flex-col justify-end">
          <div className="h-44 w-full grid grid-cols-8 grid-rows-3 gap-1 p-2 opacity-60">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className={`rounded-sm ${
                  i % 3 === 0 ? 'bg-fuchsia-600/30' : i % 3 === 1 ? 'bg-cyan-500/30' : 'bg-amber-400/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 3 NPC Stations & Central Pedestal */}
        <div className="relative z-20 w-full flex flex-col md:flex-row items-center justify-around gap-6 py-6">
          <div className="order-2 md:order-1 flex flex-col items-center">
            <DuckNpc
              id="typing"
              name="Prof. Quill"
              role="Speed Typewriter"
              actionText="START TYPING BATTLE"
              isCompleted={progress.typingCompleted}
              onClick={() => handleNpcClick('typing')}
            />
          </div>

          <div className="order-1 md:order-2 my-2 md:my-0">
            <GiftPedestal
              progress={progress}
              isUnlocked={isUnlocked}
              onOpenGift={onOpenGift}
            />
          </div>

          <div className="order-3 flex items-center gap-8 sm:gap-12">
            <DuckNpc
              id="puzzle"
              name="Dr. Bones"
              role="Artifact Scholar"
              actionText="SOLVE THE MYSTERY"
              isCompleted={progress.puzzleCompleted}
              onClick={() => handleNpcClick('puzzle')}
            />

            <DuckNpc
              id="cowboy"
              name="Billy The Quack"
              role="Quickdraw Marksman"
              actionText="FACE THE SHOOTOUT"
              isCompleted={progress.shooterCompleted}
              onClick={() => handleNpcClick('cowboy')}
            />
          </div>
        </div>
      </div>

      <div className="relative z-20 text-center pb-2 text-[11px] font-mono-rhythm text-white/50">
        Click any duck rival above to begin their challenge. Defeat all three to claim your special birthday gift.
      </div>
    </div>
  );
};
