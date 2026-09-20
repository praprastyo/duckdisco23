import React from 'react';

interface EditorControlsProps {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  isRecording: boolean;
  totalNotes: number;
  onSeek: (sec: number) => void;
  onTogglePlay: () => void;
  onToggleRecord: () => void;
}

export const EditorControls: React.FC<EditorControlsProps> = ({
  currentTime,
  duration,
  isPlaying,
  isRecording,
  totalNotes,
  onSeek,
  onTogglePlay,
  onToggleRecord,
}) => {
  return (
    <div className="bg-black/40 border border-white/10 rounded-2xl p-3 mb-3">
      <div className="flex items-center justify-between text-xs font-mono-rhythm text-cyan-300 font-bold mb-1.5">
        <span>DETIK: {currentTime.toFixed(3)}s</span>
        <span>TOTAL NOTE: {totalNotes}</span>
      </div>

      <input
        type="range"
        min="0"
        max={duration || 120}
        step="0.05"
        value={currentTime}
        onChange={(e) => onSeek(parseFloat(e.target.value))}
        className="w-full accent-yellow-400 h-2 bg-white/10 rounded-lg cursor-pointer mb-2.5"
      />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onSeek(Math.max(0, currentTime - 5))}
            className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-mono-rhythm"
          >
            -5s
          </button>
          <button
            type="button"
            onClick={onTogglePlay}
            className="px-4 py-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-disco font-bold text-xs rounded-lg shadow active:scale-95 transition-all"
          >
            {isPlaying ? '❚❚ PAUSE' : '▶ PLAY'}
          </button>
          <button
            type="button"
            onClick={() => onSeek(currentTime + 5)}
            className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-mono-rhythm"
          >
            +5s
          </button>
        </div>

        <button
          type="button"
          onClick={onToggleRecord}
          className={`px-4 py-1.5 rounded-xl font-disco font-bold text-xs uppercase flex items-center gap-1.5 shadow transition-all ${
            isRecording
              ? 'bg-rose-600 text-white animate-pulse border border-rose-400 shadow-[0_0_15px_#f43f5e]'
              : 'bg-white/10 hover:bg-white/20 text-white/80 border border-white/10'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping" />
          {isRecording ? '🔴 RECORDING (ON)' : 'REC MODE (OFF)'}
        </button>
      </div>
    </div>
  );
};
