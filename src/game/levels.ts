import type { LevelDefinition } from './types';
import type { Term, Sign } from '../math/types';
import { nextTermId } from '../math/id';

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function numberTermFromInt(n: number, family = 'num'): Term {
  if (n === 0) {
    return { id: nextTermId(), kind: 'number', value: 0, sign: 1, family };
  }
  const sign: Sign = n > 0 ? 1 : -1;
  const value = Math.abs(n);
  return { id: nextTermId(), kind: 'number', value, sign, family };
}

export const levels: LevelDefinition[] = [
  {
    id: 'combine-1',
    topic: 'combine-like-terms',
    difficulty: 1,
    title: 'Random Combine',
    description: 'Combine all the integers on the left.',
    initialEquation: {
      left: {
        terms: [
          numberTermFromInt(randInt(-9, 9)),
          numberTermFromInt(randInt(-9, 9)),
          numberTermFromInt(randInt(-9, 9)),
        ],
      },
      right: { terms: [] }, // still exists, just hidden/unused in UI
    },
    goal: {
      type: 'simplify-side',
      targetSide: 'left',
    },
    hideRightSide: true, // 🔹 no "=" or right side in UI; no cross-side moves
  },

  // ... other levels ...
];
