import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { getPokemonDetails } from '../../../../../api/pokeapi';
import CardDetails from './card-details';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock('../../../../../api/pokeapi', () => ({
  getPokemonDetails: vi.fn(),
}));

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

describe('CardDetails', async () => {
  const mockedGetPokemonDetails = getPokemonDetails as ReturnType<typeof vi.fn>;
  const mockedUseNavigate = (await import('react-router-dom'))
    .useNavigate as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetPokemonDetails.mockResolvedValue(mockPokemon);
    mockedUseNavigate.mockReturnValue(vi.fn());
  });

  it('renders skeleton during loading', async () => {
    render(
      <MemoryRouter initialEntries={['/1/charmeleon']}>
        <Routes>
          <Route path="/:page/:detailsId" element={<CardDetails />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('card-details')).toBeInTheDocument();
  });

  it('displays pokemon info after loading', async () => {
    render(
      <MemoryRouter initialEntries={['/1/charmeleon']}>
        <Routes>
          <Route path="/:page/:detailsId" element={<CardDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('charmeleon')).toBeInTheDocument();
    });

    expect(screen.getByAltText('charmeleon')).toHaveAttribute(
      'src',
      mockPokemon.sprites.front_default
    );
    expect(screen.getByText('Base experience: 142')).toBeInTheDocument();
    expect(screen.getByText('hp: 58')).toBeInTheDocument();
    expect(screen.getByText('attack: 64')).toBeInTheDocument();
    expect(screen.getByText('blaze')).toBeInTheDocument();
    expect(screen.getByText('solar-power')).toBeInTheDocument();
  });

  it('handles data retrieval error', async () => {
    mockedGetPokemonDetails.mockRejectedValue(new Error('fail'));

    render(
      <MemoryRouter initialEntries={['/1/charmeleon']}>
        <Routes>
          <Route path="/:page/:detailsId" element={<CardDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText('Error loading pokemon details')
      ).toBeInTheDocument();
    });
  });

  it('handles missing pokemon id', async () => {
    render(
      <MemoryRouter initialEntries={['/1']}>
        <Routes>
          <Route path="/:page/:detailsId?" element={<CardDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Pokemon not selected')).toBeInTheDocument();
    });
  });

  it('navigates to 404 on invalid page', async () => {
    const navigateSpy = vi.fn();
    mockedUseNavigate.mockReturnValue(navigateSpy);

    render(
      <MemoryRouter initialEntries={['/invalid/charmeleon']}>
        <Routes>
          <Route path="/:page/:detailsId" element={<CardDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(navigateSpy).toHaveBeenCalledWith('/404', { replace: true });
    });
  });
});
