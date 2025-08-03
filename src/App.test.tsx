import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  afterEach,
  vi,
  beforeEach,
} from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from './mocks/node';
import { App } from './App';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cardsReducer, { type CardsState } from './store/cards-slice';
import favoriteCardsReducer from './store/favorite-cards-slice';
import type { IFavoriteCard } from './components/main/card-list/card/card.types';

interface RootState {
  cards: CardsState;
  favoriteCards: IFavoriteCard[];
}

const createMockStore = (initialState: Partial<RootState> = {}) => {
  return configureStore({
    reducer: {
      cards: cardsReducer,
      favoriteCards: favoriteCardsReducer,
    },
    preloadedState: {
      cards: initialState.cards || [
        {
          name: 'bulbasaur',
          url: 'https://pokeapi.co/api/v2/pokemon/1/',
        },
      ],
      favoriteCards: initialState.favoriteCards || [],
    } as RootState,
  });
};

const renderWithRouter = (ui: React.ReactElement, { route = '/1' } = {}) => {
  return render(
    <Provider store={createMockStore()}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/:page" element={ui} />
          <Route path="/404" element={<div>404 Not Found</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe('App component', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
  });

  beforeEach(() => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
  });

  afterEach(() => {
    server.resetHandlers();
    vi.restoreAllMocks();
  });

  afterAll(() => {
    server.close();
  });

  it('renders Skeleton on initial load', async () => {
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon', () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(
              HttpResponse.json({
                count: 1118,
                next: 'https://pokeapi.co/api/v2/pokemon?offset=2&limit=2',
                previous: null,
                results: [
                  {
                    name: 'bulbasaur',
                    url: 'https://pokeapi.co/api/v2/pokemon/1/',
                  },
                ],
              })
            );
          }, 100);
        });
      })
    );

    renderWithRouter(<App />, { route: '/1' });

    await waitFor(() => {
      expect(screen.getAllByTestId('skeleton')).toHaveLength(16);
    });
  });

  it('displays pokemon after loading', async () => {
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon', () => {
        return HttpResponse.json({
          count: 1118,
          next: 'https://pokeapi.co/api/v2/pokemon?offset=2&limit=2',
          previous: null,
          results: [
            { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
          ],
        });
      }),
      http.get('https://pokeapi.co/api/v2/pokemon/1/', () => {
        return HttpResponse.json({
          name: 'bulbasaur',
          base_experience: 64,
          sprites: {
            front_default:
              'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
          },
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
          stats: [
            {
              base_stat: 45,
              effort: 0,
              stat: {
                name: 'speed',
                url: 'https:// PokeAPI.co/api/v2/stat/6/',
              },
            },
          ],
        });
      })
    );

    renderWithRouter(<App />, { route: '/1' });

    await waitFor(
      () => {
        expect(screen.queryAllByTestId('skeleton')).toHaveLength(0);
        expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it('displays an error message when the API fails', async () => {
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    renderWithRouter(<App />, { route: '/1' });

    await waitFor(
      () => {
        expect(screen.queryAllByTestId('skeleton')).toHaveLength(0);
        expect(
          screen.getByText(/Unfortunately, such a Pokemon does not exist!/i)
        ).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it('navigates to /404 when page is invalid', async () => {
    renderWithRouter(<App />, { route: '/invalid' });

    await waitFor(() => {
      expect(screen.getByText(/404 Not Found/i)).toBeInTheDocument();
    });
  });
});
