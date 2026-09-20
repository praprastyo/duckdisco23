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
import { LevelSplashIntro } from '../components/SplashIntro/LevelSplashIntro';
import { Level1Stage } from '../levels/Level1/Level1Stage';
import { Level2Stage } from '../levels/Level2/Level2Stage';
import { Level3Stage } from '../levels/Level3/Level3Stage';
import { Level4Stage } from '../levels/Level4/Level4Stage';
import { DebugOverlay } from '../components/DebugOverlay/DebugOverlay';
import { BeatmapEditorModal } from '../components/BeatmapEditor/BeatmapEditorModal';
import { DevModeService } from '../services/DevModeService';

import { SaveService } from '../services/SaveService';

import { EnergyData } from '../audio/AudioAnalyser';
import { InputAction } from '../game/InputManager';
import { LaneDir } from '../levels/Level1/DanceNoteTrack';


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
  const [missCount, setMissCount] = useState(0);
  const [triggerId, setTriggerId] = useState(0);
  const [energy, setEnergy] = useState<EnergyData>({ bass: 0.1, lowMid: 0.1, mid: 0.1, high: 0.1, overall: 0.1 });
  const [actionEvent, setActionEvent] = useState<{ id: number; action: InputAction }>({ id: 0, action: 'tap' });
  const [lastDirection, setLastDirection] = useState<LaneDir | null>(null);
  const [beatmapEvents, setBeatmapEvents] = useState<BeatmapEvent[]>([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const handleApplyBeatmap = (data: BeatmapData) => {
    setBeatmapEvents(data.events);
    if (engineRef.current) {
      engineRef.current.getBeatmapRunner().load(data);
      engineRef.current.getBeatClock().setConfig(data.bpm, data.offset);
    }
  };

  useEffect(() => {
    const offset = SaveService.load().settings.timingOffset;
    const engine = new RhythmEngine(offset, level.id);
    engineRef.current = engine;

    engine.onStatusChange(setStatus);
    engine.getBeatClock().onBeat(setCurrentBeat);
    engine.onCue(setCurrentCue);
    engine.onInput((action) => {
      setActionEvent({ id: performance.now(), action });
    });

    engine.onJudgement((j) => {
      setLastJudgement(j);
      setCombo(j.combo);
      setMaxCombo((m) => Math.max(m, j.combo));
      setScore(j.score);
      setAccuracy(engine.getScoringEngine().getAccuracy());
      setMissCount(engine.getScoringEngine().getMissCount());
      setTriggerId((t) => t + 1);
      if (j.event?.direction) {
        setLastDirection(j.event.direction as LaneDir);
      }
    });


    engine.onComplete(onFinish);

    fetch(`${level.song.beatmap}?t=${Date.now()}`)
      .then((r) => r.json())
      .then((d: BeatmapData) => {
        setBeatmapEvents(d.events);
        return engine.initializeLevel(level.song.src, d);
      })
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
    <div className="relative min-h-screen w-full flex flex-col justify-between p-4 select-none overflow-hidden">
      {/* Top Hanging Disco Ball (Only for disco nightclub levels 2, 3, 4) */}
      {level.id !== 'level1' && <DiscoBall highEnergy={energy.high} bassEnergy={energy.bass} />}

      {/* Dual Bass Speaker Stacks (Only for disco nightclub levels 2, 3, 4) */}
      {level.id !== 'level1' && <SpeakerStacks bassEnergy={energy.bass} midEnergy={energy.mid} />}

      {/* Top HUD */}
      <div className="relative z-30 flex items-center justify-between w-full max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <button
            data-interactive="true"
            tabIndex={-1}
            onFocus={(e) => e.currentTarget.blur()}
            onClick={onExit}
            className="px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs font-mono-rhythm text-white/70 hover:text-white"
          >
            ← EXIT
          </button>
          <div className="hidden sm:flex flex-col">
            <span className="text-[10px] font-mono-rhythm text-fuchsia-400 font-bold uppercase">NIGHT 0{level.levelNumber}</span>
            <span className="font-disco text-sm text-white">{level.title}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {level.id !== 'level1' && <EqualizerVisualizer energy={energy} />}
          <ScoreDisplay score={score} accuracy={accuracy} />
        </div>

        <button
          data-interactive="true"
          tabIndex={-1}
          onFocus={(e) => e.currentTarget.blur()}
          onClick={() => status === 'playing' ? engineRef.current?.pause() : engineRef.current?.resume()}
          className="px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs font-mono-rhythm text-white/70 hover:text-white"
        >
          {status === 'paused' ? '▶ RESUME' : '❚❚ PAUSE'}
        </button>
      </div>

      {/* Main Dynamic Level Stage */}
      <div className="relative z-20 flex flex-col items-center justify-center my-auto w-full">
        {/* Level 1 has its own dance-line cue system, so skip the generic cue */}
        {level.id !== 'level1' && <TutorialCue currentCue={currentCue} currentBeat={currentBeat} />}

        {/* Dynamic mini-game stage per level */}
        <div className="my-2 flex flex-col items-center w-full">
          {level.id === 'level1' && (
            <Level1Stage
              currentBeat={currentBeat}
              currentCue={currentCue}
              lastJudgement={lastJudgement?.judgement}
              lastDirection={lastDirection}
              combo={combo}
              events={beatmapEvents}
              isPlaying={status === 'playing'}
              isComplete={status === 'completed'}
              missCount={missCount}
              maxMisses={engineRef.current?.getMaxMisses() || 10}
              onDanceInput={(dir) => engineRef.current?.handlePlayerAction(dir)}
            />
          )}

          {level.id === 'level2' && (
            <Level2Stage
              currentBeat={currentBeat}
              currentCue={currentCue}
              lastJudgement={lastJudgement?.judgement}
              combo={combo}
            />
          )}

          {level.id === 'level3' && (
            <Level3Stage
              currentBeat={currentBeat}
              currentCue={currentCue}
              lastJudgement={lastJudgement?.judgement}
              combo={combo}
            />
          )}

          {level.id === 'level4' && (
            <Level4Stage
              currentBeat={currentBeat}
              lastJudgement={lastJudgement?.judgement}
              combo={combo}
              score={score}
              accuracy={accuracy}
              isCompleted={status === 'completed'}
            />
          )}
        </div>

        <RhythmFeedback judgement={lastJudgement?.judgement ?? null} deltaMs={lastJudgement?.deltaMs} triggerId={triggerId} />

        {/* Combo counter (Level 1 shows combo in its own stage HUD) */}
        {level.id !== 'level1' && (
          <div className="mt-1">
            <ComboCounter combo={combo} maxCombo={maxCombo} />
          </div>
        )}
      </div>

      {/* Crowd Duck Silhouettes along the floor (Only for disco nightclub levels 2, 3, 4) */}
      {level.id !== 'level1' && <CrowdSilhouettes currentBeat={currentBeat} combo={combo} />}

      {/* Bottom control tip (Only for levels 2, 3, 4) */}
      {level.id !== 'level1' && (
        <div className="relative z-20 text-center pb-2">
          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-mono-rhythm text-[11px] text-white/70 tracking-widest uppercase">
              SPACEBAR • CLICK • TOUCH TO JUMP / FLAP / GROOVE
            </span>
          </div>
        </div>
      )}

      {/* Animated Level Splash Screen Intro */}
      {status === 'readyToStart' && (
        <LevelSplashIntro level={level} onStart={handleStart} />
      )}

      {/* Loading Indicator */}
      {status === 'loading' && (
        <div className="absolute inset-0 z-40 bg-black/90 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 rounded-full border-4 border-fuchsia-500 border-t-transparent animate-spin mb-4" />
          <h3 className="font-disco text-xl text-yellow-300 mb-1">WARMING UP THE QUACK...</h3>
          <span className="text-xs font-mono-rhythm text-white/50 tracking-widest uppercase">DECODING AUDIO</span>
        </div>
      )}

      {/* Stage Failed (10 Miss Reached) Overlay */}
      {status === 'failed' && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex flex-col items-center justify-center p-6 text-center select-none animate-fadeIn">
          <div className="w-20 h-20 rounded-full bg-rose-600/30 border-2 border-rose-500 flex items-center justify-center text-4xl mb-4 animate-bounce">
            😵
          </div>
          <span className="text-xs font-mono-rhythm text-rose-400 font-bold uppercase tracking-widest mb-1">
            OUT OF GROOVE • 10 MISS LIMIT
          </span>
          <h2 className="font-disco text-4xl sm:text-5xl text-white neon-glow-magenta mb-3">
            KEEP GOING!
          </h2>
          <p className="max-w-md text-white/70 text-xs sm:text-sm font-mono-rhythm mb-8 leading-relaxed">
            A few steps fell off-beat (10 miss limit). Don't give up, keep to the rhythm and try again to unlock the secret gift!
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
            <button
              onClick={() => {
                setMissCount(0);
                engineRef.current?.restart();
              }}
              className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-disco text-sm font-bold tracking-wider uppercase shadow-[0_0_25px_rgba(234,179,8,0.5)] active:scale-95 transition-all cursor-pointer"
            >
              🔁 TRY AGAIN
            </button>
            <button
              onClick={onExit}
              className="flex-1 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-disco text-sm tracking-wider uppercase border border-white/20 active:scale-95 transition-all cursor-pointer"
            >
              🚪 EXIT
            </button>
          </div>
        </div>
      )}

      <PauseMenu
        isOpen={status === 'paused'}
        onResume={() => engineRef.current?.resume()}
        onRestart={() => engineRef.current?.restart()}
        onExit={onExit}
        onOpenEditor={() => setIsEditorOpen(true)}
      />

      {DevModeService.isEnabled() && (
        <>
          <DebugOverlay
            engine={engineRef.current}
            lastJudgement={lastJudgement}
            onOpenEditor={() => setIsEditorOpen(true)}
          />

          <BeatmapEditorModal
            isOpen={isEditorOpen}
            onClose={() => setIsEditorOpen(false)}
            onApplyBeatmap={handleApplyBeatmap}
          />
        </>
      )}
    </div>
  );
};



