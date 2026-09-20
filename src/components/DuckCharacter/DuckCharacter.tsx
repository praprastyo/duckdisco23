import React, { useEffect, useState } from 'react';
import { JudgementType } from '../../config/scoring';

interface DuckCharacterProps {
  currentBeat?: number;
  lastJudgement?: JudgementType | null;
  combo?: number;
  isClear?: boolean;
}

export const DuckCharacter: React.FC<DuckCharacterProps> = ({
  currentBeat = 0,
  lastJudgement,
  combo = 0,
  isClear = false,
}) => {
  const [reaction, setReaction] = useState<'idle' | 'confident' | 'confused' | 'dancing'>('idle');

  useEffect(() => {
    if (isClear) {
      setReaction('dancing');
      return;
    }

    if (!lastJudgement) return;

    if (lastJudgement === 'perfect' || lastJudgement === 'great') {
      setReaction('confident');
      const timer = setTimeout(() => setReaction('idle'), 400);
      return () => clearTimeout(timer);
    } else if (lastJudgement === 'miss') {
      setReaction('confused');
      const timer = setTimeout(() => setReaction('idle'), 600);
      return () => clearTimeout(timer);
    }
  }, [lastJudgement, isClear]);

  // Head bob cadence synced with beat
  const bob = currentBeat % 2 === 0 ? '-translate-y-2' : 'translate-y-0';
  const rotation = reaction === 'confused' ? '-rotate-12' : reaction === 'confident' ? 'rotate-3 scale-105' : 'rotate-0';
  const highComboGlow = combo >= 10 ? 'drop-shadow-[0_0_25px_rgba(234,179,8,0.7)]' : 'drop-shadow-[0_0_15px_rgba(236,72,153,0.4)]';

  return (
    <div className={`relative flex flex-col items-center select-none pointer-events-none transition-all duration-150 ${bob} ${rotation} ${highComboGlow}`}>
      {/* SVG Original DJ Quack */}
      <svg width="240" height="260" viewBox="0 0 240 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-48 h-52 sm:w-60 sm:h-64">
        {/* Glow halo */}
        <circle cx="120" cy="115" r="85" fill="url(#duckGlow)" opacity="0.4" />

        {/* Headphones Arch */}
        <path d="M 60 95 C 60 40, 180 40, 180 95" stroke="#f43f5e" strokeWidth="12" strokeLinecap="round" />
        <path d="M 60 95 C 60 40, 180 40, 180 95" stroke="#fb7185" strokeWidth="4" strokeLinecap="round" />

        {/* Headphone Earcups */}
        <rect x="42" y="80" width="22" height="38" rx="10" fill="#1e1b4b" stroke="#e11d48" strokeWidth="4" />
        <rect x="176" y="80" width="22" height="38" rx="10" fill="#1e1b4b" stroke="#e11d48" strokeWidth="4" />

        {/* Duck Body & DJ Jacket */}
        <path d="M 65 170 C 65 140, 175 140, 175 170 L 195 240 C 195 255, 45 255, 45 240 Z" fill="#4c0519" stroke="#fb7185" strokeWidth="3" />
        {/* Jacket Lapels / Neon Collar */}
        <polygon points="120,180 80,145 105,210" fill="#be123c" />
        <polygon points="120,180 160,145 135,210" fill="#be123c" />
        <polygon points="120,195 105,245 135,245" fill="#facc15" /> {/* Gold Medallion */}

        {/* Duck Head */}
        <circle cx="120" cy="115" r="54" fill="url(#goldFeather)" stroke="#ca8a04" strokeWidth="2.5" />

        {/* DJ Sunglasses */}
        <path d="M 82 105 L 115 105 C 117 105, 119 107, 119 110 L 115 125 C 114 128, 111 130, 108 130 L 88 130 C 84 130, 81 127, 81 123 Z" fill="#09090b" stroke="#06b6d4" strokeWidth="3" />
        <path d="M 125 105 L 158 105 C 160 105, 162 107, 162 110 L 158 125 C 157 128, 154 130, 151 130 L 131 130 C 127 130, 124 127, 124 123 Z" fill="#09090b" stroke="#06b6d4" strokeWidth="3" />
        <line x1="115" y1="110" x2="125" y2="110" stroke="#06b6d4" strokeWidth="3" />
        {/* Sunglasses Cyan/Magenta Shine */}
        <line x1="86" y1="112" x2="98" y2="124" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" />
        <line x1="129" y1="112" x2="141" y2="124" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" />

        {/* Duck Bill / Beak */}
        <ellipse cx="120" cy="138" rx="26" ry="14" fill="#f97316" stroke="#c2410c" strokeWidth="2.5" />
        <ellipse cx="120" cy="135" rx="22" ry="7" fill="#fb923c" />
        {/* Nostrils */}
        <circle cx="114" cy="133" r="1.5" fill="#7c2d12" />
        <circle cx="126" cy="133" r="1.5" fill="#7c2d12" />

        {/* Confused Question Mark or Confident Sparkle */}
        {reaction === 'confused' && (
          <g transform="translate(165, 50)">
            <text x="0" y="20" fill="#f43f5e" fontSize="32" fontWeight="900" fontFamily="sans-serif">?</text>
          </g>
        )}
        {reaction === 'confident' && (
          <g transform="translate(170, 55)">
            <polygon points="10,0 13,7 20,10 13,13 10,20 7,13 0,10 7,7" fill="#facc15" />
          </g>
        )}

        {/* Gradients */}
        <defs>
          <radialGradient id="duckGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="goldFeather" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>
        </defs>
      </svg>

      {/* Mascot Name Badge */}
      <div className="mt-1 px-3 py-0.5 rounded-full bg-black/60 border border-yellow-500/40 text-[11px] uppercase tracking-widest text-yellow-300 font-mono-rhythm backdrop-blur-sm">
        DJ QUACK {combo > 5 ? `• ${combo}× FEVER` : ''}
      </div>
    </div>
  );
};
