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
  totalFailures: number;
  maxMisses: number;
  isFailed: boolean;
  fullGroovesCount: number;
  lastRating: JudgementRating | null;
  lastDeltaMs: number | null;
  feedbackMessage: string;
  expectedDirection: Direction | null;
  countIn: string | null;
  isMissShaking: boolean;
  energy: EnergyData;
  autoplay: boolean;
  isSpecialFinish: boolean;
}

export function useLevel3Game(
  onFinish?: (summary: Level3Summary) => void,
  initialAutoplay = false,
  externalAction?: { id: number; action: string } | null
) {
  const [config, setConfig] = useState<Level3Config>(() => loadLevel3Config());
  const [autoplay, setAutoplay] = useState(initialAutoplay);
  const poseTimerRef = useRef<number | null>(null);
  const lastInputTimeRef = useRef<{ dir: Direction; time: number }>({ dir: 'left', time: 0 });

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
    totalFailures: 0,
    maxMisses: 10,
    isFailed: false,
    fullGroovesCount: 0,
    lastRating: null,
    lastDeltaMs: null,
    feedbackMessage: '',
    expectedDirection: null,
    countIn: null,
    isMissShaking: false,
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

  useEffect(() => {
    gameRef.current.config = config;
    gameRef.current.autoplay = autoplay;
  }, [config, autoplay]);

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
      totalFailures: g.miss + g.wrongMoves,
      fullGroovesCount: g.fullGrooves,
    }));
  }, []);

  const checkMissLimit = useCallback(() => {
    const g = gameRef.current;
    const totalFailures = g.miss + g.wrongMoves;
    if (totalFailures >= 10 && !g.finishedDispatched) {
      g.finishedDispatched = true;
      const audio = AudioEngine.getInstance();
      audio.pause();
      audio.playSfx('scratch');
      setState((s) => ({
        ...s,
        isFailed: true,
        phaseBanner: 'OUT OF GROOVE',
        quackPose: 'miss',
        feedbackMessage: 'OUT OF GROOVE! 10 Miss limit reached.',
        isMissShaking: true,
      }));
      return true;
    }
    return false;
  }, []);

  const restartLevel = useCallback(() => {
    const g = gameRef.current;
    g.activeRoundIndex = -1;
    g.realCommands = [];
    g.demoCommands = [];
    g.score = 0;
    g.combo = 0;
    g.maxCombo = 0;
    g.perfect = 0;
    g.great = 0;
    g.good = 0;
    g.miss = 0;
    g.wrongMoves = 0;
    g.fullGrooves = 0;
    g.finishedDispatched = false;
    g.prevSongTime = -1;

    const audio = AudioEngine.getInstance();
    audio.seek(0);
    audio.play(0);

    setState((s) => ({
      ...s,
      songTime: 0,
      phase: 'intro',
      phaseBanner: 'GET READY',
      isFailed: false,
      score: 0,
      combo: 0,
      maxCombo: 0,
      accuracy: 100,
      perfectCount: 0,
      greatCount: 0,
      goodCount: 0,
      missCount: 0,
      wrongMovesCount: 0,
      totalFailures: 0,
      quackPose: 'idle',
      lastRating: null,
      lastDeltaMs: null,
      feedbackMessage: '',
      isMissShaking: false,
    }));
  }, []);
  // Handle directional input from Desktop (Keyboard) or Mobile (Buttons)
  const handleDirectionInput = useCallback(
    (inputDir: Direction, isAutoplayTrigger = false) => {
      const now = performance.now();
      if (!isAutoplayTrigger && lastInputTimeRef.current.dir === inputDir && now - lastInputTimeRef.current.time < 35) {
        return;
      }
      lastInputTimeRef.current = { dir: inputDir, time: now };

      const audio = AudioEngine.getInstance();
      const currentAudioTime = audio.getCurrentTime();
      const g = gameRef.current;
      const cfg = g.config;

      // Always give instant visual illumination on the pad
      setState((s) => ({ ...s, activePlayerDirection: inputDir }));
      setTimeout(() => {
        setState((s) => (s.activePlayerDirection === inputDir ? { ...s, activePlayerDirection: null } : s));
      }, 180);

      // If failed or finished, do not score
      if (g.finishedDispatched) return;

      // If no active round or song hasn't reached first round
      if (g.activeRoundIndex < 0 || g.activeRoundIndex >= cfg.rounds.length) {
        audio.playSfx('cowbell');
        setState((s) => ({
          ...s,
          feedbackMessage: 'READY! Round starts soon — watch DJ Quack first!',
        }));
        return;
      }

      const round = cfg.rounds[g.activeRoundIndex];
      const adjustedInputTime = currentAudioTime - cfg.inputLatencyOffset;

      // If pressed before YOUR TURN phase
      if (adjustedInputTime < round.responseStart - cfg.hitWindows.good - 0.15) {
        audio.playSfx('cowbell');
        setState((s) => ({
          ...s,
          feedbackMessage:
            adjustedInputTime < round.responseStart - 1.2
              ? '👀 WATCH DJ QUACK! Wait for YOUR TURN!'
              : 'GET READY! Almost your turn...',
        }));
        return;
      }

      // Find the first unjudged real command in the active round
      const target = g.realCommands.find((c) => !c.judged);
      if (!target) return;

      const timingError = isAutoplayTrigger ? 0 : adjustedInputTime - target.absTime;
      const absError = Math.abs(timingError);
      const deltaMs = Math.round(timingError * 1000);

      // 1. If pressed significantly too early before this note's window:
      if (!isAutoplayTrigger && timingError < -cfg.hitWindows.good - 0.08) {
        audio.playSfx('miss');
        setState((s) => ({
          ...s,
          lastRating: 'early',
          lastDeltaMs: deltaMs,
          feedbackMessage: `TOO EARLY (${deltaMs}ms)! Hold the groove!`,
          isMissShaking: false,
        }));
        return;
      }

      // 2. Normal judging within window
      const isDirCorrect = inputDir === target.command.direction;
      let rating: JudgementRating = 'miss';
      let scoreGained = 0;
      let feedbackMsg = '';
      let isShake = false;

      const ARROW_SYM: Record<Direction, string> = { left: '←', up: '↑', right: '→', down: '↓' };

      if (!isDirCorrect) {
        rating = 'wrong';
        g.wrongMoves++;
        g.combo = 0;
        g.hasFailedAnyInRound = true;
        g.isAllPerfectInRound = false;
        audio.playSfx('miss');
        isShake = true;
        feedbackMsg = `WRONG MOVE! Expected ${ARROW_SYM[target.command.direction]} (${target.command.direction.toUpperCase()}), pressed ${ARROW_SYM[inputDir]}`;
      } else {
        if (absError <= cfg.hitWindows.perfect) {
          rating = 'perfect';
          scoreGained = 300;
          g.perfect++;
          g.combo++;
          audio.playSfx('clap');
          feedbackMsg = `PERFECT! +300 (${deltaMs > 0 ? '+' : ''}${deltaMs}ms)`;
        } else if (absError <= cfg.hitWindows.great) {
          rating = 'great';
          scoreGained = 200;
          g.great++;
          g.combo++;
          g.isAllPerfectInRound = false;
          audio.playSfx('cowbell');
          feedbackMsg = `GREAT! +200 (${deltaMs > 0 ? '+' : ''}${deltaMs}ms)`;
        } else if (absError <= cfg.hitWindows.good + 0.06) {
          rating = 'good';
          scoreGained = 100;
          g.good++;
          g.isAllPerfectInRound = false;
          audio.playSfx('quack');
          feedbackMsg = `GOOD! +100 (${deltaMs > 0 ? '+' : ''}${deltaMs}ms)`;
        } else {
          rating = 'miss';
          g.miss++;
          g.combo = 0;
          g.hasFailedAnyInRound = true;
          g.isAllPerfectInRound = false;
          audio.playSfx('miss');
          isShake = true;
          feedbackMsg = `LATE MISS (${deltaMs}ms)!`;
        }
      }

      target.judged = true;
      g.maxCombo = Math.max(g.maxCombo, g.combo);
      g.score += scoreGained;

      const nextTarget = g.realCommands.find((c) => !c.judged);

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
        feedbackMessage: feedbackMsg,
        expectedDirection: nextTarget ? nextTarget.command.direction : null,
        isMissShaking: isShake,
      }));

      // Auto-recovery timer so DJ Quack returns to idle after 350ms
      if (poseTimerRef.current) clearTimeout(poseTimerRef.current);
      poseTimerRef.current = window.setTimeout(() => {
        setState((prev) => ({
          ...prev,
          quackPose: 'idle',
          activePlayerDirection: null,
          isMissShaking: false,
        }));
      }, 350);

      syncStats();
      if (rating === 'wrong' || rating === 'miss') {
        checkMissLimit();
      }
    },
    [syncStats, checkMissLimit]
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
        const totalFailures = g.miss + g.wrongMoves;
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
          cleared: acc >= cfg.clearAccuracyThreshold && totalFailures <= 10,
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
              feedbackMessage: d.command.fake
                ? `👻 FAKE CUE: ${d.command.direction.toUpperCase()} (DO NOT REPEAT!)`
                : `WATCH: ${d.command.direction.toUpperCase()}`,
            }));

            if (poseTimerRef.current) clearTimeout(poseTimerRef.current);
            poseTimerRef.current = window.setTimeout(() => {
              setState((prev) => ({
                ...prev,
                activeDemoDirection: null,
                quackPose: 'idle',
              }));
            }, 350);
          }
        });
      } else if (currentT >= demoEnd && currentT < responseStart) {
        curPhase = 'get-ready';
        const beatDuration = 60 / Math.max(60, currentSec.bpm);
        const timeToResponse = responseStart - currentT;
        const beatsToResponse = Math.ceil(timeToResponse / beatDuration);

        let countText = 'GET READY';
        if (beatsToResponse <= 3 && beatsToResponse > 1) {
          countText = `GET READY... ${beatsToResponse}`;
        } else if (beatsToResponse === 1) {
          countText = 'GET READY... GO!';
        }
        banner = countText;

        const firstExpected = g.realCommands.find((c) => !c.judged);
        setState((s) => ({
          ...s,
          activeDemoDirection: null,
          isDemoFake: false,
          quackPose: 'idle',
          countIn: beatsToResponse <= 3 ? String(beatsToResponse) : null,
          expectedDirection: firstExpected ? firstExpected.command.direction : null,
          feedbackMessage: beatsToResponse <= 3 ? `COUNT-IN: ${beatsToResponse}` : 'GET READY!',
        }));
      } else if (currentT >= responseStart && currentT < responseEnd) {
        curPhase = 'response';
        banner = 'YOUR TURN';

        if (g.autoplay) {
          const nextAutoplayCmd = g.realCommands.find((c) => !c.judged && currentT >= c.absTime);
          if (nextAutoplayCmd) {
            handleDirectionInput(nextAutoplayCmd.command.direction, true);
          }
        }

        const ARROW_SYM: Record<Direction, string> = { left: '←', up: '↑', right: '→', down: '↓' };

        g.realCommands.forEach((c) => {
          if (!c.judged && currentT > c.absTime + cfg.hitWindows.good + 0.08) {
            c.judged = true;
            g.miss++;
            g.combo = 0;
            g.hasFailedAnyInRound = true;
            g.isAllPerfectInRound = false;
            audio.playSfx('miss');

            const nextTarget = g.realCommands.find((cmd) => !cmd.judged);

            setState((s) => ({
              ...s,
              quackPose: 'miss',
              lastRating: 'miss',
              lastDeltaMs: null,
              feedbackMessage: `MISSED! Too late on ${ARROW_SYM[c.command.direction]} (${c.command.direction.toUpperCase()})`,
              expectedDirection: nextTarget ? nextTarget.command.direction : null,
              isMissShaking: true,
            }));

            if (poseTimerRef.current) clearTimeout(poseTimerRef.current);
            poseTimerRef.current = window.setTimeout(() => {
              setState((prev) => ({
                ...prev,
                quackPose: 'idle',
                isMissShaking: false,
              }));
            }, 350);

            syncStats();
            checkMissLimit();
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
  }, [config, onFinish, handleDirectionInput, syncStats, checkMissLimit]);

  // Keyboard controls (Arrows & WASD)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If modal or text input is focused, don't capture
      if (document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.repeat) return;
      const k = e.key;
      const c = e.code;
      let dir: Direction | null = null;
      if (k === 'ArrowLeft' || k === 'a' || k === 'A' || c === 'ArrowLeft' || c === 'KeyA') dir = 'left';
      else if (k === 'ArrowUp' || k === 'w' || k === 'W' || c === 'ArrowUp' || c === 'KeyW') dir = 'up';
      else if (k === 'ArrowRight' || k === 'd' || k === 'D' || c === 'ArrowRight' || c === 'KeyD') dir = 'right';
      else if (k === 'ArrowDown' || k === 's' || k === 'S' || c === 'ArrowDown' || c === 'KeyS') dir = 'down';

      if (dir) {
        e.preventDefault();
        handleDirectionInput(dir);
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [handleDirectionInput]);

  // Secondary pipeline for external inputs from InputManager / RhythmEngine
  useEffect(() => {
    if (!externalAction || !externalAction.id) return;
    const act = externalAction.action;
    if (act === 'left' || act === 'up' || act === 'right' || act === 'down') {
      handleDirectionInput(act as Direction);
    }
  }, [externalAction, handleDirectionInput]);


  return {
    state,
    setState,
    config,
    setConfig,
    autoplay,
    setAutoplay,
    syncStats,
    handleDirectionInput,
    restartLevel,
    gameRef,
  };
}
