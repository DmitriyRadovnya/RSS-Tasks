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
import { render, screen, waitFor } from '../../test/test-utils';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/node';
import { Main } from './main';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cardsReducer, { type CardsState } from '../../store/cards-slice';
import favoriteCardsReducer from '../../store/favorite-cards-slice';

import { pokemonApi } from '../../api/pokeapi';
import { usePokemonFromLS } from '../../hook/use-pokemon-from-ls';
import type { IFavoriteCard } from './card-list/card/card.types';

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
      cards: initialState.cards || ['bulbasaur', 'ivysaur'],
      favoriteCards: initialState.favoriteCards || [],
    } as RootState,
  });
};

describe('Main component', () => {
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
  });

  afterEach(() => {
    server.resetHandlers();
    vi.restoreAllMocks();
    navigate.mockClear();
  });

  afterAll(() => {
    server.close();
  });

  it('renders CardList inside main-container', async () => {
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

    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/1']}>
          <Routes>
            <Route path="/:page" element={<Main searchError={null} />}>
              <Route
                index
                element={
                  <div className="placeholder-text">Select a Pokémon</div>
                }
              />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('main-container')).toHaveClass('main-container');
    await waitFor(() => {
      expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
      expect(screen.getByText(/ivysaur/i)).toBeInTheDocument();
      expect(screen.getByTestId('list-container')).toBeInTheDocument();
      expect(screen.getByTestId('details-container')).toBeInTheDocument();
      expect(screen.getByText(/Select a Pokémon/i)).toBeInTheDocument();
    });
  });

  it('renders InvalidPokemon when searchError is provided', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/1']}>
          <Routes>
            <Route
              path="/:page"
              element={<Main searchError={new Error('Pokémon not found')} />}
            >
              <Route
                index
                element={
                  <div className="placeholder-text">Select a Pokémon</div>
                }
              />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('main-container')).toHaveClass('main-container');
    expect(
      screen.getByText(/Unfortunately, such a Pokémon does not exist!/i)
    ).toBeInTheDocument();
    expect(screen.queryByTestId('list-container')).not.toBeInTheDocument();
    expect(screen.queryByTestId('details-container')).not.toBeInTheDocument();
  });
});
