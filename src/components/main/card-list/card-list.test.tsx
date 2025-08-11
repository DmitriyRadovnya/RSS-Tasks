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
import { render, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../../../mocks/node';
import { CardList } from './card-list';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cardsReducer, { showCards } from '../../../store/cards-slice';
import favoriteCardsReducer from '../../../store/favorite-cards-slice';
import { pokemonApi } from '../../../api/pokeapi';
import type { RootState } from '../../../store/index';
import { usePokemonFromLS } from '../../../hook/use-pokemon-from-ls';

vi.mock('../../../hook/use-pokemon-from-ls', () => ({
  usePokemonFromLS: vi.fn(),
}));

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
      cards: initialState.cards || [],
    } as RootState,
  });
};

describe('CardList component', () => {
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
  });

  afterAll(() => {
    server.close();
  });

  it('renders a list of Pokémon name cards from a Redux store', async () => {
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon', () => {
        return HttpResponse.json({
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
          previous: null,
          next: 'https://pokeapi.co/api/v2/pokemon?offset=2&limit=20',
        });
      })
    );

    const store = createMockStore();
    const spy = vi.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/1']}>
          <CardList />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith(showCards(['bulbasaur', 'ivysaur']));
      expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
      expect(screen.getByText(/ivysaur/i)).toBeInTheDocument();
      expect(screen.getAllByText(/bulbasaur|ivysaur/i)).toHaveLength(2);
    });
  });

  it('displays Skeleton during loading', async () => {
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon', async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return HttpResponse.json({
          results: [
            {
              name: 'bulbasaur',
              url: 'https://pokeapi.co/api/v2/pokemon/bulbasaur',
            },
          ],
        });
      })
    );

    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/1']}>
          <CardList />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getAllByTestId('skeleton')).toHaveLength(16);
    await waitFor(() => {
      expect(screen.queryAllByTestId('skeleton')).toHaveLength(0);
    });
  });

  it('displays single Pokémon when pokemonName is set', async () => {
    vi.mocked(usePokemonFromLS).mockReturnValue({
      pokemonName: 'pikachu',
      savePokemon: vi.fn(),
    });

    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon/pikachu', () => {
        return HttpResponse.json({
          name: 'pikachu',
          base_experience: 112,
          stats: [],
          abilities: [],
          sprites: {
            front_default: 'https://pokeapi.co/api/v2/pokemon/pikachu.png',
          },
        });
      })
    );

    const store = createMockStore();
    const spy = vi.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/1']}>
          <CardList />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith(showCards(['pikachu']));
      expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
      expect(screen.getAllByText(/pikachu/i)).toHaveLength(1);
      expect(screen.queryByText(/bulbasaur/i)).not.toBeInTheDocument();
    });
  });
});
