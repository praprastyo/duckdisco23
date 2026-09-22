import { TargetType } from '../types/level4Types';

export interface TargetVisualDef {
  type: TargetType;
  label: string;
  points: number; // +1 or -1
  icon: string;
  color: string;
}

export const TARGET_DEFS: Record<TargetType, TargetVisualDef> = {
  bottle: {
    type: 'bottle',
    label: 'DISCO BOTTLE',
    points: 1,
    icon: '🍾',
    color: '#22c55e',
  },
  cocktail: {
    type: 'cocktail',
    label: 'DELICATE COCKTAIL',
    points: -1,
    icon: '🍸',
    color: '#ef4444',
  },
  poop: {
    type: 'poop',
    label: 'MUD SPLAT',
    points: -1,
    icon: '💩',
    color: '#f97316',
  },
  cactus: {
    type: 'cactus',
    label: 'SPINY CACTUS',
    points: -1,
    icon: '🌵',
    color: '#ec4899',
  },
};
