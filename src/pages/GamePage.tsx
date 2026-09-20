import React, { useEffect, useRef, useState, useCallback } from 'react';
import { getLevelConfig } from '../config/levels';
import { RhythmEngine, JudgementEvent, GameStatus } from '../game/RhythmEngine';
import { ScoreSummary } from '../game/ScoringEngine';
import { BeatmapEvent, BeatmapData } from '../game/BeatmapRunner';
import { DuckCharacter } from '../components/DuckCharacter/DuckCharacter';
import { RhythmFeedback } from '../components/RhythmFeedback/RhythmFeedback';
import { ComboCounter } from '../components/ComboCounter/ComboCounter';
import { ScoreDisplay } from '../components/ScoreDisplay/ScoreDisplay';
import { TutorialCue } from '../components/TutorialCue/TutorialCue';
import { PauseMenu } from '../components/PauseMenu/PauseMenu';
import { ReadyOverlay } from '../components/ReadyOverlay/ReadyOverlay';
import { DebugOverlay } from '../components/DebugOverlay/DebugOverlay';
import { SaveService } from '../services/SaveService';

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

    return () => engine.stop();
  }, [level, onFinish]);

  const handleStart = useCallback(() => {
    if (status === 'readyToStart') engineRef.current?.start();
  }, [status]);

  return (
    <div onClick={handleStart} className="relative min-h-screen w-full flex flex-col justify-between p-4 select-none overflow-hidden">
      <div className="relative z-20 flex items-center justify-between w-full max-w-6xl mx-auto">
        <button data-interactive="true" onClick={onExit} className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs font-mono-rhythm text-white/70">
          ← EXIT
        </button>
        <ScoreDisplay score={score} accuracy={accuracy} />
        <button
          data-interactive="true"
          onClick={() => status === 'playing' ? engineRef.current?.pause() : engineRef.current?.resume()}
          className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs font-mono-rhythm text-white/70"
        >
          {status === 'paused' ? '▶ RESUME' : '❚❚ PAUSE'}
        </button>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center my-auto">
        <TutorialCue currentCue={currentCue} currentBeat={currentBeat} />
        <div className="my-2">
          <DuckCharacter currentBeat={currentBeat} lastJudgement={lastJudgement?.judgement} combo={combo} />
        </div>
        <RhythmFeedback judgement={lastJudgement?.judgement ?? null} deltaMs={lastJudgement?.deltaMs} triggerId={triggerId} />
        <div className="mt-2">
          <ComboCounter combo={combo} maxCombo={maxCombo} />
        </div>
      </div>

      <div className="relative z-10 text-center pb-2">
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-black/40 border border-white/10">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-mono-rhythm text-[11px] text-white/60 tracking-widest uppercase">
            SPACEBAR • CLICK • TOUCH TO GROOVE
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
