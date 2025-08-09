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
import { server } from '../../../mocks/node';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { CardDetails } from './card-details';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { pokemonApi } from '../../../api/pokeapi';

const navigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

const mockPokemon = {
  name: 'charmeleon',
  stats: [
    { stat: { name: 'hp' }, base_stat: 58 },
    { stat: { name: 'attack' }, base_stat: 64 },
  ],
  abilities: [
    { ability: { name: 'blaze' } },
    { ability: { name: 'solar-power' } },
  ],
  base_experience: 142,
  sprites: {
    front_default: 'https://pokeapi.co/media/sprites/front_default/5.png',
  },
};

const createMockStore = () => {
  return configureStore({
    reducer: {
      [pokemonApi.reducerPath]: pokemonApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(pokemonApi.middleware),
  });
};

describe('CardDetails component', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
  });

  afterEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
    navigate.mockClear();
  });

  afterAll(() => {
    server.close();
  });

  it('renders Skeleton while loading', async () => {
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon/charmeleon', async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return HttpResponse.json(mockPokemon);
      })
    );

    render(
      <Provider store={createMockStore()}>
        <MemoryRouter initialEntries={['/1/charmeleon']}>
          <Routes>
            <Route path="/:page/:detailsId" element={<CardDetails />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('card-details')).toBeInTheDocument();
    expect(screen.getAllByTestId('skeleton')).toHaveLength(2);
    await waitFor(() => {
      expect(screen.queryAllByTestId('skeleton')).toHaveLength(0);
    });
  });

  it('displays Pokémon info after loading', async () => {
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon/charmeleon', () => {
        return HttpResponse.json(mockPokemon);
      })
    );

    render(
      <Provider store={createMockStore()}>
        <MemoryRouter initialEntries={['/1/charmeleon']}>
          <Routes>
            <Route path="/:page/:detailsId" element={<CardDetails />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(
      () => {
        expect(screen.getByText('charmeleon')).toBeInTheDocument();
        expect(screen.getByAltText('charmeleon')).toHaveAttribute(
          'src',
          mockPokemon.sprites.front_default
        );
        expect(screen.getByText('Base experience: 142')).toBeInTheDocument();
        expect(screen.getByText('hp: 58')).toBeInTheDocument();
        expect(screen.getByText('attack: 64')).toBeInTheDocument();
        expect(screen.getByText('blaze')).toBeInTheDocument();
        expect(screen.getByText('solar-power')).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: /Close/i })
        ).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it('handles data retrieval error', async () => {
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon/charmeleon', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    render(
      <Provider store={createMockStore()}>
        <MemoryRouter initialEntries={['/1/charmeleon']}>
          <Routes>
            <Route path="/:page/:detailsId" element={<CardDetails />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(
      () => {
        expect(
          screen.getByText('Error loading Pokémon details')
        ).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: /Close/i })
        ).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it('handles missing detailsId', async () => {
    render(
      <Provider store={createMockStore()}>
        <MemoryRouter initialEntries={['/1']}>
          <Routes>
            <Route path="/:page/:detailsId?" element={<CardDetails />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(
      () => {
        expect(screen.getByText('Pokémon not found')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it('redirects to /404 if the page is invalid', async () => {
    render(
      <Provider store={createMockStore()}>
        <MemoryRouter initialEntries={['/invalid/charmeleon']}>
          <Routes>
            <Route path="/:page/:detailsId" element={<CardDetails />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(
      () => {
        expect(navigate).toHaveBeenCalledWith('/404', { replace: true });
      },
      { timeout: 2000 }
    );
  });
});
