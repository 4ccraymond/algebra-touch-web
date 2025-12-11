// src/components/EquationView.tsx
import React from 'react';
import type { Equation, Term } from '../math/types';
import { motion } from 'framer-motion';

interface EquationViewProps {
  equation: Equation;
  onDragTermStart: (
    side: 'left' | 'right',
    index: number,
    e: React.DragEvent<HTMLSpanElement>
  ) => void;
  onDropOnSide: (
    side: 'left' | 'right',
    e: React.DragEvent<HTMLDivElement>
  ) => void;
  onDropOnTerm: (
    side: 'left' | 'right',
    targetIndex: number,
    e: React.DragEvent<HTMLElement>
  ) => void;
  onOperatorClick: (side: 'left' | 'right', rightIndex: number) => void;
}

const EquationView: React.FC<EquationViewProps> = ({
  equation,
  onDragTermStart,
  onDropOnSide,
  onDropOnTerm,
  onOperatorClick,
}) => {
  const renderTermBody = (term: Term): string => {
    if (term.kind === 'number') {
      return term.value.toString();
    }
    // variable: show 3x, x, 2y, etc.
    if (term.coefficient === 1) {
      return term.name;
    }
    return `${term.coefficient}${term.name}`;
  };

  const renderSide = (side: 'left' | 'right', terms: Term[]) => {
    if (terms.length === 0) {
      return <span className="token">0</span>;
    }

    return terms.map((term, index) => {
      const isNegative = term.sign === -1;
      const signForFirst = isNegative ? '-' : '';
      const operatorText = isNegative ? '-' : '+';
      const bodyText = renderTermBody(term);

      const key =
        term.id ??
        `${side}-${index}-${term.kind}-${term.family}-${bodyText}-${term.sign}`;

      return (
        <motion.div
          key={key}                    // 🔑 stable key (id when present)
          layout                       // let Framer Motion animate position changes
          className="term-slot"
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();       // avoid bubbling to side
            onDropOnTerm(side, index, e);
          }}
          onDragOver={(e) => e.preventDefault()}
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
        </motion.div>
      );
    });
  };

  return (
    <div className="equation-row">
      <div
        className="side left-side drop-target"
        onDrop={(e) => {
          e.preventDefault();
          onDropOnSide('left', e); // drop at end of left side
        }}
        onDragOver={(e) => e.preventDefault()}
      >
        {renderSide('left', equation.left.terms)}
      </div>

      <span className="token equals">=</span>

      <div
        className="side right-side drop-target"
        onDrop={(e) => {
          e.preventDefault();
          onDropOnSide('right', e); // drop at end of right side
        }}
        onDragOver={(e) => e.preventDefault()}
      >
        {renderSide('right', equation.right.terms)}
      </div>
    </div>
  );
};

export default EquationView;
