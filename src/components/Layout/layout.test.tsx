import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Layout from './layout';
import { ThemeProvider } from '../../context/ThemeProvider';
import favoriteCardsReducer from '../../store/favorite-cards-slice';
import type { RootState } from '../../store';

const createMockStore = (initialState: Partial<RootState> = {}) => {
  return configureStore({
    reducer: {
      favoriteCards: favoriteCardsReducer,
      cards: () => [],
    },
    preloadedState: initialState as RootState,
  });
};

describe('Layout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders header, outlet, and footer', () => {
    const store = createMockStore({ favoriteCards: [] });

    render(
      <Provider store={store}>
        <ThemeProvider>
          <MemoryRouter>
            <Layout />
          </MemoryRouter>
        </ThemeProvider>
      </Provider>
    );

    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass('header');

    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
    expect(homeLink).toHaveClass('header-link');

    const aboutLink = screen.getByRole('link', { name: /about/i });
    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink).toHaveAttribute('href', '/about');
    expect(aboutLink).toHaveClass('header-link');

    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveTextContent('RSSchool React');

    expect(screen.queryByText(/Favorite cards/i)).not.toBeInTheDocument();
  });

  it('renders child routes via Outlet', () => {
    const ChildComponent = () => <div>Child Route</div>;
    const store = createMockStore({ favoriteCards: [] });

    render(
      <Provider store={store}>
        <ThemeProvider>
          <MemoryRouter initialEntries={['/test']}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/test" element={<ChildComponent />} />
              </Route>
            </Routes>
          </MemoryRouter>
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText('Child Route')).toBeInTheDocument();

    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByText('RSSchool React')).toBeInTheDocument();

    expect(screen.queryByText(/Favorite cards/i)).not.toBeInTheDocument();
  });

  it('renders CardFavorite when favoriteCards is not empty', () => {
    const mockFavoriteCards = [
      {
        name: 'bulbasaur',
        baseExp: 64,
        stats: [{ base_stat: 45, effort: 0, stat: { name: 'speed', url: '' } }],
        abilities: [
          { ability: { name: 'overgrow', url: '' }, is_hidden: false, slot: 1 },
        ],
      },
    ];
    const store = createMockStore({ favoriteCards: mockFavoriteCards });

    render(
      <Provider store={store}>
        <ThemeProvider>
          <MemoryRouter>
            <Layout />
          </MemoryRouter>
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText(/Favorite cards: 1/i)).toBeInTheDocument();
    expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Clear list/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Download list/i })
    ).toBeInTheDocument();
  });
});
