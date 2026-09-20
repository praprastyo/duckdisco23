import React, { useEffect, useRef, useState, useCallback } from 'react';
import { BeatmapEvent } from '../../game/BeatmapRunner';
import { JudgementType } from '../../config/scoring';
import { InputAction } from '../../game/InputManager';
import { BeachDiscoBackdrop } from './BeachDiscoBackdrop';
import { DanceNoteTrack, LANE_ORDER, LaneDir, POSE_BY_DIR } from './DanceNoteTrack';
import { DancePose, QuackDancer } from './QuackDancer';
import { VirtualPad } from './VirtualPad';

interface QuackDanceStageProps {
  currentBeat: number;
  events: BeatmapEvent[];
  lastJudgement?: JudgementType | null;
  lastDirection?: LaneDir | null;
  combo: number;
  isPlaying: boolean;
  isComplete: boolean;
  missCount?: number;
  maxMisses?: number;
  onDanceInput: (dir: InputAction) => void;
}

export const QuackDanceStage: React.FC<QuackDanceStageProps> = ({
  currentBeat,
  events,
  lastJudgement,
  lastDirection,
  combo,
  isPlaying,
  isComplete,
  missCount = 0,
  maxMisses = 10,
  onDanceInput,
}) => {
  const [pose, setPose] = useState<DancePose>('idle');
  const [activeLane, setActiveLane] = useState<LaneDir | null>(null);
  const [moveLabel, setMoveLabel] = useState('');
  const [missStreak, setMissStreak] = useState(0);
  const poseTimer = useRef<number | null>(null);

  const triggerPose = useCallback((next: DancePose, label: string) => {
    setPose(next);
    setMoveLabel(label);
    if (poseTimer.current) window.clearTimeout(poseTimer.current);
    poseTimer.current = window.setTimeout(() => {
      setPose('idle');
      setMoveLabel('');
    }, 320);
  }, []);

  // Dance pose driven by the direction of the note that was just judged
  useEffect(() => {
    if (!lastJudgement) return;
    if (lastJudgement === 'miss') {
      setMissStreak((prev) => prev + 1);
      triggerPose('miss', 'MISSED STEP');
    } else {
      setMissStreak(0);
      if (lastDirection) {
        triggerPose(POSE_BY_DIR[lastDirection], lastDirection.toUpperCase());
      }
    }
  }, [lastJudgement, lastDirection, triggerPose]);


  // Celebration pose on song clear
  useEffect(() => {
    if (isComplete) {
      if (poseTimer.current) window.clearTimeout(poseTimer.current);
      setPose('super');
      setMoveLabel('SUPER QUACK MOVE!');
    }
  }, [isComplete]);

  // NOTE: keyboard arrows are already captured by InputManager -> RhythmEngine.
  // This stage only needs to render the judged result, so we don't re-bind keys here.

  useEffect(() => () => {
    if (poseTimer.current) window.clearTimeout(poseTimer.current);
  }, []);

  const isFever = combo >= 25;

  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden select-none">
      <BeachDiscoBackdrop beat={currentBeat} combo={combo} />

      <div className="relative z-10 h-full w-full flex flex-col lg:flex-row items-center justify-center gap-2 lg:gap-8 px-3 pt-24 pb-4">
        {/* Arrow track */}
        <div className="w-full max-w-[320px] lg:max-w-[360px] shrink-0">
          <div className="rounded-3xl border border-white/20 bg-black/35 backdrop-blur-sm p-3">
            <div className="flex items-center justify-between mb-1 px-1">
              <span className="text-[10px] font-mono-rhythm text-white/70 tracking-widest uppercase">Dance Line</span>
              <span className="text-[10px] font-mono-rhythm text-yellow-300 font-bold tracking-widest">79 BPM</span>
            </div>
            <DanceNoteTrack events={events} isPlaying={isPlaying} onActiveNoteChange={setActiveLane} />
            <div className="flex justify-around mt-1">
              {LANE_ORDER.map((d) => (
                <span key={d} className="w-12 text-center text-[9px] font-mono-rhythm text-white/45 tracking-wider uppercase">
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Dancer + move label */}
        <div className="relative flex flex-col items-center shrink-0">
          <div className="h-8 mb-1 flex items-center justify-center">
            {moveLabel && (
              <span
                className={`font-disco text-sm tracking-widest px-4 py-1 rounded-full border ${
                  pose === 'miss'
                    ? 'text-rose-200 border-rose-400/60 bg-rose-900/50'
                    : pose === 'super'
                    ? 'text-yellow-200 border-yellow-300/70 bg-yellow-900/40 animate-bounce'
                    : 'text-cyan-100 border-cyan-300/60 bg-cyan-900/40'
                }`}
              >
                {moveLabel}
              </span>
            )}
          </div>

          <QuackDancer pose={pose} beat={currentBeat} combo={combo} missStreak={missStreak} />

          <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
            <div className="px-3 py-0.5 rounded-full bg-black/55 border border-yellow-500/40 text-[10px] font-mono-rhythm tracking-widest text-yellow-300 uppercase">
              DJ QUACK {isFever ? '• NEON MODE' : ''}
            </div>
            {combo >= 2 && (
              <div className="px-3 py-0.5 rounded-full bg-black/55 border border-fuchsia-500/50 text-[11px] font-mono-rhythm font-bold tracking-widest text-fuchsia-300 uppercase">
                {combo}× COMBO
              </div>
            )}
            <div className="px-3 py-0.5 rounded-full bg-black/55 border border-white/20 text-[10px] font-mono-rhythm flex items-center gap-1.5">
              <span className="text-white/50">MISS:</span>
              <span className={`font-black ${missCount >= 8 ? 'text-rose-400 animate-pulse' : missCount >= 5 ? 'text-amber-300' : 'text-emerald-400'}`}>
                {missCount}/{maxMisses}
              </span>
            </div>
          </div>
        </div>


        {/* Touch pad */}
        <div className="shrink-0 mt-1 lg:mt-0">
          <VirtualPad onPress={onDanceInput} activeLane={activeLane} disabled={!isPlaying} />
        </div>
      </div>

      {/* Beat pips + control hint */}
      <div className="absolute bottom-2 inset-x-0 z-20 flex flex-col items-center gap-1 pointer-events-none">
        <div className="flex items-center gap-2">
          {[0, 1, 2, 3].map((b) => (
            <span
              key={b}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-100 ${
                currentBeat % 4 === b ? 'bg-yellow-300 scale-125 shadow-[0_0_12px_#facc15]' : 'bg-white/25'
              }`}
            />
          ))}
        </div>
        <span className="text-[10px] font-mono-rhythm text-white/60 tracking-widest uppercase">
          ← Slide • ↑ Jump • → Spin • ↓ Groove
        </span>
      </div>
    </div>
  );
};