import React from 'react';
import { DuckNpcId, DuckNpcVariant, GameProgress } from '../types/level4Types';
import { DuckNpc } from './DuckNpc';

interface NpcApproachModalProps {
  npcId: DuckNpcId;
  progress: GameProgress;
  onAccept: (id: DuckNpcId) => void;
  onClose: () => void;
}

interface ApproachConfig {
  name: string;
  role: string;
  variant: DuckNpcVariant;
  intro: string;
  prompt: string;
  acceptLabel: string;
  completedText: string;
}

const NPC_CONFIGS: Record<DuckNpcId, ApproachConfig> = {
  typing: {
    name: 'Prof. Quill',
    role: 'Speed Typewriter',
    variant: 'talk',
    intro:
      '"So you actually came over. I type around sixty words per minute. On a good day, anyway. One hundred words. First one to finish wins."',
    prompt: 'START TYPING BATTLE?',
    acceptLabel: 'CHALLENGE',
    completedText: '"Don\'t make me type another hundred words."',
  },
  puzzle: {
    name: 'Dr. Bones',
    role: 'Artifact Scholar',
    variant: 'talk',
    intro:
      '"Ah. Perfect timing. I\'ve collected ten very important questions. Some are ancient mysteries. Some are... probably not. Answer all ten. Three mistakes and we\'re done."',
    prompt: 'READY?',
    acceptLabel: "LET'S GO",
    completedText: '"I officially have no more questions."',
  },
  cowboy: {
    name: 'Billy The Quack',
    role: 'Quickdraw Marksman',
    variant: 'aim',
    intro:
      '"You\'re finally here. Sixty seconds. Bottles are worth one. Don\'t shoot the cocktail glasses, the cactus... or that. Beat my score and the lock is yours."',
    prompt: 'START SHOOTOUT?',
    acceptLabel: 'CHALLENGE',
    completedText: '"Rematch? ...maybe later."',
  },
};

export const NpcApproachModal: React.FC<NpcApproachModalProps> = ({
  npcId,
  progress,
  onAccept,
  onClose,
}) => {
  const config = NPC_CONFIGS[npcId];
  const isCompleted =
    (npcId === 'typing' && progress.typingCompleted) ||
    (npcId === 'puzzle' && progress.puzzleCompleted) ||
    (npcId === 'cowboy' && progress.shooterCompleted);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-[#130d29] border-2 border-yellow-400/80 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center relative">
        <div className="mb-3">
          <DuckNpc
            id={npcId}
            name={config.name}
            role={config.role}
            actionText=""
            size="sm"
            variant={isCompleted ? 'win' : config.variant}
            isCompleted={isCompleted}
            onClick={() => {}}
          />
        </div>
        <h3 className="font-disco text-lg text-yellow-300 mb-2 uppercase">{config.name}</h3>

        {!isCompleted ? (
          <>
            <p className="font-mono text-xs sm:text-sm text-white/90 leading-relaxed mb-4">
              {config.intro}
            </p>
            <span className="text-[11px] font-mono-rhythm text-cyan-400 font-bold mb-4 uppercase tracking-wider">
              {config.prompt}
            </span>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => onAccept(npcId)}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-disco text-xs font-bold uppercase tracking-wider cursor-pointer hover:brightness-110 active:scale-95"
              >
                {config.acceptLabel}
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-disco text-xs uppercase tracking-wider cursor-pointer active:scale-95"
              >
                NOT YET
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="font-mono text-xs sm:text-sm text-white/90 leading-relaxed mb-4">
              {config.completedText}
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => onAccept(npcId)}
                className="flex-1 py-3 rounded-xl bg-yellow-400 text-black font-disco text-xs font-bold uppercase tracking-wider cursor-pointer hover:brightness-110"
              >
                PLAY AGAIN
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-disco text-xs uppercase tracking-wider cursor-pointer"
              >
                BACK
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
