import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Header from './header';
import { BrowserRouter } from 'react-router-dom';

const renderWithRouter = (ui: React.ReactElement) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe('Header component', () => {
  it('renders SearchForm with correct props', () => {
    const setAppState = vi.fn();
    const setAppLoading = vi.fn();
    const setAppError = vi.fn();

    renderWithRouter(
      <Header
        setAppState={setAppState}
        setAppLoading={setAppLoading}
        setAppError={setAppError}
      />
    );
    const searchForm = screen.getByTestId('search-form');
    expect(searchForm).toBeInTheDocument();
  });
});
