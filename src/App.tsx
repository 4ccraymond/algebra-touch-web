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

  const handleDropSide = (
    targetSide: 'left' | 'right',
    e: React.DragEvent<HTMLDivElement>
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

    const { side: fromSide, index } = parsed;

    const updated = moveTerm(equation, fromSide, index, targetSide);
    if (updated === equation) {
      setStatus('Could not move that term.');
      return;
    }

    setEquation(updated);

    const done = checkGoalReached(currentLevel, updated);
    if (done) {
      setIsComplete(true);
      setStatus('Level complete! You isolated x.');
    } else if (fromSide === targetSide) {
      setStatus(
        'Reordered: dropping on the same side moves the term to the front.'
      );
    } else {
      setStatus(
        'Nice! Moving a term across "=" adds its opposite to the other side.'
      );
    }
  };

  const handleOperatorClick = (side: 'left' | 'right', rightIndex: number) => {
    const updated = combineAdjacentNumbers(equation, side, rightIndex);

    if (updated === equation) {
      setStatus(
        'Those terms cannot be combined. You can only combine two adjacent integers from the same family.'
      );
      return;
    }

    setEquation(updated);

    const done = checkGoalReached(currentLevel, updated);
    if (done) {
      setIsComplete(true);
      setStatus('Level complete! You isolated x.');
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
        onDropSide={handleDropSide}
        onOperatorClick={handleOperatorClick}
      />

      <StatusBar message={status} />

      <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        <button onClick={reset}>Reset Level</button>
        <button onClick={goToNextLevel} disabled={!isComplete}>
          Next Level
        </button>
      </div>

      <p className="hint">
        • Drag a term onto the same side to move it to the front.
        <br />
        • Drag a term across the equals sign to add its opposite to the other
        side.
        <br />
        • Click the + or - between two integers of the same family to combine
        them.
        <br />
        • Goal for this level: isolate x with a single number on the other side.
      </p>
    </div>
  );
};

export default App;