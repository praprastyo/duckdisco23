import React, { useState } from 'react';

interface BallroomEntranceProps {
  onEnter: () => void;
  onExit?: () => void;
}

export const BallroomEntrance: React.FC<BallroomEntranceProps> = ({ onEnter, onExit }) => {
  const [stage, setStage] = useState<'closed' | 'unlocking' | 'opening' | 'entered'>('closed');

  const handleEnterClick = () => {
    if (stage !== 'closed') return;
    setStage('unlocking');

    setTimeout(() => {
      setStage('opening');
    }, 700);

    setTimeout(() => {
      setStage('entered');
    }, 2200);

    setTimeout(() => {
      onEnter();
    }, 2600);
  };

  const isOpeningOrEntered = stage === 'opening' || stage === 'entered';

  return (
    <div className="relative w-full min-h-screen bg-[#070312] overflow-hidden flex flex-col items-center justify-between p-4 sm:p-6 select-none">
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

      {/* Main Doorway Stage with Camera Zoom Push */}
      <div
        className={`relative w-full max-w-2xl h-[480px] sm:h-[540px] flex items-center justify-center transition-all duration-1000 ease-in-out ${
          stage === 'entered'
            ? 'scale-150 opacity-0'
            : stage === 'opening'
            ? 'scale-110 opacity-100'
            : 'scale-100 opacity-100'
        }`}
      >
        {/* Leaking Disco Lights Behind Doors */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className={`w-80 h-80 rounded-full bg-cyan-500/25 blur-3xl transition-opacity duration-700 ${
              isOpeningOrEntered ? 'opacity-90 scale-125' : 'opacity-40 animate-pulse'
            }`}
          />
          <div
            className={`w-72 h-72 rounded-full bg-fuchsia-500/25 blur-3xl transition-opacity duration-700 ${
              isOpeningOrEntered ? 'opacity-90 scale-125' : 'opacity-40 animate-pulse delay-500'
            }`}
          />
          <div
            className={`w-96 h-96 rounded-full bg-amber-500/20 blur-3xl transition-opacity duration-700 ${
              isOpeningOrEntered ? 'opacity-100 scale-135' : 'opacity-30'
            }`}
          />
        </div>

        {/* Door Frame Arch */}
        <div className="relative w-[340px] sm:w-[430px] h-[460px] sm:h-[510px] border-8 border-amber-500/80 rounded-t-full bg-black/95 shadow-[0_0_60px_rgba(245,158,11,0.45)] overflow-hidden flex">
          {/* Left Door Leaf */}
          <div
            className={`w-1/2 h-full bg-gradient-to-b from-[#18153d] to-[#0a0f1d] border-r-2 border-amber-400/40 p-4 flex flex-col justify-between transition-transform duration-1000 ease-in-out ${
              isOpeningOrEntered ? '-translate-x-full' : 'translate-x-0'
            }`}
          >
            <div className="w-full h-28 border-2 border-amber-400/25 rounded-t-full bg-cyan-500/10 backdrop-blur-sm flex items-center justify-center relative overflow-hidden">
              <span className="text-2xl animate-pulse">🪩</span>
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-40">
                <span className="text-xl">🕺</span>
              </div>
            </div>
            <div className="self-end my-auto w-3.5 h-12 rounded-full bg-amber-400 shadow-[0_0_10px_#facc15]" />
            <div className="w-full h-28 border-2 border-amber-400/20 rounded-md bg-amber-500/5" />
          </div>

          {/* Right Door Leaf */}
          <div
            className={`w-1/2 h-full bg-gradient-to-b from-[#18153d] to-[#0a0f1d] border-l-2 border-amber-400/40 p-4 flex flex-col justify-between transition-transform duration-1000 ease-in-out ${
              isOpeningOrEntered ? 'translate-x-full' : 'translate-x-0'
            }`}
          >
            <div className="w-full h-28 border-2 border-amber-400/25 rounded-t-full bg-fuchsia-500/10 backdrop-blur-sm flex items-center justify-center relative overflow-hidden">
              <span className="text-2xl animate-pulse delay-300">✨</span>
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-40">
                <span className="text-xl">🦆</span>
              </div>
            </div>
            <div className="self-start my-auto w-3.5 h-12 rounded-full bg-amber-400 shadow-[0_0_10px_#facc15]" />
            <div className="w-full h-28 border-2 border-amber-400/20 rounded-md bg-amber-500/5" />
          </div>

          {/* Golden Light Beam escaping from center slit */}
          <div
            className={`absolute inset-y-0 left-1/2 -translate-x-1/2 bg-gradient-to-b from-yellow-300 via-amber-400 to-rose-400 shadow-[0_0_20px_#facc15] pointer-events-none transition-all duration-700 ${
              stage === 'unlocking'
                ? 'w-6 opacity-100'
                : isOpeningOrEntered
                ? 'w-full opacity-0'
                : 'w-1 opacity-75 animate-pulse'
            }`}
          />
        </div>
      </div>

      {/* CTA Button & Headline */}
      <div className="relative z-30 pb-6 text-center flex flex-col items-center gap-2">
        <span className="text-xs font-mono-rhythm text-yellow-400 font-bold uppercase tracking-widest animate-pulse">
          ★ THE FINAL NIGHT ★
        </span>
        <button
          onClick={handleEnterClick}
          disabled={stage !== 'closed'}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-disco text-base sm:text-lg font-bold tracking-widest uppercase shadow-[0_0_35px_rgba(250,204,21,0.7)] hover:shadow-[0_0_50px_rgba(250,204,21,0.9)] hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-80"
        >
          {stage === 'unlocking'
            ? '🔓 UNLOCKING...'
            : isOpeningOrEntered
            ? 'DOORS OPENING...'
            : '🚪 ENTER THE BALLROOM'}
        </button>
        <p className="mt-1 text-xs font-mono-rhythm text-white/50 tracking-wider">
          Behind the doors awaits the ultimate disco showdown
        </p>
      </div>
    </div>
  );
};
