import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Skeleton from './skeleton';

describe('Skeleton component', () => {
  it('renders the default number of skeletons with default styles', () => {
    render(<Skeleton />);

    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons.length).toBe(4);

    skeletons.forEach((element) => {
      expect(element).toHaveStyle({
        width: '100%',
        height: '200px',
        margin: '8px 0',
      });
    });
  });

  it('renders the correct number of skeletons based on count prop', () => {
    render(<Skeleton count={2} />);

    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons.length).toBe(2);
  });

  it('applies custom styles for width, height, and margin', () => {
    render(<Skeleton count={1} width="50%" height="100px" margin="10px" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveStyle({
      width: '50%',
      height: '100px',
      margin: '10px',
    });
  });
});
