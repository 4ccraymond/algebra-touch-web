// src/game/types.ts
import type { Equation } from '../math/types';

export type GoalType = 'x-equals-number';

export interface LevelDefinition {
  id: string;
  title: string;
  description: string;
  initialEquation: Equation;
  goalType: GoalType;
}
