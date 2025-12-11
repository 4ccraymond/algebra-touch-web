// src/math/rules.ts
import type { Equation, Term } from './types';
import { nextTermId } from './id';

/**
 * Move a term from one side (and index) to another side and index.
 *
 * - Within the same side, sign stays the same.
 * - Across "=", sign flips.
 * - toIndex === null → append at end of target side.
 * - toIndex is a number → insert before that index.
 */
export function moveTerm(
  equation: Equation,
  fromSide: 'left' | 'right',
  fromIndex: number,
  toSide: 'left' | 'right',
  toIndex: number | null
): Equation {
  const leftTerms = [...equation.left.terms];
  const rightTerms = [...equation.right.terms];

  const sourceTerms = fromSide === 'left' ? leftTerms : rightTerms;
  const targetTerms = toSide === 'left' ? leftTerms : rightTerms;

  if (fromIndex < 0 || fromIndex >= sourceTerms.length) {
    return equation;
  }

  const [term] = sourceTerms.splice(fromIndex, 1);

  // Flip sign only when crossing the equals sign
  const moved: Term =
    fromSide === toSide ? term : { ...term, sign: term.sign === 1 ? -1 : 1 };

  let insertIndex: number;
  if (toIndex == null) {
    // Drop at end of that side
    insertIndex = targetTerms.length;
  } else {
    let idx = toIndex;

    // If moving within the same side and we removed an earlier element,
    // the target index shifts left by one.
    if (fromSide === toSide && fromIndex < toIndex) {
      idx -= 1;
    }

    if (idx < 0) idx = 0;
    if (idx > targetTerms.length) idx = targetTerms.length;
    insertIndex = idx;
  }

  targetTerms.splice(insertIndex, 0, moved);

  return {
    left: { terms: leftTerms },
    right: { terms: rightTerms },
  };
}

/**
 * Combine two adjacent integer terms on the same side.
 * rightIndex is the index of the right-hand term of the pair.
 */
export function combineAdjacentNumbers(
  equation: Equation,
  side: 'left' | 'right',
  rightIndex: number
): Equation {
  const sideTerms =
    side === 'left' ? equation.left.terms : equation.right.terms;

  if (rightIndex <= 0 || rightIndex >= sideTerms.length) {
    return equation;
  }

  const prevTerm = sideTerms[rightIndex - 1];
  const nextTerm = sideTerms[rightIndex];

  if (prevTerm.kind !== 'number' || nextTerm.kind !== 'number') {
    // Only combine pure numbers for now
    return equation;
  }

  const leftValue = prevTerm.sign * prevTerm.value;
  const rightValue = nextTerm.sign * nextTerm.value;
  const sum = leftValue + rightValue;

  const leftTerms = [...equation.left.terms];
  const rightTerms = [...equation.right.terms];
  const targetTerms = side === 'left' ? leftTerms : rightTerms;

  // Remove both original terms
  targetTerms.splice(rightIndex - 1, 2);

  if (sum !== 0) {
    const newTerm: Term = {
      id: nextTermId(),
      kind: 'number',
      value: Math.abs(sum),
      sign: sum >= 0 ? 1 : -1,
      family: prevTerm.family,
    };
    targetTerms.splice(rightIndex - 1, 0, newTerm);
  }

  return {
    left: { terms: leftTerms },
    right: { terms: rightTerms },
  };
}
