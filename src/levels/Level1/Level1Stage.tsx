import React from 'react';
import { BeatmapEvent } from '../../game/BeatmapRunner';
import { JudgementType } from '../../config/scoring';
import { InputAction } from '../../game/InputManager';
import { Beach3DStage } from './Beach3DStage';

interface Level1StageProps {
  currentBeat: number;
  currentCue: BeatmapEvent | null;
  lastJudgement?: JudgementType | null;
  combo: number;
  events?: BeatmapEvent[];
  actionEvent?: { id: number; action: InputAction };
  onLaneSwitch?: (lane: 'left' | 'right') => void;
}



export const Level1Stage: React.FC<Level1StageProps> = (props) => {
  return <Beach3DStage {...props} />;
};





