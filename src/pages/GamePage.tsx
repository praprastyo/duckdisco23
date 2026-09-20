import React, { useEffect, useRef, useState, useCallback } from 'react';
import { getLevelConfig } from '../config/levels';
import { RhythmEngine, JudgementEvent, GameStatus } from '../game/RhythmEngine';
import { ScoreSummary } from '../game/ScoringEngine';
import { BeatmapEvent, BeatmapData } from '../game/BeatmapRunner';
import { DuckCharacter } from '../components/DuckCharacter/DuckCharacter';
import { TurntableBooth } from '../components/TurntableBooth/TurntableBooth';
import { DiscoBall } from '../components/DiscoBall/DiscoBall';
import { SpeakerStacks } from '../components/SpeakerStacks/SpeakerStacks';
import { CrowdSilhouettes } from '../components/CrowdSilhouettes/CrowdSilhouettes';
import { EqualizerVisualizer } from '../components/EqualizerVisualizer/EqualizerVisualizer';
import { RhythmFeedback } from '../components/RhythmFeedback/RhythmFeedback';
import { ComboCounter } from '../components/ComboCounter/ComboCounter';
import { ScoreDisplay } from '../components/ScoreDisplay/ScoreDisplay';
import { TutorialCue } from '../components/TutorialCue/TutorialCue';
import { PauseMenu } from '../components/PauseMenu/PauseMenu';
import { ReadyOverlay } from '../components/ReadyOverlay/ReadyOverlay';
import { DebugOverlay } from '../components/DebugOverlay/DebugOverlay';
import { SaveService } from '../services/SaveService';
import { EnergyData } from '../audio/AudioAnalyser';

interface GamePageProps {
  levelId: string;
  onFinish: (summary: ScoreSummary) => void;
  onExit: () => void;
}

export const GamePage: React.FC<GamePageProps> = ({ levelId, onFinish, onExit }) => {
  const level = getLevelConfig(levelId)!;
  const engineRef = useRef<RhythmEngine | null>(null);

  const [status, setStatus] = useState<GameStatus>('loading');
  const [currentBeat, setCurrentBeat] = useState(0);
  const [currentCue, setCurrentCue] = useState<BeatmapEvent | null>(null);
  const [lastJudgement, setLastJudgement] = useState<JudgementEvent | null>(null);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [triggerId, setTriggerId] = useState(0);
  const [energy, setEnergy] = useState<EnergyData>({ bass: 0.1, lowMid: 0.1, mid: 0.1, high: 0.1, overall: 0.1 });

  useEffect(() => {
    const offset = SaveService.load().settings.timingOffset;
    const engine = new RhythmEngine(offset);
    engineRef.current = engine;

    engine.onStatusChange(setStatus);
    engine.getBeatClock().onBeat(setCurrentBeat);
    engine.onCue(setCurrentCue);

    engine.onJudgement((j) => {
      setLastJudgement(j);
      setCombo(j.combo);
      setMaxCombo((m) => Math.max(m, j.combo));
      setScore(j.score);
      setAccuracy(engine.getScoringEngine().getAccuracy());
      setTriggerId((t) => t + 1);
    });

    engine.onComplete(onFinish);

    fetch(level.song.beatmap)
      .then((r) => r.json())
      .then((d: BeatmapData) => engine.initializeLevel(level.song.src, d))
      .catch(() => setStatus('error'));

    const energyTimer = setInterval(() => {
      if (engine.getStatus() === 'playing') {
        setEnergy({ ...engine.getAudioEngine().getAnalyser().getEnergy() });
      }
    }, 66);

    return () => {
      clearInterval(energyTimer);
      engine.stop();
    };
  }, [level, onFinish]);

  const handleStart = useCallback(() => {
    if (status === 'readyToStart') engineRef.current?.start();
  }, [status]);

  return (
    <div onClick={handleStart} className="relative min-h-screen w-full flex flex-col justify-between p-4 select-none overflow-hidden">
      {/* Top Hanging Disco Ball */}
      <DiscoBall highEnergy={energy.high} bassEnergy={energy.bass} />

      {/* Dual Bass Speaker Stacks */}
      <SpeakerStacks bassEnergy={energy.bass} midEnergy={energy.mid} />

      {/* Top HUD */}
      <div className="relative z-30 flex items-center justify-between w-full max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <button data-interactive="true" onClick={onExit} className="px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs font-mono-rhythm text-white/70 hover:text-white">
            ← EXIT
          </button>
          <div className="hidden sm:flex flex-col">
            <span className="text-[10px] font-mono-rhythm text-fuchsia-400 font-bold uppercase">NIGHT 0{level.levelNumber}</span>
            <span className="font-disco text-sm text-white">{level.title}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <EqualizerVisualizer energy={energy} />
          <ScoreDisplay score={score} accuracy={accuracy} />
        </div>

        <button
          data-interactive="true"
          onClick={() => status === 'playing' ? engineRef.current?.pause() : engineRef.current?.resume()}
          className="px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs font-mono-rhythm text-white/70 hover:text-white"
        >
          {status === 'paused' ? '▶ RESUME' : '❚❚ PAUSE'}
        </button>
      </div>

      {/* Main Mascot & DJ Turntable Stage */}
      <div className="relative z-20 flex flex-col items-center justify-center my-auto">
        <TutorialCue currentCue={currentCue} currentBeat={currentBeat} />
        <div className="flex flex-col items-center my-1">
          <DuckCharacter currentBeat={currentBeat} lastJudgement={lastJudgement?.judgement} combo={combo} />
          <TurntableBooth currentBeat={currentBeat} combo={combo} />
        </div>
        <RhythmFeedback judgement={lastJudgement?.judgement ?? null} deltaMs={lastJudgement?.deltaMs} triggerId={triggerId} />
        <div className="mt-1">
          <ComboCounter combo={combo} maxCombo={maxCombo} />
        </div>
      </div>

      {/* Crowd Duck Silhouettes along the floor */}
      <CrowdSilhouettes currentBeat={currentBeat} combo={combo} />

      {/* Bottom control tip */}
      <div className="relative z-20 text-center pb-2">
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-mono-rhythm text-[11px] text-white/70 tracking-widest uppercase">
            SPACEBAR • CLICK • TOUCH ANYWHERE TO GROOVE
          </span>
        </div>
      </div>

      <ReadyOverlay status={status} level={level} />

      <PauseMenu
        isOpen={status === 'paused'}
        onResume={() => engineRef.current?.resume()}
        onRestart={() => engineRef.current?.restart()}
        onExit={onExit}
      />

      <DebugOverlay engine={engineRef.current} lastJudgement={lastJudgement} />
    </div>
  );
};

