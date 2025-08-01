import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  afterEach,
  vi,
} from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/node';
import { Main } from './main';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cardsReducer, { type CardsState } from '../../store/cards-slice';
import { CardDetails } from './card-list/card/card-details/card-details';

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
      ],
    } as RootState,
  });
};

describe('Main component', () => {
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

  it('renders CardList inside main-container', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/1']}>
          <Routes>
            <Route path="/:page" element={<Main />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole('main')).toHaveClass('main-container');

    expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
  });

  it('renders CardDetails via Outlet with Pokemon data after clicking on the card', async () => {
    server.use(
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
              ability: { name: 'overgrow' },
            },
          ],
          stats: [
            {
              base_stat: 45,
              stat: { name: 'speed' },
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
              <Route path=":detailsId" element={<CardDetails />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    const cardButton = screen.getByText(/bulbasaur/i);
    expect(cardButton).toBeInTheDocument();

    fireEvent.click(cardButton);

    await screen.findByText(/Base experience: 64/i);

    expect(screen.getByTestId('card-details')).toBeInTheDocument();
    expect(screen.getByText(/overgrow/i)).toBeInTheDocument();
    expect(screen.getByText(/speed: 45/i)).toBeInTheDocument();
  });

  it('shows a placeholder if no pokemon is selected', async () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/1']}>
          <Routes>
            <Route path="/:page" element={<Main />}>
              <Route path="" element={<CardDetails />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('card-details')).toBeInTheDocument();
    expect(screen.getByText(/Pokemon not selected/i)).toBeInTheDocument();
  });
});
