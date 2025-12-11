// src/math/types.ts

export type Sign = 1 | -1;
export type TermKind = 'number' | 'variable';

export interface TermBase {
  kind: TermKind;
  sign: Sign;
  /**
   * Optional stable id so UI keys don't shuffle on reorder.
   */
  id?: string;
  /**
   * "Family" identifies like terms.
   * Examples:
   *  - "num" for plain numbers
   *  - "x" for x-terms
   *  - "mana" for mana orbs
   *  - "wolf" for a certain creature type
   */
  family: string;
}

export interface NumberTerm extends TermBase {
  kind: 'number';
  value: number;
}

export interface VariableTerm extends TermBase {
  kind: 'variable';
  name: string;
  /**
   * Coefficient is always non-negative; sign is stored separately.
   */
  coefficient: number;
}

export type Term = NumberTerm | VariableTerm;

export interface Side {
  terms: Term[];
}

export interface Equation {
  left: Side;
  right: Side;
}
