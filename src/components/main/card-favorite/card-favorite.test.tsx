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
import { render, screen, fireEvent, waitFor } from '../../../test/test-utils';
import { http, HttpResponse } from 'msw';
import { server } from '../../../mocks/node';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { CardFavorite } from './card-favorite';
import cardsReducer, { type CardsState } from '../../../store/cards-slice';
import favoriteCardsReducer from '../../../store/favorite-cards-slice';
import { pokemonApi } from '../../../api/pokeapi';
import { Main } from '../main';
import { ThemeProvider } from '../../../context/ThemeProvider';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { usePokemonFromLS } from '../../../hook/use-pokemon-from-ls';
import type { IFavoriteCard } from '../card-list/card/card.types';
import Layout from '../../Layout/layout';

vi.mock('./card-favorite.lib', () => ({
  downloadFavoritesInCSV: vi.fn(),
}));

const navigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

vi.mock('../../../hook/use-pokemon-from-ls', () => ({
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

const mockFavoriteCards: IFavoriteCard[] = [
  {
    name: 'bulbasaur',
    baseExp: 64,
    stats: [
      {
        base_stat: 45,
        effort: 0,
        stat: { name: 'speed', url: 'https://pokeapi.co/api/v2/stat/6/' },
      },
    ],
    abilities: [
      {
        ability: {
          name: 'overgrow',
          url: 'https://pokeapi.co/api/v2/ability/65/',
        },
        is_hidden: false,
        slot: 1,
      },
    ],
  },
  {
    name: 'ivysaur',
    baseExp: 142,
    stats: [
      {
        base_stat: 60,
        effort: 0,
        stat: { name: 'speed', url: 'https://pokeapi.co/api/v2/stat/6/' },
      },
    ],
    abilities: [
      {
        ability: {
          name: 'overgrow',
          url: 'https://pokeapi.co/api/v2/ability/65/',
        },
        is_hidden: false,
        slot: 1,
      },
    ],
  },
];

describe('CardFavorite component', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
  });

  beforeEach(() => {
    vi.clearAllMocks();
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

  it('renders favorite cards list with correct count', () => {
    const store = createMockStore({ favoriteCards: mockFavoriteCards });

    render(
      <Provider store={store}>
        <CardFavorite />
      </Provider>
    );

    expect(screen.getByText(/Favorite cards: 2/i)).toBeInTheDocument();
    expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
    expect(screen.getByText(/ivysaur/i)).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(
      screen.getByRole('button', { name: /Clear list/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Download list/i })
    ).toBeInTheDocument();
  });

  it('does not render when favoriteCards is empty', () => {
    const store = createMockStore({ favoriteCards: [] });

    render(
      <Provider store={store}>
        <CardFavorite />
      </Provider>
    );

    expect(screen.queryByText(/Favorite cards/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Clear list/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Download list/i })
    ).not.toBeInTheDocument();
  });

  it('dispatches removeAllFavoriteCards when Clear list button is clicked', async () => {
    const store = createMockStore({ favoriteCards: mockFavoriteCards });
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <CardFavorite />
      </Provider>
    );

    const clearButton = screen.getByRole('button', { name: /Clear list/i });
    fireEvent.click(clearButton);

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'favoriteCards/removeAllFavoriteCards',
    });

    await waitFor(() => {
      expect(store.getState().favoriteCards).toEqual([]);
    });
  });

  it('refetches data when refresh button is clicked in CardList within Layout', async () => {
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

    const store = createMockStore({ favoriteCards: mockFavoriteCards });

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

    expect(screen.getByText(/Favorite cards: 2/i)).toBeInTheDocument();
    expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
    expect(screen.getByText(/ivysaur/i)).toBeInTheDocument();
  });
});
