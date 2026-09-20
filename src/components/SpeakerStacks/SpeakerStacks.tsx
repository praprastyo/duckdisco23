import React from 'react';

interface SpeakerStacksProps {
  bassEnergy?: number;
  midEnergy?: number;
}

export const SpeakerStacks: React.FC<SpeakerStacksProps> = ({ bassEnergy = 0.2, midEnergy = 0.2 }) => {
  const wooferScale = 1 + bassEnergy * 0.28;
  const midScale = 1 + midEnergy * 0.18;

  const SingleStack = ({ align }: { align: 'left' | 'right' }) => (
    <div
      className={`hidden lg:flex flex-col items-center justify-end w-28 xl:w-36 h-[340px] xl:h-[400px] bg-gradient-to-b from-[#160c28] to-[#0a0514] border-2 border-fuchsia-500/30 rounded-2xl p-3 shadow-[0_0_30px_rgba(236,72,153,0.2)] pointer-events-none select-none relative overflow-hidden ${
        align === 'left' ? 'rotate-2' : '-rotate-2'
      }`}
    >
      {/* Chrome Corner Protectors */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-slate-300" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-slate-300" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-slate-300" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-slate-300" />

      {/* Tweeter Horn */}
      <div className="w-16 h-12 bg-black/80 rounded-lg border border-white/10 flex items-center justify-center mb-4">
        <div
          className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-cyan-300 shadow-[0_0_12px_#06b6d4]"
          style={{ transform: `scale(${midScale})`, transition: 'transform 50ms ease-out' }}
        />
      </div>

      {/* Mid Driver */}
      <div className="w-20 h-20 bg-black/90 rounded-full border-2 border-white/10 flex items-center justify-center mb-4 shadow-inner">
        <div
          className="w-14 h-14 rounded-full bg-gradient-to-b from-slate-700 to-slate-900 border border-fuchsia-500/40 flex items-center justify-center"
          style={{ transform: `scale(${midScale})`, transition: 'transform 60ms ease-out' }}
        >
          <div className="w-6 h-6 rounded-full bg-fuchsia-500/50" />
        </div>
      </div>

      {/* Subwoofer Cone (Punches on Bass) */}
      <div className="w-24 xl:w-28 h-24 xl:h-28 bg-black rounded-full border-4 border-yellow-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.2)]">
        <div
          className="w-20 xl:w-24 h-20 xl:h-24 rounded-full bg-gradient-to-b from-[#2d1b4e] via-[#1b0e33] to-black border-2 border-yellow-400/50 flex items-center justify-center shadow-lg"
          style={{ transform: `scale(${wooferScale})`, transition: 'transform 45ms ease-out' }}
        >
          {/* Dust Cap */}
          <div className="w-8 h-8 rounded-full bg-yellow-400 shadow-[0_0_15px_#facc15] flex items-center justify-center text-[9px] font-bold text-black font-mono-rhythm">
            DUCK
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="absolute inset-x-0 bottom-12 flex justify-between px-4 sm:px-8 xl:px-14 pointer-events-none z-10">
      <SingleStack align="left" />
      <SingleStack align="right" />
    </div>
  );
};
