type paginationDirection = 'prev' | 'next';

export interface IPaginationControlsProps {
  handler: (drection: paginationDirection) => void;
  disabled: {
    prev: boolean;
    next: boolean;
  };
}
