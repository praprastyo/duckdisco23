import { useState, useEffect, useRef, useCallback } from 'react';
import { BeatmapEvent, BeatmapData, DanceDirection } from '../../game/BeatmapRunner';
import { AudioEngine } from '../../audio/AudioEngine';
import { TapTempo } from './TapTempo';

export function useBeatmapEditor(isOpen: boolean, onApplyBeatmap?: (data: BeatmapData) => void) {
  const [bpm, setBpm] = useState(79);
  const [offset, setOffset] = useState(0.20);
  const [events, setEvents] = useState<BeatmapEvent[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  const tapTempoRef = useRef(new TapTempo());
  const [tappedBpm, setTappedBpm] = useState<number | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    if (!isOpen) return;
    fetch('/beatmaps/level1.json')
      .then((r) => r.json())
      .then((d: BeatmapData) => {
        setBpm(d.bpm || 79);
        setOffset(d.offset || 0.20);
        setEvents(d.events || []);
      })
      .catch(() => {});
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    let animId: number;
    const loop = () => {
      animId = requestAnimationFrame(loop);
      const audio = AudioEngine.getInstance();
      setCurrentTime(audio.getCurrentTime());
      setIsPlaying(audio.isPlaybackActive());
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isOpen]);

  const stampNote = useCallback((dir: DanceDirection) => {
    const audio = AudioEngine.getInstance();
    const t = Number(audio.getCurrentTime().toFixed(3));
    const beatSec = 60 / bpm;
    const cueTime = Number(Math.max(0, t - beatSec * 2).toFixed(3));

    const newEv: BeatmapEvent = {
      id: `custom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      cueTime,
      time: t,
      action: 'tap',
      cue: 'quack',
      direction: dir,
      promptText: dir.toUpperCase(),
    };

    audio.playSfx('quack');
    setEvents((prev) => [...prev, newEv].sort((a, b) => a.time - b.time));
  }, [bpm]);

  useEffect(() => {
    if (!isOpen || !isRecording) return;
    const handleKey = (e: KeyboardEvent) => {
      const map: Record<string, DanceDirection> = {
        ArrowLeft: 'left', KeyA: 'left',
        ArrowUp: 'up', KeyW: 'up',
        ArrowRight: 'right', KeyD: 'right',
        ArrowDown: 'down', KeyS: 'down',
      };
      const dir = map[e.code];
      if (dir) {
        e.preventDefault();
        stampNote(dir);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, isRecording, stampNote]);

  const handleTogglePlay = () => {
    const audio = AudioEngine.getInstance();
    if (audio.isPlaybackActive()) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.resume();
      setIsPlaying(true);
    }
  };

  const handleSeek = (sec: number) => {
    AudioEngine.getInstance().seek(sec);
    setCurrentTime(sec);
  };

  const handleNudge = (id: string, delta: number) => {
    setEvents((prev) =>
      prev
        .map((ev) => (ev.id === id ? { ...ev, time: Number(Math.max(0, ev.time + delta).toFixed(3)) } : ev))
        .sort((a, b) => a.time - b.time)
    );
  };

  const handleDelete = (id: string) => {
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
  };

  const handleTapTempo = () => {
    const detected = tapTempoRef.current.tap();
    if (detected) {
      setTappedBpm(detected);
      setBpm(detected);
      showToast(`BPM: ${detected}`);
    }
  };

  const getPayload = (): BeatmapData => ({
    bpm,
    offset,
    duration: Math.round(AudioEngine.getInstance().getDuration()) || 120,
    events,
  });

  const handleApply = () => {
    onApplyBeatmap?.(getPayload());
    showToast('Beatmap diterapkan ke game!');
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(getPayload(), null, 2)).then(() => {
      showToast('JSON disalin ke Clipboard!');
    });
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(getPayload(), null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'level1.json';
    a.click();
    showToast('level1.json diunduh!');
  };

  return {
    bpm, setBpm,
    offset, setOffset,
    events, setEvents,
    isPlaying,
    isRecording, setIsRecording,
    currentTime,
    toast,
    tappedBpm,
    stampNote,
    handleTogglePlay,
    handleSeek,
    handleNudge,
    handleDelete,
    handleTapTempo,
    handleApply,
    handleCopyJson,
    handleDownloadJson,
  };
}
