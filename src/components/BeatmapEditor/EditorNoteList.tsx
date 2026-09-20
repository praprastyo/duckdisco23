import React from 'react';
import { BeatmapEvent, DanceDirection } from '../../game/BeatmapRunner';

interface EditorNoteListProps {
  events: BeatmapEvent[];
  currentTime: number;
  onDelete: (id: string) => void;
  onNudge: (id: string, deltaSec: number) => void;
  onSeek: (time: number) => void;
}

const DIR_SYMBOLS: Record<DanceDirection, string> = {
  left: '← KIRI',
  up: '↑ ATAS',
  right: '→ KANAN',
  down: '↓ BAWAH',
};

const DIR_COLORS: Record<DanceDirection, string> = {
  left: 'bg-amber-400 text-black',
  up: 'bg-cyan-400 text-black',
  right: 'bg-fuchsia-400 text-black',
  down: 'bg-emerald-400 text-black',
};

export const EditorNoteList: React.FC<EditorNoteListProps> = ({
  events,
  currentTime,
  onDelete,
  onNudge,
  onSeek,
}) => {
  if (events.length === 0) {
    return (
      <div className="h-44 flex flex-col items-center justify-center text-xs font-mono-rhythm text-white/40 border border-white/10 rounded-2xl bg-black/40">
        <span>Belum ada note. Tekan REC lalu pencet tombol panah untuk merekam!</span>
      </div>
    );
  }

  return (
    <div className="h-44 overflow-y-auto border border-white/10 rounded-2xl bg-black/40 p-2 space-y-1 font-mono-rhythm text-xs select-none">
      {events.map((ev, idx) => {
        const dir = (ev.direction || 'left') as DanceDirection;
        const isNear = Math.abs(currentTime - ev.time) < 0.3;

        return (
          <div
            key={ev.id}
            className={`flex items-center justify-between px-3 py-1.5 rounded-xl border transition-colors ${
              isNear
                ? 'bg-yellow-500/20 border-yellow-400'
                : 'bg-white/5 border-white/5 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] text-white/40 w-6">#{idx + 1}</span>
              <button
                type="button"
                onClick={() => onSeek(ev.time)}
                className="font-bold text-yellow-300 hover:underline"
              >
                {ev.time.toFixed(3)}s
              </button>
              {ev.x !== undefined && ev.y !== undefined ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/30 text-cyan-300 border border-cyan-400/40">
                  🎯 ({ev.x}%, {ev.y}%)
                </span>
              ) : (
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${DIR_COLORS[dir]}`}>
                  {DIR_SYMBOLS[dir]}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onNudge(ev.id, -0.05)}
                className="px-1.5 py-0.5 bg-white/10 hover:bg-white/20 rounded text-[9px] text-white/70"
                title="Geser 50ms mundur"
              >
                -50ms
              </button>
              <button
                type="button"
                onClick={() => onNudge(ev.id, 0.05)}
                className="px-1.5 py-0.5 bg-white/10 hover:bg-white/20 rounded text-[9px] text-white/70"
                title="Geser 50ms maju"
              >
                +50ms
              </button>
              <button
                type="button"
                onClick={() => onDelete(ev.id)}
                className="px-2 py-0.5 bg-rose-500/30 hover:bg-rose-500 text-rose-200 hover:text-white rounded text-[10px] font-bold ml-1 transition-colors"
                title="Hapus note"
              >
                ✕
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
