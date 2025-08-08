import type { FC } from 'react';
import './Skeleton.css';
import type { SkeletonProps } from './skeleton.types';

export const Skeleton: FC<SkeletonProps> = ({ count = 4, ...props }) => {
  const skeletons = Array.from({ length: count }, (_, index) => (
    <div
      key={`skeleton${count}:${index}`}
      className="skeleton"
      data-testid="skeleton"
      style={{ ...props }}
    />
  ));

  return (
    <div className="skeleton-container" data-testid="skeleton">
      {skeletons}
    </div>
  );
};
