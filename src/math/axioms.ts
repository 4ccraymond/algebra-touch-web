// src/math/axioms.ts
import type { Equation } from './types';

export type AxiomName =
  | 'add-same-both-sides'
  | 'multiply-same-both-sides'
  | 'commutativity-addition'
  | 'associativity-addition'
  | 'additive-inverse'
  | 'distributive-law';
  // (add more as needed)

export interface AxiomApplication {
  axiom: AxiomName;
  description: string;   // plain-language explanation, for tooltips later
  before: Equation;
  after: Equation;
}
