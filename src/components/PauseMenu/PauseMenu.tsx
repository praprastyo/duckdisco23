import React from 'react';
import { DevModeService } from '../../services/DevModeService';

interface PauseMenuProps {
  isOpen: boolean;
  onResume: () => void;
  onRestart: () => void;
  onExit: () => void;
  onOpenEditor?: () => void;
}

export const PauseMenu: React.FC<PauseMenuProps> = ({
  isOpen,
  onResume,
  onRestart,
  onExit,
  onOpenEditor,
}) => {
  if (!isOpen) return null;
  const isDev = DevModeService.isEnabled();

  return (
    <div className="absolute inset-0 z-40 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
      <h2 className="font-disco text-5xl text-white neon-glow-magenta mb-8">
        PAUSED
      </h2>
      <div className="flex flex-col gap-3 w-64 select-none">
        <button
          onClick={onResume}
          className="py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-disco text-sm font-bold tracking-widest uppercase transition-colors cursor-pointer"
        >
          RESUME
        </button>
        {isDev && onOpenEditor && (
          <button
            onClick={onOpenEditor}
            className="py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-disco text-sm font-bold tracking-widest uppercase transition-colors shadow-[0_0_20px_rgba(234,179,8,0.4)] cursor-pointer"
          >
            🛠️ BEATMAP EDITOR (DEV)
          </button>
        )}
        <button
          onClick={onRestart}
          className="py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-disco text-sm font-bold tracking-widest uppercase transition-colors cursor-pointer"
        >
          RESTART
        </button>
        <button
          onClick={onExit}
          className="py-3 rounded-xl bg-rose-600/80 hover:bg-rose-500 text-white font-disco text-sm font-bold tracking-widest uppercase transition-colors cursor-pointer"
        >
          EXIT TO QUEST SELECT
        </button>
      </div>
    </div>
  );
};

