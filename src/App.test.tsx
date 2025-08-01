import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  afterEach,
  vi,
} from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from './mocks/node';
import { App } from './App';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cardsReducer, { type CardsState } from './store/cards-slice';

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

const renderWithRouter = (ui: React.ReactElement, { route = '/1' } = {}) => {
  return render(
    <Provider store={createMockStore()}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/:page" element={ui} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe('App component', () => {
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

  it('renders Skeleton on initial load', async () => {
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon', () => {
        return new Promise(() => {});
      })
    );

    renderWithRouter(<App />, { route: '/1' });
    expect(screen.getAllByTestId('skeleton')).toHaveLength(21);
  });

  it('displays pokemon after loading', async () => {
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon', () => {
        return HttpResponse.json({
          count: 1118,
          next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
          previous: null,
          results: [
            {
              name: 'bulbasaur',
              url: 'https://pokeapi.co/api/v2/pokemon/bulbasaur',
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

  // it('redirects to /404 if the page is invalid', async () => {
  //   renderWithRouter(<App />, { route: '/404' });
  //   await waitFor(
  //     () => {
  //       expect(screen.queryByText(/bulbasaur/i)).not.toBeInTheDocument();
  //       // expect(screen.getByText(/Page not found/i)).toBeInTheDocument();
  //     },
  //     { timeout: 2000 }
  //   );
  // });
});
