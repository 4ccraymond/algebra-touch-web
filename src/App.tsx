// src/App.tsx
import React, { useState } from 'react';
import './styles/App.css';
import EquationView from './components/EquationView';
import StatusBar from './components/StatusBar';
import type { Equation } from './math/types';
import { moveTerm, combineAdjacentNumbers } from './math/rules';
import { levels } from './game/levels';
import { checkGoalReached } from './game/logic';

const App: React.FC = () => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [equation, setEquation] = useState<Equation>(
    levels[0].initialEquation
  );
  const [isComplete, setIsComplete] = useState(false);
  const [status, setStatus] = useState(levels[0].description);

  const currentLevel = levels[currentLevelIndex];

  const handleDragTermStart = (
    side: 'left' | 'right',
    index: number,
    e: React.DragEvent<HTMLSpanElement>
  ) => {
    const payload = JSON.stringify({ side, index });
    e.dataTransfer.setData('application/json', payload);
    e.dataTransfer.setData('text/plain', payload); // fallback
  };

  const applyDropMove = (
    targetSide: 'left' | 'right',
    targetIndex: number | null,
    e: React.DragEvent
  ) => {
    e.preventDefault();

    const raw =
      e.dataTransfer.getData('application/json') ||
      e.dataTransfer.getData('text/plain');
    if (!raw) return;

    let parsed: { side: 'left' | 'right'; index: number };
    try {
      parsed = JSON.parse(raw);
    } catch {
      return;
    }

    const { side: fromSide, index: fromIndex } = parsed;

    const updated = moveTerm(
      equation,
      fromSide,
      fromIndex,
      targetSide,
      targetIndex
    );

    if (updated === equation) {
      setStatus('Could not move that term.');
      return;
    }

    setEquation(updated);

    const done = checkGoalReached(currentLevel, updated);
    if (done) {
      setIsComplete(true);
      setStatus('Level complete!');
    } else if (fromSide === targetSide) {
      setStatus('Reordered the terms on this side.');
    } else {
      setStatus(
        'Moved a term across "=", adding its opposite to the other side.'
      );
    }
  };

  const handleDropOnSide = (
    targetSide: 'left' | 'right',
    e: React.DragEvent<HTMLDivElement>
  ) => {
    applyDropMove(targetSide, null, e);
  };

  const handleDropOnTerm = (
    targetSide: 'left' | 'right',
    targetIndex: number,
    e: React.DragEvent<HTMLElement>
  ) => {
    applyDropMove(targetSide, targetIndex, e);
  };

  const handleOperatorClick = (side: 'left' | 'right', rightIndex: number) => {
    const updated = combineAdjacentNumbers(equation, side, rightIndex);

    if (updated === equation) {
      setStatus(
        'Those terms cannot be combined. You can only combine two adjacent integers for now.'
      );
      return;
    }

    setEquation(updated);

    const done = checkGoalReached(currentLevel, updated);
    if (done) {
      setIsComplete(true);
      setStatus('Level complete!');
    } else {
      setStatus('Combined those integers into a single number.');
    }
  };

  const reset = () => {
    setEquation(currentLevel.initialEquation);
    setIsComplete(false);
    setStatus(currentLevel.description);
  };

  const goToNextLevel = () => {
    const nextIndex = (currentLevelIndex + 1) % levels.length;
    const nextLevel = levels[nextIndex];

    setCurrentLevelIndex(nextIndex);
    setEquation(nextLevel.initialEquation);
    setIsComplete(false);
    setStatus(nextLevel.description);
  };

  return (
    <div className="app-root">
      <h1>Algebra Adventure – Prototype</h1>
      <h2>
        Level {currentLevelIndex + 1}: {currentLevel.title}
      </h2>

      <EquationView
        equation={equation}
        onDragTermStart={handleDragTermStart}
        onDropOnSide={handleDropOnSide}
        onDropOnTerm={handleDropOnTerm}
        onOperatorClick={handleOperatorClick}
      />

      <StatusBar message={status} />

      <div
        style={{
          marginTop: '0.75rem',
          display: 'flex',
          gap: '0.5rem',
          justifyContent: 'center',
        }}
      >
        <button onClick={reset}>Reset Level</button>
        <button onClick={goToNextLevel} disabled={!isComplete}>
          Next Level
        </button>
      </div>

      <p className="hint">
        • Drag a term onto another term to insert it before that term.
        <br />
        • Drag a term onto the background of a side to drop it at the end.
        <br />
        • Drag across the equals sign to add the opposite to the other side.
        <br />
        • Click the + or - between two integers to combine them.
      </p>
    </div>
  );
};

export default App;
