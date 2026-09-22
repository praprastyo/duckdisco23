import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { FINAL_LETTER_DEFAULT } from '../config/level4Config';

interface LetterRevealProps {
  onBackToBallroom: () => void;
}

export const LetterReveal: React.FC<LetterRevealProps> = ({ onBackToBallroom }) => {
  useEffect(() => {
    // Confetti celebration burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#facc15', '#ec4899', '#38bdf8', '#fb7185'],
    });
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[#070312] text-slate-900 flex flex-col justify-between p-4 sm:p-6 overflow-y-auto select-text">
      {/* Top Header */}
      <div className="relative z-20 flex items-center justify-between w-full max-w-3xl mx-auto pb-4 border-b border-white/10 select-none">
        <button
          onClick={onBackToBallroom}
          className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-mono-rhythm text-white cursor-pointer"
        >
          ← BALLROOM
        </button>

        <div className="text-center">
          <span className="text-[10px] font-mono-rhythm text-yellow-400 font-bold uppercase tracking-widest block">
            THE FINAL REWARD
          </span>
          <span className="font-disco text-xs sm:text-sm text-white/80">
            A LETTER FOR YOU
          </span>
        </div>

        <div className="w-12" />
      </div>

      {/* Parchment Letter Card */}
      <div className="relative z-20 w-full max-w-2xl mx-auto my-6 bg-[#fffbeb] border-4 border-amber-400/80 rounded-3xl p-6 sm:p-10 shadow-[0_0_50px_rgba(250,204,21,0.35)] relative overflow-hidden">
        {/* Subtle Watermark Duck */}
        <div className="absolute right-4 bottom-4 text-8xl opacity-5 pointer-events-none select-none">
          🦆
        </div>

        {/* Letter Stamp */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-[10px] font-mono-rhythm text-amber-800 uppercase tracking-widest block font-bold">
              SPECIAL DELIVERY • DISCO DUCK HQ
            </span>
            <h1 className="font-disco text-2xl sm:text-3xl text-amber-950 mt-1">
              {FINAL_LETTER_DEFAULT.title}
            </h1>
            {FINAL_LETTER_DEFAULT.subtitle && (
              <span className="text-xs font-mono-rhythm text-amber-700 italic">
                {FINAL_LETTER_DEFAULT.subtitle}
              </span>
            )}
          </div>
          <div className="w-14 h-16 rounded-md border-2 border-dashed border-amber-600/50 bg-amber-100 flex flex-col items-center justify-center text-xs select-none">
            <span className="text-[8px] font-mono-rhythm text-amber-800 font-bold mt-1">2026</span>
          </div>
        </div>

        {/* Letter Body Paragraphs */}
        <div className="space-y-4 font-sans text-slate-800 leading-relaxed text-sm sm:text-base">
          {FINAL_LETTER_DEFAULT.paragraphs.map((p, idx) => (
            <p key={idx} className="indent-4">
              {p}
            </p>
          ))}
        </div>

        {/* Signature */}
        <div className="mt-8 pt-6 border-t border-amber-300/60 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
          <div>
            <span className="text-[10px] font-mono-rhythm text-amber-800 uppercase tracking-wider block">
              SEALED WITH LOVE
            </span>
            <p className="font-disco text-amber-900 text-sm sm:text-base mt-1">
              {FINAL_LETTER_DEFAULT.signature}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="relative z-20 pb-4 flex flex-col sm:flex-row items-center justify-center gap-3 select-none">
        <button
          onClick={onBackToBallroom}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-disco text-xs sm:text-sm font-bold tracking-wider uppercase shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          BACK TO BALLROOM HUB
        </button>
      </div>
    </div>
  );
};
