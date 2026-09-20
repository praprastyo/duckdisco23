import React from 'react';

interface TurntableBoothProps {
  currentBeat?: number;
  combo?: number;
}

export const TurntableBooth: React.FC<TurntableBoothProps> = ({ currentBeat = 0, combo = 0 }) => {
  const isEvenBeat = currentBeat % 2 === 0;
  const isFever = combo >= 10;
  const tonearmRotate = isEvenBeat ? 'rotate-12' : '-rotate-6';

  return (
    <div className="relative -mt-8 sm:-mt-10 z-10 w-64 sm:w-80 h-16 sm:h-20 bg-gradient-to-b from-[#1c1236] to-[#0d071a] rounded-2xl border-2 border-fuchsia-500/50 shadow-[0_10px_30px_rgba(0,0,0,0.8)] px-4 py-2 flex items-center justify-between select-none pointer-events-none">
      {/* Left Spinning Vinyl Turntable */}
      <div className="relative flex items-center justify-center">
        <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-black border-2 border-slate-700 animate-spin-slow flex items-center justify-center shadow-md">
          <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full border border-slate-600/50 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-yellow-400 border border-black flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-black" />
            </div>
          </div>
        </div>
        <div className={`absolute top-0 right-0 w-6 h-0.5 bg-slate-300 origin-top-right transition-transform duration-200 ${tonearmRotate}`} />
      </div>

      {/* Center DJ Mixer LED Level Meters */}
      <div className="flex flex-col items-center gap-1">
        <div className="flex gap-1.5">
          <span className="w-1.5 h-6 bg-gradient-to-t from-emerald-500 via-yellow-400 to-rose-500 rounded-sm animate-pulse" />
          <span className="w-1.5 h-6 bg-gradient-to-t from-emerald-500 via-yellow-400 to-rose-500 rounded-sm animate-pulse" />
        </div>
        <span className="text-[8px] font-mono-rhythm text-yellow-300 tracking-wider">
          {isFever ? '🔥 GROOVE' : 'MIXER'}
        </span>
      </div>

      {/* Right Turntable */}
      <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-black border-2 border-slate-700 animate-spin-slow flex items-center justify-center shadow-md">
        <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full border border-slate-600/50 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-fuchsia-500 border border-black flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-black" />
          </div>
        </div>
      </div>
    </div>
  );
};
