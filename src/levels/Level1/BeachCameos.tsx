import React from 'react';

interface BeachCameosProps {
  beat: number;
  combo: number;
  isHit?: boolean;
}

export const BeachCameos: React.FC<BeachCameosProps> = ({ beat, combo, isHit }) => {
  const isEven = beat % 2 === 0;
  const isFever = combo >= 15;

  // Surfer duck travels across ocean based on beat
  const surferLeft = `${((beat * 8) % 110) - 10}%`;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10">
      {/* 1. 🕊️ Disco Seagulls Flying Across Sky */}
      <div
        className="absolute top-10 flex gap-12 transition-all duration-700 ease-linear"
        style={{ left: `${((beat * 6) % 120) - 20}%` }}
      >
        <div className={`flex items-center gap-1 ${isEven ? '-translate-y-2 rotate-6' : 'translate-y-2 -rotate-6'}`}>
          <span className="text-xl">🕊️</span>
          <span className="text-[10px] -ml-2 mb-2">🕶️</span>
          <span className="text-xs text-yellow-300 animate-ping">✨</span>
        </div>
        <div className={`flex items-center gap-1 ${!isEven ? '-translate-y-3' : 'translate-y-1'}`}>
          <span className="text-base">🕊️</span>
          <span className="text-[9px] -ml-1.5 mb-1.5">🕶️</span>
        </div>
      </div>

      {/* 2. 🏄 Surfer Duck Riding Ocean Waves */}
      <div
        className="absolute top-[63%] transition-all duration-300 ease-out"
        style={{ left: surferLeft }}
      >
        <div className={`flex flex-col items-center ${isEven ? '-translate-y-4 rotate-12 scale-110' : 'translate-y-0 -rotate-6'}`}>
          {/* Sailor Donald Surfer duck */}
          <div className="relative flex flex-col items-center">
            <span className="text-[10px] -mb-1">🧢</span>
            <span className="text-2xl filter drop-shadow">🦆</span>
            <span className="text-[8px] -mt-1">🎀</span>
            <span className="absolute top-2 right-0 text-[9px]">🕶️</span>
          </div>
          {/* Surfboard with splash */}
          <div className="w-14 h-2 rounded-full bg-gradient-to-r from-pink-500 via-yellow-400 to-cyan-400 border border-white -mt-1 shadow-[0_0_10px_#06b6d4] flex items-center justify-between px-1">
            <span className="text-[8px] animate-bounce">💦</span>
            <span className="text-[8px] animate-bounce">🌊</span>
          </div>
        </div>
      </div>

      {/* 3. 📸 Paparazzi Duck on Bottom Left with Camera Flashes */}
      <div className="absolute bottom-2 left-2 sm:left-6 flex flex-col items-center">
        {/* Camera Flash Strobe */}
        <div
          className={`absolute -top-8 -right-4 w-20 h-20 rounded-full bg-white blur-xl pointer-events-none transition-opacity duration-75 ${
            isEven || isHit ? 'opacity-90 scale-125' : 'opacity-0'
          }`}
        />
        <div className={`flex items-end ${isEven ? 'scale-105' : 'scale-95'}`}>
          {/* Sailor Duck with Camera */}
          <div className="relative flex flex-col items-center">
            <span className="text-[10px] -mb-1">🧢</span>
            <span className="text-3xl">🦆</span>
            <span className="text-[9px] -mt-1">🎀</span>
            <span className="absolute top-1 right-0 text-base animate-pulse">📸</span>
          </div>
        </div>
        <span className="text-[8px] font-mono-rhythm text-yellow-300 bg-black/60 px-1.5 py-0.2 rounded-full font-bold">
          PAPARAZZI
        </span>
      </div>

      {/* 4. 🍹 Coconut Drink Barista Duck on Bottom Right */}
      <div className="absolute bottom-2 right-2 sm:right-6 flex flex-col items-center">
        <div className={`flex items-end ${!isEven ? 'scale-110 -rotate-6' : 'scale-100 rotate-6'}`}>
          <div className="relative flex flex-col items-center">
            <span className="text-[10px] -mb-1">🧢</span>
            <span className="text-3xl">🦆</span>
            <span className="text-[9px] -mt-1">🎀</span>
            <span className="absolute -top-1 left-0 text-lg animate-bounce">🍹</span>
          </div>
        </div>
        <span className="text-[8px] font-mono-rhythm text-cyan-300 bg-black/60 px-1.5 py-0.2 rounded-full font-bold">
          BEACH BAR
        </span>
      </div>


      {/* 5. 🕶️ Club Bouncer Security Duck (appears when combo >= 10) */}
      {combo >= 10 && (
        <div className="absolute bottom-16 left-4 sm:left-14 flex flex-col items-center animate-fadeIn">
          <div className={`flex flex-col items-center ${isEven ? 'translate-y-1' : '-translate-y-2'}`}>
            <span className="text-4xl filter drop-shadow">🦆</span>
            <div className="w-10 h-6 -mt-3 bg-black rounded-lg border border-yellow-400 flex items-center justify-center">
              <span className="text-[7px] font-bold text-yellow-300">SECURITY</span>
            </div>
          </div>
        </div>
      )}

      {/* 6. 🥳 VIP Beach Party Duck (appears when combo >= 25) */}
      {isFever && (
        <div className="absolute bottom-16 right-4 sm:right-14 flex flex-col items-center animate-bounce">
          <span className="text-3xl">🦆</span>
          <span className="text-sm -mt-2">👑</span>
          <span className="text-[8px] font-bold text-fuchsia-300 bg-black/70 px-1 rounded-full">VIP DUCK</span>
        </div>
      )}
    </div>
  );
};
