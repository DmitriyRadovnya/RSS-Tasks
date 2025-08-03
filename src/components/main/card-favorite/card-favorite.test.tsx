import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../../test/test-utils';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { CardFavorite } from './card-favorite';
import favoriteCardsReducer from '../../../store/favorite-cards-slice';
import type { RootState } from '../../../store';
import type { IFavoriteCard } from '../card-list/card/card';

vi.mock('./card-favorite.lib', () => ({
  downloadFavoritesInCSV: vi.fn(),
}));

const createMockStore = (initialState: Partial<RootState> = {}) => {
  return configureStore({
    reducer: {
      favoriteCards: favoriteCardsReducer,
      cards: () => [],
    },
    preloadedState: initialState as RootState,
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
  beforeEach(() => {
    vi.clearAllMocks();
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
});
