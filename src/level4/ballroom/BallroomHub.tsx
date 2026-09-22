import React, { useState, useEffect } from 'react';
import { GameProgress, DuckNpcId, BallroomIntroStage } from '../types/level4Types';
import { DuckNpc } from './DuckNpc';
import { GiftPedestal } from './GiftPedestal';
import { NpcApproachModal } from './NpcApproachModal';
import { AudioManager } from '../audio/AudioManager';
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
  const [introStage, setIntroStage] = useState<BallroomIntroStage>('doors_open');
  const [approachedNpc, setApproachedNpc] = useState<DuckNpcId | null>(null);
  const [npcDialogue, setNpcDialogue] = useState<string | null>(null);
  const audio = AudioManager.getInstance();

  const completedCount = [
    progress.typingCompleted,
    progress.puzzleCompleted,
    progress.shooterCompleted,
  ].filter(Boolean).length;

  // 6–10s Automated Opening Cutscene Timeline
  useEffect(() => {
    const t1 = setTimeout(() => setIntroStage('wide_disco_gift'), 1200);
    const t2 = setTimeout(() => setIntroStage('pan_typing_duck'), 3000);
    const t3 = setTimeout(() => setIntroStage('pan_puzzle_duck'), 5200);
    const t4 = setTimeout(() => {
      setIntroStage('pan_cowboy_duck');
      audio.playShooterPop('bottle');
    }, 7400);
    const t5 = setTimeout(() => setIntroStage('player_control_ready'), 9600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [audio]);

  const handleSkipIntro = () => {
    setIntroStage('player_control_ready');
  };

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
    if (introStage !== 'player_control_ready') return;
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
          <div className="w-0.5 h-12 bg-slate-400" />
          <div className="w-14 h-14 rounded-full bg-slate-200 border-2 border-slate-300 shadow-[0_0_40px_rgba(255,255,255,0.9)] flex items-center justify-center text-2xl animate-spin">
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
      <div className="relative z-30 flex items-center justify-between w-full max-w-6xl mx-auto">
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
          <span className="font-disco text-sm sm:text-base text-white">
            {isUnlocked
              ? 'ALL RIVALS DEFEATED • THE FINAL GIFT IS READY'
              : `${3 - completedCount} CHALLENGES REMAIN • CHOOSE FREELY`}
          </span>
        </div>

        <div className="text-right text-[10px] font-mono-rhythm text-cyan-400 font-bold">
          BALLROOM LIVE
        </div>
      </div>

      {/* Opening Cutscene Banner (during 6-10s intro) */}
      {introStage !== 'player_control_ready' && (
        <div className="relative z-30 self-center my-1 px-6 py-2.5 rounded-2xl bg-black/90 border border-yellow-400 shadow-2xl text-xs font-mono-rhythm text-yellow-300 font-bold flex items-center justify-between gap-4 max-w-xl animate-fadeIn">
          {introStage === 'doors_open' && <span>ENTERING THE GRAND DISCO BALLROOM...</span>}
          {introStage === 'wide_disco_gift' && <span>3 CHALLENGES • 3 LOCKS • 1 FINAL GIFT</span>}
          {introStage === 'pan_typing_duck' && (
            <span>Prof. Quill: "Oh... another typist? Think you can finish before I do?"</span>
          )}
          {introStage === 'pan_puzzle_duck' && (
            <span>Dr. Bones: "I've been looking for someone who knows the answers to a few mysteries..."</span>
          )}
          {introStage === 'pan_cowboy_duck' && (
            <span>Billy the Quack: "Well, well... Think you're quicker than me? Come find out."</span>
          )}
          <button
            onClick={handleSkipIntro}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] text-white/80 cursor-pointer uppercase"
          >
            SKIP
          </button>
        </div>
      )}

      {/* NPC Dialogue Toast */}
      {npcDialogue && (
        <div
          onClick={() => setNpcDialogue(null)}
          className="relative z-30 self-center max-w-md my-1 px-4 py-2 rounded-xl bg-black/85 border border-yellow-400/60 shadow-lg text-xs font-mono-rhythm text-yellow-300 flex items-center justify-between gap-3 cursor-pointer animate-fadeIn"
        >
          <span>{npcDialogue}</span>
          <span className="text-white/40 text-[10px]">✕</span>
        </div>
      )}

      {/* 2. SPATIAL BALLROOM LIVING LAYOUT */}
      <div className="relative z-15 flex-1 flex flex-col justify-between w-full max-w-6xl mx-auto my-1">
        {/* TOP: MAIN STAGE & DANCING SILHOUETTES */}
        <div className="relative w-full flex justify-between items-center px-4 py-1 pointer-events-none">
          <div className="flex items-center gap-2 text-xs font-mono-rhythm text-amber-300/60 uppercase">
            <span>✨ MAIN DISCO STAGE</span>
          </div>

          {/* Dancing background crowd silhouettes */}
          <div className="flex items-center gap-3 text-2xl opacity-40 animate-pulse">
            <span className="animate-bounce">🕺</span>
            <span>💃</span>
            <span className="animate-bounce delay-300">🦆</span>
            <span>🕺</span>
            <span className="animate-bounce delay-700">💃</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono-rhythm text-fuchsia-300/60 uppercase">
            <span>VIP BAR ZONE 🍸</span>
          </div>
        </div>

        {/* MIDDLE SECTION: TYPING AREA (Left), DANCE FLOOR & GIFT (Center), PUZZLE BAR (Right) */}
        <div className="relative w-full grid grid-cols-1 md:grid-cols-3 items-center gap-4 py-2">
          {/* ZONE 1: TYPING AREA (Left) */}
          <div className="flex flex-col items-center justify-center p-3 rounded-3xl bg-black/30 border border-cyan-500/20 backdrop-blur-xs relative group">
            <div className="absolute top-2 left-3 text-[9px] font-mono-rhythm text-cyan-400/80 uppercase font-bold flex items-center gap-1">
              <span>⌨️ TYPING STUDY</span>
            </div>
            <DuckNpc
              id="typing"
              name="Prof. Quill"
              role="Speed Typewriter"
              dialoguePrompt="Think you can type faster than me?"
              actionText="CHALLENGE"
              isCompleted={progress.typingCompleted}
              onClick={() => handleNpcClick('typing')}
            />
            <div className="mt-1 text-[9px] font-mono-rhythm text-white/40">
              Typewriter Desk & Manuscripts
            </div>
          </div>

          {/* ZONE 2: CENTRAL DANCE FLOOR & GIFT PEDESTAL (Center) */}
          <div className="relative flex flex-col items-center justify-center p-2">
            {/* Animated Pulsing Dance Floor Grid under the gift */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-b from-[#190e38] to-[#0a0614] border-2 border-yellow-500/30 overflow-hidden shadow-2xl flex flex-col justify-end -z-10">
              <div className="h-40 w-full grid grid-cols-6 grid-rows-3 gap-1 p-2 opacity-50">
                {Array.from({ length: 18 }).map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-sm transition-colors duration-500 ${
                      completedCount >= 2
                        ? i % 2 === 0
                          ? 'bg-fuchsia-500/40'
                          : 'bg-cyan-400/40'
                        : i % 3 === 0
                        ? 'bg-amber-400/30'
                        : 'bg-indigo-900/30'
                    }`}
                  />
                ))}
              </div>
            </div>

            <GiftPedestal
              progress={progress}
              isUnlocked={isUnlocked}
              onOpenGift={onOpenGift}
            />
          </div>

          {/* ZONE 3: PUZZLE & BAR AREA (Right) */}
          <div className="flex flex-col items-center justify-center p-3 rounded-3xl bg-black/30 border border-amber-500/20 backdrop-blur-xs relative group">
            <div className="absolute top-2 right-3 text-[9px] font-mono-rhythm text-amber-400/80 uppercase font-bold flex items-center gap-1">
              <span>🍸 BAR COUNTER</span>
            </div>
            <DuckNpc
              id="puzzle"
              name="Dr. Bones"
              role="Artifact Scholar"
              dialoguePrompt="I've got ten questions for you."
              actionText="CHALLENGE"
              isCompleted={progress.puzzleCompleted}
              onClick={() => handleNpcClick('puzzle')}
            />
            <div className="mt-1 text-[9px] font-mono-rhythm text-white/40 flex items-center gap-1">
              <span>🍸 Bartender wipes glasses</span>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: COWBOY SHOOTOUT AREA (Bottom-Left) & ENTRANCE ARCH */}
        <div className="relative w-full flex flex-col sm:flex-row justify-between items-end px-4 py-2 gap-4">
          {/* ZONE 4: SHOOTING / BAR CHALLENGE AREA */}
          <div className="flex items-center gap-4 p-3 rounded-3xl bg-black/40 border border-rose-500/20 backdrop-blur-xs">
            <DuckNpc
              id="cowboy"
              name="Billy The Quack"
              role="Quickdraw Marksman"
              dialoguePrompt="Fast hands, partner?"
              actionText="CHALLENGE"
              size="sm"
              isCompleted={progress.shooterCompleted}
              onClick={() => handleNpcClick('cowboy')}
            />
            <div className="flex flex-col text-[10px] font-mono-rhythm text-white/60">
              <span className="font-bold text-rose-300">SHOOTING GALLERY</span>
              <span>60s Quickdraw duel</span>
              <span className="text-[9px] text-white/40">Bottle targets only</span>
            </div>
          </div>

          {/* ENTRANCE ARCHWAY TIP */}
          <div className="text-center sm:text-right text-[11px] font-mono-rhythm text-white/40 pb-1">
            <span>Explore the ballroom • Approach any rival duck to accept their challenge</span>
          </div>
        </div>
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
