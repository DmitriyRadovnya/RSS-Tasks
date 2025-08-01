import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PaginationControls } from './pagination-controls';

describe('PaginationControls component', () => {
  it('renders Prev and Next buttons when they are not disabled', () => {
    const mockHandler = vi.fn();
    render(
      <PaginationControls
        handler={mockHandler}
        disabled={{ prev: false, next: false }}
      />
    );

    const prevButton = screen.getByText(/Prev/i);
    const nextButton = screen.getByText(/Next/i);

    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
    expect(prevButton).not.toBeDisabled();
    expect(nextButton).not.toBeDisabled();
  });

  it('does not render anything if both buttons are disabled', () => {
    const mockHandler = vi.fn();
    render(
      <PaginationControls
        handler={mockHandler}
        disabled={{ prev: true, next: true }}
      />
    );

    expect(screen.queryByText(/Prev/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Next/i)).not.toBeInTheDocument();
  });

  it('disables the Prev button if disabled.prev === true', () => {
    const mockHandler = vi.fn();
    render(
      <PaginationControls
        handler={mockHandler}
        disabled={{ prev: true, next: false }}
      />
    );

    const prevButton = screen.getByText(/Prev/i);
    const nextButton = screen.getByText(/Next/i);

    expect(prevButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();
  });

  it('disables the Next button if disabled.next === true', () => {
    const mockHandler = vi.fn();
    render(
      <PaginationControls
        handler={mockHandler}
        disabled={{ prev: false, next: true }}
      />
    );

    const prevButton = screen.getByText(/Prev/i);
    const nextButton = screen.getByText(/Next/i);

    expect(prevButton).not.toBeDisabled();
    expect(nextButton).toBeDisabled();
  });

  it('calls the handler with "prev" when clicking the Prev button', () => {
    const mockHandler = vi.fn();
    render(
      <PaginationControls
        handler={mockHandler}
        disabled={{ prev: false, next: false }}
      />
    );

    const prevButton = screen.getByText(/Prev/i);
    fireEvent.click(prevButton);

    expect(mockHandler).toHaveBeenCalledWith('prev');
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });

  it('calls the handler with "next" when clicking the Next button', () => {
    const mockHandler = vi.fn();
    render(
      <PaginationControls
        handler={mockHandler}
        disabled={{ prev: false, next: false }}
      />
    );

    const nextButton = screen.getByText(/Next/i);
    fireEvent.click(nextButton);

    expect(mockHandler).toHaveBeenCalledWith('next');
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });

  it('does not call handler when clicking on disabled button', () => {
    const mockHandler = vi.fn();
    render(
      <PaginationControls
        handler={mockHandler}
        disabled={{ prev: true, next: true }}
      />
    );

    expect(screen.queryByText(/Prev/i)).not.toBeInTheDocument();
    expect(mockHandler).not.toHaveBeenCalled();
  });
});
