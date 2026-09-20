import React from 'react';

interface BeachPropProps {
  beat: number;
  combo: number;
}

/** Palm trees, hanging disco ball, rig lights and the duck crowd. */
export const BeachProps: React.FC<BeachPropProps> = ({ beat, combo }) => {
  const isEven = beat % 2 === 0;
  const lightsOn = combo >= 10;
  const discoMode = combo >= 50;

  const trees = [
    { x: '4%', scale: 1.0, flip: false },
    { x: '12%', scale: 0.78, flip: true },
    { x: '88%', scale: 1.0, flip: false },
    { x: '79%', scale: 0.78, flip: true },
  ];

  return (
    <>
      {/* Palm trees */}
      {trees.map((t, i) => (
        <div
          key={i}
          className="absolute bottom-[26%]"
          style={{ left: t.x, transform: `scale(${t.scale}) scaleX(${t.flip ? -1 : 1})` }}
        >
          <div className="w-2 h-24 bg-[#78350f] rounded-full mx-auto" />
          <div className="relative -mt-24">
            <div className="w-16 h-4 bg-[#15803d] rounded-full rotate-45" />
            <div className="w-16 h-4 bg-[#16a34a] rounded-full -rotate-45 -mt-2" />
            <div className="w-14 h-3 bg-[#22c55e] rounded-full mt-1" />
          </div>
        </div>
      ))}

      {/* Hanging disco ball */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 flex flex-col items-center">
        <div className="w-0.5 h-8 bg-slate-300/60" />
        <div
          className={`w-16 h-16 rounded-full border border-white/40 ${discoMode ? 'animate-spin-slow' : ''}`}
          style={{
            backgroundImage: `radial-gradient(circle at 40% 35%, #ffffff 0%, ${lightsOn ? '#cbd5e1' : '#64748b'} 40%, #1e293b 100%)`,
            boxShadow: lightsOn ? '0 0 34px rgba(236,72,153,0.75)' : '0 0 16px rgba(148,163,184,0.5)',
          }}
        />
      </div>

      {/* Rig lights — flicker on the beat */}
      {Array.from({ length: 9 }).map((_, i) => {
        const hue = [330, 190, 48, 275, 160][i % 5];
        const on = lightsOn && (isEven ? i % 2 === 0 : i % 2 === 1);
        return (
          <div
            key={i}
            className="absolute top-0 w-3 h-3 rounded-full transition-all duration-100"
            style={{
              left: `${8 + i * 10.5}%`,
              backgroundColor: `hsl(${hue} 95% 62%)`,
              opacity: on ? 1 : lightsOn ? 0.5 : 0.18,
              boxShadow: on ? `0 0 22px hsl(${hue} 95% 62%)` : 'none',
            }}
          />
        );
      })}

      {/* Light beams */}
      {lightsOn && (
        <div className="absolute inset-x-0 top-0 h-[70%] opacity-40">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute top-0 w-40 h-full origin-top transition-transform duration-300"
              style={{
                left: `${22 + i * 26}%`,
                transform: `rotate(${isEven ? -9 + i * 4 : 9 - i * 4}deg)`,
                background: `linear-gradient(to bottom, hsla(${[330, 190, 48][i]} 95% 65% / 0.5), transparent 78%)`,
              }}
            />
          ))}
        </div>
      )}

      {/* Duck crowd */}
      <div className="absolute inset-x-0 bottom-1 flex justify-around items-end opacity-90">
        {Array.from({ length: 11 }).map((_, i) => {
          const jump = isEven ? i % 2 === 0 : i % 2 === 1;
          return (
            <div key={i} className={`transition-transform duration-150 ${jump ? '-translate-y-2' : ''}`}>
              <svg width="26" height="30" viewBox="0 0 26 30">
                <circle cx="13" cy="9" r="7" fill="#111827" />
                <ellipse cx="20" cy="10" rx="4" ry="2" fill="#1f2937" />
                <path d="M 5 18 C 5 14, 21 14, 21 18 L 24 30 L 2 30 Z" fill="#0f172a" />
              </svg>
            </div>
          );
        })}
      </div>
    </>
  );
};