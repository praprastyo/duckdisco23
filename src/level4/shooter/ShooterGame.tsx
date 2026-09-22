import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AudioManager } from '../audio/AudioManager';
import { ShooterEngine } from './ShooterEngine';
import { CowboyDuckAI } from './CowboyDuckAI';
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
  const [targets, setTargets] = useState<ShooterTarget[]>([]);
  const [feedbacks, setFeedbacks] = useState<FloatFeedback[]>([]);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isRecoil, setIsRecoil] = useState(false);

  const [isGameOver, setIsGameOver] = useState(false);
  const [playerWon, setPlayerWon] = useState(false);

  const engineRef = useRef<ShooterEngine>(new ShooterEngine());
  const aiRef = useRef<CowboyDuckAI>(new CowboyDuckAI());
  const startTimeRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
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
    startTimeRef.current = performance.now();
  }, []);

  // Main 60 FPS physics & game clock
  useEffect(() => {
    startTimeRef.current = performance.now();
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

        // Update Cowboy Duck AI
        const aiAction = aiRef.current.update(deltaSec, activeTargets);
        if (aiAction.shotFired) {
          audio.playShooterPop('cowboy');
          if (aiAction.hitTargetId) {
            engineRef.current.removeTarget(aiAction.hitTargetId);
            setCowboyScore((s) => s + 1);
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
  }, [playerScore, cowboyScore, audio, onWin]);

  // Click & Aim Handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const handleShoot = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isGameOver || timeLeft <= 0 || !containerRef.current) return;
    setIsRecoil(true);
    setTimeout(() => setIsRecoil(false), 80);

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    audio.playShooterPop('shot');
    const result = engineRef.current.checkHit(x, y);

    if (result.hit && result.target) {
      if (result.points > 0) {
        audio.playShooterPop('bottle');
        setPlayerScore((s) => s + 1);
        addFeedback(x, y, '+1 BOTTLE!', '#4ade80');
      } else {
        audio.playShooterPop('forbidden');
        setPlayerScore((s) => Math.max(0, s - 1));
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

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onClick={handleShoot}
      className="relative w-full min-h-screen bg-[#06040f] text-white flex flex-col justify-between p-4 select-none cursor-crosshair overflow-hidden"
    >
      {/* Top HUD */}
      <div className="relative z-30 flex items-center justify-between w-full max-w-5xl mx-auto pointer-events-auto">
        <button
          onClick={onExit}
          className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono-rhythm text-white/80 cursor-pointer"
        >
          ← RETURN TO BALLROOM
        </button>

        <div className="flex items-center gap-6 bg-black/70 px-6 py-2 rounded-2xl border border-white/10 backdrop-blur-md">
          <div className="text-right">
            <span className="text-[10px] font-mono-rhythm text-yellow-400 block uppercase font-bold">YOU</span>
            <span className="text-2xl font-disco text-yellow-300">{playerScore}</span>
          </div>
          <div className="text-center px-4 border-x border-white/10">
            <span className="text-[9px] font-mono-rhythm text-white/50 block uppercase">TIME</span>
            <span className="text-xl font-mono-rhythm font-bold text-cyan-400">
              00:{timeLeft.toString().padStart(2, '0')}
            </span>
          </div>
          <div className="text-left">
            <span className="text-[10px] font-mono-rhythm text-rose-400 block uppercase font-bold">COWBOY</span>
            <span className="text-2xl font-disco text-rose-300">{cowboyScore}</span>
          </div>
        </div>

        <div className="text-right text-[10px] font-mono-rhythm text-white/50">
          HIT: <span className="text-emerald-400 font-bold">🍾 +1</span> | AVOID: <span className="text-rose-400 font-bold">🍸💩🌵 -1</span>
        </div>
      </div>

      {/* Main Bar Playfield */}
      <div className="relative z-20 flex-1 w-full max-w-5xl mx-auto my-2 rounded-3xl border-2 border-amber-600/30 bg-gradient-to-b from-[#180a2b] via-[#0d0718] to-[#120803] overflow-hidden shadow-2xl">
        {/* Animated Flying Targets */}
        {targets.map((t) => {
          const def = TARGET_DEFS[t.type];
          return (
            <div
              key={t.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-75"
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
            className="absolute -translate-x-1/2 -translate-y-1/2 font-disco font-bold text-sm pointer-events-none animate-bounce"
            style={{ left: `${fb.x}%`, top: `${fb.y}%`, color: fb.color }}
          >
            {fb.text}
          </div>
        ))}

        {/* Custom Crosshair */}
        <div
          className={`absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-transform ${
            isRecoil ? 'scale-135' : 'scale-100'
          }`}
          style={{ left: `${mousePos.x}%`, top: `${mousePos.y}%` }}
        >
          <div className="w-8 h-8 rounded-full border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_10px_#22d3ee]">
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
          </div>
        </div>

        {/* Opponent Cowboy Duck at Bar Corner */}
        <div className="absolute bottom-4 right-6 pointer-events-none">
          <div className="w-[100px] h-[140px] bg-black/40 rounded-2xl border border-amber-500/20 p-1 flex items-center justify-center">
            <DuckNpc
              id="cowboy"
              name="Billy"
              role="Opponent"
              actionText=""
              size="sm"
              isCompleted={false}
              onClick={() => {}}
            />
          </div>
        </div>
      </div>
      {/* Win Modal */}
      {isGameOver && playerWon && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fadeIn pointer-events-auto">
          <div className="text-6xl mb-4 animate-bounce">🎯</div>
          <span className="text-xs font-mono-rhythm text-yellow-400 font-bold uppercase tracking-widest mb-1">
            QUICKER THAN THE COWBOY
          </span>
          <h2 className="font-disco text-4xl sm:text-5xl text-white mb-2">
            FINAL SCORE: {playerScore} VS {cowboyScore}
          </h2>
          <p className="font-mono-rhythm text-sm text-white/70 mb-6">
            Billy the Quack holsters his finger gun: "Fast hands, partner. You earned this."
          </p>
          <button
            onClick={onWin}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-disco font-bold cursor-pointer"
          >
            CLAIM SHOOTER SEAL ✓
          </button>
        </div>
      )}

      {/* Game Over Modal */}
      {isGameOver && !playerWon && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fadeIn pointer-events-auto">
          <div className="text-6xl mb-4 animate-bounce">🤠</div>
          <span className="text-xs font-mono-rhythm text-rose-400 font-bold uppercase tracking-widest mb-1">
            NOT FAST ENOUGH
          </span>
          <h2 className="font-disco text-3xl sm:text-4xl text-white mb-2">
            COWBOY OUT-SHOT YOU ({cowboyScore} VS {playerScore})
          </h2>
          <p className="font-mono-rhythm text-xs text-white/60 mb-6 max-w-sm">
            Focus on the green bottles and avoid clicking cocktails, poop, or cactus!
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleRestart}
              className="px-5 py-3 rounded-xl bg-yellow-400 text-black font-disco font-bold cursor-pointer"
            >
              🔁 RETRY SHOOTOUT
            </button>
            <button
              onClick={onExit}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-disco cursor-pointer"
            >
              🚪 BALLROOM
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
