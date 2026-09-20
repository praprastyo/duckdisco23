import React from 'react';
import { DancePose, QuackSprite } from './QuackSprite';
import { BackupDancers } from './BackupDancers';

export { ARROW_ICONS, MOVE_NAMES } from './QuackSprite';
export type { DancePose } from './QuackSprite';


/** Extra particle / aura layer that fires for the current dance move. */
const PoseEffects: React.FC<{ pose: DancePose }> = ({ pose }) => {
  if (pose === 'right') {
    return (
      <div className="absolute -top-6 flex gap-2 animate-ping">
        <span className="text-lg">âœ¨</span><span className="text-xl">ðŸª¶</span><span className="text-lg">âœ¨</span>
      </div>
    );
  }
  if (pose === 'up') {
    return (
      <div className="absolute -top-4 flex gap-3 animate-bounce">
        <span className="text-sm text-cyan-300">Ë„</span><span className="text-sm text-cyan-300">Ë„</span>
      </div>
    );
  }
  if (pose === 'down') {
    return (
      <div className="absolute -bottom-2 flex gap-1 items-end">
        {[0, 1, 2].map((i) => (
          <span key={i} className="w-1.5 rounded-full bg-fuchsia-400 animate-pulse" style={{ height: `${10 + i * 5}px` }} />
        ))}
      </div>
    );
  }
  if (pose === 'left') {
    return (
      <div className="absolute top-1/2 -left-8 flex flex-col gap-1">
        <span className="w-6 h-0.5 bg-amber-300/80 rounded-full" />
        <span className="w-9 h-0.5 bg-amber-300/60 rounded-full" />
        <span className="w-6 h-0.5 bg-amber-300/40 rounded-full" />
      </div>
    );
  }
  if (pose === 'miss') {
    return (
      <div className="absolute -top-5 flex gap-2 animate-spin">
        <div className="w-3 h-3 rounded-full bg-rose-400 shadow-[0_0_8px_#f43f5e]" />
        <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#facc15]" />
      </div>
    );
  }
  if (pose === 'super') {
    return (
      <div className="absolute -top-8 flex gap-3 animate-bounce">
        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-yellow-400 to-pink-500 shadow-[0_0_12px_#ec4899]" />
        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-amber-300 shadow-[0_0_12px_#06b6d4] animate-ping" />
        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-pink-500 to-yellow-400 shadow-[0_0_12px_#ec4899]" />
      </div>
    );
  }
  return null;
};

const BODY_TRANSFORM: Record<DancePose, (bob: number) => string> = {
  idle: (bob) => `translateY(${bob}px)`,
  left: () => 'translateX(-26px) rotate(-14deg)',
  right: () => 'translateX(26px) rotate(14deg)',
  up: () => 'translateY(-30px) scale(1.08)',
  down: () => 'translateY(16px) scaleY(0.86)',
  miss: () => 'translateY(6px) rotate(16deg) scale(0.95)',
  super: () => 'scale(1.18) rotate(-6deg)',
};

interface QuackDancerProps {
  pose: DancePose;
  beat: number;
  combo: number;
  missStreak?: number;
}

/**
 * Driving wrapper for the DJ Quack sprite.
 * Combo tiers unlock backup dancers and extra stage lighting.
 */
export const QuackDancer: React.FC<QuackDancerProps> = ({ pose, beat, combo, missStreak = 0 }) => {
  const isEven = beat % 2 === 0;
  const isFever = combo >= 25;
  const isDisco = combo >= 50;
  const isFrustrated = missStreak >= 2;

  const glow = isDisco
    ? 'drop-shadow-[0_0_30px_rgba(236,72,153,0.9)]'
    : isFever
    ? 'drop-shadow-[0_0_22px_rgba(6,182,212,0.8)]'
    : 'drop-shadow-[0_0_14px_rgba(234,179,8,0.5)]';

  return (
    <div className="relative flex flex-col items-center select-none pointer-events-none">
      <PoseEffects pose={pose} />

      {/* Backup Dancers appear when combo >= 5! */}
      <BackupDancers pose={pose} beat={beat} combo={combo} />

      <div
        className={`transition-all duration-150 ease-out z-10 ${glow}`}
        style={{ transform: BODY_TRANSFORM[pose](isEven ? -4 : 0) }}
      >
        <QuackSprite pose={pose} isEven={isEven} isFever={isFever} isFrustrated={isFrustrated} />
      </div>
    </div>
  );
};
