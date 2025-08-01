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
import { server } from '../../../../../mocks/node';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { CardDetails } from './card-details';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
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

describe('CardDetails component', async () => {
  const mockedUseNavigate = vi.mocked(
    (await import('react-router-dom')).useNavigate
  );

  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
  });

  afterEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
  });

  afterAll(() => {
    server.close();
  });

  it('renders Skeleton while loading', async () => {
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon/charmeleon', () => {
        return new Promise(() => {});
      })
    );

    render(
      <MemoryRouter initialEntries={['/1/charmeleon']}>
        <Routes>
          <Route path="/:page/:detailsId" element={<CardDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('card-details')).toBeInTheDocument();
      expect(screen.getAllByTestId('skeleton')).toHaveLength(2);
    });
  });

  it('displays pokemon info after loading', async () => {
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon/charmeleon', () => {
        return HttpResponse.json(mockPokemon);
      })
    );

    render(
      <MemoryRouter initialEntries={['/1/charmeleon']}>
        <Routes>
          <Route path="/:page/:detailsId" element={<CardDetails />} />
        </Routes>
      </MemoryRouter>
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
      <MemoryRouter initialEntries={['/1/charmeleon']}>
        <Routes>
          <Route path="/:page/:detailsId" element={<CardDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(
      () => {
        expect(
          screen.getByText('Error loading pokemon details')
        ).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it('handles missing detailsId', async () => {
    render(
      <MemoryRouter initialEntries={['/1']}>
        <Routes>
          <Route path="/:page/:detailsId?" element={<CardDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(
      () => {
        expect(screen.getByText('Pokemon not selected')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it('redirects to /404 if the page is invalid', async () => {
    const navigateSpy = vi.fn();
    mockedUseNavigate.mockReturnValue(navigateSpy);

    render(
      <MemoryRouter initialEntries={['/invalid/charmeleon']}>
        <Routes>
          <Route path="/:page/:detailsId" element={<CardDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(
      () => {
        expect(navigateSpy).toHaveBeenCalledWith('/404', { replace: true });
      },
      { timeout: 2000 }
    );
  });
});
