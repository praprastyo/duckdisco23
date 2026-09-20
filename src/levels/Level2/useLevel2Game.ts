import { useEffect, useState, useCallback } from 'react';
import { RhythmEngine } from '../../game/RhythmEngine';
import { BeatmapEvent } from '../../game/BeatmapRunner';
import { AudioEngine } from '../../audio/AudioEngine';
import { JudgementType } from '../../config/scoring';
import { Particle, HitPopup, Shockwave } from './Level2Effects';

const DEFAULT_APPROACH_DURATION = 0.85;

export function useLevel2Game(
  engine?: RhythmEngine | null,
  events: BeatmapEvent[] = [],
  onTargetClick?: (noteId: string) => void
) {
  const [songTime, setSongTime] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [popups, setPopups] = useState<HitPopup[]>([]);
  const [shockwaves, setShockwaves] = useState<Shockwave[]>([]);
  const [hitNoteIds, setHitNoteIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    let animId: number;
    let prevTime = 0;
    const loop = () => {
      animId = requestAnimationFrame(loop);
      const audio = AudioEngine.getInstance();
      const currentT = audio.getCurrentTime();

      // If playback restarted to near 0 or seeked backwards, reset hit tracking immediately
      if (currentT < 0.15 || currentT < prevTime - 0.4) {
        setHitNoteIds(new Set());
        setParticles([]);
        setPopups([]);
        setShockwaves([]);
      }
      prevTime = currentT;
      setSongTime(currentT);

      const now = performance.now();
      setPopups((prev) => (prev.length > 0 ? prev.filter((p) => now - p.createdAt < 650) : prev));
      setShockwaves((prev) => (prev.length > 0 ? prev.filter((s) => now - s.createdAt < 450) : prev));
      setParticles((prev) =>
        prev.length === 0
          ? prev
          : prev
              .map((p) => ({
                ...p,
                x: p.x + p.vx,
                y: p.y + p.vy,
                rot: p.rot + p.vRot,
                life: p.life - 0.035,
              }))
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

      const colors = {
        perfect: '#facc15',
        great: '#06b6d4',
        good: '#4ade80',
        miss: '#f43f5e',
      };
      const color = colors[jEv.judgement] || '#ffffff';

      // 1. Add glowing popup
      setPopups((prev) => [
        ...prev.slice(-8),
        {
          id: `pop_${Date.now()}_${Math.random()}`,
          x: ev.x!,
          y: ev.y!,
          text: jEv.judgement.toUpperCase(),
          color,
          createdAt: performance.now(),
        },
      ]);

      // ponytail: Always retire note from active target list so miss doesn't linger or block subsequent targets
      setHitNoteIds((prev) => new Set([...prev, ev.id]));

      if (jEv.judgement !== 'miss') {
        // 2. Add expanding shockwave ring
        setShockwaves((prev) => [
          ...prev.slice(-6),
          {
            id: `sw_${Date.now()}_${Math.random()}`,
            x: ev.x!,
            y: ev.y!,
            color,
            createdAt: performance.now(),
          },
        ]);

        // 3. Add explosion particles
        const count = jEv.judgement === 'perfect' ? 18 : jEv.judgement === 'great' ? 12 : 6;
        const pColors = ['#facc15', '#06b6d4', '#ec4899', '#ffffff', '#a855f7'];
        const newPts: Particle[] = [];

        for (let i = 0; i < count; i++) {
          const a = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.6;
          const spd = (jEv.judgement === 'perfect' ? 3.5 : 2.5) + Math.random() * 4.5;
          newPts.push({
            id: `pt_${Date.now()}_${i}`,
            x: ev.x!,
            y: ev.y!,
            vx: Math.cos(a) * spd * 0.35,
            vy: Math.sin(a) * spd * 0.35,
            size: 4 + Math.random() * 6,
            rot: Math.random() * 360,
            vRot: (Math.random() - 0.5) * 20,
            color: pColors[i % pColors.length],
            life: 1.0,
          });
        }
        setParticles((prev) => [...prev.slice(-45), ...newPts]);
      }
    };

    const unsub = engine.onJudgement(handleJudgement);
    return () => unsub();
  }, [engine]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, note: BeatmapEvent) => {
      e.stopPropagation();
      e.preventDefault();
      if (hitNoteIds.has(note.id) || (engine?.getBeatmapRunner().isHit(note.id) ?? false)) return;
      if (onTargetClick) onTargetClick(note.id);
      else if (engine) engine.handleTargetClick(note.id);
    },
    [hitNoteIds, onTargetClick, engine]
  );

  const visibleNotes = events.filter((note) => {
    if (hitNoteIds.has(note.id) || (engine?.getBeatmapRunner().isHit(note.id) ?? false)) return false;
    const dur = note.approachDuration || DEFAULT_APPROACH_DURATION;
    return songTime >= note.time - dur && songTime <= note.time + 0.2;
  });

  const sortedUpcoming = [...visibleNotes].sort((a, b) => a.time - b.time);

  return {
    songTime,
    particles,
    popups,
    shockwaves,
    sortedUpcoming,
    handlePointerDown,
  };
}