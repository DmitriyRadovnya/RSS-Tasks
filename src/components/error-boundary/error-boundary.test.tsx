import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ErrorBoundary from './error-boundary';

const ChildComponent = () => <div data-testid="child">Hello</div>;
const FallbackComponent = <div data-testid="fallback">Error occurred</div>;

describe('ErrorBoundary', () => {
  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary fallback={FallbackComponent}>
        <ChildComponent />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.queryByTestId('fallback')).toBeNull();
  });

  it('renders fallback when error is thrown inside children', () => {
    const ErrorComponent = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary fallback={FallbackComponent}>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('fallback')).toBeInTheDocument();
  });
});
