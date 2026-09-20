import React, { useEffect, useState } from 'react';
import { BeatmapEvent } from '../../game/BeatmapRunner';

interface TutorialCueProps {
  currentCue: BeatmapEvent | null;
  currentBeat: number;
}

export const TutorialCue: React.FC<TutorialCueProps> = ({ currentCue, currentBeat }) => {
  const [activePrompt, setActivePrompt] = useState<string | null>(null);

  useEffect(() => {
    if (!currentCue) return;
    setActivePrompt(currentCue.promptText || 'QUACK!');
    const timer = setTimeout(() => {
      setActivePrompt(null);
    }, 900);
    return () => clearTimeout(timer);
  }, [currentCue]);

  // Metronome count indicator (1, 2, 3, 4)
  const countBeat = (currentBeat % 4) + 1;

  return (
    <div className="flex flex-col items-center select-none pointer-events-none gap-2">
      {/* Dynamic Beat Pip Dots */}
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4].map((b) => (
          <div
            key={b}
            className={`w-3 h-3 rounded-full transition-all duration-100 ${
              countBeat === b
                ? 'bg-cyan-400 shadow-[0_0_12px_#06b6d4] scale-125'
                : 'bg-white/20 scale-90'
            }`}
          />
        ))}
      </div>

      {/* Rhythmic Speech Bubble / Cue Indicator */}
      <div className="h-10 flex items-center justify-center">
        {activePrompt ? (
          <div className="px-5 py-1 rounded-full bg-fuchsia-950/80 border border-fuchsia-500/60 shadow-[0_0_20px_rgba(236,72,153,0.5)] animate-bounce">
            <span className="font-disco text-sm sm:text-base font-bold tracking-wider text-yellow-300">
              🎤 {activePrompt}
            </span>
          </div>
        ) : (
          <div className="text-xs font-mono-rhythm text-white/40 tracking-widest uppercase">
            LISTEN TO THE CALL • HIT ON CUE
          </div>
        )}
      </div>
    </div>
  );
};
