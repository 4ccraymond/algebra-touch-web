// src/game/types.ts
import type { Equation } from '../math/types';

export type LevelGoal =
  | {
      type: 'simplify-side';
      targetSide?: 'left' | 'right';
    }
  | {
      type: 'balance-equation';
    }
  | {
      type: 'isolate-variable';
      targetVariable?: string;
    };

export interface LevelDefinition {
  id: string;
  topic: string;
  difficulty: number;
  title: string;
  description: string;
  initialEquation: Equation;
  goal: LevelGoal;
}
