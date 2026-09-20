import React from 'react';
import { DancePose, QuackSprite } from './QuackSprite';

interface BackupDancersProps {
  pose: DancePose;
  beat: number;
  combo: number;
}

/**
 * Backup Duck Dancers that join the stage as the player builds combos:
 * - Combo >= 5: 2 dancers appear (Left & Right)
 * - Combo >= 15: 4 dancers in full formation
 */
export const BackupDancers: React.FC<BackupDancersProps> = ({ pose, beat, combo }) => {
  if (combo < 5) return null;

  const isEven = beat % 2 === 0;
  const count = combo >= 15 ? 4 : 2;

  // Offsets for 2 or 4 dancers
  const dancerOffsets = count === 4 ? [-140, -75, 75, 140] : [-110, 110];

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {dancerOffsets.map((offsetX, idx) => {
        const isLeft = offsetX < 0;
        const delayBeat = idx % 2 === 0 ? isEven : !isEven;

        return (
          <div
            key={idx}
            className="absolute transition-all duration-200 ease-out opacity-85"
            style={{
              transform: `translateX(${offsetX}px) scale(0.68) translateY(${delayBeat ? -6 : 4}px)`,
              filter: isLeft ? 'hue-rotate(320deg)' : 'hue-rotate(180deg)',
            }}
          >
            <QuackSprite pose={pose} isEven={delayBeat} isFever={combo >= 25} />
            <span className="block text-center text-[9px] font-mono-rhythm text-white/60 font-bold -mt-2">
              DANCER #{idx + 1}
            </span>
          </div>
        );
      })}
    </div>
  );
};
