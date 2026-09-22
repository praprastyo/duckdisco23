import React, { useState, useEffect, useRef } from 'react';
import { AudioManager } from '../audio/AudioManager';
import { PUZZLE_QUESTIONS_RAW, shuffleQuestions, checkAnswer } from './puzzleQuestions';
import { getRandomReaction, getLeadInPhrase } from './puzzleDialogue';
import { DuckNpc } from '../ballroom/DuckNpc';
import { DuckNpcVariant } from '../types/level4Types';

interface PuzzleGameProps {
  onWin: () => void;
  onExit: () => void;
}

export const PuzzleGame: React.FC<PuzzleGameProps> = ({ onWin, onExit }) => {
  const [questions, setQuestions] = useState(() => shuffleQuestions(PUZZLE_QUESTIONS_RAW));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [mistakes, setMistakes] = useState(0);
  const [dialogueReaction, setDialogueReaction] = useState<string | null>(null);
  const [speaker, setSpeaker] = useState<'duck' | 'player'>('duck');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const audio = AudioManager.getInstance();
  const currentQ = questions[currentIndex];
  const leadIn = getLeadInPhrase(currentIndex);

  // Turn-based focus timing: Duck talks first, then player focus opens
  useEffect(() => {
    const timer = setTimeout(() => {
      setSpeaker('player');
      inputRef.current?.focus();
    }, 700);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const handleRestart = () => {
    setQuestions(shuffleQuestions(PUZZLE_QUESTIONS_RAW));
    setCurrentIndex(0);
    setInputVal('');
    setMistakes(0);
    setDialogueReaction(null);
    setSpeaker('duck');
    setIsProcessing(false);
    setIsWon(false);
    setIsGameOver(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing || isWon || isGameOver) return;
    if (!inputVal.trim()) return;

    const isCorrect = checkAnswer(currentQ.answers, inputVal);
    setIsProcessing(true);
    setSpeaker('duck');

    if (isCorrect) {
      audio.playPuzzleBlip(true);
      setDialogueReaction(getRandomReaction('correct'));

      setTimeout(() => {
        if (currentIndex + 1 >= questions.length) {
          setIsWon(true);
          audio.playFanfare();
          setTimeout(() => onWin(), 1800);
        } else {
          setCurrentIndex((prev) => prev + 1);
          setInputVal('');
          setDialogueReaction(null);
          setIsProcessing(false);
        }
      }, 1100);
    } else {
      audio.playPuzzleBlip(false);
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      setDialogueReaction(getRandomReaction('wrong'));

      setTimeout(() => {
        if (newMistakes >= 3) {
          setIsGameOver(true);
        } else {
          setInputVal('');
          setDialogueReaction(null);
          setIsProcessing(false);
          setSpeaker('player');
        }
      }, 1200);
    }
  };

  const puzzleDuckVariant: DuckNpcVariant = isGameOver
    ? 'lose'
    : isWon
    ? 'win'
    : isProcessing
    ? dialogueReaction && mistakes > 0
      ? 'lose'
      : 'win'
    : speaker === 'duck'
    ? 'talk'
    : 'look';

  return (
    <div className="relative w-full min-h-screen bg-[#070312] text-white flex flex-col justify-between p-3 sm:p-4 select-none overflow-hidden">
      {/* Top Header */}
      <div className="relative z-20 flex items-center justify-between w-full max-w-4xl mx-auto">
        <button
          onClick={onExit}
          className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono-rhythm text-white/80 cursor-pointer"
        >
          ← RETURN TO BALLROOM
        </button>

        {/* 10 Artifact Fragments Progress */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-mono-rhythm text-amber-400 font-bold tracking-widest uppercase">
            ANCIENT ARTIFACT FRAGMENTS
          </span>
          <div className="flex items-center gap-1.5 font-mono text-sm tracking-widest mt-0.5">
            {Array.from({ length: 10 }).map((_, i) => (
              <span
                key={i}
                className={
                  i < currentIndex
                    ? 'text-amber-400 text-base drop-shadow-[0_0_8px_#facc15]'
                    : i === currentIndex
                    ? 'text-cyan-300 text-base animate-pulse'
                    : 'text-slate-600'
                }
              >
                {i < currentIndex ? '◆' : '◇'}
              </span>
            ))}
          </div>
        </div>

        {/* 3 Life Seals */}
        <div className="flex items-center gap-1 bg-black/60 px-3 py-1.5 rounded-xl border border-white/10">
          <span className="text-[10px] font-mono-rhythm text-rose-400 mr-1 font-bold">SEALS:</span>
          {Array.from({ length: 3 }).map((_, i) => (
            <span
              key={i}
              className={`text-sm transition-opacity duration-300 ${
                i < mistakes ? 'opacity-20 grayscale' : 'opacity-100'
              }`}
            >
              🏺
            </span>
          ))}
        </div>
      </div>

      {/* Main Bar Table Scene (Two Characters Talking Across Bar) */}
      <div className="relative z-20 w-full max-w-3xl mx-auto my-auto flex flex-col items-center gap-4">
        <div className="w-full flex items-end justify-between px-4 sm:px-8 relative">
          {/* 1. Dr. Bones on the Left */}
          <div
            className={`flex flex-col items-center transition-all duration-300 ${
              speaker === 'duck'
                ? 'opacity-100 scale-105 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]'
                : 'opacity-55 scale-95'
            }`}
          >
            <DuckNpc
              id="puzzle"
              name="Dr. Bones"
              role="Archaeologist"
              actionText=""
              size="md"
              variant={puzzleDuckVariant}
              isCompleted={false}
              onClick={() => {}}
            />
          </div>

          {/* 2. Bartender Duck in the Center behind Bar Counter */}
          <div className="flex flex-col items-center pb-2 opacity-75 pointer-events-none">
            <div className="text-3xl animate-bounce">🍸🦆</div>
            <span className="text-[9px] font-mono-rhythm text-amber-300">BALLROOM BAR</span>
            <div className="w-32 h-2 bg-gradient-to-r from-transparent via-amber-700/60 to-transparent mt-1" />
          </div>

          {/* 3. Player / Widut on the Right */}
          <div
            className={`flex flex-col items-center transition-all duration-300 ${
              speaker === 'player'
                ? 'opacity-100 scale-105 drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]'
                : 'opacity-55 scale-95'
            }`}
          >
            <div className="w-[100px] h-[135px] bg-black/50 border-2 border-cyan-400/40 rounded-2xl flex flex-col items-center justify-center p-2 shadow-inner">
              <span className="text-4xl animate-pulse">🕺</span>
              <span className="text-[10px] font-mono-rhythm text-cyan-300 mt-2 font-bold uppercase">
                WIDUT
              </span>
            </div>
          </div>
        </div>

        {/* Turn-Based Dialogue Box */}
        <div className="w-full bg-[#110d24] border-4 border-amber-500/80 rounded-3xl p-5 sm:p-7 shadow-[0_0_40px_rgba(245,158,11,0.25)] flex flex-col justify-between min-h-[160px]">
          <div>
            <div className="flex justify-between items-center text-[10px] font-mono-rhythm text-amber-400 uppercase tracking-wider mb-1">
              <span>
                {speaker === 'duck' ? '🎙️ DR. BONES SPEAKS' : '✍️ YOUR TURN TO RESPOND'}
              </span>
              <span className="text-white/40">CLUE {currentIndex + 1} / {questions.length}</span>
            </div>

            <p className="font-mono text-xs text-amber-300/80 italic mb-1">
              "{leadIn}"
            </p>

            <h3 className="font-mono text-base sm:text-xl text-yellow-100 font-bold leading-relaxed">
              "{currentQ?.question}"
            </h3>

            {dialogueReaction && (
              <div className="mt-2 text-xs font-mono-rhythm font-bold text-cyan-300 animate-fadeIn">
                💬 {dialogueReaction}
              </div>
            )}
          </div>

          {/* Answer Input Form */}
          <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400 font-mono font-bold text-sm">
                &gt;
              </span>
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                disabled={isProcessing || isWon || isGameOver}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ketik jawaban kamu di sini..."
                className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-black/60 border border-white/20 text-white font-mono text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isProcessing || isWon || isGameOver || !inputVal.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-disco text-xs font-bold uppercase tracking-wider shadow-md hover:brightness-110 active:scale-95 disabled:opacity-40 transition-all cursor-pointer"
            >
              JAWAB ↵
            </button>
          </form>
        </div>
      </div>
      {/* Win Modal */}
      {isWon && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
          <div className="text-6xl mb-4 animate-bounce">📜</div>
          <span className="text-xs font-mono-rhythm text-yellow-400 font-bold uppercase tracking-widest mb-1">
            MYSTERY SOLVED
          </span>
          <h2 className="font-disco text-4xl sm:text-5xl text-white mb-2">
            ALL 10 CLUES CONFIRMED!
          </h2>
          <p className="font-mono-rhythm text-sm text-white/70 mb-6">
            Dr. Bones tips his explorer hat: "The ancient duck scrolls have confirmed your truth."
          </p>
          <button
            onClick={onWin}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-disco font-bold cursor-pointer"
          >
            CLAIM PUZZLE SEAL ✓
          </button>
        </div>
      )}

      {/* Game Over Modal */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
          <div className="text-6xl mb-4 animate-bounce">🏺</div>
          <span className="text-xs font-mono-rhythm text-rose-400 font-bold uppercase tracking-widest mb-1">
            TOO MANY WRONG ANSWERS
          </span>
          <h2 className="font-disco text-3xl sm:text-4xl text-white mb-2">
            THE RUINS HAVE CLOSED
          </h2>
          <p className="font-mono-rhythm text-xs text-white/60 mb-6 max-w-sm">
            You made 3 incorrect guesses. Take a moment to think and try again!
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleRestart}
              className="px-5 py-3 rounded-xl bg-yellow-400 text-black font-disco font-bold cursor-pointer"
            >
              🔁 RETRY PUZZLE
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

      {/* Bottom Info */}
      <div className="relative z-20 text-center pb-2 text-[11px] font-mono-rhythm text-white/40">
        Jawab 10 teka-teki dengan tepat. Huruf besar/kecil tidak berpengaruh. Batas kesalahan: 3 kali.
      </div>
    </div>
  );
};
