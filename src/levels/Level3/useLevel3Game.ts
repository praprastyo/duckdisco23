import { useEffect, useRef, useState, useCallback } from 'react';
import { AudioEngine } from '../../audio/AudioEngine';
import { EnergyData } from '../../audio/AudioAnalyser';
import {
  Level3Config,
  CommandRound,
  RhythmCommand,
  Direction,
  GamePhase,
  DJQuackPose,
  JudgementRating,
  Level3Summary,
  MusicSection,
} from './level3Types';
import { loadLevel3Config } from './level3Data';

export interface Level3GameState {
  songTime: number;
  phase: GamePhase;
  phaseBanner: string;
  currentSection: MusicSection;
  currentRound: CommandRound | null;
  currentCommandIndex: number;
  activeDemoDirection: Direction | null;
  isDemoFake: boolean;
  activePlayerDirection: Direction | null;
  quackPose: DJQuackPose;
  score: number;
  combo: number;
  maxCombo: number;
  accuracy: number;
  perfectCount: number;
  greatCount: number;
  goodCount: number;
  missCount: number;
  wrongMovesCount: number;
  fullGroovesCount: number;
  lastRating: JudgementRating | null;
  lastDeltaMs: number | null;
  energy: EnergyData;
  autoplay: boolean;
  isSpecialFinish: boolean;
}

