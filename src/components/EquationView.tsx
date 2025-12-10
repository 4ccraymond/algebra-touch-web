// src/components/EquationView.tsx
import React from 'react';
import type { Equation, Term } from '../math/types';

interface EquationViewProps {
  equation: Equation;
  onDragTermStart: (
    side: 'left' | 'right',
    index: number,
    e: React.DragEvent<HTMLSpanElement>
  ) => void;
  onDropSide: (
    side: 'left' | 'right',
    e: React.DragEvent<HTMLDivElement>
  ) => void;
  onOperatorClick: (side: 'left' | 'right', rightIndex: number) => void;
}

const EquationView: React.FC<EquationViewProps> = ({
  equation,
  onDragTermStart,
  onDropSide,
  onOperatorClick,
}) => {
  const renderSide = (side: 'left' | 'right', terms: Term[]) => {
    if (terms.length === 0) {
      // Empty side becomes 0
      return <span className="token">0</span>;
    }

    return terms.map((term, index) => {
      const isNegative = term.sign === -1;
      const bodyText =
        term.kind === 'variable' ? term.name : term.value.toString();

      const signForFirst = isNegative ? '-' : '';
      const operatorText = isNegative ? '-' : '+';

      return (
        <React.Fragment
          key={`${side}-${index}-${term.kind}-${bodyText}-${term.sign}`}
        >
          {index === 0 ? null : (
            <span
              className="token operator"
              onClick={() => onOperatorClick(side, index)}
            >
              {operatorText}
            </span>
          )}

          <span
            className="token draggable"
            draggable
            onDragStart={(e) => onDragTermStart(side, index, e)}
          >
            {index === 0 ? signForFirst : ''}
            {bodyText}
          </span>
        </React.Fragment>
      );
    });
  };

  return (
    <div className="equation-row">
      <div
        className="side left-side drop-target"
        onDrop={(e) => onDropSide('left', e)}
        onDragOver={(e) => e.preventDefault()}
      >
        {renderSide('left', equation.left.terms)}
      </div>

      <span className="token equals">=</span>

      <div
        className="side right-side drop-target"
        onDrop={(e) => onDropSide('right', e)}
        onDragOver={(e) => e.preventDefault()}
      >
        {renderSide('right', equation.right.terms)}
      </div>
    </div>
  );
};

export default EquationView;
