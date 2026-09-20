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
/** Total track height in px. */
const TRACK_HEIGHT = 290;
/** Exact Y position where notes hit delta = 0 (the target line). */
const TARGET_LINE_Y = 235;

interface DanceNoteTrackProps {
  events: BeatmapEvent[];
  isPlaying: boolean;
  onHitFlash?: (dir: LaneDir) => void;
  onActiveNoteChange?: (dir: LaneDir | null) => void;
}

/**
 * Scrolling arrow track.
 * Note Y positions are driven by the authoritative audio clock in a rAF loop,
 * mathematically centered on TARGET_LINE_Y at delta = 0 for perfect visual sync.
 */
export const DanceNoteTrack: React.FC<DanceNoteTrackProps> = ({
  events,
  isPlaying,
  onActiveNoteChange,
}) => {
  const noteRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeLaneRef = useRef<LaneDir | null>(null);

  useEffect(() => {
    let frameId: number;

    const loop = () => {
      frameId = requestAnimationFrame(loop);
      if (!isPlaying) return;

      const t = AudioEngine.getInstance().getCurrentTime();
      let nearest: LaneDir | null = null;
      let nearestDelta = Infinity;

      // Gentle disco sway after 60s
      const swayAmp = t > 60 ? Math.min(8, (t - 60) * 0.15) : 0;

      events.forEach((ev, i) => {
        const el = noteRefs.current[i];
        if (!el) return;

        const dir = (ev.direction ?? 'left') as LaneDir;
        const delta = ev.time - t;

        // Hide notes far outside the approach window
        if (delta > APPROACH_SEC || delta < -0.35) {
          el.style.opacity = '0';
          el.style.pointerEvents = 'none';
        } else {
          // Keep notes fully readable until just past the hit line
          let opacity = 1;
          if (delta < -0.15) {
            opacity = Math.max(0, 1 - (-delta - 0.15) / 0.2);
          }
          el.style.opacity = String(opacity);
          el.style.pointerEvents = 'auto';
        }

        // Progress: 0 at spawn, 1.0 exactly at delta = 0 (hit moment)
        const progress = 1 - delta / APPROACH_SEC;
        // Y position of note center: at progress = 1, y = TARGET_LINE_Y exactly!
        const y = progress * TARGET_LINE_Y;

        // Subtle horizontal sway oscillation as note descends
        const swayX = swayAmp > 0 ? Math.sin(t * 5 + progress * 3 + i) * swayAmp : 0;

        // Note is vertically centered using calc(${y}px - 50%) so its exact center hits the line at delta = 0!
        el.style.transform = `translate(calc(-50% + ${swayX.toFixed(1)}px), calc(${y.toFixed(1)}px - 50%))`;
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
    <div className="relative w-full overflow-hidden rounded-2xl" style={{ height: TRACK_HEIGHT }}>
      {/* Approach guide vertical dashed lines */}
      <div className="absolute inset-0 flex justify-around opacity-20 pointer-events-none">
        {LANE_ORDER.map((dir) => (
          <div key={dir} className={`w-px h-full border-l border-dashed ${LANE_COLORS[dir].ring}`} />
        ))}
      </div>

      {/* Target Hit Line (Garis Sasaran Presisi di Tengah) */}
      <div
        className="absolute inset-x-0 pointer-events-none z-10"
        style={{ top: `${TARGET_LINE_Y}px` }}
      >
        {/* Glowing soft blur line */}
        <div className="absolute inset-x-0 -top-1.5 h-3 bg-gradient-to-r from-amber-400/30 via-cyan-400/50 to-emerald-400/30 blur-sm" />
        {/* Core glowing target line */}
        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-cyan-300 to-emerald-400 shadow-[0_0_12px_#38bdf8]" />

        {/* Center Target Crosshairs for each lane */}
        <div className="relative w-full flex justify-around">
          {LANE_ORDER.map((dir) => (
            <div key={dir} className="relative -top-2 flex items-center justify-center">
              <div
                className={`w-5 h-5 rounded-full border-2 border-white/90 bg-black/70 shadow-[0_0_12px_white] flex items-center justify-center`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${LANE_COLORS[dir].ring.replace('border-', 'bg-')}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Falling arrow notes */}
      {events.map((ev, i) => {
        const dir = (ev.direction ?? 'left') as LaneDir;
        const col = LANE_COLORS[dir];
        const leftPct = `${((LANE_ORDER.indexOf(dir) + 0.5) / LANE_ORDER.length) * 100}%`;

        return (
          <div
            key={ev.id}
            ref={(el) => {
              noteRefs.current[i] = el;
            }}
            className="absolute top-0 z-20 will-change-transform"
            style={{ left: leftPct, opacity: 0, transform: 'translate(-50%, -50%)' }}
          >
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center font-disco font-black text-xl border-2 border-white/90 ${col.note} ${col.glow}`}
            >
              {ARROW_ICONS[dir]}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const POSE_BY_DIR: Record<LaneDir, DancePose> = {
  left: 'left',
  up: 'up',
  right: 'right',
  down: 'down',
};