export function useLevel3Game(
  onFinish?: (summary: Level3Summary) => void,
  initialAutoplay = false
) {
  const [config, setConfig] = useState<Level3Config>(() => loadLevel3Config());
  const [autoplay, setAutoplay] = useState(initialAutoplay);

  const [state, setState] = useState<Level3GameState>(() => ({
    songTime: 0,
    phase: 'intro',
    phaseBanner: 'GET READY',
    currentSection: config.sections[0],
    currentRound: null,
    currentCommandIndex: 0,
    activeDemoDirection: null,
    isDemoFake: false,
    activePlayerDirection: null,
    quackPose: 'idle',
    score: 0,
    combo: 0,
    maxCombo: 0,
    accuracy: 100,
    perfectCount: 0,
    greatCount: 0,
    goodCount: 0,
    missCount: 0,
    wrongMovesCount: 0,
    fullGroovesCount: 0,
    lastRating: null,
    lastDeltaMs: null,
    energy: { bass: 0.1, lowMid: 0.1, mid: 0.1, high: 0.1, overall: 0.1 },
    autoplay: initialAutoplay,
    isSpecialFinish: false,
  }));

  const gameRef = useRef({
    config,
    autoplay,
    prevSongTime: -1,
    activeRoundIndex: -1,
    currentCommandIdx: 0,
    realCommands: [] as { command: RhythmCommand; absTime: number; judged: boolean }[],
    demoCommands: [] as { command: RhythmCommand; absTime: number; played: boolean }[],
    hasFailedAnyInRound: false,
    isAllPerfectInRound: true,
    score: 0,
    combo: 0,
    maxCombo: 0,
    perfect: 0,
    great: 0,
    good: 0,
    miss: 0,
    wrongMoves: 0,
    fullGrooves: 0,
    finishedDispatched: false,
  });

  gameRef.current.config = config;
  gameRef.current.autoplay = autoplay;

  // Helper to re-sync stats into React state
  const syncStats = useCallback(() => {
    const g = gameRef.current;
    const total = g.perfect + g.great + g.good + g.miss + g.wrongMoves;
    const acc =
      total === 0
        ? 100
        : Number(
            (
              ((g.perfect * 1.0 + g.great * 0.75 + g.good * 0.4) / total) *
              100
            ).toFixed(1)
          );

    setState((s) => ({
      ...s,
      score: g.score,
      combo: g.combo,
      maxCombo: g.maxCombo,
      accuracy: acc,
      perfectCount: g.perfect,
      greatCount: g.great,
      goodCount: g.good,
      missCount: g.miss,
      wrongMovesCount: g.wrongMoves,
      fullGroovesCount: g.fullGrooves,
    }));
  }, []);
  // Handle directional input from Desktop (Keyboard) or Mobile (Buttons)
  const handleDirectionInput = useCallback(
    (inputDir: Direction, isAutoplayTrigger = false) => {
      const audio = AudioEngine.getInstance();
      const currentAudioTime = audio.getCurrentTime();
      const g = gameRef.current;
      const cfg = g.config;

      // Only accept scored inputs during 'response' phase!
      if (g.activeRoundIndex < 0 || g.activeRoundIndex >= cfg.rounds.length) return;
      const round = cfg.rounds[g.activeRoundIndex];
      const adjustedInputTime = currentAudioTime - cfg.inputLatencyOffset;

      // Find the first unjudged real command in the active round
      const unjudgedIdx = g.realCommands.findIndex((c) => !c.judged);
      if (unjudgedIdx === -1) return;

      const target = g.realCommands[unjudgedIdx];
      const timingError = isAutoplayTrigger ? 0 : adjustedInputTime - target.absTime;
      const absError = Math.abs(timingError);
      const deltaMs = Math.round(timingError * 1000);

      // Check direction match
      const isDirCorrect = inputDir === target.command.direction;

      let rating: JudgementRating = 'miss';
      let scoreGained = 0;

      if (!isDirCorrect) {
        rating = 'wrong';
        g.wrongMoves++;
        g.combo = 0;
        g.hasFailedAnyInRound = true;
        g.isAllPerfectInRound = false;
        audio.playSfx('miss');
      } else {
        if (absError <= cfg.hitWindows.perfect) {
          rating = 'perfect';
          scoreGained = 300;
          g.perfect++;
          g.combo++;
          audio.playSfx('clap');
        } else if (absError <= cfg.hitWindows.great) {
          rating = 'great';
          scoreGained = 200;
          g.great++;
          g.combo++;
          g.isAllPerfectInRound = false;
          audio.playSfx('cowbell');
        } else if (absError <= cfg.hitWindows.good) {
          rating = 'good';
          scoreGained = 100;
          g.good++;
          g.isAllPerfectInRound = false;
          audio.playSfx('quack');
        } else {
          rating = 'miss';
          g.miss++;
          g.combo = 0;
          g.hasFailedAnyInRound = true;
          g.isAllPerfectInRound = false;
          audio.playSfx('miss');
        }
      }

      target.judged = true;
      g.maxCombo = Math.max(g.maxCombo, g.combo);
      g.score += scoreGained;

      // Pose for DJ Quack
      const poseMap: Record<Direction, DJQuackPose> = {
        left: 'player-left',
        up: 'player-up',
        right: 'player-right',
        down: 'player-down',
      };
      const newPose: DJQuackPose =
        rating === 'wrong' ? 'wrong-move' : rating === 'miss' ? 'miss' : poseMap[inputDir];

      setState((s) => ({
        ...s,
        quackPose: newPose,
        activePlayerDirection: inputDir,
        lastRating: rating,
        lastDeltaMs: deltaMs,
      }));

      syncStats();
    },
    [syncStats]
  );

  // Main update animation loop
  useEffect(() => {
    let animId: number;
    const audio = AudioEngine.getInstance();

    const loop = () => {
      animId = requestAnimationFrame(loop);
      const currentT = audio.getCurrentTime();
      const duration = audio.getDuration();
      const g = gameRef.current;
      const cfg = g.config;

      if (currentT < g.prevSongTime - 0.4 || currentT < 0.1) {
        g.activeRoundIndex = -1;
        g.realCommands = [];
        g.demoCommands = [];
        g.prevSongTime = currentT;
      }

      if (!g.finishedDispatched && duration > 10 && currentT >= Math.min(duration - 0.5, 257)) {
        g.finishedDispatched = true;
        const totalJudged = g.perfect + g.great + g.good + g.miss + g.wrongMoves;
        const acc =
          totalJudged === 0
            ? 100
            : Number((((g.perfect * 1.0 + g.great * 0.75 + g.good * 0.4) / totalJudged) * 100).toFixed(1));
        const summary: Level3Summary = {
          score: g.score,
          accuracy: acc,
          perfect: g.perfect,
          great: g.great,
          good: g.good,
          miss: g.miss,
          wrongMoves: g.wrongMoves,
          maxCombo: g.maxCombo,
          fullGrooves: g.fullGrooves,
          cleared: acc >= cfg.clearAccuracyThreshold,
        };
        setState((s) => ({ ...s, phase: 'finished', phaseBanner: 'LEVEL COMPLETE' }));
        onFinish?.(summary);
        return;
      }

      const activeTrans = cfg.transitions.find((t) => currentT >= t.startTime && currentT <= t.endTime);
      const currentSec =
        cfg.sections.find((s) => currentT >= s.startTime && currentT < s.endTime) ||
        cfg.sections[cfg.sections.length - 1];
      const curEnergy = audio.getAnalyser().getEnergy();

      if (activeTrans) {
        setState((s) => ({
          ...s,
          songTime: currentT,
          phase: 'transition',
          phaseBanner: activeTrans.label || 'SLOW IT DOWN',
          currentSection: currentSec,
          activeDemoDirection: null,
          quackPose: 'idle',
          energy: curEnergy,
        }));
        g.prevSongTime = currentT;
        return;
      }

      let roundIdx = -1;
      for (let i = 0; i < cfg.rounds.length; i++) {
        const r = cfg.rounds[i];
        const lastCmdOffset = r.commands.reduce((max, c) => Math.max(max, c.offset), 0);
        const roundEnd = r.responseStart + lastCmdOffset + 2.0;
        if (currentT >= r.demoStart && currentT <= roundEnd) {
          roundIdx = i;
          break;
        }
      }

      if (roundIdx !== g.activeRoundIndex) {
        g.activeRoundIndex = roundIdx;
        if (roundIdx >= 0) {
          const r = cfg.rounds[roundIdx];
          g.hasFailedAnyInRound = false;
          g.isAllPerfectInRound = true;
          g.realCommands = r.commands
            .filter((c) => !c.fake)
            .map((c) => ({ command: c, absTime: r.responseStart + c.offset, judged: false }));
          g.demoCommands = r.commands.map((c) => ({
            command: c,
            absTime: r.demoStart + c.offset,
            played: false,
          }));
        }
      }

      if (roundIdx === -1) {
        setState((s) => ({
          ...s,
          songTime: currentT,
          phase: currentT < 4 ? 'intro' : 'idle' as GamePhase,
          phaseBanner: currentT < 4 ? 'GET READY' : 'FEEL THE GROOVE',
          currentSection: currentSec,
          currentRound: null,
          activeDemoDirection: null,
          activePlayerDirection: null,
          energy: curEnergy,
        }));
        g.prevSongTime = currentT;
        return;
      }

      const activeRound = cfg.rounds[roundIdx];
      const maxOffset = activeRound.commands.reduce((max, c) => Math.max(max, c.offset), 0);
      const demoEnd = activeRound.demoStart + maxOffset + 0.6;
      const responseStart = activeRound.responseStart;
      const responseEnd = responseStart + maxOffset + cfg.hitWindows.good + 0.5;

      let curPhase: GamePhase = 'watch';
      let banner = 'WATCH';

      if (currentT < demoEnd) {
        curPhase = 'watch';
        banner = 'WATCH';
        g.demoCommands.forEach((d) => {
          if (!d.played && currentT >= d.absTime) {
            d.played = true;
            const poseMap: Record<Direction, DJQuackPose> = {
              left: 'demo-left',
              up: 'demo-up',
              right: 'demo-right',
              down: 'demo-down',
            };
            if (!d.command.fake) {
              audio.playSfx(d.command.direction === 'left' ? 'quack' : d.command.direction === 'up' ? 'clap' : 'cowbell');
            }
            setState((s) => ({
              ...s,
              activeDemoDirection: d.command.direction,
              isDemoFake: Boolean(d.command.fake),
              quackPose: poseMap[d.command.direction],
            }));
          }
        });
      } else if (currentT >= demoEnd && currentT < responseStart) {
        curPhase = 'get-ready';
        banner = 'GET READY';
        setState((s) => ({ ...s, activeDemoDirection: null, isDemoFake: false, quackPose: 'idle' }));
      } else if (currentT >= responseStart && currentT < responseEnd) {
        curPhase = 'response';
        banner = 'YOUR TURN';

        if (g.autoplay) {
          const nextAutoplayCmd = g.realCommands.find((c) => !c.judged && currentT >= c.absTime);
          if (nextAutoplayCmd) {
            handleDirectionInput(nextAutoplayCmd.command.direction, true);
          }
        }

        g.realCommands.forEach((c) => {
          if (!c.judged && currentT > c.absTime + cfg.hitWindows.good + 0.05) {
            c.judged = true;
            g.miss++;
            g.combo = 0;
            g.hasFailedAnyInRound = true;
            g.isAllPerfectInRound = false;
            audio.playSfx('miss');
            setState((s) => ({
              ...s,
              quackPose: 'miss',
              lastRating: 'miss',
              lastDeltaMs: null,
            }));
            syncStats();
          }
        });
      } else {
        curPhase = 'round-result';
        const allJudged = g.realCommands.length > 0 && g.realCommands.every((c) => c.judged);

        if (allJudged && !g.hasFailedAnyInRound) {
          banner = g.isAllPerfectInRound ? 'PERFECT GROOVE! ✨' : 'FULL GROOVE! 🌟';
          if (!(activeRound as unknown as { bonusGiven?: boolean }).bonusGiven) {
            (activeRound as unknown as { bonusGiven?: boolean }).bonusGiven = true;
            g.fullGrooves++;
            g.score += cfg.sequenceBonus;
            audio.playSfx('reveal');
            syncStats();
          }
        } else {
          banner = 'ROUND COMPLETE';
        }
      }

      setState((s) => ({
        ...s,
        songTime: currentT,
        phase: curPhase,
        phaseBanner: banner,
        currentSection: currentSec,
        currentRound: activeRound,
        energy: curEnergy,
        isSpecialFinish: roundIdx === cfg.rounds.length - 1 && !g.hasFailedAnyInRound,
      }));

      g.prevSongTime = currentT;
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [config, onFinish, handleDirectionInput, syncStats]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      let dir: Direction | null = null;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') dir = 'left';
      else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') dir = 'up';
      else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') dir = 'right';
      else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') dir = 'down';

      if (dir) {
        handleDirectionInput(dir);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDirectionInput]);


  return {
    state,
    setState,
    config,
    setConfig,
    autoplay,
    setAutoplay,
    syncStats,
    handleDirectionInput,
    gameRef,
  };
}
