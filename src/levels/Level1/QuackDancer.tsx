import React from 'react';
import { DancePose, QuackSprite } from './QuackSprite';

export { ARROW_ICONS, MOVE_NAMES } from './QuackSprite';
export type { DancePose } from './QuackSprite';

/** Extra particle / aura layer that fires for the current dance move. */
const PoseEffects: React.FC<{ pose: DancePose }> = ({ pose }) => {
  if (pose === 'right') {
    return (
      <div className="absolute -top-6 flex gap-2 animate-ping">
        <span className="text-lg">✨</span><span className="text-xl">🪶</span><span className="text-lg">✨</span>
      </div>
    );
  }
  if (pose === 'up') {
    return (
      <div className="absolute -top-4 flex gap-3 animate-bounce">
        <span className="text-sm text-cyan-300">˄</span><span className="text-sm text-cyan-300">˄</span>
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
        <span className="text-base">⭐</span><span className="text-base">💫</span>
      </div>
    );
  }
  if (pose === 'super') {
    return (
      <div className="absolute -top-8 flex gap-2">
        <span className="text-2xl animate-bounce">🎉</span>
        <span className="text-2xl animate-ping">🌈</span>
        <span className="text-2xl animate-bounce">🎉</span>
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
}

/**
 * Driving wrapper for the DJ Quack sprite.
 * Combo tiers unlock extra stage lighting on the dancer itself.
 */
export const QuackDancer: React.FC<QuackDancerProps> = ({ pose, beat, combo }) => {
  const isEven = beat % 2 === 0;
  const isFever = combo >= 25;
  const isDisco = combo >= 50;

  const glow = isDisco
    ? 'drop-shadow-[0_0_30px_rgba(236,72,153,0.9)]'
    : isFever
    ? 'drop-shadow-[0_0_22px_rgba(6,182,212,0.8)]'
    : 'drop-shadow-[0_0_14px_rgba(234,179,8,0.5)]';

  return (
    <div className="relative flex flex-col items-center select-none pointer-events-none">
      <PoseEffects pose={pose} />
      <div
        className={`transition-all duration-150 ease-out ${glow}`}
        style={{ transform: BODY_TRANSFORM[pose](isEven ? -4 : 0) }}
      >
        <QuackSprite pose={pose} isEven={isEven} isFever={isFever} />
      </div>
    </div>
  );
};