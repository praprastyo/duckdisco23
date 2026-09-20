import { useEffect, useState, useCallback } from 'react';
import { RhythmEngine } from '../../game/RhythmEngine';
import { BeatmapEvent } from '../../game/BeatmapRunner';
import { AudioEngine } from '../../audio/AudioEngine';
import { JudgementType } from '../../config/scoring';
import { Particle, HitPopup } from './Level2Effects';

const DEFAULT_APPROACH_DURATION = 0.85;

export function useLevel2Game(
  engine?: RhythmEngine | null,
  events: BeatmapEvent[] = [],
  onTargetClick?: (noteId: string) => void
) {
  const [songTime, setSongTime] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [popups, setPopups] = useState<HitPopup[]>([]);
  const [hitNoteIds, setHitNoteIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    let animId: number;
    const loop = () => {
      animId = requestAnimationFrame(loop);
      setSongTime(AudioEngine.getInstance().getCurrentTime());

      const now = performance.now();
      setPopups((prev) => (prev.length > 0 ? prev.filter((p) => now - p.createdAt < 600) : prev));
      setParticles((prev) =>
        prev.length === 0
          ? prev
          : prev
              .map((p) => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, life: p.life - 0.05 }))
              .filter((p) => p.life > 0)
      );
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  useEffect(() => {
    if (!engine) return;
    const handleJudgement = (jEv: { judgement: JudgementType; event?: BeatmapEvent }) => {
      const ev = jEv.event;
      if (!ev || ev.x === undefined || ev.y === undefined) return;

      const colors = { perfect: '#facc15', great: '#06b6d4', good: '#4ade80', miss: '#f43f5e' };
      setPopups((prev) => [
        ...prev.slice(-6),
        {
          id: `pop_${Date.now()}_${Math.random()}`,
          x: ev.x!,
          y: ev.y!,
          text: jEv.judgement.toUpperCase(),
          color: colors[jEv.judgement] || '#ffffff',
          createdAt: performance.now(),
        },
      ]);

      if (jEv.judgement !== 'miss') {
        setHitNoteIds((prev) => new Set([...prev, ev.id]));
        const count = jEv.judgement === 'perfect' ? 10 : 6;
        const pColors = ['#facc15', '#06b6d4', '#ec4899', '#ffffff'];
        const newPts: Particle[] = [];

        for (let i = 0; i < count; i++) {
          const a = (Math.PI * 2 * i) / count + Math.random() * 0.5;
          const spd = 2 + Math.random() * 4;
          newPts.push({
            id: `pt_${Date.now()}_${i}`,
            x: ev.x!,
            y: ev.y!,
            vx: Math.cos(a) * spd * 0.3,
            vy: Math.sin(a) * spd * 0.3,
            color: pColors[i % pColors.length],
            life: 1.0,
          });
        }
        setParticles((prev) => [...prev.slice(-25), ...newPts]);
      }
    };

    engine.onJudgement(handleJudgement);
  }, [engine]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, note: BeatmapEvent) => {
      e.stopPropagation();
      e.preventDefault();
      if (hitNoteIds.has(note.id)) return;
      if (onTargetClick) onTargetClick(note.id);
      else if (engine) engine.handleTargetClick(note.id);
    },
    [hitNoteIds, onTargetClick, engine]
  );

  const visibleNotes = events.filter((note) => {
    if (hitNoteIds.has(note.id)) return false;
    const dur = note.approachDuration || DEFAULT_APPROACH_DURATION;
    return songTime >= note.time - dur && songTime <= note.time + 0.2;
  });

  const sortedUpcoming = [...visibleNotes].sort((a, b) => a.time - b.time);

  return {
    songTime,
    particles,
    popups,
    sortedUpcoming,
    handlePointerDown,
  };
}
