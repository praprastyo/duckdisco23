import React, { useState } from 'react';
import { DuckNpcId, DuckNpcVariant } from '../types/level4Types';
import { getNpcSpritePath } from '../config/level4Config';

export type DuckAnimationState = 'idle' | 'talk' | 'celebrate' | 'defeat';

interface DuckNpcProps {
  id: DuckNpcId;
  name: string;
  role: string;
  isCompleted: boolean;
  animState?: DuckAnimationState;
  variant?: DuckNpcVariant;
  size?: 'sm' | 'md' | 'lg';
  onClick: () => void;
  actionText: string;
  spriteSrc?: string;
}

export const DuckNpc: React.FC<DuckNpcProps> = ({
  id,
  name,
  role,
  isCompleted,
  animState = 'idle',
  variant,
  size = 'lg',
  onClick,
  actionText,
  spriteSrc,
}) => {
  const [imgError, setImgError] = useState(false);

  // Determine active variant (1. idle, 2. action, 3. talk/shoot, 4. dance, 5. win, 6. lose)
  const activeVariant: DuckNpcVariant =
    variant ||
    (isCompleted
      ? 'win'
      : animState === 'celebrate'
      ? 'win'
      : animState === 'talk'
      ? 'talk'
      : animState === 'defeat'
      ? 'lose'
      : 'idle');

  const resolvedSpriteUrl = spriteSrc || getNpcSpritePath(id, activeVariant);

  const sizeClasses =
    size === 'sm'
      ? 'w-[86px] h-[103px]'
      : size === 'md'
      ? 'w-[120px] h-[144px]'
      : 'w-[130px] h-[156px] sm:w-[172px] sm:h-[206px]';

  return (
    <div
      onClick={onClick}
      className={`group relative flex flex-col items-center cursor-pointer transition-all duration-300 transform hover:scale-105 active:scale-95 ${
        isCompleted ? 'brightness-110 drop-shadow-[0_0_15px_rgba(52,211,153,0.6)]' : 'hover:drop-shadow-[0_0_20px_rgba(250,204,21,0.6)]'
      }`}
    >
      {actionText && (
        <div className="mb-2 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono-rhythm font-bold uppercase tracking-wider backdrop-blur-md border transition-colors shadow-lg bg-black/70 border-white/20">
          {isCompleted ? (
            <>
              <span className="text-emerald-400">✓ DEFEATED</span>
              <span className="text-yellow-400">👑</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="text-yellow-300">{actionText}</span>
            </>
          )}
        </div>
      )}

      <div
        className={`relative ${sizeClasses} flex items-center justify-center transition-transform ${
          activeVariant === 'talk' || animState === 'talk'
            ? 'animate-bounce'
            : isCompleted || activeVariant === 'win'
            ? 'animate-pulse'
            : 'hover:-translate-y-1'
        }`}
      >
        {!imgError ? (
          <img
            src={resolvedSpriteUrl}
            alt={name}
            width={172}
            height={206}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain [image-rendering:pixelated]"
          />
        ) : (
          <DuckSvgGraphic id={id} />
        )}
        {isCompleted && <div className="absolute -top-3 text-2xl animate-bounce">👑</div>}
      </div>

      <div className="mt-2 text-center">
        <h4 className="font-disco text-xs sm:text-sm text-white tracking-wide group-hover:text-yellow-300 transition-colors">
          {name}
        </h4>
        <span className="text-[9px] sm:text-[10px] font-mono-rhythm text-white/60 tracking-widest uppercase">
          {role}
        </span>
      </div>
    </div>
  );
};

const DuckSvgGraphic: React.FC<{ id: DuckNpcId }> = ({ id }) => {
  if (id === 'typing') {
    return (
      <svg width="100" height="110" viewBox="0 0 100 110" fill="none" className="drop-shadow-md">
        <rect x="25" y="78" width="50" height="24" rx="3" fill="#334155" stroke="#64748b" strokeWidth="2" />
        <rect x="36" y="60" width="28" height="16" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
        <circle cx="50" cy="38" r="22" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
        <rect x="34" y="32" width="14" height="10" rx="2" fill="#000" stroke="#38bdf8" strokeWidth="2" />
        <rect x="52" y="32" width="14" height="10" rx="2" fill="#000" stroke="#38bdf8" strokeWidth="2" />
        <line x1="48" y1="37" x2="52" y2="37" stroke="#38bdf8" strokeWidth="2" />
        <polygon points="44,45 56,45 50,53" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" />
        <path d="M 32 60 C 32 50, 68 50, 68 60 L 74 82 L 26 82 Z" fill="#1e293b" stroke="#475569" strokeWidth="2" />
        <line x1="28" y1="62" x2="38" y2="76" stroke="#facc15" strokeWidth="5" strokeLinecap="round" />
        <line x1="72" y1="62" x2="62" y2="76" stroke="#facc15" strokeWidth="5" strokeLinecap="round" />
      </svg>
    );
  }

  if (id === 'puzzle') {
    return (
      <svg width="100" height="110" viewBox="0 0 100 110" fill="none" className="drop-shadow-md">
        <path d="M 30 26 C 30 14, 70 14, 70 26 Z" fill="#78350f" stroke="#451a03" strokeWidth="2" />
        <line x1="22" y1="26" x2="78" y2="26" stroke="#451a03" strokeWidth="3" strokeLinecap="round" />
        <circle cx="50" cy="40" r="21" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
        <ellipse cx="43" cy="38" rx="3" ry="4" fill="#000" />
        <ellipse cx="57" cy="38" rx="3" ry="4" fill="#000" />
        <ellipse cx="50" cy="48" rx="8" ry="4" fill="#f97316" stroke="#ea580c" strokeWidth="1.5" />
        <path d="M 32 60 C 32 52, 68 52, 68 60 L 72 88 L 28 88 Z" fill="#854d0e" stroke="#713f12" strokeWidth="2" />
        <line x1="34" y1="60" x2="66" y2="86" stroke="#451a03" strokeWidth="3" />
        <polygon points="74,70 82,62 86,76" fill="#06b6d4" stroke="#0891b2" strokeWidth="1.5" />
      </svg>
    );
  }

  return (
    <svg width="100" height="110" viewBox="0 0 100 110" fill="none" className="drop-shadow-md">
      <path d="M 28 24 C 28 10, 72 10, 72 24 Z" fill="#451a03" stroke="#290e02" strokeWidth="2" />
      <line x1="18" y1="24" x2="82" y2="24" stroke="#451a03" strokeWidth="4" strokeLinecap="round" />
      <circle cx="50" cy="40" r="21" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
      <circle cx="43" cy="40" r="3" fill="#000" />
      <circle cx="57" cy="40" r="3" fill="#000" />
      <polygon points="42,47 58,47 54,55 46,55" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" />
      <path d="M 32 60 C 32 52, 68 52, 68 60 L 72 86 L 28 86 Z" fill="#78350f" stroke="#451a03" strokeWidth="2" />
      <line x1="28" y1="64" x2="16" y2="58" stroke="#facc15" strokeWidth="5" strokeLinecap="round" />
      <line x1="72" y1="64" x2="84" y2="58" stroke="#facc15" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
};
