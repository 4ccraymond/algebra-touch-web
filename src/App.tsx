// src/App.tsx
import React, { useState } from 'react';
import './styles/App.css';
import EquationView from './components/EquationView';
import StatusBar from './components/StatusBar';
import type { Equation } from './math/types';
import { moveTerm, combineAdjacentNumbers } from './math/rules';

const initialEquation: Equation = {
  left: {
    terms: [
      { kind: 'variable', name: 'x', sign: 1, family: 'x' },   // +x
      { kind: 'number', value: 3, sign: 1, family: 'num' },    // +3
    ],
  },
  right: {
    terms: [{ kind: 'number', value: 5, sign: 1, family: 'num' }], // +5
  },
};

const App: React.FC = () => {
  const [equation, setEquation] = useState<Equation>(initialEquation);
  const [status, setStatus] = useState(
    'Drag any term to reorder it or move it across "=". Click between two integers to combine them.'
  );

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

    if (fromSide === targetSide) {
      setStatus(
        'Reordered: dropping on the same side moves the term to the front.'
      );
    } else {
      setStatus(
        'Nice! Moving a term across "=" adds its opposite to the other side.'
      );
    }

    setEquation(updated);
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
    setStatus('Combined those integers into a single number.');
  };

  const reset = () => {
    setEquation(initialEquation);
    setStatus(
      'Drag any term to reorder it or move it across "=". Click between two integers to combine them.'
    );
  };

  return (
    <div className="app-root">
      <h1>Algebra Touch Web – Prototype</h1>

      <EquationView
        equation={equation}
        onDragTermStart={handleDragTermStart}
        onDropSide={handleDropSide}
        onOperatorClick={handleOperatorClick}
      />

      <StatusBar message={status} />

      <button onClick={reset}>Reset</button>

      <p className="hint">
        • Drag a term onto the same side to move it to the front.
        <br />
        • Drag a term across the equals sign to add its opposite to the other
        side.
        <br />
        • Click the + or - between two integers to combine them.
      </p>
    </div>
  );
};

export default App;
