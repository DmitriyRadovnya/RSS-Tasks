import './pagination-controls.css';
import type { FC } from 'react';

type paginationDirection = 'prev' | 'next';

interface IPaginationControlsProps {
  handler: (drection: paginationDirection) => void;
  disabled: {
    prev: boolean;
    next: boolean;
  };
}

export const PaginationControls: FC<IPaginationControlsProps> = ({
  handler,
  disabled,
}) => {
  if (disabled.next === true && disabled.prev === true) return null;

  return (
    <div className="buttons-container">
      <button
        className="pagination-button"
        disabled={disabled.prev}
        onClick={() => handler('prev')}
      >
        Prev
      </button>
      <button
        className="pagination-button"
        disabled={disabled.next}
        onClick={() => handler('next')}
      >
        Next
      </button>
    </div>
  );
};
