import React from 'react';

interface StagePyrotechnicsProps {
  beat: number;
  combo: number;
  isHit?: boolean;
}

export const StagePyrotechnics: React.FC<StagePyrotechnicsProps> = ({ beat, combo, isHit }) => {
  const isEven = beat % 2 === 0;
  const isFever = combo >= 15;
  const isDisco = combo >= 30;

  // Strobe border color based on beat
  const borderColors = [
    'rgba(236,72,153,0.7)', // magenta
    'rgba(6,182,212,0.7)',  // cyan
    'rgba(250,204,21,0.8)', // gold
    'rgba(168,85,247,0.7)', // purple
  ];
  const currentStrobe = borderColors[beat % borderColors.length];

  // Pure geometric confetti ribbons (Zero emojis)
  const confettiShapes = [
    { left: '12%', color: '#facc15', w: 8, h: 18, delay: '0s' },
    { left: '26%', color: '#ec4899', w: 10, h: 14, delay: '0.4s' },
    { left: '40%', color: '#06b6d4', w: 7, h: 20, delay: '0.2s' },
    { left: '58%', color: '#a855f7', w: 9, h: 16, delay: '0.6s' },
    { left: '74%', color: '#f43f5e', w: 10, h: 15, delay: '0.1s' },
    { left: '88%', color: '#10b981', w: 8, h: 18, delay: '0.5s' },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-20">
      {/* 1. Pulsating Neon Strobe Border around the whole screen */}
      <div
        className="absolute inset-0 transition-opacity duration-75 pointer-events-none border-4 sm:border-8"
        style={{
          borderColor: currentStrobe,
          boxShadow: isEven || isHit
            ? `inset 0 0 35px ${currentStrobe}, 0 0 45px ${currentStrobe}`
            : 'none',
          opacity: isDisco ? 0.9 : isFever ? 0.75 : 0.45,
        }}
      />

      {/* 2. Left & Right Stage Flame Jets */}
      <div className="absolute bottom-16 left-12 sm:left-24 flex flex-col items-center">
        <div
          className={`w-8 rounded-full transition-all duration-100 origin-bottom ${
            isEven || isHit
              ? 'h-36 sm:h-48 bg-gradient-to-t from-orange-500 via-yellow-300 to-transparent shadow-[0_0_30px_#f97316] opacity-90 scale-110'
              : 'h-6 bg-orange-600/30 opacity-20'
          }`}
        />
        <div className="w-10 h-6 bg-black/80 rounded-t-lg border border-yellow-400 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-orange-400 animate-ping" />
        </div>
      </div>

      <div className="absolute bottom-16 right-12 sm:right-24 flex flex-col items-center">
        <div
          className={`w-8 rounded-full transition-all duration-100 origin-bottom ${
            !isEven || isHit
              ? 'h-36 sm:h-48 bg-gradient-to-t from-pink-500 via-cyan-300 to-transparent shadow-[0_0_30px_#06b6d4] opacity-90 scale-110'
              : 'h-6 bg-pink-600/30 opacity-20'
          }`}
        />
        <div className="w-10 h-6 bg-black/80 rounded-t-lg border border-cyan-400 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
        </div>
      </div>

      {/* 3. Floating Confetti Ribbon Rain (combo >= 10, zero emojis) */}
      {combo >= 10 && (
        <div className="absolute inset-0">
          {confettiShapes.map((c, i) => (
            <div
              key={i}
              className="absolute top-0 animate-bounce"
              style={{
                left: c.left,
                width: `${c.w}px`,
                height: `${c.h}px`,
                backgroundColor: c.color,
                boxShadow: `0 0 8px ${c.color}`,
                transform: `rotate(${i * 45}deg)`,
                animationDuration: isDisco ? '0.8s' : '1.4s',
                animationDelay: c.delay,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};