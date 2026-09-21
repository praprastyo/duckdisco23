import React from 'react';
import { EnergyData } from '../../audio/AudioAnalyser';

interface Level3FloorProps {
  currentSectionId: string;
  bpm: number;
  currentBeat: number;
  energy: EnergyData;
  combo: number;
  isSpecialFinish?: boolean;
}

export const Level3Floor: React.FC<Level3FloorProps> = ({
  currentSectionId,
  bpm,
  currentBeat,
  energy,
  combo: _combo,
  isSpecialFinish = false,
}) => {
  const isPart2 = currentSectionId === 'part-2';
  const isPart3 = currentSectionId === 'part-3';
  const stageOpacity = isPart2 ? 'opacity-35' : isPart3 ? 'opacity-95' : 'opacity-65';

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* 1. Ambient Lighting */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${stageOpacity}`}
        style={{
          background: isPart2
            ? 'radial-gradient(ellipse at 50% 60%, rgba(30,10,60,0.85) 0%, #05020c 80%)'
            : isPart3
            ? 'radial-gradient(ellipse at 50% 50%, rgba(76,29,149,0.7) 0%, rgba(13,4,30,0.95) 75%)'
            : 'radial-gradient(ellipse at 50% 50%, rgba(24,10,48,0.7) 0%, #080315 80%)',
        }}
      />

      {/* 2. Spotlights & Lasers */}
      <div className="absolute top-0 inset-x-0 h-96 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-64 sm:w-96 h-full blur-xl transition-all duration-300"
          style={{
            background: isPart2
              ? 'conic-gradient(from 180deg at 50% 0%, rgba(168,85,247,0.3) 0deg, transparent 60deg)'
              : isPart3
              ? 'conic-gradient(from 180deg at 50% 0%, rgba(250,204,21,0.45) 0deg, rgba(236,72,153,0.35) 45deg, transparent 75deg)'
              : 'conic-gradient(from 180deg at 50% 0%, rgba(6,182,212,0.35) 0deg, rgba(236,72,153,0.2) 40deg, transparent 65deg)',
            transform: `translateX(-50%) rotate(${Math.sin(currentBeat * 0.4) * (isPart2 ? 4 : 16)}deg) scale(${1 + energy.bass * 0.35})`,
          }}
        />
        {!isPart2 && (
          <>
            <div
              className="absolute top-0 left-1/4 w-1 h-[140%] origin-top bg-cyan-400 blur-[1px] shadow-[0_0_12px_#06b6d4] transition-transform duration-150"
              style={{ transform: `rotate(${Math.sin(currentBeat * 0.6) * 35 - 15}deg)`, opacity: 0.4 + energy.high * 0.6 }}
            />
            <div
              className="absolute top-0 right-1/4 w-1 h-[140%] origin-top bg-fuchsia-400 blur-[1px] shadow-[0_0_12px_#ec4899] transition-transform duration-150"
              style={{ transform: `rotate(${Math.cos(currentBeat * 0.6) * 35 + 15}deg)`, opacity: 0.4 + energy.high * 0.6 }}
            />
          </>
        )}
      </div>

      {/* 3. Disco Dance Floor */}
      <div className="absolute bottom-0 inset-x-0 h-48 sm:h-60 overflow-hidden [perspective:600px]">
        <div
          className="w-full h-full origin-bottom transition-all duration-150"
          style={{
            transform: 'rotateX(58deg)',
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,${0.08 + energy.bass * 0.15}) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,${0.08 + energy.bass * 0.15}) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            backgroundColor: isPart2 ? '#090414' : isPart3 ? (currentBeat % 2 === 0 ? '#19072e' : '#230940') : (currentBeat % 2 === 0 ? '#0f0822' : '#080518'),
          }}
        >
          <div
            className="absolute inset-0 rounded-full blur-2xl transition-all"
            style={{
              background: isSpecialFinish
                ? 'radial-gradient(circle, rgba(250,204,21,0.6) 0%, transparent 70%)'
                : isPart3
                ? 'radial-gradient(circle, rgba(236,72,153,0.4) 0%, rgba(6,182,212,0.2) 50%, transparent 80%)'
                : 'radial-gradient(circle, rgba(6,182,212,0.25) 0%, transparent 60%)',
              transform: `scale(${1 + energy.bass * 0.4})`,
            }}
          />
        </div>
      </div>

      {/* 4. DJ Turntable Booth */}
      <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 w-72 sm:w-88 h-14 bg-gradient-to-b from-gray-900 via-gray-950 to-black border-t-2 border-cyan-400/50 rounded-t-xl shadow-2xl flex items-center justify-between px-6 z-10">
        <div className="w-10 h-10 rounded-full bg-black border-2 border-yellow-400/80 relative flex items-center justify-center shadow-lg">
          <div className="w-4 h-4 rounded-full bg-cyan-400 animate-spin" style={{ animationDuration: `${60 / Math.max(60, bpm)}s` }} />
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-black/60 rounded-md border border-white/10">
          <span className={`w-1.5 h-1.5 rounded-full ${energy.bass > 0.4 ? 'bg-rose-500 shadow-[0_0_6px_#f43f5e]' : 'bg-rose-900'}`} />
          <span className={`w-1.5 h-1.5 rounded-full ${energy.mid > 0.3 ? 'bg-amber-400 shadow-[0_0_6px_#f59e0b]' : 'bg-amber-900'}`} />
          <span className={`w-1.5 h-1.5 rounded-full ${energy.high > 0.3 ? 'bg-emerald-400 shadow-[0_0_6px_#10b981]' : 'bg-emerald-900'}`} />
          <span className="text-[9px] font-mono-rhythm text-white/50 ml-1">{bpm} BPM</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-black border-2 border-fuchsia-400/80 relative flex items-center justify-center shadow-lg">
          <div className="w-4 h-4 rounded-full bg-pink-400 animate-spin" style={{ animationDuration: `${60 / Math.max(60, bpm)}s` }} />
        </div>
      </div>
    </div>
  );
};
