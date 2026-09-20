import React from 'react';

interface CrowdSilhouettesProps {
  currentBeat?: number;
  combo?: number;
}

export const CrowdSilhouettes: React.FC<CrowdSilhouettesProps> = ({ currentBeat = 0, combo = 0 }) => {
  const isEvenBeat = currentBeat % 2 === 0;
  const isFever = combo >= 10;

  // 7 animated duck silhouettes across the bottom
  const ducks = [
    { id: 1, x: '8%', height: 75, delay: 0, glow: '#ec4899', hasStick: true },
    { id: 2, x: '22%', height: 90, delay: 1, glow: '#06b6d4', hasStick: false },
    { id: 3, x: '35%', height: 80, delay: 0, glow: '#facc15', hasStick: true },
    { id: 4, x: '50%', height: 95, delay: 1, glow: '#a855f7', hasStick: false },
    { id: 5, x: '65%', height: 85, delay: 0, glow: '#06b6d4', hasStick: true },
    { id: 6, x: '78%', height: 90, delay: 1, glow: '#ec4899', hasStick: false },
    { id: 7, x: '92%', height: 75, delay: 0, glow: '#facc15', hasStick: true },
  ];

  return (
    <div className="absolute inset-x-0 bottom-0 h-24 sm:h-28 overflow-hidden pointer-events-none z-10 select-none">
      {/* Dark gradient base */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black via-black/80 to-transparent" />

      {ducks.map((d) => {
        const jump = (isEvenBeat ? d.delay === 0 : d.delay === 1) ? (isFever ? '-translate-y-6 rotate-3' : '-translate-y-3') : 'translate-y-0';
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
                  boxShadow: `0 0 10px ${d.glow}`,
                  transform: isEvenBeat ? 'rotate(25deg)' : 'rotate(-25deg)',
                }}
              />
            )}

            {/* Stylized Duck Silhouette Head & Beak */}
            <svg
              width="50"
              height={d.height}
              viewBox="0 0 50 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]"
            >
              {/* Silhouette Head */}
              <circle cx="25" cy="22" r="15" fill="#0c0717" stroke="#3b1b54" strokeWidth="1" />
              {/* Beak profile */}
              <ellipse cx="37" cy="24" rx="8" ry="4" fill="#140b24" />
              {/* Sunglasses shine if high combo */}
              {isFever && (
                <rect x="20" y="18" width="16" height="5" rx="2" fill={d.glow} opacity="0.8" />
              )}
              {/* Duck Body Silhouette */}
              <path d="M 10 38 C 10 30, 40 30, 40 38 L 48 80 L 2 80 Z" fill="#08040f" />
            </svg>
          </div>
        );
      })}
    </div>
  );
};
