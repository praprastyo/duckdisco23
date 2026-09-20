import React, { useEffect, useRef, useState } from 'react';

import { BeatmapEvent } from '../../game/BeatmapRunner';
import { AudioEngine } from '../../audio/AudioEngine';
import { ARROW_ICONS, DancePose } from './QuackDancer';

export const LANE_ORDER = ['left', 'up', 'right', 'down'] as const;
export type LaneDir = (typeof LANE_ORDER)[number];

const LANE_COLORS: Record<LaneDir, { ring: string; note: string; glow: string }> = {
  left: { ring: 'border-amber-300', note: 'bg-amber-400 text-black', glow: 'shadow-[0_0_16px_#facc15]' },
  up: { ring: 'border-cyan-300', note: 'bg-cyan-400 text-black', glow: 'shadow-[0_0_16px_#06b6d4]' },
  right: { ring: 'border-fuchsia-300', note: 'bg-fuchsia-400 text-black', glow: 'shadow-[0_0_16px_#ec4899]' },
  down: { ring: 'border-emerald-300', note: 'bg-emerald-400 text-black', glow: 'shadow-[0_0_16px_#10b981]' },
};

/** Seconds a note takes to travel from the top of the track to the hit line. */
const APPROACH_SEC = 2.4;
/** Vertical travel distance of the note track in px. */
const TRACK_HEIGHT = 300;

interface DanceNoteTrackProps {
  events: BeatmapEvent[];
  isPlaying: boolean;
  onHitFlash?: (dir: LaneDir) => void;
  onActiveNoteChange?: (dir: LaneDir | null) => void;
}

/**
 * Scrolling ayodance-style arrow track.
 * Note Y positions are driven by the authoritative audio clock in a rAF loop,
 * so notes stay locked to the music even if React re-renders.
 */
export const DanceNoteTrack: React.FC<DanceNoteTrackProps> = ({
  events,
  isPlaying,
  onActiveNoteChange,
}) => {
  const noteRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeLaneRef = useRef<LaneDir | null>(null);
  const [showStealthNotice, setShowStealthNotice] = useState(false);

  useEffect(() => {
    let frameId: number;

    const loop = () => {
      frameId = requestAnimationFrame(loop);
      if (!isPlaying) return;

      const t = AudioEngine.getInstance().getCurrentTime();
      let nearest: LaneDir | null = null;
      let nearestDelta = Infinity;

      // Notice banner for 40s - 45s
      setShowStealthNotice(t >= 40 && t <= 45);

      const isPast40s = t > 40;

      events.forEach((ev, i) => {
        const el = noteRefs.current[i];
        if (!el) return;

        const dir = (ev.direction ?? 'left') as LaneDir;
        const delta = ev.time - t;

        // Hide notes far outside the approach window
        if (delta > APPROACH_SEC || delta < -0.4) {
          el.style.opacity = '0';
          el.style.pointerEvents = 'none';
        } else {
          // Progress: 0 = top of track, 1 = target box line
          const progress = 1 - delta / APPROACH_SEC;

          let opacity = 1;
          if (delta < -0.25) {
            opacity = 0;
          } else if (isPast40s) {
            // Early stealth fade: visible at the top (0 - 15%), fades smoothly (15% - 55%),
            // and completely invisible (0 opacity) from 55% all the way through the target box!
            if (progress < 0.15) {
              opacity = 1.0;
            } else if (progress <= 0.55) {
              const ratio = (progress - 0.15) / (0.55 - 0.15); // 0 to 1
              opacity = Math.max(0, 1.0 - ratio);
            } else {
              // Completely gone when nearing or at the target box!
              opacity = 0;
            }
          }
          el.style.opacity = String(opacity);

        }

        // Progress 0 = top of track, 1 = hit line
        const progress = 1 - delta / APPROACH_SEC;
        const y = Math.max(-40, Math.min(TRACK_HEIGHT + 20, progress * TRACK_HEIGHT));
        el.style.transform = `translate(-50%, ${y}px)`;
        el.dataset.y = String(y);

        if (Math.abs(delta) < Math.abs(nearestDelta)) {
          nearestDelta = Math.abs(delta);
          nearest = dir;
        }
      });

      // Report the closest note to highlight the matching pad
      const nextLane = nearestDelta <= 0.6 ? nearest : null;
      if (nextLane !== activeLaneRef.current) {
        activeLaneRef.current = nextLane;
        onActiveNoteChange?.(nextLane);
      }
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [events, isPlaying, onActiveNoteChange]);

  return (
    <div className="relative w-full" style={{ height: TRACK_HEIGHT }}>
      {/* 40s Stealth Fade Notice */}
      {showStealthNotice && (
        <div className="absolute -top-6 inset-x-0 z-30 flex justify-center animate-bounce pointer-events-none">
          <span className="px-2.5 py-0.5 rounded-full bg-purple-900/90 border border-purple-400 text-[9px] font-mono-rhythm text-yellow-300 font-bold shadow-[0_0_14px_#c084fc]">
            👻 GHOST NOTES: PANAH LENYAP SEBELUM KOTAK TARGET!
          </span>
        </div>
      )}
      {/* Approach guide lines */}
      <div className="absolute inset-0 flex justify-around opacity-25">
        {LANE_ORDER.map((dir) => (
          <div key={dir} className={`w-px h-full border-l border-dashed ${LANE_COLORS[dir].ring}`} />
        ))}
      </div>

      {/* Falling arrow notes */}
      {events.map((ev, i) => {
        const dir = (ev.direction ?? 'left') as LaneDir;
        const col = LANE_COLORS[dir];
        const leftPct = `${((LANE_ORDER.indexOf(dir) + 0.5) / LANE_ORDER.length) * 100}%`;

        return (
          <div
            key={ev.id}
            ref={(el) => { noteRefs.current[i] = el; }}
            className="absolute top-0 transition-opacity duration-150"
            style={{ left: leftPct, opacity: 0, transform: 'translate(-50%, 0px)' }}
          >
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center font-disco font-black text-xl border-2 border-white/70 ${col.note} ${col.glow}`}
            >
              {ARROW_ICONS[dir]}
            </div>
          </div>
        );
      })}

      {/* Hit line */}
      <div
        className="absolute inset-x-0 flex justify-around"
        style={{ top: TRACK_HEIGHT - 22 }}
      >
        {LANE_ORDER.map((dir) => (
          <div
            key={dir}
            className={`w-12 h-12 rounded-xl border-2 border-dashed bg-black/40 ${LANE_COLORS[dir].ring}`}
          />
        ))}
      </div>
    </div>
  );
};

export const POSE_BY_DIR: Record<LaneDir, DancePose> = {
  left: 'left',
  up: 'up',
  right: 'right',
  down: 'down',
};