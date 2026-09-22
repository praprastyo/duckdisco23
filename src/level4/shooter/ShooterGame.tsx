import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AudioManager } from '../audio/AudioManager';
import { ShooterEngine } from './ShooterEngine';
import { CowboyDuckAI, CowboyAimStatus } from './CowboyDuckAI';
import { ShooterTarget } from '../types/level4Types';
import { TARGET_DEFS } from './targetConfig';
import { DuckNpc } from '../ballroom/DuckNpc';

interface ShooterGameProps {
  onWin: () => void;
  onExit: () => void;
}

interface FloatFeedback {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
}

export const ShooterGame: React.FC<ShooterGameProps> = ({ onWin, onExit }) => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [playerScore, setPlayerScore] = useState(0);
  const [cowboyScore, setCowboyScore] = useState(0);
  const [playerPulse, setPlayerPulse] = useState(false);
  const [cowboyPulse, setCowboyPulse] = useState(false);

  const [targets, setTargets] = useState<ShooterTarget[]>([]);
  const [feedbacks, setFeedbacks] = useState<FloatFeedback[]>([]);

  // 1. Single source of truth for player aim (Local playfield coords 0-100%)
  const [playerAim, setPlayerAim] = useState({ x: 55, y: 50 });
  const [isPlayerRecoil, setIsPlayerRecoil] = useState(false);

  // 2. Separate source of truth for Cowboy AI aim (never touches player events)
  const [cowboyAim, setCowboyAim] = useState<{ x: number; y: number; state: CowboyAimStatus }>({
    x: 18,
    y: 65,
    state: 'idle',
  });

  const [countdown, setCountdown] = useState<'READY' | '3' | '2' | '1' | 'DRAW!' | null>('READY');
  const [isGameOver, setIsGameOver] = useState(false);
  const [playerWon, setPlayerWon] = useState(false);

  const engineRef = useRef<ShooterEngine>(new ShooterEngine());
  const aiRef = useRef<CowboyDuckAI>(new CowboyDuckAI());
  const startTimeRef = useRef<number | null>(null);
  const playfieldRef = useRef<HTMLDivElement>(null);
  const audio = AudioManager.getInstance();

  const handleRestart = useCallback(() => {
    engineRef.current.reset();
    aiRef.current.reset();
    setTimeLeft(60);
    setPlayerScore(0);
    setCowboyScore(0);
    setTargets([]);
    setFeedbacks([]);
    setIsGameOver(false);
    setPlayerWon(false);
    setCountdown('READY');
    startTimeRef.current = null;
  }, []);

  // Duel Start Countdown Sequence - Reliable Chained Transitions
  useEffect(() => {
    if (countdown === 'READY') {
      const t = setTimeout(() => setCountdown('3'), 800);
      return () => clearTimeout(t);
    }
    if (countdown === '3') {
      const t = setTimeout(() => setCountdown('2'), 800);
      return () => clearTimeout(t);
    }
    if (countdown === '2') {
      const t = setTimeout(() => setCountdown('1'), 800);
      return () => clearTimeout(t);
    }
    if (countdown === '1') {
      const t = setTimeout(() => {
        setCountdown('DRAW!');
        startTimeRef.current = performance.now();
      }, 800);
      return () => clearTimeout(t);
    }
    if (countdown === 'DRAW!') {
      const t = setTimeout(() => setCountdown(null), 700);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  // Main 60 FPS physics & game clock
  useEffect(() => {
    if (!startTimeRef.current) return;
    let lastTime = performance.now();
    let animId: number;

    const loop = (currentTime: number) => {
      const deltaSec = Math.min(0.05, (currentTime - lastTime) / 1000);
      lastTime = currentTime;

      const elapsedSec = (currentTime - startTimeRef.current!) / 1000;
      const remaining = Math.max(0, 60 - Math.floor(elapsedSec));
      setTimeLeft(remaining);

      if (remaining > 0) {
        // Update physics & targets
        engineRef.current.update(elapsedSec, deltaSec);
        const activeTargets = engineRef.current.getActiveTargets();
        setTargets([...activeTargets]);

        // Update Cowboy Duck AI (completely independent from player pointer)
        const aiAction = aiRef.current.update(deltaSec, activeTargets);
        const currentCowboyAim = aiRef.current.getAim();
        setCowboyAim(currentCowboyAim);

        if (aiAction.shotFired) {
          audio.playShooterPop('cowboy');
          if (aiAction.hitTargetId) {
            engineRef.current.removeTarget(aiAction.hitTargetId);
            setCowboyScore((s) => s + 1);
            setCowboyPulse(true);
            setTimeout(() => setCowboyPulse(false), 250);
          }
        }
        animId = requestAnimationFrame(loop);
      } else {
        // Match Finished!
        setIsGameOver(true);
        const won = playerScore > cowboyScore;
        setPlayerWon(won);
        if (won) {
          audio.playFanfare();
          setTimeout(() => onWin(), 1800);
        } else {
          audio.playTypingError();
        }
      }
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [countdown, playerScore, cowboyScore, audio, onWin]);

  // SINGLE POINTER HANDLERS — Local playfield coordinates only
  const handlePlayfieldPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!playfieldRef.current) return;
    const rect = playfieldRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setPlayerAim({ x, y });
  };

  const handlePlayfieldPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isGameOver || timeLeft <= 0 || !playfieldRef.current) return;

    const rect = playfieldRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

    setIsPlayerRecoil(true);
    setTimeout(() => setIsPlayerRecoil(false), 80);

    audio.playShooterPop('shot');
    const result = engineRef.current.checkHit(x, y);

    if (result.hit && result.target) {
      if (result.points > 0) {
        audio.playShooterPop('bottle');
        setPlayerScore((s) => s + 1);
        setPlayerPulse(true);
        setTimeout(() => setPlayerPulse(false), 250);
        addFeedback(x, y, '+1 BOTTLE!', '#4ade80');
      } else {
        audio.playShooterPop('forbidden');
        setPlayerScore((s) => Math.max(0, s - 1));
        setPlayerPulse(true);
        setTimeout(() => setPlayerPulse(false), 250);
        addFeedback(x, y, '-1 WRONG TARGET!', '#f43f5e');
      }
    }
  };

  const addFeedback = (x: number, y: number, text: string, color: string) => {
    const fb: FloatFeedback = { id: Date.now() + Math.random(), x, y, text, color };
    setFeedbacks((prev) => [...prev, fb]);
    setTimeout(() => {
      setFeedbacks((prev) => prev.filter((f) => f.id !== fb.id));
    }, 600);
  };

  const cowboyVariant =
    isGameOver
      ? playerWon
        ? 'lose'
        : 'win'
      : cowboyAim.state === 'shooting'
      ? 'shoot'
      : cowboyAim.state === 'aiming'
      ? 'aim'
      : cowboyAim.state === 'miss_reaction'
      ? 'lose'
      : 'idle';

  return (
    <div className="relative w-full min-h-screen bg-[#06040f] text-white flex flex-col justify-between p-3 sm:p-4 select-none overflow-hidden">
      {/* Top HUD */}
      <div className="relative z-30 flex items-center justify-between w-full max-w-5xl mx-auto pointer-events-auto">
        <button
          onClick={onExit}
          className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono-rhythm text-white/80 cursor-pointer"
        >
          ← RETURN TO BALLROOM
        </button>

        {/* Duel Score Comparison */}
        <div className="flex items-center gap-6 bg-black/80 px-6 py-2 rounded-2xl border border-white/15 backdrop-blur-md shadow-xl">
          <div className="text-right">
            <span className="text-[10px] font-mono-rhythm text-yellow-400 block uppercase font-bold">
              YOU
            </span>
            <span
              className={`text-2xl font-disco text-yellow-300 transition-transform duration-150 inline-block ${
                playerPulse ? 'scale-135 text-white' : 'scale-100'
              }`}
            >
              {playerScore}
            </span>
          </div>
          <div className="text-center px-4 border-x border-white/10">
            <span className="text-[9px] font-mono-rhythm text-white/50 block uppercase">
              TIME
            </span>
            <span
              className={`text-xl font-mono-rhythm font-bold ${
                timeLeft <= 10 ? 'text-rose-500 animate-pulse text-2xl' : 'text-cyan-400'
              }`}
            >
              00:{timeLeft.toString().padStart(2, '0')}
            </span>
          </div>
          <div className="text-left">
            <span className="text-[10px] font-mono-rhythm text-rose-400 block uppercase font-bold">
              COWBOY BILLY
            </span>
            <span
              className={`text-2xl font-disco text-rose-300 transition-transform duration-150 inline-block ${
                cowboyPulse ? 'scale-135 text-white' : 'scale-100'
              }`}
            >
              {cowboyScore}
            </span>
          </div>
        </div>

        <div className="text-right text-[10px] font-mono-rhythm text-white/60">
          HIT: <span className="text-emerald-400 font-bold">BOTTLE (+1)</span> | AVOID:{' '}
          <span className="text-rose-400 font-bold">FORBIDDEN (-1)</span>
        </div>
      </div>

      {/* Main Bar Playfield — SINGLE POINTER EVENT SOURCE & cursor: none */}
      <div
        ref={playfieldRef}
        onPointerMove={handlePlayfieldPointerMove}
        onPointerDown={handlePlayfieldPointerDown}
        className="relative shooter-playfield flex-1 w-full max-w-5xl mx-auto my-2 rounded-3xl border-2 border-amber-600/30 bg-gradient-to-b from-[#1a0a2e] via-[#0d0718] to-[#120803] overflow-hidden shadow-2xl [cursor:none] select-none flex"
      >
        {/* Duel Start Countdown Banner */}
        {countdown !== null && (
          <div className="absolute inset-0 z-40 bg-black/50 flex items-center justify-center pointer-events-none animate-fadeIn">
            <span className="font-disco text-5xl sm:text-7xl font-bold tracking-widest text-yellow-400 drop-shadow-[0_0_30px_rgba(250,204,21,0.9)] animate-pulse">
              {countdown}
            </span>
          </div>
        )}

        {/* Left Side: Cowboy Duck Stance (~22% width) */}
        <div className="w-[110px] sm:w-[150px] h-full flex flex-col justify-end items-center pb-4 pl-2 pointer-events-none z-20">
          <div className="bg-black/50 border border-amber-500/30 rounded-2xl p-2 flex flex-col items-center shadow-lg">
            <DuckNpc
              id="cowboy"
              name="Billy"
              role={
                cowboyAim.state === 'aiming'
                  ? 'AIMING'
                  : cowboyAim.state === 'shooting'
                  ? 'FIRING'
                  : cowboyAim.state === 'miss_reaction'
                  ? 'MISSED'
                  : 'READY'
              }
              actionText=""
              size="sm"
              variant={cowboyVariant}
              isCompleted={false}
              onClick={() => {}}
            />
          </div>
        </div>

        {/* Bartender Duck behind the bar counter tossing bottles */}
        <div className="absolute bottom-12 left-[36%] pointer-events-none opacity-85 z-10 flex flex-col items-center">
          <span className="text-[8px] font-mono-rhythm text-amber-300 font-bold tracking-wider">
            BARTENDER
          </span>
        </div>

        {/* Target Flying Area */}
        <div className="relative flex-1 h-full pointer-events-none">
          {/* Animated Flying Targets */}
          {targets.map((t) => {
            const def = TARGET_DEFS[t.type];
            return (
              <div
                key={t.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-75 z-15"
                style={{
                  left: `${t.x}%`,
                  top: `${t.y}%`,
                  transform: `translate(-50%, -50%) rotate(${t.rotation}deg) scale(${t.scale})`,
                }}
              >
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-3xl drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                  {def.icon}
                </div>
              </div>
            );
          })}

          {/* Floating Hit Feedback Text */}
          {feedbacks.map((fb) => (
            <div
              key={fb.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 font-disco font-bold text-sm pointer-events-none animate-bounce z-25"
              style={{ left: `${fb.x}%`, top: `${fb.y}%`, color: fb.color }}
            >
              {fb.text}
            </div>
          ))}
        </div>

        {/* 1. PLAYER CROSSHAIR — Controlled ONLY by playerAim */}
        <div
          className={`absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 z-30 ${
            isPlayerRecoil ? 'scale-135' : 'scale-100'
          }`}
          style={{ left: `${playerAim.x}%`, top: `${playerAim.y}%` }}
        >
          <div className="w-10 h-10 rounded-full border-2 border-yellow-300 flex items-center justify-center shadow-[0_0_12px_rgba(250,204,21,0.85)] bg-yellow-400/5">
            <div className="w-2 h-2 rounded-full bg-white shadow-sm" />
            <div className="absolute w-full h-[1px] bg-yellow-300/80" />
            <div className="absolute h-full w-[1px] bg-yellow-300/80" />
          </div>
          <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-mono-rhythm text-yellow-300 font-bold tracking-wider">
            YOU
          </span>
        </div>

        {/* 2. COWBOY CROSSHAIR — Controlled ONLY by cowboyAim AI */}
        <div
          className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-all duration-75 z-25"
          style={{ left: `${cowboyAim.x}%`, top: `${cowboyAim.y}%` }}
        >
          <div
            className={`w-9 h-9 rounded-full border-2 border-rose-500 flex items-center justify-center shadow-[0_0_12px_rgba(244,63,94,0.9)] ${
              cowboyAim.state === 'shooting' ? 'scale-130 bg-rose-500/25 ring-2 ring-rose-400' : 'scale-100'
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-rose-500" />
            <div className="absolute w-full h-[1.5px] bg-rose-500/90" />
            <div className="absolute h-full w-[1.5px] bg-rose-500/90" />
          </div>
          <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-mono-rhythm text-rose-400 font-bold tracking-wider">
            COWBOY
          </span>
        </div>
      </div>
      {/* Win Modal */}
      {isGameOver && playerWon && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fadeIn pointer-events-auto">
          <span className="text-xs font-mono-rhythm text-yellow-400 font-bold uppercase tracking-widest mb-1">
            QUICKER THAN THE COWBOY
          </span>
          <h2 className="font-disco text-3xl sm:text-4xl text-white mb-2">
            FINAL SCORE: {playerScore} VS {cowboyScore}
          </h2>
          <p className="font-mono-rhythm text-sm text-white/80 mb-6 max-w-md">
            Billy the Quack lowers his arm and tips his hat: "You're quick. Too quick."
          </p>
          <button
            onClick={onWin}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-disco font-bold cursor-pointer uppercase tracking-wider"
          >
            CLAIM SHOOTER SEAL
          </button>
        </div>
      )}

      {/* Game Over Modal */}
      {isGameOver && !playerWon && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fadeIn pointer-events-auto">
          <span className="text-xs font-mono-rhythm text-rose-400 font-bold uppercase tracking-widest mb-1">
            NOT FAST ENOUGH
          </span>
          <h2 className="font-disco text-3xl sm:text-4xl text-white mb-2">
            COWBOY OUT-SHOT YOU ({cowboyScore} VS {playerScore})
          </h2>
          <p className="font-mono-rhythm text-xs text-white/60 mb-6 max-w-sm">
            Focus on the bottles and avoid clicking cocktails, mud, or cactus.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleRestart}
              className="px-5 py-3 rounded-xl bg-yellow-400 text-black font-disco font-bold cursor-pointer uppercase"
            >
              RETRY SHOOTOUT
            </button>
            <button
              onClick={onExit}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-disco cursor-pointer uppercase"
            >
              BALLROOM
            </button>
          </div>
        </div>
      )}

      <div className="relative z-20 text-center pb-2 text-[11px] font-mono-rhythm text-white/40 pointer-events-auto">
        Shoot flying bottles (+1) before time expires. Avoid cocktails, mud, and cactus (-1). Beat Cowboy Billy to win.
      </div>
    </div>
  );
};
