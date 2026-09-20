import React from 'react';

interface DiscoBallProps {
  highEnergy?: number;
  bassEnergy?: number;
}

export const DiscoBall: React.FC<DiscoBallProps> = ({ highEnergy = 0.2, bassEnergy = 0.2 }) => {
  const glowIntensity = Math.min(1, 0.3 + highEnergy * 0.7);
  const scale = 1 + bassEnergy * 0.08;

  return (
    <div
      className="absolute top-0 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center select-none"
      style={{ transform: `translateX(-50%) scale(${scale})`, transition: 'transform 75ms ease-out' }}
    >
      {/* Hanging metallic chain */}
      <div className="w-0.5 h-10 sm:h-16 bg-gradient-to-b from-slate-400 via-slate-200 to-slate-400 opacity-70" />

      {/* Disco Ball Sphere */}
      <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden shadow-[0_0_50px_rgba(236,72,153,0.4)] border border-white/20">
        {/* Rotating Facet Grid */}
        <div
          className="absolute inset-0 animate-spin-slow bg-gradient-to-br from-slate-200 via-slate-400 to-slate-900 opacity-95"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 50%, rgba(255,255,255,0.9) 0%, transparent 60%),
              repeating-linear-gradient(0deg, rgba(255,255,255,0.4) 0px, rgba(255,255,255,0.4) 2px, transparent 2px, transparent 8px),
              repeating-linear-gradient(90deg, rgba(200,200,220,0.5) 0px, rgba(200,200,220,0.5) 2px, transparent 2px, transparent 8px)
            `,
            backgroundSize: '100% 100%, 8px 8px, 8px 8px',
          }}
        />

        {/* Ambient Spherical Highlight Shading */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/60 via-transparent to-white/70 pointer-events-none" />

        {/* Dynamic Center Flash on high energy */}
        <div
          className="absolute inset-0 rounded-full bg-white transition-opacity duration-100 pointer-events-none"
          style={{ opacity: highEnergy > 0.4 ? highEnergy * 0.6 : 0 }}
        />
      </div>

      {/* Sweeping Ray Sprays */}
      <div
        className="absolute top-16 w-80 sm:w-[500px] h-80 sm:h-[500px] rounded-full pointer-events-none -z-10 animate-spin-slow"
        style={{
          background: `conic-gradient(from 0deg, rgba(236,72,153,${glowIntensity * 0.25}), transparent 60deg, rgba(6,182,212,${glowIntensity * 0.25}) 120deg, transparent 180deg, rgba(250,204,21,${glowIntensity * 0.25}) 240deg, transparent 300deg, rgba(236,72,153,${glowIntensity * 0.25}) 360deg)`,
          filter: 'blur(16px)',
        }}
      />
    </div>
  );
};
