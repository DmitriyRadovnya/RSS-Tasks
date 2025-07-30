import './Skeleton.css';
import type { SkeletonProps } from '../../interfaces/interfaces';

export const Skeleton = (props: SkeletonProps) => {
  const {
    count = 4,
    width = '100%',
    height = '20px',
    margin = '3px 0',
  } = props;
  const skeletons = Array.from({ length: count }, (_, index) => (
    <div
      key={`skeleton${count}:${index}`}
      className="skeleton"
      data-testid="skeleton"
      style={{
        width,
        height,
        margin,
      }}
    />
  ));

  return (
    <div className="skeleton-container" data-testid="skeleton">
      {skeletons}
    </div>
  );
};
