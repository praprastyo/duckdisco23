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
  const isDisco = combo >= 20 || songTime >= 35;
  const isMega = combo >= 45 || songTime >= 65;
  const isQuackFever = combo >= 80 || songTime >= 100;

  const strobeColors = [
    'rgba(6,182,212,0.85)',   // cyan
    'rgba(236,72,153,0.85)',  // magenta
    'rgba(250,204,21,0.9)',   // gold
    'rgba(168,85,247,0.85)',  // purple
  ];
  const activeColor = strobeColors[currentBeat % strobeColors.length];

  // Pure geometric confetti streamers (Zero emojis)
  const confettiRibbons = [
    { left: '6%', color: '#facc15', w: 8, h: 20 },
    { left: '16%', color: '#ec4899', w: 10, h: 16 },
    { left: '26%', color: '#06b6d4', w: 7, h: 22 },
    { left: '38%', color: '#a855f7', w: 9, h: 18 },
    { left: '50%', color: '#f43f5e', w: 11, h: 16 },
    { left: '62%', color: '#10b981', w: 8, h: 20 },
    { left: '74%', color: '#facc15', w: 10, h: 16 },
    { left: '84%', color: '#06b6d4', w: 7, h: 21 },
    { left: '94%', color: '#ec4899', w: 9, h: 17 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-15">
      {/* 1. Pulsating Neon Strobe Border around playfield (turns on at combo >= 10) */}
      {combo >= 10 && (
        <div
          className="absolute inset-0 transition-all duration-75 border-4 sm:border-6 rounded-3xl"
          style={{
            borderColor: activeColor,
            boxShadow: isEven
              ? `inset 0 0 30px ${activeColor}, 0 0 40px ${activeColor}`
              : `inset 0 0 10px ${activeColor}`,
            opacity: isQuackFever ? 0.95 : isMega ? 0.8 : isDisco ? 0.65 : 0.45,
          }}
        />
      )}

      {/* 2. Sweeping Disco Laser Cones across screen */}
      {isDisco && (
        <>
          <div
            className="absolute -top-10 left-10 w-48 h-[550px] origin-top bg-gradient-to-b from-cyan-400/30 via-cyan-400/10 to-transparent blur-md transition-transform duration-300"
            style={{
              transform: isEven ? 'rotate(35deg)' : 'rotate(15deg)',
            }}
          />
          <div
            className="absolute -top-10 right-10 w-48 h-[550px] origin-top bg-gradient-to-b from-fuchsia-500/30 via-fuchsia-500/10 to-transparent blur-md transition-transform duration-300"
            style={{
              transform: isEven ? 'rotate(-35deg)' : 'rotate(-15deg)',
            }}
          />
        </>
      )}

      {/* 3. Confetti Ribbon Rain (bursts when combo >= 20, pure geometric shapes) */}
      {combo >= 20 && (
        <div className="absolute inset-x-0 top-0 h-full overflow-hidden">
          {confettiRibbons.map((c, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: c.left,
                top: isEven ? '6%' : '14%',
                width: `${c.w}px`,
                height: `${c.h}px`,
                backgroundColor: c.color,
                boxShadow: `0 0 10px ${c.color}`,
                transform: `rotate(${(i * 45) + (isEven ? 20 : -20)}deg)`,
                transition: 'all 0.3s ease-out',
                opacity: isMega ? 0.9 : 0.6,
              }}
            />
          ))}
        </div>
      )}

      {/* 4. Quack Fever Gold Sparkle Shower (combo >= 80) */}
      {isQuackFever && (
        <div className="absolute inset-0 bg-yellow-400/20 animate-pulse" />
      )}
    </div>
  );
};