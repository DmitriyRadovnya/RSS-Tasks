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
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '../../test/test-utils';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/node';
import { Main } from './main';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cardsReducer, { type CardsState } from '../../store/cards-slice';
import favoriteCardsReducer from '../../store/favorite-cards-slice';
import { CardDetails } from './card-details/card-details';
import type { IFavoriteCard } from './card-list/card/card.types';

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
          url: 'https://pokeapi.co/api/v2/pokemon/bulbasaur',
        },
        {
          name: 'ivysaur',
          url: 'https://pokeapi.co/api/v2/pokemon/ivysaur',
        },
      ],
      favoriteCards: initialState.favoriteCards || [],
    } as RootState,
  });
};

describe('Main component', () => {
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
            <Route path="/:page" element={<Main />}>
              <Route
                index
                element={
                  <div className="placeholder-text">Select a Pokemon</div>
                }
              />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('main-container')).toHaveClass('main-container');
    await screen.findByText(/bulbasaur/i);
    expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
    expect(screen.getByText(/ivysaur/i)).toBeInTheDocument();
    expect(screen.getByTestId('list-container')).toBeInTheDocument();
    expect(screen.getByTestId('details-container')).toBeInTheDocument();
    expect(screen.getByText(/Select a Pokemon/i)).toBeInTheDocument();
  });

  it('renders CardDetails via Outlet with Pokemon data after clicking on the card', async () => {
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
      }),
      http.get('https://pokeapi.co/api/v2/pokemon/bulbasaur', () => {
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
              stat: { name: 'speed', url: 'https://pokeapi.co/api/v2/stat/6/' },
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
            <Route path="/:page" element={<Main />}>
              <Route
                index
                element={
                  <div className="placeholder-text">Select a Pokemon</div>
                }
              />
              <Route path=":detailsId" element={<CardDetails />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    await screen.findByText(/bulbasaur/i);

    expect(screen.getByText(/Select a Pokemon/i)).toBeInTheDocument();
    expect(screen.queryByTestId('card-details')).not.toBeInTheDocument();

    const cardContainer = screen.getByTestId('list-container');
    const cardButton = within(cardContainer).getByText(/bulbasaur/i);
    expect(cardButton).toHaveClass('card-name');

    fireEvent.click(cardButton);

    await waitFor(() => {
      expect(screen.getByTestId('card-details')).toBeInTheDocument();
    });

    const detailsContainer = screen.getByTestId('details-container');
    expect(within(detailsContainer).getByText(/bulbasaur/i)).toHaveClass(
      'card-details-name'
    );
    expect(screen.getByText(/Base experience: 64/i)).toBeInTheDocument();
    expect(screen.getByText(/overgrow/i)).toBeInTheDocument();
    expect(screen.getByText(/speed: 45/i)).toBeInTheDocument();
  });

  it('shows a placeholder in CardDetails when no pokemon is selected', async () => {
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
            <Route path="/:page" element={<Main />}>
              <Route
                index
                element={
                  <div className="placeholder-text">Select a Pokemon</div>
                }
              />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Select a Pokemon/i)).toBeInTheDocument();
    });
    expect(screen.queryByTestId('card-details')).not.toBeInTheDocument();
  });
});
