import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  afterEach,
  vi,
} from 'vitest';
import { render, screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../../../mocks/node';
import { CardList } from './card-list';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cardsReducer, { type CardsState } from '../../../store/cards-slice';

interface RootState {
  cards: CardsState;
}

const createMockStore = (initialState: Partial<RootState> = {}) => {
  return configureStore({
    reducer: {
      cards: cardsReducer,
    },
    preloadedState: {
      cards: initialState.cards || [
        {
          name: 'bulbasaur',
          url: 'https://pokeapi.co/api/v2/pokemon/bulbasaur',
        },
        { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/ivysaur' },
      ],
    } as RootState,
  });
};

describe('CardList component', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
  });

  afterEach(() => {
    server.resetHandlers();
    vi.restoreAllMocks();
  });

  afterAll(() => {
    server.close();
  });

  it('renders a list of Pokemon name cards from a Redux store', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/1']}>
          <CardList />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
    expect(screen.getByText(/ivysaur/i)).toBeInTheDocument();
    expect(screen.getAllByText(/[a-zA-Z]/)).toHaveLength(2);
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
