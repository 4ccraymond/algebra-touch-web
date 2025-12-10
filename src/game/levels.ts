// src/game/levels.ts
import type { LevelDefinition } from './types';

export const levels: LevelDefinition[] = [
  {
    id: 'level-1',
    title: 'First Gate',
    description: 'Get x alone on one side with a single number on the other.',
    initialEquation: {
      left: {
        terms: [
          { kind: 'variable', name: 'x', sign: 1, family: 'x' },   // +x
          { kind: 'number', value: 3, sign: 1, family: 'num' },    // +3
        ],
      },
      right: {
        terms: [{ kind: 'number', value: 5, sign: 1, family: 'num' }], // +5
      },
    },
    goalType: 'x-equals-number',
  },
];
