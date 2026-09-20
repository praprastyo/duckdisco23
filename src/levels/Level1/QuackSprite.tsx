import React from 'react';
import { DanceDirection } from '../../game/BeatmapRunner';

export const ARROW_ICONS: Record<DanceDirection, string> = {
  left: '←',
  up: '↑',
  right: '→',
  down: '↓',
};

export const MOVE_NAMES: Record<DanceDirection, string> = {
  left: 'DUCK SLIDE',
  up: 'QUACK JUMP',
  right: 'WING SPIN',
  down: 'LOW GROOVE',
};

export type DancePose = 'idle' | 'left' | 'up' | 'right' | 'down' | 'miss' | 'super';

interface QuackSpriteProps {
  pose: DancePose;
  isEven: boolean;
  isFever: boolean;
}

/**
 * DJ Quack's 2D skeletal sprite. Body parts swap scale/rotation per pose
 * so each arrow key produces a visibly different dance move.
 */
export const QuackSprite: React.FC<QuackSpriteProps> = ({ pose, isEven, isFever }) => (
  <svg width="150" height="170" viewBox="0 0 150 170" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 40 62 C 40 30, 110 30, 110 62" stroke="#f43f5e" strokeWidth="9" strokeLinecap="round" />
    <rect x="28" y="54" width="15" height="26" rx="7" fill="#1e1b4b" stroke="#e11d48" strokeWidth="3" />
    <rect x="107" y="54" width="15" height="26" rx="7" fill="#1e1b4b" stroke="#e11d48" strokeWidth="3" />

    <g style={{ transform: `translateY(${isEven ? -4 : 0}px)` }}>
      <circle cx="75" cy="72" r="34" fill="url(#qkHead)" stroke="#ca8a04" strokeWidth="2" />
      <path d="M 48 64 L 72 64 C 74 64, 75 66, 75 68 L 72 80 C 71 82, 69 83, 67 83 L 53 83 C 50 83, 48 81, 48 78 Z" fill="#09090b" stroke="#06b6d4" strokeWidth="2.5" />
      <path d="M 78 64 L 102 64 C 104 64, 105 66, 105 68 L 102 80 C 101 82, 99 83, 97 83 L 83 83 C 80 83, 78 81, 78 78 Z" fill="#09090b" stroke="#06b6d4" strokeWidth="2.5" />
      <line x1="72" y1="68" x2="78" y2="68" stroke="#06b6d4" strokeWidth="2.5" />
      <line x1="52" y1="69" x2="62" y2="79" stroke={isFever ? '#facc15' : '#ec4899'} strokeWidth="2" strokeLinecap="round" />
      <line x1="82" y1="69" x2="92" y2="79" stroke={isFever ? '#facc15' : '#ec4899'} strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="75" cy="92" rx="17" ry="9" fill="#f97316" stroke="#c2410c" strokeWidth="2" />
      <ellipse cx="75" cy="89" rx="14" ry="4.5" fill="#fb923c" />
    </g>

    <path d="M 46 112 C 46 96, 104 96, 104 112 L 112 156 C 112 164, 38 164, 38 156 Z" fill="#4c0519" stroke="#fb7185" strokeWidth="2.5" />
    <polygon points="75,120 52,100 64,142" fill="#be123c" />
    <polygon points="75,120 98,100 86,142" fill="#be123c" />
    <circle cx="75" cy="132" r="9" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />

    <ellipse cx="42" cy="122" rx={pose === 'left' ? 20 : 10} ry="8" fill="#eab308" stroke="#ca8a04" strokeWidth="2"
      transform={pose === 'left' ? 'rotate(-32 42 122)' : undefined} />
    <ellipse cx="108" cy="122" rx={pose === 'right' ? 20 : 10} ry="8" fill="#eab308" stroke="#ca8a04" strokeWidth="2"
      transform={pose === 'right' ? 'rotate(32 108 122)' : undefined} />

    {pose === 'up' ? (
      <>
        <ellipse cx="60" cy="162" rx="9" ry="5" fill="#ea580c" transform="rotate(-25 60 162)" />
        <ellipse cx="92" cy="162" rx="9" ry="5" fill="#ea580c" transform="rotate(25 92 162)" />
      </>
    ) : (
      <>
        <ellipse cx={isEven ? 62 : 58} cy="162" rx="9" ry="5" fill="#ea580c" />
        <ellipse cx={isEven ? 90 : 94} cy="162" rx="9" ry="5" fill="#ea580c" />
      </>
    )}

    <defs>
      <linearGradient id="qkHead" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="55%" stopColor="#facc15" />
        <stop offset="100%" stopColor="#eab308" />
      </linearGradient>
    </defs>
  </svg>
);