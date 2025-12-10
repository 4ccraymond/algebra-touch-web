// src/math/types.ts

export type Sign = 1 | -1;
export type TermKind = 'number' | 'variable';

export interface TermBase {
  kind: TermKind;
  sign: Sign;
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
}

export type Term = NumberTerm | VariableTerm;

export interface Side {
  terms: Term[];
}

export interface Equation {
  left: Side;
  right: Side;
}
