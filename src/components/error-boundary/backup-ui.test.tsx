import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BackupUI from './backup-ui';

describe('BackupUI component', () => {
  it('renders correctly with correct text and styles', () => {
    render(<BackupUI />);

    const heading = screen.getByText(
      'Oh no, all the Pokemon have gone into hibernation.'
    );
    expect(heading).toBeInTheDocument();

    const paragraph = screen.getByText(
      "Let's rewind time to catch all the Pokemon?"
    );
    expect(paragraph).toBeInTheDocument();

    const button = screen.getByText('Rewind time!');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('reloadButton');
  });

  it('calls window.location.reload on button click', () => {
    const reloadMock = vi.fn();
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { reload: reloadMock },
    });

    render(<BackupUI />);
    const button = screen.getByText('Rewind time!');
    fireEvent.click(button);
    expect(reloadMock).toHaveBeenCalled();
  });
});
