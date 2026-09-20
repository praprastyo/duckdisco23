import React from 'react';
import { DanceDirection } from '../../game/BeatmapRunner';

interface EditorPadsProps {
  onStamp: (dir: DanceDirection) => void;
  bpm: number;
  offset: number;
  tappedBpm: number | null;
  onBpmChange: (bpm: number) => void;
  onOffsetChange: (offset: number) => void;
  onTapTempo: () => void;
}

export const EditorPads: React.FC<EditorPadsProps> = ({
  onStamp,
  bpm,
  offset,
  tappedBpm,
  onBpmChange,
  onOffsetChange,
  onTapTempo,
}) => {
  return (
    <div className="space-y-3 mb-3">
      {/* 4 Directional Stamping Buttons */}
      <div className="bg-black/30 border border-white/10 rounded-2xl p-2.5">
        <div className="text-[10px] uppercase font-mono-rhythm text-white/50 tracking-wider mb-2 text-center">
          KLIK ATAU TEKAN TOMBOL PANAH KEYBOARD (← ↑ → ↓ / WASD) UNTUK MEREKAM:
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[
            { dir: 'left' as DanceDirection, label: '← KIRI', col: 'bg-amber-400 text-black' },
            { dir: 'up' as DanceDirection, label: '↑ ATAS', col: 'bg-cyan-400 text-black' },
            { dir: 'right' as DanceDirection, label: '→ KANAN', col: 'bg-fuchsia-400 text-black' },
            { dir: 'down' as DanceDirection, label: '↓ BAWAH', col: 'bg-emerald-400 text-black' },
          ].map((b) => (
            <button
              key={b.dir}
              type="button"
              onClick={() => onStamp(b.dir)}
              className={`py-2 rounded-xl font-disco font-black text-xs uppercase shadow active:scale-95 transition-all ${b.col}`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* BPM & Offset Setting + Tap Tempo */}
      <div className="grid grid-cols-3 gap-2 font-mono-rhythm text-xs">
        <div className="bg-white/5 border border-white/10 rounded-xl p-2">
          <span className="text-[9px] text-white/50 block">BPM</span>
          <input
            type="number"
            value={bpm}
            onChange={(e) => onBpmChange(parseInt(e.target.value, 10) || 79)}
            className="w-full bg-transparent font-bold text-yellow-300 text-sm outline-none"
          />
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-2">
          <span className="text-[9px] text-white/50 block">OFFSET (DETIK)</span>
          <input
            type="number"
            step="0.05"
            value={offset}
            onChange={(e) => onOffsetChange(parseFloat(e.target.value) || 0.20)}
            className="w-full bg-transparent font-bold text-cyan-300 text-sm outline-none"
          />
        </div>

        <button
          type="button"
          onClick={onTapTempo}
          className="rounded-xl border border-pink-400/40 bg-pink-950/40 hover:bg-pink-900/60 text-pink-200 flex flex-col items-center justify-center p-2 active:scale-95 transition-all"
        >
          <span className="font-disco text-xs font-bold">👆 TAP TEMPO</span>
          <span className="text-[9px] text-pink-300/70">{tappedBpm ? `${tappedBpm} BPM` : 'Ketuk di sini'}</span>
        </button>
      </div>
    </div>
  );
};
