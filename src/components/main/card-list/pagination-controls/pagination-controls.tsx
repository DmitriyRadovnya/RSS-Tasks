import './pagination-controls.css';
import type { FC } from 'react';
import type { IPaginationControlsProps } from './pagination-controls.types';

export const PaginationControls: FC<IPaginationControlsProps> = ({
  handler,
  disabled,
}) => {
  if (disabled.next && disabled.prev) return null;

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
