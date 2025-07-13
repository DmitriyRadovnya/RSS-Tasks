import React from 'react';
import './Skeleton.css';

type SkeletonProps = {
  count?: number;
  width?: string;
  height?: string;
  margin?: string;
};

export default class Skeleton extends React.Component<SkeletonProps> {
  static defaultProps = {
    count: 4,
    width: '100%',
    height: '200px',
    margin: '8px 0',
  };

  render() {
    const { count, width, height, margin } = this.props;

    const skeletons = Array.from({ length: count! }, (_, index) => (
      <div
        key={index}
        className="skeleton"
        style={{
          width,
          height,
          margin,
        }}
      />
    ));

    return <div className="skeletonContainer">{skeletons}</div>;
  }
}
