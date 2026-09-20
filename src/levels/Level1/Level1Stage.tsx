import React from 'react';
import { BeatmapEvent } from '../../game/BeatmapRunner';
import { JudgementType } from '../../config/scoring';
import { InputAction } from '../../game/InputManager';
import { QuackDanceStage } from './QuackDanceStage';
import { LaneDir } from './DanceNoteTrack';

interface Level1StageProps {
  currentBeat: number;
  currentCue: BeatmapEvent | null;
  lastJudgement?: JudgementType | null;
  lastDirection?: LaneDir | null;
  combo: number;
  events?: BeatmapEvent[];
  isPlaying?: boolean;
  isComplete?: boolean;
  onDanceInput: (dir: InputAction) => void;
}

/**
 * Level 1 — Quack Dance Party
 * Ayodance-style 4-arrow rhythm dance on the Sunset Duck Beach stage.
 */
export const Level1Stage: React.FC<Level1StageProps> = ({
  currentBeat,
  lastJudgement,
  lastDirection,
  combo,
  events = [],
  isPlaying = false,
  isComplete = false,
  onDanceInput,
}) => {
  return (
    <QuackDanceStage
      currentBeat={currentBeat}
      events={events}
      lastJudgement={lastJudgement}
      lastDirection={lastDirection}
      combo={combo}
      isPlaying={isPlaying}
      isComplete={isComplete}
      onDanceInput={onDanceInput}
    />
  );
};





