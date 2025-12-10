// src/game/logic.ts
import type { Equation, Term } from '../math/types';
import type { LevelDefinition } from './types';

function isSingleX(term: Term): boolean {
  return term.kind === 'variable' && term.name === 'x';
}

function isSingleNumber(term: Term): boolean {
  return term.kind === 'number';
}

export function checkGoalReached(
  level: LevelDefinition,
  eq: Equation
): boolean {
  switch (level.goalType) {
    case 'x-equals-number': {
      const leftTerms = eq.left.terms;
      const rightTerms = eq.right.terms;

      // Case 1: left is x, right is a number
      const case1 =
        leftTerms.length === 1 &&
        isSingleX(leftTerms[0]) &&
        rightTerms.length === 1 &&
        isSingleNumber(rightTerms[0]);

      // Case 2: right is x, left is a number
      const case2 =
        rightTerms.length === 1 &&
        isSingleX(rightTerms[0]) &&
        leftTerms.length === 1 &&
        isSingleNumber(leftTerms[0]);

      return case1 || case2;
    }
    default:
      return false;
  }
}
