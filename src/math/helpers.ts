// src/math/helpers.ts
import type { Term, Side } from './types';

/**
 * Turn a single term into a human-readable string, including its sign.
 * This isn't used in the UI right now but is handy for debugging or logs.
 */
export function termToString(term: Term, isFirst: boolean): string {
  const isNegative = term.sign === -1;

  const signText = isFirst
    ? isNegative
      ? '-'
      : ''
    : isNegative
    ? ' - '
    : ' + ';

  const body =
    term.kind === 'variable' ? term.name : term.value.toString();

  return `${signText}${body}`;
}

/**
 * Convert a whole side into a string like "x + 3 - 5" or "0".
 */
export function sideToString(side: Side): string {
  if (side.terms.length === 0) return '0';
  return side.terms
    .map((term, index) => termToString(term, index === 0))
    .join('');
}
