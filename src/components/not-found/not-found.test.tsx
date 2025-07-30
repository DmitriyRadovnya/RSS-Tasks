import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NotFound } from './not-found';

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

describe('NotFoundPage', () => {
  it('renders correctly', () => {
    render(<NotFound />);

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page not found')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Sorry, the page you requested does not exist or has been moved.'
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go Back' })).toBeInTheDocument();
  });
});
