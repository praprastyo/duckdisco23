import { TargetType } from '../types/level4Types';

export interface TargetVisualDef {
  type: TargetType;
  label: string;
  points: number; // +1 or -1
  color: string;
}

export const TARGET_DEFS: Record<TargetType, TargetVisualDef> = {
  bottle: {
    type: 'bottle',
    label: 'DISCO BOTTLE',
    points: 1,
    color: '#22c55e',
  },
  cocktail: {
    type: 'cocktail',
    label: 'COCKTAIL GLASS',
    points: -1,
    color: '#ef4444',
  },
  poop: {
    type: 'poop',
    label: 'MUD SPLAT',
    points: -1,
    color: '#f97316',
  },
  cactus: {
    type: 'cactus',
    label: 'SPINY CACTUS',
    points: -1,
    color: '#ec4899',
  },
};
