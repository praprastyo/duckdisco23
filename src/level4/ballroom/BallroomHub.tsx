import React, { useState, useEffect } from 'react';
import { GameProgress, DuckNpcId } from '../types/level4Types';
import { DuckNpc } from './DuckNpc';
import { GiftPedestal } from './GiftPedestal';
import { NpcApproachModal } from './NpcApproachModal';
import confetti from 'canvas-confetti';

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
  const [approachedNpc, setApproachedNpc] = useState<DuckNpcId | null>(null);

  const completedCount = [
    progress.typingCompleted,
    progress.puzzleCompleted,
    progress.shooterCompleted,
  ].filter(Boolean).length;

  // Trigger celebration confetti when 3/3 cleared
  useEffect(() => {
    if (isUnlocked) {
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#facc15', '#38bdf8', '#ec4899', '#34d399'],
      });
    }
  }, [isUnlocked]);

  const handleNpcClick = (id: DuckNpcId) => {
    setApproachedNpc(id);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#070314] text-white flex flex-col justify-between p-3 sm:p-4 select-none overflow-hidden">
      {/* 1. Ceiling Mirror Ball & Ambient Disco Spotlights */}
      <div className="absolute top-0 inset-x-0 flex justify-around pointer-events-none z-10">
        <div
          className={`w-24 h-48 bg-gradient-to-b from-cyan-400/25 via-blue-500/10 to-transparent blur-xl transition-all duration-1000 ${
            completedCount >= 2 ? 'opacity-80 scale-125' : 'opacity-40'
          }`}
        />
        <div className="flex flex-col items-center">
          <div className="w-0.5 h-10 bg-slate-400" />
          <div className="w-12 h-12 rounded-full bg-slate-200 border-2 border-slate-300 shadow-[0_0_40px_rgba(255,255,255,0.9)] flex items-center justify-center text-xl animate-spin">
            🪩
          </div>
        </div>
        <div
          className={`w-24 h-48 bg-gradient-to-b from-fuchsia-400/25 via-pink-500/10 to-transparent blur-xl transition-all duration-1000 ${
            completedCount >= 2 ? 'opacity-80 scale-125' : 'opacity-40'
          }`}
        />
      </div>

      {/* Header HUD */}
      <div className="relative z-30 flex items-center justify-between w-full max-w-6xl mx-auto mb-2">
        <button
          onClick={onExit}
          className="px-3.5 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 border border-white/10 text-xs font-mono-rhythm text-white/80 transition-all cursor-pointer"
        >
          ← EXIT
        </button>

        <div className="text-center">
          <span className="text-[10px] font-mono-rhythm text-yellow-400 font-bold tracking-widest block uppercase">
            LEVEL 4 • GRAND DISCO BALLROOM
          </span>
          <span className="font-disco text-xs sm:text-sm text-white">
            {isUnlocked
              ? 'ALL RIVALS DEFEATED • THE FINAL GIFT IS READY'
              : `${3 - completedCount} CHALLENGES REMAIN • CHOOSE FREELY`}
          </span>
        </div>

        <div className="text-right text-[10px] font-mono-rhythm text-cyan-400 font-bold">
          BALLROOM LIVE
        </div>
      </div>

      {/* 2. TOP SECTION: Final Gift Pedestal ("Price reveal di atas aja") */}
      <div className="relative z-20 flex flex-col items-center my-1 sm:my-2">
        <GiftPedestal
          progress={progress}
          isUnlocked={isUnlocked}
          onOpenGift={onOpenGift}
        />
      </div>

      {/* 3. THREE DUCK RIVALS LINED UP SIDE BY SIDE (Tiga Bejejer) */}
      <div className="relative z-20 w-full max-w-5xl mx-auto grid grid-cols-3 gap-3 sm:gap-6 my-auto items-end px-2">
        {/* Duck 1 (Left): Prof. Quill */}
        <div className="flex flex-col items-center p-3 rounded-3xl bg-black/40 border border-cyan-500/25 backdrop-blur-xs">
          <DuckNpc
            id="typing"
            name="Prof. Quill"
            role="Speed Typewriter"
            dialoguePrompt="Think you can type faster than me?"
            actionText="CHALLENGE"
            isCompleted={progress.typingCompleted}
            onClick={() => handleNpcClick('typing')}
          />
        </div>

        {/* Duck 2 (Center): Dr. Bones */}
        <div className="flex flex-col items-center p-3 rounded-3xl bg-black/40 border border-amber-500/25 backdrop-blur-xs">
          <DuckNpc
            id="puzzle"
            name="Dr. Bones"
            role="Artifact Scholar"
            dialoguePrompt="I've got ten questions for you."
            actionText="CHALLENGE"
            isCompleted={progress.puzzleCompleted}
            onClick={() => handleNpcClick('puzzle')}
          />
        </div>

        {/* Duck 3 (Right): Billy The Quack */}
        <div className="flex flex-col items-center p-3 rounded-3xl bg-black/40 border border-rose-500/25 backdrop-blur-xs">
          <DuckNpc
            id="cowboy"
            name="Billy The Quack"
            role="Quickdraw Marksman"
            dialoguePrompt="Fast hands, partner?"
            actionText="CHALLENGE"
            isCompleted={progress.shooterCompleted}
            onClick={() => handleNpcClick('cowboy')}
          />
        </div>
      </div>

      {/* Bottom Footer Tip */}
      <div className="relative z-20 text-center pb-2 text-[11px] font-mono-rhythm text-white/50">
        Click any rival duck above to accept their challenge. Defeat all three to unlock the gift.
      </div>

      {/* Interactive In-World Character Conversation Modal */}
      {approachedNpc && (
        <NpcApproachModal
          npcId={approachedNpc}
          progress={progress}
          onAccept={(id) => {
            setApproachedNpc(null);
            onSelectGame(id);
          }}
          onClose={() => setApproachedNpc(null)}
        />
      )}
    </div>
  );
};
