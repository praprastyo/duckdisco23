import React, { useState } from 'react';
import { Direction } from './level3Types';

interface Level3VirtualPadProps {
  onDirectionPress: (dir: Direction) => void;
  activeDirection?: Direction | null;
  disabled?: boolean;
}

export const Level3VirtualPad: React.FC<Level3VirtualPadProps> = ({
  onDirectionPress,
  activeDirection = null,
  disabled = false,
}) => {
  const [pressedDir, setPressedDir] = useState<Direction | null>(null);

  const handlePointer = (dir: Direction, e: React.PointerEvent) => {
    e.preventDefault();
    if (disabled) return;
    setPressedDir(dir);
    onDirectionPress(dir);
    setTimeout(() => {
      setPressedDir((cur) => (cur === dir ? null : cur));
    }, 180);
  };

  const getButtonClass = (dir: Direction) => {
    const isLit = pressedDir === dir || activeDirection === dir;
    return `w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex flex-col items-center justify-center font-disco font-black text-2xl sm:text-3xl select-none touch-none cursor-pointer transition-all duration-100 ${
      isLit
        ? 'bg-yellow-400 text-black scale-95 shadow-[0_0_25px_rgba(250,204,21,0.85)] border-2 border-white ring-4 ring-yellow-400/50'
        : 'bg-black/60 hover:bg-black/80 text-white/90 border border-white/20 shadow-[0_4px_15px_rgba(0,0,0,0.5)] active:scale-95'
    }`;
  };

  return (
    <div className="relative flex flex-col items-center justify-center gap-1 select-none pointer-events-auto">
      {/* UP */}
      <button
        type="button"
        onPointerDown={(e) => handlePointer('up', e)}
        className={getButtonClass('up')}
        aria-label="Up - Wing Pop (W / Up Arrow)"
      >
        <span className="leading-none">↑</span>
        <span className="text-[8px] font-mono-rhythm font-bold text-cyan-300 -mt-0.5 tracking-tight">W / POP</span>
      </button>

      {/* LEFT & RIGHT */}
      <div className="flex items-center gap-14 sm:gap-18">
        <button
          type="button"
          onPointerDown={(e) => handlePointer('left', e)}
          className={getButtonClass('left')}
          aria-label="Left - Duck Slide (A / Left Arrow)"
        >
          <span className="leading-none">←</span>
          <span className="text-[8px] font-mono-rhythm font-bold text-fuchsia-300 -mt-0.5 tracking-tight">A / SLIDE</span>
        </button>

        <button
          type="button"
          onPointerDown={(e) => handlePointer('right', e)}
          className={getButtonClass('right')}
          aria-label="Right - Quack Spin (D / Right Arrow)"
        >
          <span className="leading-none">→</span>
          <span className="text-[8px] font-mono-rhythm font-bold text-yellow-300 -mt-0.5 tracking-tight">D / SPIN</span>
        </button>
      </div>

      {/* DOWN */}
      <button
        type="button"
        onPointerDown={(e) => handlePointer('down', e)}
        className={getButtonClass('down')}
        aria-label="Down - Low Groove (S / Down Arrow)"
      >
        <span className="leading-none">↓</span>
        <span className="text-[8px] font-mono-rhythm font-bold text-emerald-300 -mt-0.5 tracking-tight">S / GROOVE</span>
      </button>
    </div>
  );
};
