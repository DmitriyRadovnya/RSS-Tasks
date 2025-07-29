import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Skeleton from './skeleton';

describe('Skeleton Component', () => {
  it('renders the specified number of skeletons with default styles', () => {
    render(<Skeleton count={4} />);
    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons).toHaveLength(5);
    skeletons.forEach((element, index) => {
      if (index === 0) {
        expect(element).toHaveClass('skeleton-container');
      } else {
        expect(element).toHaveClass('skeleton');
        expect(element).toHaveStyle({
          width: '100%',
          height: '20px',
          margin: '3px 0',
        });
      }
    });
  });

  it('renders the correct number of skeletons based on the count prop', () => {
    render(<Skeleton count={2} />);
    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons).toHaveLength(3);
  });

  it('applies custom styles to width, height and margin', () => {
    render(<Skeleton count={1} width="50%" height="100px" margin="10px" />);
    const skeleton = screen
      .getAllByTestId('skeleton')
      .find((el) => el.className === 'skeleton');
    expect(skeleton).toHaveStyle({
      width: '50%',
      height: '100px',
      margin: '10px',
    });
  });
});
