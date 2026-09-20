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

      {/* 2. Left & Right Stage Flame Jets / Spark Cannons */}
      <div className="absolute bottom-16 left-12 sm:left-24 flex flex-col items-center">
        {/* Flame column shoots up on beat or hit */}
        <div
          className={`w-8 rounded-full transition-all duration-100 origin-bottom ${
            isEven || isHit
              ? 'h-36 sm:h-48 bg-gradient-to-t from-orange-500 via-yellow-300 to-transparent shadow-[0_0_30px_#f97316] opacity-90 scale-110'
              : 'h-6 bg-orange-600/30 opacity-20'
          }`}
        />
        <div className="w-10 h-6 bg-black/80 rounded-t-lg border border-yellow-400 flex items-center justify-center text-[10px]">
          🔥
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
        <div className="w-10 h-6 bg-black/80 rounded-t-lg border border-cyan-400 flex items-center justify-center text-[10px]">
          💨
        </div>
      </div>

      {/* 3. Floating Confetti & Glitter Rain (when combo >= 10) */}
      {combo >= 10 && (
        <div className="absolute inset-0">
          {[
            { left: '15%', delay: '0s', text: '✨' },
            { left: '28%', delay: '0.4s', text: '🎉' },
            { left: '42%', delay: '0.2s', text: '⭐' },
            { left: '60%', delay: '0.6s', text: '✨' },
            { left: '75%', delay: '0.1s', text: '🎊' },
            { left: '88%', delay: '0.5s', text: '⭐' },
          ].map((c, i) => (
            <div
              key={i}
              className="absolute top-0 animate-bounce text-xl"
              style={{
                left: c.left,
                animationDuration: isDisco ? '0.8s' : '1.4s',
                animationDelay: c.delay,
              }}
            >
              {c.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
