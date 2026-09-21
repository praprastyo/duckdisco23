import React from 'react';
import { DJQuackPose, Direction } from './level3Types';

interface QuackCharacter2DProps {
  pose: DJQuackPose;
  bpm?: number;
  beatIndex?: number;
  isFakeDemo?: boolean;
  activeDirection?: Direction | null;
  bassEnergy?: number;
}

export const QuackCharacter2D: React.FC<QuackCharacter2DProps> = ({
  pose,
  bpm = 115,
  beatIndex = 0,
  isFakeDemo = false,
  activeDirection = null,
  bassEnergy = 0.2,
}) => {
  const isEven = beatIndex % 2 === 0;
  const bobY = isEven ? -6 - bassEnergy * 8 : 0;
  const isSpecial = pose === 'special';
  const isFullGroove = pose === 'full-groove' || pose === 'celebrate';
  const isWrongOrMiss = pose === 'miss' || pose === 'wrong-move';

  let bodyTransform = `translateY(${bobY}px)`;
  let headTransform = '';
  let leftWingTransform = '';
  let rightWingTransform = '';

  if (pose === 'demo-left' || pose === 'player-left' || activeDirection === 'left') {
    bodyTransform += ' translateX(-20px) rotate(-8deg)';
    headTransform = 'rotate(-12deg) translate(-8px, -4px)';
    leftWingTransform = 'rotate(-40deg) translate(-10px, -15px)';
    rightWingTransform = 'rotate(15deg) translate(5px, 0px)';
  } else if (pose === 'demo-up' || pose === 'player-up' || activeDirection === 'up') {
    bodyTransform += ' translateY(-22px) scale(1.05)';
    headTransform = 'translateY(-10px) rotate(2deg)';
    leftWingTransform = 'rotate(-75deg) translate(-22px, -28px)';
    rightWingTransform = 'rotate(75deg) translate(22px, -28px)';
  } else if (pose === 'demo-right' || pose === 'player-right' || activeDirection === 'right') {
    bodyTransform += ' translateX(20px) rotate(8deg)';
    headTransform = 'rotate(12deg) translate(8px, -4px)';
    leftWingTransform = 'rotate(-15deg) translate(-5px, 0px)';
    rightWingTransform = 'rotate(40deg) translate(10px, -15px)';
  } else if (pose === 'demo-down' || pose === 'player-down' || activeDirection === 'down') {
    bodyTransform += ' translateY(18px) scale(0.96, 0.88)';
    headTransform = 'translateY(8px)';
    leftWingTransform = 'rotate(30deg) translate(0px, 12px)';
    rightWingTransform = 'rotate(-30deg) translate(0px, 12px)';
  } else if (isSpecial) {
    bodyTransform += ' scale(1.15) translateY(-14px)';
    headTransform = 'rotate(-6deg) translateY(-8px)';
    leftWingTransform = 'rotate(-85deg) translate(-28px, -32px)';
    rightWingTransform = 'rotate(60deg) translate(18px, -20px)';
  } else if (isFullGroove) {
    bodyTransform += ' rotate(4deg) translateY(-10px)';
    headTransform = 'rotate(8deg) translateY(-4px)';
    leftWingTransform = 'rotate(-65deg) translate(-16px, -22px)';
    rightWingTransform = 'rotate(45deg) translate(14px, -12px)';
  } else if (isWrongOrMiss) {
    bodyTransform += ' rotate(12deg) translateY(12px)';
    headTransform = 'rotate(22deg) translate(12px, 8px)';
    leftWingTransform = 'rotate(20deg)';
    rightWingTransform = 'rotate(-20deg)';
  }

  const animDuration = Math.max(0.28, 60 / Math.max(60, bpm));

  return (
    <div
      className={`relative inline-flex items-center justify-center transition-all ${
        isFakeDemo ? 'opacity-60 saturate-50 filter drop-shadow-[0_0_12px_rgba(168,85,247,0.5)]' : ''
      }`}
      style={{ transitionDuration: `${animDuration * 0.4}s` }}
    >
      {isSpecial && (
        <div className="absolute inset-0 -m-10 rounded-full bg-gradient-to-r from-yellow-400/40 via-amber-300/30 to-fuchsia-500/40 blur-2xl animate-pulse pointer-events-none" />
      )}
      {isFullGroove && !isSpecial && (
        <div className="absolute inset-0 -m-6 rounded-full bg-gradient-to-r from-cyan-400/30 to-yellow-400/30 blur-xl animate-pulse pointer-events-none" />
      )}
      {isFakeDemo && (
        <div className="absolute -top-6 px-2.5 py-0.5 rounded-full bg-purple-950/90 border border-purple-400/70 text-[10px] font-mono-rhythm text-purple-300 tracking-wider shadow-lg animate-bounce pointer-events-none">
          👻 FAKE CUE • IGNORE!
        </div>
      )}
      <svg width="190" height="220" viewBox="0 0 190 220" fill="none" className="overflow-visible select-none pointer-events-none">
        <defs>
          <linearGradient id="l3Head" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" /><stop offset="65%" stopColor="#f8fafc" /><stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          <linearGradient id="l3Gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde047" /><stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>
          <linearGradient id="l3Blue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>
        </defs>
        <ellipse cx="95" cy="204" rx={isSpecial ? 65 : 50 + bassEnergy * 20} ry="14" fill="rgba(0,0,0,0.5)" />
        {/* Headphones */}
        <g style={{ transform: bodyTransform }} className="transition-transform duration-200">
          <path d="M 50 68 C 50 26, 140 26, 140 68" stroke={isFakeDemo ? '#9333ea' : '#f43f5e'} strokeWidth="11" strokeLinecap="round" />
          <rect x="36" y="58" width="18" height="34" rx="8" fill="#111827" stroke={isFakeDemo ? '#a855f7' : '#e11d48'} strokeWidth="3.5" />
          <rect x="136" y="58" width="18" height="34" rx="8" fill="#111827" stroke={isFakeDemo ? '#a855f7' : '#e11d48'} strokeWidth="3.5" />
        </g>
        {/* Torso & Wings */}
        <g style={{ transform: bodyTransform }} className="transition-transform duration-200">
          <path d="M 58 126 C 58 102, 132 102, 132 126 L 142 184 C 142 194, 48 194, 48 184 Z"
            fill={isSpecial ? 'url(#l3Gold)' : isFakeDemo ? '#312e81' : 'url(#l3Blue)'}
            stroke={isSpecial ? '#facc15' : '#38bdf8'} strokeWidth="3" />
          <polygon points="95,134 64,110 82,160" fill={isSpecial ? '#fef08a' : '#1e40af'} stroke={isSpecial ? '#eab308' : '#60a5fa'} strokeWidth="2" />
          <polygon points="95,134 126,110 108,160" fill={isSpecial ? '#fef08a' : '#1e40af'} stroke={isSpecial ? '#eab308' : '#60a5fa'} strokeWidth="2" />
          <polygon points="95,134 76,125 78,143" fill="#dc2626" />
          <polygon points="95,134 114,125 112,143" fill="#dc2626" />
          <circle cx="95" cy="134" r="5" fill="#facc15" stroke="#ef4444" strokeWidth="2" />
          {/* Left Wing */}
          <g style={{ transform: leftWingTransform }} className="transition-transform duration-200 origin-[55px_130px]">
            <ellipse cx="45" cy="138" rx={pose === 'demo-left' || pose === 'player-left' ? 24 : 14} ry="10" fill="#ffffff" stroke="#94a3b8" strokeWidth="2.5" />
          </g>
          {/* Right Wing */}
          <g style={{ transform: rightWingTransform }} className="transition-transform duration-200 origin-[135px_130px]">
            <ellipse cx="145" cy="138" rx={pose === 'demo-right' || pose === 'player-right' ? 24 : 14} ry="10" fill="#ffffff" stroke="#94a3b8" strokeWidth="2.5" />
          </g>
          {/* Webbed Feet */}
          <ellipse cx={isEven ? 72 : 68} cy="196" rx="14" ry="6" fill="#f97316" stroke="#c2410c" strokeWidth="2" />
          <ellipse cx={isEven ? 118 : 122} cy="196" rx="14" ry="6" fill="#f97316" stroke="#c2410c" strokeWidth="2" />
        </g>
        {/* Head */}
        <g style={{ transform: `${bodyTransform} ${headTransform}` }} className="transition-transform duration-200 origin-[95px_78px]">
          <path d="M 74 44 C 74 26, 116 26, 116 44 Z" fill={isSpecial ? '#ca8a04' : '#1e3a8a'} stroke={isSpecial ? '#fef08a' : '#3b82f6'} strokeWidth="2" />
          <path d="M 110 44 L 128 54 L 120 58 Z" fill="#0f172a" />
          <circle cx="95" cy="78" r="40" fill="url(#l3Head)" stroke="#94a3b8" strokeWidth="2.5" />
          {/* Sunglasses */}
          <g>
            <path d="M 64 68 L 92 68 C 94 68, 95 70, 95 72 L 92 86 C 91 88, 89 90, 86 90 L 70 90 C 66 90, 64 87, 64 84 Z" fill="#09090b" stroke={isFakeDemo ? '#a855f7' : isSpecial ? '#facc15' : '#06b6d4'} strokeWidth="3" />
            <path d="M 98 68 L 126 68 C 128 68, 129 70, 129 72 L 126 86 C 125 88, 123 90, 120 90 L 104 90 C 100 90, 98 87, 98 84 Z" fill="#09090b" stroke={isFakeDemo ? '#a855f7' : isSpecial ? '#facc15' : '#06b6d4'} strokeWidth="3" />
            <line x1="92" y1="72" x2="98" y2="72" stroke="#06b6d4" strokeWidth="3" />
            <line x1="68" y1="73" x2="80" y2="85" stroke={isFakeDemo ? '#c084fc' : isSpecial ? '#fef08a' : '#ec4899'} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="102" y1="73" x2="114" y2="85" stroke={isFakeDemo ? '#c084fc' : isSpecial ? '#fef08a' : '#ec4899'} strokeWidth="2.5" strokeLinecap="round" />
          </g>
          {/* Beak */}
          <ellipse cx="95" cy="102" rx="20" ry="11" fill="#f97316" stroke="#c2410c" strokeWidth="2.5" />
          <ellipse cx="95" cy="98" rx="16" ry="5" fill="#fb923c" />
          {isWrongOrMiss && (
            <g>
              <text x="42" y="55" fontSize="20" className="animate-bounce">💦</text>
              <text x="88" y="58" fontSize="16" fill="#ef4444" fontWeight="bold">✕</text>
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};
