import React, { useEffect, useState } from 'react';
import { RhythmEngine, JudgementEvent } from '../../game/RhythmEngine';
import { UnlockService } from '../../services/UnlockService';
import { AutoBeatDetector } from '../../audio/AutoBeatDetector';

interface DebugOverlayProps {
  engine?: RhythmEngine | null;
  lastJudgement?: JudgementEvent | null;
  onOpenEditor?: () => void;
}

export const DebugOverlay: React.FC<DebugOverlayProps> = ({ engine, lastJudgement, onOpenEditor }) => {

  const [isOpen, setIsOpen] = useState(false);
  const [audioTime, setAudioTime] = useState(0);
  const [autoplay, setAutoplay] = useState(false);
  const [unlockAll, setUnlockAll] = useState(UnlockService.isDevUnlockAll());
  const [detectedInfo, setDetectedInfo] = useState<string | null>(null);


  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === '`' || e.key === '~') setIsOpen((v) => !v);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      if (engine) {
        setAudioTime(engine.getAudioEngine().getCurrentTime());
        setAutoplay(engine.getAutoplay());
      }
    }, 100);
    return () => clearInterval(interval);
  }, [isOpen, engine]);

  const toggleUnlockAll = () => {
    const next = !unlockAll;
    UnlockService.setDevUnlockAll(next);
    setUnlockAll(next);
  };

  const toggleAutoplay = () => {
    if (!engine) return;
    const next = !engine.getAutoplay();
    engine.setAutoplay(next);
    setAutoplay(next);
  };

  const seek = (sec: number) => {
    if (!engine) return;
    engine.getAudioEngine().seek(engine.getAudioEngine().getCurrentTime() + sec);
  };

  const handleDetectBeats = () => {
    if (!engine) return;
    const buf = engine.getAudioEngine().getCurrentBuffer();
    if (!buf) {
      setDetectedInfo('No audio buffer loaded');
      return;
    }
    const res = AutoBeatDetector.analyze(buf);
    console.log('--- AUTO-DETECTED BEATMAP DATA ---');
    console.log('BPM:', res.bpm, 'Offset:', res.offset);
    console.log('Beatmap Events (JSON):', JSON.stringify({ bpm: res.bpm, offset: res.offset, events: res.generatedEvents }, null, 2));
    setDetectedInfo(`BPM: ${res.bpm} | Offset: ${res.offset}s (${res.beatTimes.length} beats)`);
  };


  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-3 right-3 z-50 px-2.5 py-1 bg-black/80 border border-yellow-500/50 text-[10px] font-mono-rhythm text-yellow-300 rounded hover:bg-black"
      >
        DEV DEBUG (~)
      </button>
    );
  }

  const beatClock = engine?.getBeatClock();
  const energy = engine?.getAudioEngine().getAnalyser().getEnergy() ?? { bass: 0, mid: 0, high: 0, overall: 0 };

  return (
    <div className="fixed top-3 right-3 z-50 w-72 bg-black/95 border border-yellow-500/60 rounded-lg p-3 text-xs font-mono-rhythm text-yellow-300 shadow-2xl backdrop-blur-md select-none">
      <div className="flex items-center justify-between pb-1.5 border-b border-yellow-500/30 mb-2">
        <span className="font-bold tracking-wider">⚡ DEV INSPECTOR</span>
        <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white px-1.5 py-0.5 rounded bg-white/10">✕</button>
      </div>

      <div className="space-y-1 text-[11px]">
        <div className="flex justify-between">
          <span className="text-white/60">AUDIO TIME:</span>
          <span>{audioTime.toFixed(3)}s</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">BPM / BEAT / BAR:</span>
          <span>{beatClock?.getBpm() ?? '--'} / {beatClock?.getCurrentBeat() ?? 0} / {beatClock?.getCurrentBar() ?? 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">LAST HIT:</span>
          <span className="uppercase text-fuchsia-400 font-bold">
            {lastJudgement?.judgement ?? '--'} ({lastJudgement?.deltaMs ?? 0}ms)
          </span>
        </div>

        {/* Meters */}
        <div className="pt-2 border-t border-white/10 space-y-1">
          <div className="flex justify-between text-[9px]"><span>BASS</span><span>{(energy.bass * 100).toFixed(0)}%</span></div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-rose-500" style={{ width: `${energy.bass * 100}%` }} />
          </div>

          <div className="flex justify-between text-[9px]"><span>MID</span><span>{(energy.mid * 100).toFixed(0)}%</span></div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-400" style={{ width: `${energy.mid * 100}%` }} />
          </div>

          <div className="flex justify-between text-[9px]"><span>HIGH</span><span>{(energy.high * 100).toFixed(0)}%</span></div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-400" style={{ width: `${energy.high * 100}%` }} />
          </div>
        </div>

        {/* Action buttons */}
        <div className="pt-2.5 border-t border-white/10 grid grid-cols-2 gap-1 text-[10px]">
          <button onClick={() => seek(-5)} className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded">-5s SEEK</button>
          <button onClick={() => seek(5)} className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded">+5s SEEK</button>
          <button onClick={toggleAutoplay} className={`px-2 py-1 rounded font-bold ${autoplay ? 'bg-emerald-600 text-white' : 'bg-white/10'}`}>
            AUTOPLAY: {autoplay ? 'ON' : 'OFF'}
          </button>
          <button onClick={toggleUnlockAll} className={`px-2 py-1 rounded font-bold ${unlockAll ? 'bg-amber-600 text-white' : 'bg-white/10'}`}>
            UNLOCK ALL: {unlockAll ? 'YES' : 'NO'}
          </button>
          {onOpenEditor && (
            <button
              onClick={onOpenEditor}
              className="col-span-2 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-black rounded font-bold shadow transition-all"
            >
              🛠️ BUKA BEATMAP EDITOR
            </button>
          )}
          <button
            onClick={handleDetectBeats}
            className="col-span-2 py-1.5 bg-cyan-900/70 hover:bg-cyan-800 border border-cyan-400/50 text-cyan-200 rounded font-bold"
          >
            🎵 DETECT BEAT DARI MP3/MP4
          </button>
        </div>


        {detectedInfo && (
          <div className="mt-1 p-1.5 bg-cyan-950/80 border border-cyan-500/40 rounded text-[9px] text-cyan-200">
            {detectedInfo}
            <span className="block text-[8px] text-white/50 mt-0.5">Data JSON beatmap otomatis di-print ke Console (F12)!</span>
          </div>
        )}
      </div>
    </div>
  );
};

