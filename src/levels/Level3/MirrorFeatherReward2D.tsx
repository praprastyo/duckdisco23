import React from 'react';

export const MirrorFeatherReward2D: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4 my-2 select-none animate-fadeIn">
      {/* 2D Rotating Mirror Feather with reflective shine & sparkle burst */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Sparkle background aura */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/30 via-yellow-400/30 to-fuchsia-500/30 blur-xl animate-pulse" />

        {/* Floating / Rotating Feather SVG */}
        <div className="relative animate-bounce" style={{ animationDuration: '2.5s' }}>
          <svg
            width="80"
            height="110"
            viewBox="0 0 80 110"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_0_20px_rgba(250,204,21,0.8)]"
          >
            <defs>
              <linearGradient id="mirrorSheen" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="35%" stopColor="#cffafe" />
                <stop offset="55%" stopColor="#fef08a" />
                <stop offset="80%" stopColor="#f5d0fe" />
                <stop offset="100%" stopColor="#e0e7ff" />
              </linearGradient>

              <linearGradient id="quillGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="100%" stopColor="#ca8a04" />
              </linearGradient>
            </defs>

            {/* Feather Vane (Mirror Prismatic Finish) */}
            <path
              d="M 40 10 C 65 30, 75 75, 42 96 C 40 98, 38 96, 38 94 C 10 75, 18 30, 40 10 Z"
              fill="url(#mirrorSheen)"
              stroke="#67e8f9"
              strokeWidth="2"
            />

            {/* Feather Barbs Texture Lines */}
            <path d="M 40 25 Q 56 32, 60 40" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 40 40 Q 58 48, 64 58" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 40 55 Q 56 64, 60 74" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 40 28 Q 24 35, 20 44" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 40 45 Q 22 52, 18 62" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 40 60 Q 24 68, 20 78" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />

            {/* Central Quill Stem */}
            <path d="M 40 10 Q 40 60, 40 105" stroke="url(#quillGold)" strokeWidth="3.5" strokeLinecap="round" />

            {/* Sparkle Stars */}
            <polygon points="68,20 70,25 75,27 70,29 68,34 66,29 61,27 66,25" fill="#fef08a" className="animate-ping" />
            <polygon points="12,70 14,74 18,76 14,78 12,82 10,78 6,76 10,74" fill="#67e8f9" className="animate-ping" />
          </svg>
        </div>
      </div>

      <div className="mt-2 text-center">
        <span className="text-[10px] font-mono-rhythm text-yellow-400 uppercase tracking-widest block font-bold">
          MIRROR FEATHER UNLOCKED
        </span>
        <span className="text-xs font-disco text-white/80 tracking-wide">
          Reflective disco prism feather of DJ Quack!
        </span>
      </div>
    </div>
  );
};
