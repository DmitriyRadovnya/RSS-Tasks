import './Skeleton.css';

type SkeletonProps = {
  count: number;
  width?: string;
  height?: string;
  margin?: string;
};

export default function Skeleton(props: SkeletonProps) {
  const {
    count = 4,
    width = '100%',
    height = '200px',
    margin = '8px 0',
  } = props;
  const skeletons = Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className="skeleton"
      data-testid="skeleton"
      style={{
        width,
        height,
        margin,
      }}
    />
  ));

  return <div className="skeletonContainer">{skeletons}</div>;
}
