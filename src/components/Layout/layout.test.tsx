import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  afterEach,
  beforeEach,
  vi,
} from 'vitest';
import { render, screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/node';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Layout from './layout';
import { ThemeProvider } from '../../context/ThemeProvider';
import cardsReducer, { type CardsState } from '../../store/cards-slice';
import favoriteCardsReducer from '../../store/favorite-cards-slice';
import { pokemonApi } from '../../api/pokeapi';
import { usePokemonFromLS } from '../../hook/use-pokemon-from-ls';
import { Main } from '../main/main';
import type { IFavoriteCard } from '../main/card-list/card/card.types';

const navigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

vi.mock('../../hook/use-pokemon-from-ls', () => ({
  usePokemonFromLS: vi.fn(),
}));

interface RootState {
  cards: CardsState;
  favoriteCards: IFavoriteCard[];
  [pokemonApi.reducerPath]: ReturnType<typeof pokemonApi.reducer>;
}

const createMockStore = (initialState: Partial<RootState> = {}) => {
  return configureStore({
    reducer: {
      cards: cardsReducer,
      favoriteCards: favoriteCardsReducer,
      [pokemonApi.reducerPath]: pokemonApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(pokemonApi.middleware),
    preloadedState: {
      cards: initialState.cards || {
        cards: ['bulbasaur', 'ivysaur'],
        isPrevDisabled: false,
        isNextDisabled: false,
      },
      favoriteCards: initialState.favoriteCards || [],
      [pokemonApi.reducerPath]:
        initialState[pokemonApi.reducerPath] ||
        pokemonApi.reducer(undefined, { type: '' }),
    } as RootState,
  });
};

describe('Layout component', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
  });

  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
    vi.mocked(usePokemonFromLS).mockReturnValue({
      pokemonName: null,
      savePokemon: vi.fn(),
    });
    navigate.mockClear();
  });

  afterEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
  });

  afterAll(() => {
    server.close();
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

  it('renders child routes via Outlet', async () => {
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon', () => {
        return HttpResponse.json({
          count: 1118,
          next: 'https://pokeapi.co/api/v2/pokemon?offset=2&limit=2',
          previous: null,
          results: [
            {
              name: 'bulbasaur',
              url: 'https://pokeapi.co/api/v2/pokemon/bulbasaur',
            },
            {
              name: 'ivysaur',
              url: 'https://pokeapi.co/api/v2/pokemon/ivysaur',
            },
          ],
        });
      })
    );

    const store = createMockStore({ favoriteCards: [] });

    render(
      <Provider store={store}>
        <ThemeProvider>
          <MemoryRouter initialEntries={['/1']}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/:page" element={<Main searchError={null} />} />
              </Route>
            </Routes>
          </MemoryRouter>
        </ThemeProvider>
      </Provider>
    );

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

    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByText('RSSchool React')).toBeInTheDocument();
  });

  it('refetches data when refresh button is clicked in CardList', async () => {
    let callCount = 0;
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon', () => {
        callCount++;
        return HttpResponse.json({
          count: 1118,
          next: 'https://pokeapi.co/api/v2/pokemon?offset=2&limit=2',
          previous: null,
          results: [
            {
              name: callCount === 1 ? 'bulbasaur' : 'charmander',
              url: `https://pokeapi.co/api/v2/pokemon/${callCount === 1 ? 'bulbasaur' : 'charmander'}`,
            },
          ],
        });
      })
    );

    const store = createMockStore({ favoriteCards: [] });

    render(
      <Provider store={store}>
        <ThemeProvider>
          <MemoryRouter initialEntries={['/1']}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/:page" element={<Main searchError={null} />} />
              </Route>
            </Routes>
          </MemoryRouter>
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByText('RSSchool React')).toBeInTheDocument();
  });
});
