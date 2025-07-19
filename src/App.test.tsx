import { describe, it, expect } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  it('renders loading skeleton initially', async () => {
    render(<App />);
    expect(screen.getAllByTestId('skeleton')).toHaveLength(8);
  });

  it('fetches and displays pokemons after loading', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
      expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
      expect(screen.getByText(/ivysaur/i)).toBeInTheDocument();
    });
  });

  it('handles pagination correctly', async () => {
    render(<App />);
    await waitFor(() => screen.getByText('Next'));

    fireEvent.click(screen.getByText('Next'));
    await waitFor(() => {
      expect(screen.getByText('Next')).toBeInTheDocument();
      expect(screen.getByText('Prev')).toBeInTheDocument();
    });
  });
});
