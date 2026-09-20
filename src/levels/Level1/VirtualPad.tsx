import React from 'react';
import { InputAction } from '../../game/InputManager';
import { ARROW_ICONS, MOVE_NAMES } from './QuackDancer';
import { LaneDir } from './DanceNoteTrack';

interface VirtualPadProps {
  onPress: (dir: InputAction) => void;
  activeLane: LaneDir | null;
  disabled?: boolean;
}

const PAD_STYLES: Record<LaneDir, string> = {
  left: 'border-amber-300 text-amber-200 hover:bg-amber-400/25 active:bg-amber-400/50',
  up: 'border-cyan-300 text-cyan-200 hover:bg-cyan-400/25 active:bg-cyan-400/50',
  right: 'border-fuchsia-300 text-fuchsia-200 hover:bg-fuchsia-400/25 active:bg-fuchsia-400/50',
  down: 'border-emerald-300 text-emerald-200 hover:bg-emerald-400/25 active:bg-emerald-400/50',
};

const Key: React.FC<{
  dir: LaneDir;
  onPress: (d: InputAction) => void;
  active: boolean;
  disabled?: boolean;
}> = ({ dir, onPress, active, disabled }) => (
  <button
    type="button"
    data-interactive="true"
    tabIndex={-1}
    disabled={disabled}
    onFocus={(e) => e.currentTarget.blur()}
    onPointerDown={() => onPress(dir)}
    className={`pointer-events-auto w-16 h-16 rounded-2xl border-2 backdrop-blur-md bg-black/45 flex flex-col items-center justify-center transition-all active:scale-95 disabled:opacity-40 ${
      PAD_STYLES[dir]
    } ${active ? 'scale-110 bg-white/25 shadow-[0_0_26px_currentColor]' : ''}`}
    aria-label={MOVE_NAMES[dir]}
  >
    <span className="font-disco text-2xl font-black leading-none">{ARROW_ICONS[dir]}</span>
    <span className="text-[8px] font-mono-rhythm tracking-wider mt-0.5 opacity-80">
      {MOVE_NAMES[dir].split(' ')[0]}
    </span>
  </button>
);

/**
 * Cross-layout virtual dance pad for touch devices.
 * Mirrors the keyboard arrow mapping exactly.
 */
export const VirtualPad: React.FC<VirtualPadProps> = ({ onPress, activeLane, disabled }) => (
  <div className="grid grid-cols-3 grid-rows-3 gap-1.5 place-items-center select-none">
    <span />
    <Key dir="up" onPress={onPress} active={activeLane === 'up'} disabled={disabled} />
    <span />

    <Key dir="left" onPress={onPress} active={activeLane === 'left'} disabled={disabled} />
    <div className="w-16 h-16 rounded-2xl border border-white/15 bg-black/35 flex items-center justify-center">
      <span className="font-disco text-[10px] text-white/50 tracking-widest">DANCE</span>
    </div>
    <Key dir="right" onPress={onPress} active={activeLane === 'right'} disabled={disabled} />

    <span />
    <Key dir="down" onPress={onPress} active={activeLane === 'down'} disabled={disabled} />
    <span />
  </div>
);