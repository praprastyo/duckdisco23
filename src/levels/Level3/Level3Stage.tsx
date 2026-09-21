import React, { useState } from 'react';
import { useLevel3Game } from './useLevel3Game';
import { QuackCharacter2D } from './QuackCharacter2D';
import { Level3Floor } from './Level3Floor';
import { Level3VirtualPad } from './Level3VirtualPad';
import { Level3EditorModal } from './Level3EditorModal';
import { Level3Summary, Direction } from './level3Types';
import { getGradeTier } from '../../config/scoring';
import { ScoreSummary } from '../../game/ScoringEngine';
import { DevModeService } from '../../services/DevModeService';

interface Level3StageProps {
  onLevelComplete?: (summary: ScoreSummary, extraL3?: Level3Summary) => void;
}

const ARROW_SYMBOLS: Record<Direction, string> = { left: '←', up: '↑', right: '→', down: '↓' };
const MOVE_TITLES: Record<Direction, string> = {
  left: 'DUCK SLIDE',
  up: 'WING POP',
  right: 'QUACK SPIN',
  down: 'LOW GROOVE',
};

export const Level3Stage: React.FC<Level3StageProps> = ({ onLevelComplete }) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const handleFinish = (summary: Level3Summary) => {
    const grade = getGradeTier(summary.accuracy);
    const converted: ScoreSummary = {
      score: summary.score,
      accuracy: summary.accuracy,
      perfect: summary.perfect,
      great: summary.great,
      good: summary.good,
      miss: summary.miss + summary.wrongMoves,
      currentCombo: 0,
      maxCombo: summary.maxCombo,
      grade,
      cleared: summary.cleared,
    };
    onLevelComplete?.(converted, summary);
  };

  const { state, config, setConfig, autoplay, setAutoplay, handleDirectionInput } =
    useLevel3Game(handleFinish);

  const {
    songTime,
    phase,
    phaseBanner,
    currentSection,
    activeDemoDirection,
    isDemoFake,
    activePlayerDirection,
    quackPose,
    score,
    combo,
    lastRating,
    lastDeltaMs,
    feedbackMessage,
    expectedDirection,
    countIn,
    isMissShaking,
    energy,
    isSpecialFinish,
  } = state;

  const currentBeat = Math.floor((songTime * currentSection.bpm) / 60);
  const progressPercent = Math.min(100, Math.max(0, (songTime / 257) * 100));

  return (
    <div
      className={`relative w-full max-w-5xl h-[520px] sm:h-[620px] bg-[#070312] border-2 rounded-3xl overflow-hidden select-none flex flex-col justify-between p-4 transition-all duration-150 ${
        isMissShaking
          ? 'border-rose-500 shadow-[0_0_80px_rgba(244,63,94,0.85)] ring-4 ring-rose-500/50'
          : 'border-yellow-400/60 shadow-[0_0_50px_rgba(250,204,21,0.3)]'
      }`}
    >
      {/* Red Screen Flash on Miss / Wrong Move */}
      {isMissShaking && (
        <div className="absolute inset-0 bg-rose-600/25 pointer-events-none z-30 animate-pulse" />
      )}

      <Level3Floor
        currentSectionId={currentSection.id}
        bpm={currentSection.bpm}
        currentBeat={currentBeat}
        energy={energy}
        combo={combo}
        isSpecialFinish={isSpecialFinish}
      />

      {/* Progress Bar */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-black/60 z-30">
        <div className="h-full bg-gradient-to-r from-cyan-400 via-yellow-400 to-fuchsia-500 transition-all duration-100" style={{ width: `${progressPercent}%` }} />
      </div>

      {/* Top HUD */}
      <div className="relative z-20 flex items-center justify-between w-full">
        <div>
          <span className="text-[10px] font-mono-rhythm text-white/50 tracking-widest block">SCORE</span>
          <span className="font-disco text-2xl sm:text-3xl font-black text-yellow-300">{score.toLocaleString()}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="px-3 py-1 rounded-full bg-black/70 border border-yellow-400/40 text-xs text-yellow-300 uppercase">
            {currentSection.label} • {currentSection.bpm} BPM
          </span>
          {autoplay && <span className="text-[9px] font-mono-rhythm text-cyan-300 mt-0.5">⚡ AUTOPLAY</span>}
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono-rhythm text-white/50 tracking-widest block">COMBO</span>
          <span className="font-disco text-2xl sm:text-3xl font-black text-fuchsia-400">{combo}×</span>
        </div>
      </div>

      {/* Arena */}
      <div className="relative z-20 flex flex-col items-center justify-center my-auto w-full">
        <div className="mb-2">
          <span
            className={`px-5 py-1.5 rounded-2xl font-disco font-black text-lg sm:text-xl tracking-widest border shadow-xl uppercase ${
              phase === 'watch'
                ? 'bg-cyan-950/90 border-cyan-400 text-cyan-300'
                : phase === 'response'
                ? 'bg-yellow-950/90 border-yellow-400 text-yellow-300 animate-pulse'
                : phase === 'round-result'
                ? 'bg-fuchsia-950/90 border-fuchsia-400 text-fuchsia-300'
                : 'bg-black/70 border-white/20 text-white/80'
            }`}
          >
            {phaseBanner}
          </span>
        </div>

        {/* Demo Direction Banner */}
        <div className="h-10 flex items-center justify-center mb-1">
          {activeDemoDirection && phase === 'watch' && (
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border shadow-lg ${
                isDemoFake ? 'bg-purple-950/90 border-purple-400 text-purple-300' : 'bg-yellow-400 text-black border-yellow-200'
              }`}
            >
              <span className="text-xl font-black font-disco">{ARROW_SYMBOLS[activeDemoDirection]}</span>
              <span className="text-xs font-bold font-mono-rhythm">{MOVE_TITLES[activeDemoDirection]}</span>
            </div>
          )}
        </div>

        <QuackCharacter2D
          pose={quackPose}
          bpm={currentSection.bpm}
          beatIndex={currentBeat}
          isFakeDemo={isDemoFake}
          activeDirection={activeDemoDirection || activePlayerDirection}
          bassEnergy={energy.bass}
        />

        {/* Prominent Feedback Banner & Miss Reason Notification */}
        <div className="h-8 flex items-center justify-center mt-1 z-20">
          {feedbackMessage ? (
            <div
              className={`px-3.5 py-1 rounded-full border text-xs font-mono-rhythm font-bold flex items-center gap-2 animate-bounce shadow-lg ${
                lastRating === 'wrong' || lastRating === 'miss'
                  ? 'bg-rose-950/95 border-rose-500 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.7)]'
                  : lastRating === 'early'
                  ? 'bg-amber-950/95 border-amber-400 text-amber-300'
                  : lastRating === 'perfect'
                  ? 'bg-yellow-400 text-black border-yellow-200 shadow-[0_0_20px_rgba(250,204,21,0.8)]'
                  : 'bg-cyan-950/95 border-cyan-400 text-cyan-300'
              }`}
            >
              <span>{feedbackMessage}</span>
            </div>
          ) : expectedDirection && phase === 'response' ? (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono-rhythm text-yellow-400 font-bold uppercase tracking-wider">
                YOUR STEP:
              </span>
              <span className="px-2.5 py-0.5 rounded bg-yellow-400/20 border border-yellow-400 text-yellow-300 font-disco font-black text-xs animate-pulse">
                {ARROW_SYMBOLS[expectedDirection]} {MOVE_TITLES[expectedDirection]}
              </span>
            </div>
          ) : countIn && phase === 'get-ready' ? (
            <span className="text-2xl font-black font-disco text-yellow-300 animate-ping">
              {countIn}
            </span>
          ) : null}
        </div>
      </div>

      {/* Controls */}
      <div className="relative z-20 flex flex-col items-center">
        <Level3VirtualPad
          onDirectionPress={(dir) => handleDirectionInput(dir)}
          activeDirection={activePlayerDirection || activeDemoDirection}
          disabled={phase !== 'response' && countIn !== '1'}
        />
        <div className="flex items-center justify-between w-full pt-2">
          <span className="text-[10px] font-mono-rhythm text-white/50 uppercase">
            DESKTOP: ARROWS / WASD • MOBILE: 4-WAY PAD
          </span>
          {DevModeService.isEnabled() && (
            <button
              onClick={() => setIsEditorOpen(true)}
              className="px-2 py-0.5 rounded bg-yellow-400/20 hover:bg-yellow-400/40 border border-yellow-400/50 text-[10px] font-mono-rhythm text-yellow-300 font-bold"
            >
              🛠️ LEVEL 3 TIMING EDITOR
            </button>
          )}
        </div>
      </div>

      <Level3EditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        config={config}
        onUpdateConfig={setConfig}
        songTime={songTime}
        currentPhase={phase}
        autoplay={autoplay}
        onToggleAutoplay={() => setAutoplay((a) => !a)}
      />
    </div>
  );
};

