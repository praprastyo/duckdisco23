import React from 'react';

interface Level2PyrotechnicsProps {
  currentBeat: number;
  combo: number;
  songTime: number;
}

export const Level2Pyrotechnics: React.FC<Level2PyrotechnicsProps> = ({
  currentBeat,
  combo,
  songTime,
}) => {
  const isEven = currentBeat % 2 === 0;
  const isFever = combo >= 10 || songTime >= 20;
  const isDisco = combo >= 25 || songTime >= 40;
  const isMega = combo >= 50 || songTime >= 70;
  const isQuackFever = combo >= 80 || songTime >= 100;

  const strobeColors = [
    'rgba(6,182,212,0.9)',   // cyan
    'rgba(236,72,153,0.9)',  // magenta
    'rgba(250,204,21,0.95)', // gold
    'rgba(168,85,247,0.9)',  // purple
  ];
  const activeColor = strobeColors[currentBeat % strobeColors.length];

  // Colorful confetti ribbons (pure geometric CSS strips, zero emojis)
  const confettiRibbons = [
    { left: '7%', color: '#facc15', w: 8, h: 22 },
    { left: '17%', color: '#ec4899', w: 10, h: 18 },
    { left: '28%', color: '#06b6d4', w: 7, h: 24 },
    { left: '39%', color: '#a855f7', w: 9, h: 20 },
    { left: '50%', color: '#f43f5e', w: 11, h: 18 },
    { left: '61%', color: '#10b981', w: 8, h: 22 },
    { left: '72%', color: '#facc15', w: 10, h: 18 },
    { left: '83%', color: '#06b6d4', w: 7, h: 23 },
    { left: '93%', color: '#ec4899', w: 9, h: 19 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-15">
      {/* 1. Pulsating Neon Strobe Border around playfield */}
      {isFever && (
        <div
          className="absolute inset-0 transition-all duration-75 border-4 sm:border-6 rounded-3xl"
          style={{
            borderColor: activeColor,
            boxShadow: isEven
              ? `inset 0 0 35px ${activeColor}, 0 0 45px ${activeColor}`
              : `inset 0 0 12px ${activeColor}`,
            opacity: isQuackFever ? 0.95 : isMega ? 0.85 : isDisco ? 0.7 : 0.5,
          }}
        />
      )}

      {/* 2. Four Sweeping Multi-Color Disco Laser Searchlights */}
      {isDisco && (
        <>
          {/* Laser 1: Cyan Left */}
          <div
            className="absolute -top-12 left-8 w-44 h-[600px] origin-top bg-gradient-to-b from-cyan-400/40 via-cyan-400/10 to-transparent blur-sm transition-transform duration-200"
            style={{ transform: `rotate(${isEven ? 38 : 16}deg)` }}
          />
          {/* Laser 2: Magenta Right */}
          <div
            className="absolute -top-12 right-8 w-44 h-[600px] origin-top bg-gradient-to-b from-fuchsia-500/40 via-fuchsia-500/10 to-transparent blur-sm transition-transform duration-200"
            style={{ transform: `rotate(${isEven ? -38 : -16}deg)` }}
          />
          {/* Laser 3: Gold Center-Left (unlocks on mega) */}
          {isMega && (
            <div
              className="absolute -top-12 left-1/3 w-36 h-[600px] origin-top bg-gradient-to-b from-yellow-400/35 via-yellow-400/10 to-transparent blur-sm transition-transform duration-200"
              style={{ transform: `rotate(${!isEven ? 24 : -18}deg)` }}
            />
          )}
          {/* Laser 4: Purple Center-Right (unlocks on mega) */}
          {isMega && (
            <div
              className="absolute -top-12 right-1/3 w-36 h-[600px] origin-top bg-gradient-to-b from-purple-500/35 via-purple-500/10 to-transparent blur-sm transition-transform duration-200"
              style={{ transform: `rotate(${!isEven ? -24 : 18}deg)` }}
            />
          )}
        </>
      )}

      {/* 3. Left & Right Stage Flame / Spark Columns (Shoots up on 146 BPM beats) */}
      {isDisco && (
        <>
          <div className="absolute bottom-12 left-28 sm:left-36 flex flex-col items-center">
            <div
              className={`w-9 rounded-full transition-all duration-100 origin-bottom ${
                isEven
                  ? 'h-32 sm:h-44 bg-gradient-to-t from-orange-500 via-yellow-300 to-transparent shadow-[0_0_30px_#f97316] opacity-90 scale-110'
                  : 'h-6 bg-orange-600/20 opacity-20'
              }`}
            />
            <div className="w-10 h-3 bg-black rounded-full border border-yellow-400 shadow-[0_0_10px_#facc15]" />
          </div>

          <div className="absolute bottom-12 right-28 sm:right-36 flex flex-col items-center">
            <div
              className={`w-9 rounded-full transition-all duration-100 origin-bottom ${
                !isEven
                  ? 'h-32 sm:h-44 bg-gradient-to-t from-pink-500 via-cyan-300 to-transparent shadow-[0_0_30px_#06b6d4] opacity-90 scale-110'
                  : 'h-6 bg-pink-600/20 opacity-20'
              }`}
            />
            <div className="w-10 h-3 bg-black rounded-full border border-cyan-400 shadow-[0_0_10px_#06b6d4]" />
          </div>
        </>
      )}

      {/* 4. Confetti Ribbon Rain */}
      {isFever && (
        <div className="absolute inset-x-0 top-0 h-full overflow-hidden">
          {confettiRibbons.map((c, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: c.left,
                top: isEven ? '6%' : '16%',
                width: `${c.w}px`,
                height: `${c.h}px`,
                backgroundColor: c.color,
                boxShadow: `0 0 12px ${c.color}`,
                transform: `rotate(${(i * 45) + (isEven ? 25 : -25)}deg)`,
                transition: 'all 0.3s ease-out',
                opacity: isMega ? 0.95 : 0.65,
              }}
            />
          ))}
        </div>
      )}

      {/* 5. Quack Fever Gold Sparkle Shower */}
      {isQuackFever && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-400/30 via-transparent to-transparent animate-pulse" />
      )}
    </div>
  );
};