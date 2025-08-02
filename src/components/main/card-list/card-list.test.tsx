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
import { server } from '../../../mocks/node';
import { CardList } from './card-list';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cardsReducer from '../../../store/cards-slice';
import favoriteCardsReducer from '../../../store/favorite-cards-slice';
import type { RootState } from '../../../store/index';
import { http, HttpResponse } from 'msw';

const createMockStore = (initialState: Partial<RootState> = {}) => {
  return configureStore({
    reducer: {
      cards: cardsReducer,
      favoriteCards: favoriteCardsReducer,
    },
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
  });

  afterEach(() => {
    server.resetHandlers();
    vi.restoreAllMocks();
  });

  afterAll(() => {
    server.close();
  });

  it('renders a list of Pokemon name cards from a Redux store', async () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/1']}>
          <CardList />
        </MemoryRouter>
      </Provider>
    );

    await screen.findByText(/bulbasaur/i);
    expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
    expect(screen.getByText(/ivysaur/i)).toBeInTheDocument();
    expect(screen.getAllByText(/bulbasaur|ivysaur/i)).toHaveLength(2);
  });

  it('displays Skeleton on boot', async () => {
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon', () => {
        return new Promise(() => {});
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

    expect(screen.getAllByTestId('skeleton')).toHaveLength(21);
  });

  it('displays InvalidPokemon on error', async () => {
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon', () => {
        return HttpResponse.error();
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

    await screen.findByText(/Unfortunately, such a Pokemon does not exist!/i);
  });
});
