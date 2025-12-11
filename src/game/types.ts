// src/game/types.ts
import type { Equation } from '../math/types';

export type TopicId =
  | 'combine-like-terms'
  | 'balance-equality'
  | 'one-step-equations'
  | 'two-step-equations'
  | 'multi-step-equations';

export type GoalType =
  | 'simplify-side'
  | 'balance-equation'
  | 'isolate-variable';

export interface GoalDefinition {
  type: GoalType;
  targetSide?: 'left' | 'right';
  targetVariable?: string;
}

export interface LevelDefinition {
  id: string;
  topic: TopicId;
  difficulty: number;
  title: string;
  description: string;
  initialEquation: Equation;
  goal: GoalDefinition;
  hideRightSide?: boolean; // 🔹 one-side-only levels
}
