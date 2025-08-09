import {
  describe,
  it,
  expect,
  vi,
  beforeAll,
  afterAll,
  afterEach,
} from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../../../../mocks/node';
import { Card } from './card';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import favoriteCardsReducer, {
  addFavoriteCard,
} from '../../../../store/favorite-cards-slice';
import { pokemonApi } from '../../../../api/pokeapi';
import type { CardProps } from './card.types';

const navigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

const createMockStore = () => {
  return configureStore({
    reducer: {
      favoriteCards: favoriteCardsReducer,
      [pokemonApi.reducerPath]: pokemonApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(pokemonApi.middleware),
  });
};

describe('Card component', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
  });

  afterEach(() => {
    server.resetHandlers();
    vi.restoreAllMocks();
    navigate.mockClear();
  });

  afterAll(() => {
    server.close();
  });

  it('renders pokemon name correctly', () => {
    const defaultProps: CardProps = {
      currentPage: 1,
      pokemonName: 'Bulbasaur',
    };

    render(
      <Provider store={createMockStore()}>
        <MemoryRouter>
          <Card {...defaultProps} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Bulbasaur'
    );
  });

  it('navigates to details page on card click', () => {
    const defaultProps: CardProps = {
      currentPage: 1,
      pokemonName: 'bulbasaur',
    };

    render(
      <Provider store={createMockStore()}>
        <MemoryRouter>
          <Card {...defaultProps} />
        </MemoryRouter>
      </Provider>
    );

    const cardButton = screen.getByText(/bulbasaur/i).closest('.card-button');
    if (cardButton) {
      fireEvent.click(cardButton);
      expect(navigate).toHaveBeenCalledWith('/1/bulbasaur');
    }
  });

  it('does not fetch pokemon details when not favorite', () => {
    const mockHandler = vi.fn();
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon/bulbasaur', () => {
        mockHandler();
        return HttpResponse.json({
          name: 'bulbasaur',
          base_experience: 64,
          stats: [],
          abilities: [],
        });
      })
    );

    const store = createMockStore();
    const defaultProps: CardProps = {
      currentPage: 1,
      pokemonName: 'bulbasaur',
    };

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Card {...defaultProps} />
        </MemoryRouter>
      </Provider>
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    expect(mockHandler).not.toHaveBeenCalled();
  });

  it('handles API error when fetching pokemon details', async () => {
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon/bulbasaur', () => {
        return new HttpResponse(null, { status: 404 });
      })
    );

    const store = createMockStore();
    const defaultProps: CardProps = {
      currentPage: 1,
      pokemonName: 'bulbasaur',
    };
    const spy = vi.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Card {...defaultProps} />
        </MemoryRouter>
      </Provider>
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    await waitFor(
      () => {
        expect(spy).not.toHaveBeenCalledWith(
          expect.objectContaining({ type: addFavoriteCard.type })
        );
        expect(checkbox).toBeChecked();
      },
      { timeout: 2000 }
    );
  });
});
