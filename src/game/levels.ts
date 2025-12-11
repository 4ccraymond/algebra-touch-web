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

function variableTerm(
  name: string,
  coefficient: number,
  sign: Sign,
  family?: string
): Term {
  return {
    id: nextTermId(),
    kind: 'variable',
    name,
    coefficient,
    sign,
    family: family ?? name,
  };
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
      right: { terms: [] },
    },
    goal: {
      type: 'simplify-side',
      targetSide: 'left',
    },
  },

  {
    id: 'one-step-1',
    topic: 'one-step-equations',
    difficulty: 1,
    title: 'Random One-Step',
    description: 'Get x alone with a single number on the other side.',
    initialEquation: {
      left: {
        terms: [
          {
            ...variableTerm('x', 1, 1, 'x'),
          },
          numberTermFromInt(randInt(-9, 9)),
        ],
      },
      right: {
        terms: [numberTermFromInt(randInt(-9, 9))],
      },
    },
    goal: {
      type: 'isolate-variable',
      targetVariable: 'x',
    },
  },
];
