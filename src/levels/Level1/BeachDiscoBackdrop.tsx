import React from 'react';
import { BeachProps } from './BeachProps';

interface BeachDiscoBackdropProps {
  beat: number;
  combo: number;
  intensity?: number;
}

/**
 * Sunset Duck Beach Party backdrop.
 * Reacts to the beat with stage-light flicker and escalates with combo tier:
 *   10+ -> beach lights on, 25+ -> neon wash, 50+ -> full beach disco mode.
 */
export const BeachDiscoBackdrop: React.FC<BeachDiscoBackdropProps> = ({ beat, combo, intensity = 0.35 }) => {
  const isEven = beat % 2 === 0;
  const neonMode = combo >= 25;
  const discoMode = combo >= 50;

  const skyTop = neonMode ? '#1b0640' : '#2d1050';
  const skyMid = neonMode ? '#7a1f6b' : '#9b2c5a';
  const groundGlow = discoMode ? 'rgba(236,72,153,0.45)' : 'rgba(250,204,21,0.28)';

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Sunset sky */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, ${skyTop} 0%, ${skyMid} 42%, #f97316 68%, #facc15 84%, #fde68a 100%)`,
        }}
      />

      {/* Setting sun */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[34%]">
        <div className="w-28 h-28 rounded-full bg-gradient-to-t from-yellow-300 via-orange-400 to-amber-200 opacity-90" />
      </div>

      {/* Ocean band */}
      <div className="absolute inset-x-0 top-[62%] h-[14%] bg-gradient-to-b from-[#0e7490] to-[#0ea5e9] opacity-80">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="absolute h-px bg-white/40"
            style={{ left: `${i * 22}%`, width: '18%', top: `${20 + i * 14}%` }}
          />
        ))}
      </div>

      {/* Sand floor with bass pulse */}
      <div className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-[#b45309] via-[#d97706] to-[#facc15]">
        <div
          className="absolute inset-0 transition-opacity duration-150"
          style={{ background: groundGlow, opacity: isEven ? 0.55 : 0.25 }}
        />
      </div>

      <BeachProps beat={beat} combo={combo} />

      {/* Disco-mode sparkle overlay */}
      {discoMode && (
        <div
          className="absolute inset-0 opacity-30 mix-blend-screen"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 30%, #ec4899 0%, transparent 35%), radial-gradient(circle at 80% 60%, #06b6d4 0%, transparent 35%)',
          }}
        />
      )}

      {/* Vignette + subtle grain */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.65) 100%)' }}
      />
      <div className="absolute inset-0 disco-grid-bg" style={{ opacity: intensity * 0.12 }} />
    </div>
  );
};