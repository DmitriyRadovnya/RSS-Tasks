import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { getPokemonDetails } from '../../../../../api/pokeapi';
import CardDetails from './card-details';

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

describe('CardDetails', () => {
  const mockedGetPokemonDetails = getPokemonDetails as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockedGetPokemonDetails.mockResolvedValue(mockPokemon);
  });

  it('renders placeholder on initial load', () => {
    render(
      <MemoryRouter initialEntries={['/1/charmeleon']}>
        <CardDetails />
      </MemoryRouter>
    );
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('displays pokemon info after loading', async () => {
    render(
      <MemoryRouter initialEntries={['/1/charmeleon']}>
        <Routes>
          <Route path="/:page/:name" element={<CardDetails />} />
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
          <Route path="/:page/:name" element={<CardDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Покемон не найден.')).toBeInTheDocument();
    });
  });
});
