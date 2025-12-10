// src/math/rules.ts
import type { Equation, Term } from './types';

/**
 * Move a term either:
 * - across the equals sign (flipping its sign), or
 * - within the same side (reordering, keeping its sign).
 *
 * If you drop on the same side, we move the term to the **front** of that side.
 */
export function moveTerm(
  equation: Equation,
  fromSide: 'left' | 'right',
  fromIndex: number,
  toSide: 'left' | 'right'
): Equation {
  // Copy term arrays so we don't mutate state directly
  const leftTerms = [...equation.left.terms];
  const rightTerms = [...equation.right.terms];

  const sourceTerms = fromSide === 'left' ? leftTerms : rightTerms;
  const targetTerms = toSide === 'left' ? leftTerms : rightTerms;

  if (fromIndex < 0 || fromIndex >= sourceTerms.length) {
    return equation;
  }

  const [term] = sourceTerms.splice(fromIndex, 1);

  let moved: Term;
  if (fromSide === toSide) {
    // Reorder within the same side (keep sign, move to front)
    moved = term;
    targetTerms.unshift(moved);
  } else {
    // Crossing the equals sign: add the opposite term to the other side
    moved = {
      ...term,
      sign: term.sign === 1 ? -1 : 1,
    };
    targetTerms.push(moved);
  }

  return {
    left: { terms: leftTerms },
    right: { terms: rightTerms },
  };
}

/**
 * Combine two adjacent numeric terms on the same side.
 * `rightIndex` is the index of the term *after* the operator you clicked.
 *
 * Example: for "5 - 3", terms = [ +5, -3 ]
 * The operator before index 1 is "-", so `rightIndex = 1`.
 */
export function combineAdjacentNumbers(
  equation: Equation,
  side: 'left' | 'right',
  rightIndex: number
): Equation {
  const sideTerms =
    side === 'left' ? equation.left.terms : equation.right.terms;

  // Need a term to the left and one at rightIndex
  if (rightIndex <= 0 || rightIndex >= sideTerms.length) {
    return equation;
  }

  const prevTerm = sideTerms[rightIndex - 1];
  const nextTerm = sideTerms[rightIndex];

  if (
    prevTerm.kind !== 'number' ||
    nextTerm.kind !== 'number' ||
    prevTerm.family !== nextTerm.family
  ) {
    // Only combine pure numbers from the same family (true like terms)
    return equation;
  }

  const leftValue = prevTerm.sign * prevTerm.value;
  const rightValue = nextTerm.sign * nextTerm.value;
  const sum = leftValue + rightValue;

  // Clone arrays for immutability
  const leftTerms = [...equation.left.terms];
  const rightTerms = [...equation.right.terms];
  const targetTerms = side === 'left' ? leftTerms : rightTerms;

  // Remove both original terms
  targetTerms.splice(rightIndex - 1, 2);

  if (sum !== 0) {
    const newTerm: Term = {
      kind: 'number',
      value: Math.abs(sum),
      sign: sum >= 0 ? 1 : -1,
      family: prevTerm.family,
    };
    // Insert the combined term where the first one used to be
    targetTerms.splice(rightIndex - 1, 0, newTerm);
  }
  // If sum === 0, we insert nothing; if side becomes empty, UI shows 0

  return {
    left: { terms: leftTerms },
    right: { terms: rightTerms },
  };
}
