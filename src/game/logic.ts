// src/game/logic.ts
import type { Equation, Term } from '../math/types';
import type { LevelDefinition } from './types';

function isSingleVariable(term: Term, name: string): boolean {
  return term.kind === 'variable' && term.name === name;
}

function isSingleNumber(term: Term): boolean {
  return term.kind === 'number';
}

function sidesStructurallyEqual(a: Equation['left'], b: Equation['left']): boolean {
  // simple version: same number of terms, same kind/family/sign/value/name
  if (a.terms.length !== b.terms.length) return false;
  return a.terms.every((t, i) => {
    const u = b.terms[i];
    if (!u) return false;
    if (t.kind !== u.kind) return false;
    if (t.family !== u.family) return false;
    if (t.sign !== u.sign) return false;
    if (t.kind === 'number' && u.kind === 'number') {
      return t.value === u.value;
    }
    if (t.kind === 'variable' && u.kind === 'variable') {
      return t.name === u.name;
    }
    return false;
  });
}

function isSideFullyCombined(side: Equation['left']): boolean {
  // naive version: no two adjacent terms share the same family & are numbers
  const ts = side.terms;
  for (let i = 1; i < ts.length; i++) {
    const a = ts[i - 1];
    const b = ts[i];
    if (
      a.kind === 'number' &&
      b.kind === 'number' &&
      a.family === b.family
    ) {
      return false;
    }
  }
  return true;
}

export function checkGoalReached(
  level: LevelDefinition,
  eq: Equation
): boolean {
  const { goal } = level;

  switch (goal.type) {
    case 'simplify-side': {
      const side = goal.targetSide ?? 'left';
      const chosenSide = side === 'left' ? eq.left : eq.right;
      return isSideFullyCombined(chosenSide);
    }

    case 'balance-equation': {
      return (
        sidesStructurallyEqual(eq.left, eq.right) ||
        sidesStructurallyEqual(eq.right, eq.left)
      );
    }

    case 'isolate-variable': {
      const varName = goal.targetVariable ?? 'x';
      const L = eq.left.terms;
      const R = eq.right.terms;

      const case1 =
        L.length === 1 &&
        isSingleVariable(L[0], varName) &&
        R.length === 1 &&
        isSingleNumber(R[0]);

      const case2 =
        R.length === 1 &&
        isSingleVariable(R[0], varName) &&
        L.length === 1 &&
        isSingleNumber(L[0]);

      return case1 || case2;
    }

    default:
      return false;
  }
}
