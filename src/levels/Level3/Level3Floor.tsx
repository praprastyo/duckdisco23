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
  bpm: _bpm,
  currentBeat,
  energy,
  combo: _combo,
  isSpecialFinish = false,
}) => {
  const isPart2 = currentSectionId === 'part-2';
  const isPart3 = currentSectionId === 'part-3';
  const isEvenBeat = currentBeat % 2 === 0;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* 1. Deep Nightclub Gradient Atmosphere */}
      <div
        className="absolute inset-0 transition-colors duration-700"
        style={{
          background: isPart2
            ? 'radial-gradient(ellipse at 50% 50%, #15082a 0%, #06020c 75%, #000000 100%)'
            : isPart3
            ? 'radial-gradient(ellipse at 50% 45%, #2a0845 0%, #120326 65%, #05010d 100%)'
            : 'radial-gradient(ellipse at 50% 50%, #1a0b2e 0%, #0a0418 70%, #03010a 100%)',
        }}
      />

      {/* 2. Full-Stage Glowing Disco Floor Grid Tiles */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{ opacity: isPart2 ? 0.25 : isPart3 ? 0.65 : 0.4 }}
      >
        <div
          className={`w-full h-full transition-all duration-200 ${
            currentBeat % 4 === 0
              ? 'bg-[radial-gradient(#ec4899_2px,transparent_2px)] [background-size:36px_36px]'
              : currentBeat % 4 === 1
              ? 'bg-[radial-gradient(#06b6d4_2px,transparent_2px)] [background-size:36px_36px]'
              : currentBeat % 4 === 2
              ? 'bg-[radial-gradient(#facc15_2px,transparent_2px)] [background-size:36px_36px]'
              : 'bg-[radial-gradient(#a855f7_2px,transparent_2px)] [background-size:36px_36px]'
          }`}
        />
      </div>

      {/* 3. Central Circular Dance Stage / Light Podium Beneath DJ Quack */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-80 sm:w-[460px] h-48 sm:h-72 rounded-[100%] blur-3xl transition-transform duration-150"
          style={{
            transform: `scale(${1 + energy.bass * 0.35})`,
            background: isSpecialFinish
              ? 'radial-gradient(ellipse, rgba(250,204,21,0.7) 0%, rgba(236,72,153,0.3) 60%, transparent 80%)'
              : isPart3
              ? 'radial-gradient(ellipse, rgba(236,72,153,0.5) 0%, rgba(6,182,212,0.3) 50%, transparent 80%)'
              : isPart2
              ? 'radial-gradient(ellipse, rgba(168,85,247,0.35) 0%, transparent 75%)'
              : 'radial-gradient(ellipse, rgba(6,182,212,0.4) 0%, rgba(236,72,153,0.2) 60%, transparent 80%)',
          }}
        />

        {/* Concentric Dance Floor Disc Rings */}
        <div
          className="absolute w-64 sm:w-88 h-28 sm:h-40 rounded-[100%] border-2 transition-all duration-200"
          style={{
            borderColor: isPart2 ? 'rgba(168,85,247,0.4)' : isPart3 ? 'rgba(250,204,21,0.6)' : 'rgba(6,182,212,0.5)',
            transform: `translateY(40px) scale(${isEvenBeat ? 1.03 : 1.0})`,
            boxShadow: isPart3 ? '0 0 35px rgba(236,72,153,0.5)' : '0 0 20px rgba(6,182,212,0.35)',
          }}
        />
        <div
          className="absolute w-44 sm:w-60 h-20 sm:h-28 rounded-[100%] border border-dashed transition-all duration-200"
          style={{
            borderColor: isEvenBeat ? '#facc15' : '#ec4899',
            transform: `translateY(40px) scale(${isEvenBeat ? 1.0 : 1.04})`,
            opacity: 0.6 + energy.bass * 0.4,
          }}
        />
      </div>

      {/* 4. Overhead Sweeping Spotlights */}
      <div
        className="absolute -top-10 left-1/2 -translate-x-1/2 w-80 sm:w-[500px] h-[400px] blur-2xl transition-transform duration-300"
        style={{
          transform: `translateX(-50%) rotate(${Math.sin(currentBeat * 0.35) * (isPart2 ? 6 : 18)}deg) scale(${1 + energy.bass * 0.3})`,
          background: isPart2
            ? 'conic-gradient(from 180deg at 50% 0%, rgba(168,85,247,0.25) 0deg, transparent 55deg)'
            : isPart3
            ? 'conic-gradient(from 180deg at 50% 0%, rgba(250,204,21,0.4) 0deg, rgba(236,72,153,0.3) 40deg, transparent 70deg)'
            : 'conic-gradient(from 180deg at 50% 0%, rgba(6,182,212,0.3) 0deg, rgba(236,72,153,0.2) 35deg, transparent 65deg)',
        }}
      />

      {/* 5. Stage Lasers (Part 1 and Part 3) */}
      {!isPart2 && (
        <>
          <div
            className="absolute top-0 left-1/6 w-1 h-[150%] origin-top bg-cyan-400 blur-[1px] shadow-[0_0_15px_#06b6d4] transition-transform duration-100"
            style={{ transform: `rotate(${Math.sin(currentBeat * 0.5) * 35 - 20}deg)`, opacity: 0.3 + energy.high * 0.7 }}
          />
          <div
            className="absolute top-0 right-1/6 w-1 h-[150%] origin-top bg-fuchsia-400 blur-[1px] shadow-[0_0_15px_#ec4899] transition-transform duration-100"
            style={{ transform: `rotate(${Math.cos(currentBeat * 0.5) * 35 + 20}deg)`, opacity: 0.3 + energy.high * 0.7 }}
          />
        </>
      )}
    </div>
  );
};

