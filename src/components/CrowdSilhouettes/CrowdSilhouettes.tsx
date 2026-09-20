import React from 'react';

interface CrowdSilhouettesProps {
  currentBeat?: number;
  combo?: number;
}

export const CrowdSilhouettes: React.FC<CrowdSilhouettesProps> = ({ currentBeat = 0, combo = 0 }) => {
  const isEvenBeat = currentBeat % 2 === 0;
  const isFever = combo >= 10;
  const isMega = combo >= 30;
  const isUltra = combo >= 60;

  // Front row crowd ducks (11 ducks)
  const frontDucks = [
    { id: 1, x: '4%', height: 75, delay: 0, glow: '#ec4899', hasStick: true },
    { id: 2, x: '13%', height: 85, delay: 1, glow: '#06b6d4', hasStick: isMega },
    { id: 3, x: '22%', height: 90, delay: 0, glow: '#facc15', hasStick: true },
    { id: 4, x: '31%', height: 80, delay: 1, glow: '#a855f7', hasStick: isFever },
    { id: 5, x: '40%', height: 95, delay: 0, glow: '#ec4899', hasStick: true },
    { id: 6, x: '50%', height: 85, delay: 1, glow: '#06b6d4', hasStick: true },
    { id: 7, x: '59%', height: 90, delay: 0, glow: '#facc15', hasStick: isFever },
    { id: 8, x: '68%', height: 80, delay: 1, glow: '#a855f7', hasStick: true },
    { id: 9, x: '77%', height: 95, delay: 0, glow: '#ec4899', hasStick: isMega },
    { id: 10, x: '86%', height: 85, delay: 1, glow: '#06b6d4', hasStick: true },
    { id: 11, x: '95%', height: 75, delay: 0, glow: '#facc15', hasStick: true },
  ];

  // Back row background crowd (adds depth and dense atmosphere)
  const backDucks = [
    { id: 101, x: '9%', height: 60, delay: 1, glow: '#38bdf8' },
    { id: 102, x: '27%', height: 65, delay: 0, glow: '#f43f5e' },
    { id: 103, x: '45%', height: 68, delay: 1, glow: '#eab308' },
    { id: 104, x: '63%', height: 62, delay: 0, glow: '#a855f7' },
    { id: 105, x: '82%', height: 66, delay: 1, glow: '#06b6d4' },
  ];

  return (
    <div className="absolute inset-x-0 bottom-0 h-28 sm:h-36 overflow-hidden pointer-events-none z-10 select-none">
      {/* Dark gradient base */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black via-black/85 to-transparent" />

      {/* Back row layer (visible on combo >= 5) */}
      {combo >= 5 &&
        backDucks.map((d) => {
          const jump = (isEvenBeat ? d.delay === 0 : d.delay === 1) ? '-translate-y-4' : 'translate-y-0';
          return (
            <div
              key={d.id}
              className={`absolute bottom-2 flex flex-col items-center opacity-40 transition-all duration-150 ease-out ${jump}`}
              style={{ left: d.x }}
            >
              <div
                className="w-1 h-6 rounded-full mb-0.5"
                style={{ backgroundColor: d.glow, boxShadow: `0 0 6px ${d.glow}` }}
              />
              <svg width="36" height={d.height} viewBox="0 0 50 80" fill="none">
                <circle cx="25" cy="22" r="14" fill="#090514" />
                <ellipse cx="37" cy="24" rx="7" ry="3.5" fill="#140b24" />
                <path d="M 10 38 C 10 30, 40 30, 40 38 L 48 80 L 2 80 Z" fill="#06020c" />
              </svg>
            </div>
          );
        })}

      {/* Front row ducks */}
      {frontDucks.map((d) => {
        const jump = (isEvenBeat ? d.delay === 0 : d.delay === 1)
          ? isUltra
            ? '-translate-y-8 rotate-6 scale-110'
            : isMega
            ? '-translate-y-6 rotate-3'
            : isFever
            ? '-translate-y-4'
            : '-translate-y-2'
          : 'translate-y-0';

        return (
          <div
            key={d.id}
            className={`absolute bottom-0 flex flex-col items-center transition-all duration-150 ease-out ${jump}`}
            style={{ left: d.x }}
          >
            {/* Waving glowstick */}
            {d.hasStick && (
              <div
                className="w-1.5 h-8 rounded-full mb-1 transition-transform duration-100"
                style={{
                  backgroundColor: d.glow,
                  boxShadow: `0 0 12px ${d.glow}`,
                  transform: isEvenBeat ? 'rotate(28deg)' : 'rotate(-28deg)',
                }}
              />
            )}

            {/* Stylized Duck Silhouette Head & Sunglasses */}
            <svg
              width="46"
              height={d.height}
              viewBox="0 0 50 80"
              fill="none"
              className="drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]"
            >
              <circle cx="25" cy="22" r="15" fill="#0c0717" stroke="#3b1b54" strokeWidth="1" />
              <ellipse cx="37" cy="24" rx="8" ry="4" fill="#140b24" />
              {isFever && (
                <rect x="18" y="18" width="18" height="5.5" rx="2" fill={d.glow} opacity="0.9" />
              )}
              <path d="M 10 38 C 10 30, 40 30, 40 38 L 48 80 L 2 80 Z" fill="#08040f" />
            </svg>
          </div>
        );
      })}
    </div>
  );
};
