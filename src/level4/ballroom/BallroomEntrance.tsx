import React, { useState } from 'react';

interface BallroomEntranceProps {
  onEnter: () => void;
  onExit?: () => void;
}

export const BallroomEntrance: React.FC<BallroomEntranceProps> = ({ onEnter, onExit }) => {
  const [isOpenAnimation, setIsOpenAnimation] = useState(false);

  const handleEnterClick = () => {
    if (isOpenAnimation) return;
    setIsOpenAnimation(true);
    setTimeout(() => {
      onEnter();
    }, 1400);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#070312] overflow-hidden flex flex-col items-center justify-between p-6 select-none">
      {/* Top Exit button */}
      <div className="w-full max-w-5xl flex justify-between items-center z-30">
        {onExit && (
          <button
            onClick={onExit}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono-rhythm text-white/80 transition-colors cursor-pointer"
          >
            ← EXIT TO MENU
          </button>
        )}
        <div className="text-right">
          <span className="text-[10px] font-mono-rhythm text-yellow-400 font-bold tracking-widest block uppercase">
            GRAND FINALE • LEVEL 4
          </span>
          <span className="text-xs font-disco text-white/70">
            THE DISCO BALLROOM
          </span>
        </div>
      </div>

      {/* Main Doorway Stage */}
      <div className={`relative w-full max-w-2xl h-[480px] sm:h-[540px] flex items-center justify-center transition-transform duration-1000 ${
        isOpenAnimation ? 'scale-125 opacity-0' : 'scale-100 opacity-100'
      }`}>
        {/* Leaking Disco Lights from Doors */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-72 h-72 rounded-full bg-cyan-500/20 blur-3xl animate-pulse" />
          <div className="w-64 h-64 rounded-full bg-fuchsia-500/20 blur-3xl animate-pulse delay-700" />
          <div className="w-80 h-80 rounded-full bg-amber-500/15 blur-3xl animate-pulse delay-300" />
        </div>

        {/* Door Frame Arch */}
        <div className="relative w-[340px] sm:w-[420px] h-[460px] sm:h-[500px] border-8 border-amber-500/80 rounded-t-full bg-black/90 shadow-[0_0_50px_rgba(245,158,11,0.4)] overflow-hidden flex">
          {/* Left Door Leaf */}
          <div
            className={`w-1/2 h-full bg-gradient-to-b from-[#1e1b4b] to-[#0f172a] border-r-2 border-amber-400/40 p-4 flex flex-col justify-between transition-transform duration-1000 ease-in-out ${
              isOpenAnimation ? '-translate-x-full' : 'translate-x-0'
            }`}
          >
            <div className="w-full h-24 border-2 border-amber-400/20 rounded-t-full bg-cyan-500/10 backdrop-blur-sm flex items-center justify-center">
              <span className="text-2xl animate-pulse">🪩</span>
            </div>
            <div className="self-end my-auto w-3 h-10 rounded-full bg-amber-400 shadow-lg" />
            <div className="w-full h-32 border-2 border-amber-400/20 rounded-md bg-amber-500/5" />
          </div>

          {/* Right Door Leaf */}
          <div
            className={`w-1/2 h-full bg-gradient-to-b from-[#1e1b4b] to-[#0f172a] border-l-2 border-amber-400/40 p-4 flex flex-col justify-between transition-transform duration-1000 ease-in-out ${
              isOpenAnimation ? 'translate-x-full' : 'translate-x-0'
            }`}
          >
            <div className="w-full h-24 border-2 border-amber-400/20 rounded-t-full bg-fuchsia-500/10 backdrop-blur-sm flex items-center justify-center">
              <span className="text-2xl animate-pulse delay-500">✨</span>
            </div>
            <div className="self-start my-auto w-3 h-10 rounded-full bg-amber-400 shadow-lg" />
            <div className="w-full h-32 border-2 border-amber-400/20 rounded-md bg-amber-500/5" />
          </div>

          {/* Golden Disco Beam escaping vertical slit */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-yellow-300 via-amber-400 to-rose-400 shadow-[0_0_15px_#facc15] animate-pulse pointer-events-none" />
        </div>
      </div>

      {/* CTA Button */}
      <div className="relative z-30 pb-6 text-center">
        <button
          onClick={handleEnterClick}
          disabled={isOpenAnimation}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-disco text-base sm:text-lg font-bold tracking-widest uppercase shadow-[0_0_35px_rgba(250,204,21,0.7)] hover:shadow-[0_0_50px_rgba(250,204,21,0.9)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          {isOpenAnimation ? 'OPENING DOORS...' : '🚪 ENTER THE BALLROOM'}
        </button>
        <p className="mt-3 text-xs font-mono-rhythm text-white/50 tracking-wider">
          Turn up your speakers for the disco experience
        </p>
      </div>
    </div>
  );
};
