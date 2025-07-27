import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
// import { useNavigate } from 'react-router-dom';
import NotFoundPage from './not-found';

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

describe('NotFoundPage', () => {
  it('renders correctly', () => {
    render(<NotFoundPage />);

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page not found')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Sorry, the page you requested does not exist or has been moved.'
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go Back' })).toBeInTheDocument();
  });

  //   it('navigates to home page when button is clicked', () => {
  //     const mockNavigate = vi.fn();
  //     // (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

  //     render(<NotFoundPage />);
  //     const button = screen.getByRole('button', { name: 'Go Back' });

  //     fireEvent.click(button);

  //     expect(mockNavigate).toHaveBeenCalledWith('/1');
  //   });
});
