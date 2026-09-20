import React, { useRef, useState } from 'react';
import { BeatmapEvent } from '../../game/BeatmapRunner';

interface EditorOsuPlayfieldProps {
  events: BeatmapEvent[];
  currentTime: number;
  onStampTarget: (x: number, y: number) => void;
  onDeleteTarget: (id: string) => void;
}

export const EditorOsuPlayfield: React.FC<EditorOsuPlayfieldProps> = ({
  events,
  currentTime,
  onStampTarget,
  onDeleteTarget,
}) => {
  const playfieldRef = useRef<HTMLDivElement | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!playfieldRef.current) return;
    const rect = playfieldRef.current.getBoundingClientRect();
    const rawX = ((e.clientX - rect.left) / rect.width) * 100;
    const rawY = ((e.clientY - rect.top) / rect.height) * 100;
    setHoverPos({
      x: Math.round(Math.max(8, Math.min(92, rawX))),
      y: Math.round(Math.max(12, Math.min(88, rawY))),
    });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!playfieldRef.current) return;
    const rect = playfieldRef.current.getBoundingClientRect();
    const rawX = ((e.clientX - rect.left) / rect.width) * 100;
    const rawY = ((e.clientY - rect.top) / rect.height) * 100;
    const clampedX = Math.round(Math.max(8, Math.min(92, rawX)));
    const clampedY = Math.round(Math.max(12, Math.min(88, rawY)));
    onStampTarget(clampedX, clampedY);
  };

  // Filter visible notes around currentTime: from -0.85s to +0.2s
  const visible = events.filter((ev) => {
    const dur = ev.approachDuration || 0.85;
    return currentTime >= ev.time - dur && currentTime <= ev.time + 0.25;
  });

  return (
    <div className="space-y-1.5 mb-3">
      <div className="flex items-center justify-between text-[10px] font-mono-rhythm text-cyan-300 px-1">
        <span>🎯 KLIK PLAYFIELD UNTUK MENAMBAH BULATAN (OSU TARGET)</span>
        <span>{hoverPos ? `X: ${hoverPos.x}% | Y: ${hoverPos.y}%` : 'Arahkan kursor'}</span>
      </div>

      <div
        ref={playfieldRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setHoverPos(null)}
        onPointerDown={handlePointerDown}
        className="relative w-full h-56 bg-black/80 border-2 border-cyan-500/50 rounded-2xl overflow-hidden cursor-crosshair select-none shadow-[0_0_20px_rgba(6,182,212,0.2)]"
      >
        {/* Safe Area Guide (8-92% X, 12-88% Y) */}
        <div className="absolute inset-x-[8%] inset-y-[12%] border border-cyan-400/20 border-dashed rounded-xl pointer-events-none" />

        {/* Center Guide Cross */}
        <div className="absolute top-1/2 inset-x-0 h-px bg-white/5 pointer-events-none" />
        <div className="absolute left-1/2 inset-y-0 w-px bg-white/5 pointer-events-none" />

        {/* Render visible approach rings & targets */}
        {visible.map((note, idx) => {
          const dur = note.approachDuration || 0.85;
          const rem = note.time - currentTime;
          const prog = Math.max(0, Math.min(1.2, 1 - rem / dur));
          const scale = Math.max(1.0, 2.2 - prog * 1.2);
          const isHitWindow = Math.abs(rem) <= 0.08;

          return (
            <div
              key={note.id}
              onClick={(e) => {
                e.stopPropagation();
                if (e.shiftKey) onDeleteTarget(note.id);
              }}
              title={`Note #${note.seq || idx + 1} (${note.time}s) - Shift+Klik untuk hapus`}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-auto"
              style={{
                left: `${note.x ?? 50}%`,
                top: `${note.y ?? 50}%`,
                width: '46px',
                height: '46px',
              }}
            >
              {/* Outer Approach Ring */}
              <div
                className={`absolute inset-0 rounded-full border-2 pointer-events-none ${
                  isHitWindow ? 'border-yellow-300 shadow-[0_0_10px_#facc15]' : 'border-cyan-400'
                }`}
                style={{
                  transform: `scale(${scale})`,
                  opacity: Math.min(1, prog * 1.5),
                }}
              />

              {/* Target Circle */}
              <div
                className={`w-full h-full rounded-full border-2 flex items-center justify-center font-disco text-xs font-black shadow-lg ${
                  isHitWindow
                    ? 'bg-yellow-400 text-black border-white'
                    : 'bg-gradient-to-br from-indigo-900 to-slate-900 text-yellow-300 border-yellow-400'
                }`}
              >
                {note.seq || note.promptText || idx + 1}
              </div>
            </div>
          );
        })}

        {/* Hover Placement Preview Indicator */}
        {hoverPos && (
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-yellow-400/60 border-dashed pointer-events-none flex items-center justify-center text-[9px] font-mono-rhythm text-yellow-300"
            style={{ left: `${hoverPos.x}%`, top: `${hoverPos.y}%` }}
          >
            +
          </div>
        )}
      </div>
    </div>
  );
};
