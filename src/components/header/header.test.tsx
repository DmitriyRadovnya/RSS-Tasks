import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from './header';
import type { HeaderProps } from '../../interfaces/interfaces';
import { vi } from 'vitest';

describe('Header Component', () => {
  const defaultProps: HeaderProps = {
    setAppState: vi.fn(),
    setAppLoading: vi.fn(),
    setAppError: vi.fn(),
  };

  it('рендерит SearchForm и ссылку About', () => {
    render(
      <MemoryRouter>
        <Header {...defaultProps} />
      </MemoryRouter>
    );
    expect(screen.getByTestId('search-form')).toBeInTheDocument();
    expect(screen.getByText(/About/i)).toBeInTheDocument();
    expect(screen.getByRole('banner')).toHaveClass('header');
  });
});
