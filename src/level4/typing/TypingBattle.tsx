import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AudioManager } from '../audio/AudioManager';
import { typingStoryLines } from './typingStory';
import { TOTAL_STORY_CHARS, calculateWpm } from './TypingEngine';
import { TypingDuckAI } from './TypingDuckAI';

interface TypingBattleProps {
  onWin: () => void;
  onExit: () => void;
}

export const TypingBattle: React.FC<TypingBattleProps> = ({ onWin, onExit }) => {
  const [lineIndex, setLineIndex] = useState(0);
  const [typedLine, setTypedLine] = useState('');
  const [mistakes, setMistakes] = useState(0);
  const [lineCompletedWaitingEnter, setLineCompletedWaitingEnter] = useState(false);
  const [shakeLine, setShakeLine] = useState(false);

  const [playerWpm, setPlayerWpm] = useState(0);
  const [aiWpm, setAiWpm] = useState(60);
  const [aiProgress, setAiProgress] = useState(0);
  const [playerTotalChars, setPlayerTotalChars] = useState(0);

  const [isGameOver, setIsGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [gameOverReason, setGameOverReason] = useState<string | null>(null);

  const aiRef = useRef<TypingDuckAI>(new TypingDuckAI());
  const startTimeRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const audio = AudioManager.getInstance();

  const currentExpectedLine = typingStoryLines[lineIndex] || '';
  const playerProgress = Math.min(
    100,
    Math.round(((playerTotalChars + typedLine.length) / TOTAL_STORY_CHARS) * 100)
  );

  const handleRestart = useCallback(() => {
    setLineIndex(0);
    setTypedLine('');
    setMistakes(0);
    setLineCompletedWaitingEnter(false);
    setShakeLine(false);
    setPlayerWpm(0);
    setAiWpm(60);
    setAiProgress(0);
    setPlayerTotalChars(0);
    setIsGameOver(false);
    setIsWon(false);
    setGameOverReason(null);
    aiRef.current.reset();
    startTimeRef.current = null;
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (isGameOver || isWon) return;
    let lastTime = performance.now();
    const timer = setInterval(() => {
      const now = performance.now();
      const deltaSec = (now - lastTime) / 1000;
      lastTime = now;
      if (!startTimeRef.current) return;

      const aiStatus = aiRef.current.update(deltaSec);
      setAiWpm(aiStatus.currentWpm);
      setAiProgress(aiStatus.progressPercent);

      if (aiStatus.progressPercent >= 100) {
        setIsGameOver(true);
        setGameOverReason('TYPING DUCK FINISHED FIRST!');
        audio.playTypingError();
        return;
      }

      const elapsedMin = (now - startTimeRef.current) / 60000;
      setPlayerWpm(calculateWpm(playerTotalChars + typedLine.length, elapsedMin));
    }, 100);

    return () => clearInterval(timer);
  }, [isGameOver, isWon, playerTotalChars, typedLine.length, audio]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isGameOver || isWon) return;
    if (!startTimeRef.current) startTimeRef.current = performance.now();

    if (lineCompletedWaitingEnter) {
      if (e.key === 'Enter') {
        e.preventDefault();
        audio.playCarriageReturn();
        const nextChars = playerTotalChars + currentExpectedLine.length;
        setPlayerTotalChars(nextChars);

        if (lineIndex + 1 >= typingStoryLines.length) {
          setIsWon(true);
          audio.playFanfare();
          setTimeout(() => onWin(), 1800);
        } else {
          setLineIndex((prev) => prev + 1);
          setTypedLine('');
          setLineCompletedWaitingEnter(false);
        }
      }
      return;
    }

    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      const expectedChar = currentExpectedLine[typedLine.length];

      if (e.key === expectedChar) {
        audio.playTypewriterKey(typedLine.length);
        const nextTyped = typedLine + e.key;
        setTypedLine(nextTyped);
        if (nextTyped.length === currentExpectedLine.length) {
          setLineCompletedWaitingEnter(true);
        }
      } else {
        audio.playTypingError();
        setShakeLine(true);
        setTimeout(() => setShakeLine(false), 400);
        const newMistakes = mistakes + 1;
        setMistakes(newMistakes);
        setTypedLine('');
        if (newMistakes >= 3) {
          setIsGameOver(true);
          setGameOverReason('TOO MANY MISTAKES (3/3)!');
        }
      }
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="relative w-full min-h-screen bg-[#070312] text-white flex flex-col justify-between p-4 select-none cursor-text overflow-hidden"
    >
      <input
        ref={inputRef}
        type="text"
        className="opacity-0 absolute -top-96"
        autoFocus
        onKeyDown={handleKeyDown}
        readOnly
      />
      {/* Top HUD */}
      <div className="relative z-20 flex items-center justify-between w-full max-w-5xl mx-auto">
        <button
          onClick={onExit}
          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono-rhythm text-white/80 cursor-pointer"
        >
          ← RETURN TO BALLROOM
        </button>

        <div className="text-center">
          <span className="text-[10px] font-mono-rhythm text-cyan-400 font-bold tracking-widest block uppercase">
            TYPING BATTLE VS PROF. QUILL
          </span>
          <span className="text-xs font-mono-rhythm text-white/60">
            LINE {lineIndex + 1} / {typingStoryLines.length}
          </span>
        </div>

        <div className="flex items-center gap-1 bg-black/60 px-3 py-1.5 rounded-xl border border-white/10">
          <span className="text-[10px] font-mono-rhythm text-rose-400 mr-1 font-bold">ERRORS:</span>
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className="text-sm">
              {i < mistakes ? '💔' : '❤️'}
            </span>
          ))}
        </div>
      </div>

      {/* Progress Bars */}
      <div className="relative z-20 w-full max-w-3xl mx-auto bg-black/70 border border-white/10 rounded-2xl p-4 shadow-xl backdrop-blur-md">
        <div className="mb-3">
          <div className="flex justify-between text-xs font-mono-rhythm mb-1">
            <span className="text-yellow-400 font-bold flex items-center gap-1.5">
              <span>🕺 YOU</span>
              <span className="text-white/60 font-normal">({playerWpm} WPM)</span>
            </span>
            <span className="text-yellow-400 font-bold">{playerProgress}%</span>
          </div>
          <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-white/10">
            <div className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-150" style={{ width: `${playerProgress}%` }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono-rhythm mb-1">
            <span className="text-cyan-400 font-bold flex items-center gap-1.5">
              <span>🦆 PROF. QUILL</span>
              <span className="text-white/60 font-normal">({aiWpm} WPM)</span>
            </span>
            <span className="text-cyan-400 font-bold">{aiProgress}%</span>
          </div>
          <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-white/10">
            <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-150" style={{ width: `${aiProgress}%` }} />
          </div>
        </div>
      </div>

      {/* Typewriter Line */}
      <div className="relative z-20 w-full max-w-3xl mx-auto my-auto flex flex-col items-center">
        <div className={`w-full bg-[#f8fafc] text-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl border-4 border-amber-600/60 font-mono transition-transform duration-150 ${
          shakeLine ? 'translate-x-3 border-rose-600 bg-rose-50 ring-4 ring-rose-500/50' : ''
        }`}>
          <div className="text-lg sm:text-2xl font-bold leading-relaxed tracking-wide min-h-[3.5rem] flex flex-wrap items-center">
            {currentExpectedLine.split('').map((char, i) => {
              const isTyped = i < typedLine.length;
              const isCurrent = i === typedLine.length;
              return (
                <span key={i} className={isTyped ? 'text-emerald-700 bg-emerald-100/80 rounded-xs' : isCurrent ? 'text-slate-950 underline decoration-amber-500 decoration-4 bg-amber-200' : 'text-slate-400'}>
                  {char === ' ' ? '\u00A0' : char}
                </span>
              );
            })}
          </div>

          {lineCompletedWaitingEnter && (
            <div className="mt-4 pt-3 border-t border-slate-300 flex items-center justify-between text-xs sm:text-sm font-bold text-amber-700 animate-pulse">
              <span>🔔 LINE FINISHED! PRESS [ ENTER ↵ ] TO ADVANCE CARRIAGE</span>
              <kbd className="px-3 py-1 rounded-md bg-amber-600 text-white shadow-md">ENTER ↵</kbd>
            </div>
          )}
        </div>

        {lineIndex + 1 < typingStoryLines.length && (
          <div className="mt-3 text-xs font-mono-rhythm text-white/40 text-center">
            NEXT: "{typingStoryLines[lineIndex + 1]}"
          </div>
        )}
      </div>
      {/* Win Modal */}
      {isWon && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
          <div className="text-6xl mb-4 animate-bounce">🏆</div>
          <span className="text-xs font-mono-rhythm text-yellow-400 font-bold uppercase tracking-widest mb-1">
            SPEED TYPING MASTER
          </span>
          <h2 className="font-disco text-4xl sm:text-5xl text-white mb-2">YOU OUT-TYPED THE DUCK!</h2>
          <p className="font-mono-rhythm text-sm text-white/70 mb-6">
            Prof. Quill bows: "Fine. Your fingers fly faster than my wings."
          </p>
          <button onClick={onWin} className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-disco font-bold cursor-pointer">
            CLAIM TYPING SEAL ✓
          </button>
        </div>
      )}

      {/* Game Over Modal */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
          <div className="text-6xl mb-4 animate-bounce">😵</div>
          <span className="text-xs font-mono-rhythm text-rose-400 font-bold uppercase tracking-widest mb-1">GAME OVER</span>
          <h2 className="font-disco text-3xl sm:text-4xl text-white mb-2">{gameOverReason}</h2>
          <div className="flex gap-3 mt-4">
            <button onClick={handleRestart} className="px-5 py-3 rounded-xl bg-yellow-400 text-black font-disco font-bold cursor-pointer">
              🔁 RETRY RACE
            </button>
            <button onClick={onExit} className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-disco cursor-pointer">
              🚪 BALLROOM
            </button>
          </div>
        </div>
      )}

      <div className="relative z-20 text-center pb-2 text-[11px] font-mono-rhythm text-white/40">
        Type exact characters. Wrong character resets current line. Press [Enter] after each line.
      </div>
    </div>
  );
};
