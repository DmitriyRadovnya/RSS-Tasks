import { render, screen, fireEvent } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Card from './card';
import { MemoryRouter, useSearchParams } from 'react-router-dom';
import * as pokeapi from '../../../../api/pokeapi';

// Mock the useSearchParams hook
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useSearchParams: vi.fn(),
  };
});

// Mock the pokeapi module
vi.mock('../../../../api/pokeapi');

describe('Card Component', () => {
  const mockSetPokemonDetails = vi.fn();
  const mockPokemonDetails = {
    name: 'bulbasaur',
    base_experience: 64,
    sprites: {
      front_default:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
    },
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
    stats: [
      {
        base_stat: 45,
        effort: 0,
        stat: { name: 'speed', url: 'https://pokeapi.co/api/v2/stat/6/' },
      },
    ],
  };

  const mockSearchParams = new URLSearchParams();
  const mockSetSearchParams = vi.fn();

  beforeEach(() => {
    vi.mocked(useSearchParams).mockReturnValue([
      mockSearchParams,
      mockSetSearchParams,
    ]);
    vi.mocked(pokeapi.getPokemonDetails).mockReset();
    vi.useFakeTimers(); // Используем fake timers для управления setTimeout
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers(); // Сбрасываем fake timers после каждого теста
  });

  it('renders card with pokemon name', () => {
    render(
      <MemoryRouter>
        <Card
          name={mockPokemonDetails}
          setPokemonDetails={mockSetPokemonDetails}
          pokemonDetails={null}
        />
      </MemoryRouter>
    );

    const nameTitle = screen.getByText('bulbasaur');
    expect(nameTitle).toBeInTheDocument();
  });

  it('updates search params on click', () => {
    render(
      <MemoryRouter>
        <Card
          name={mockPokemonDetails}
          setPokemonDetails={mockSetPokemonDetails}
          pokemonDetails={null}
        />
      </MemoryRouter>
    );

    const card = screen.getByText('bulbasaur');
    fireEvent.click(card);

    expect(mockSetSearchParams).toHaveBeenCalledWith(expect.any(Function));
    const setParamsCall = mockSetSearchParams.mock.calls[0][0](
      new URLSearchParams()
    );
    expect(setParamsCall.get('details')).toBe('bulbasaur');
  });

  // it('renders CardDetails when search params match pokemon name', () => {
  //   vi.mocked(useSearchParams).mockReturnValue([
  //     new URLSearchParams({ details: 'bulbasaur' }),
  //     mockSetSearchParams,
  //   ]);

  //   render(
  //     <MemoryRouter initialEntries={['/?details=bulbasaur']}>
  //       <Card
  //         name={mockPokemonDetails}
  //         setPokemonDetails={mockSetPokemonDetails}
  //         pokemonDetails={mockPokemonDetails}
  //       />
  //     </MemoryRouter>
  //   );

  //   const cardDetails = screen.getByTestId('card-details');
  //   expect(cardDetails).toBeInTheDocument();
  //   expect(screen.getByText('Base experience: 64')).toBeInTheDocument();
  //   expect(screen.getByText('Stats')).toBeInTheDocument();
  //   expect(screen.getByText('Abilities')).toBeInTheDocument();
  //   expect(screen.getByText('speed: 45')).toBeInTheDocument();
  //   expect(screen.getByText('overgrow')).toBeInTheDocument();
  // });

  // it('fetches pokemon details when search params match pokemon name', async () => {
  //   vi.mocked(useSearchParams).mockReturnValue([
  //     new URLSearchParams({ details: 'bulbasaur' }),
  //     mockSetSearchParams,
  //   ]);
  //   vi.mocked(pokeapi.getPokemonDetails).mockResolvedValue(mockPokemonDetails);

  //   render(
  //     <MemoryRouter initialEntries={['/?details=bulbasaur']}>
  //       <Card
  //         name={mockPokemonDetails}
  //         setPokemonDetails={mockSetPokemonDetails}
  //         pokemonDetails={null}
  //       />
  //     </MemoryRouter>
  //   );

  //   // Ждем завершения setTimeout
  //   vi.advanceTimersByTime(1000);

  //   await waitFor(() => {
  //     expect(pokeapi.getPokemonDetails).toHaveBeenCalledWith('bulbasaur');
  //   });

  //   await waitFor(() => {
  //     expect(mockSetPokemonDetails).toHaveBeenCalledWith(mockPokemonDetails);
  //   });

  //   const cardDetails = screen.getByTestId('card-details');
  //   expect(cardDetails).toBeInTheDocument();
  //   expect(screen.getByText('Base experience: 64')).toBeInTheDocument();
  // });

  it('shows loading state when fetching pokemon details', async () => {
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams({ details: 'bulbasaur' }),
      mockSetSearchParams,
    ]);
    vi.mocked(pokeapi.getPokemonDetails).mockReturnValue(new Promise(() => {})); // Зависший промис для имитации загрузки

    render(
      <MemoryRouter initialEntries={['/?details=bulbasaur']}>
        <Card
          name={mockPokemonDetails}
          setPokemonDetails={mockSetPokemonDetails}
          pokemonDetails={null}
        />
      </MemoryRouter>
    );

    const cardDetails = screen.getByTestId('card-details');
    expect(cardDetails).toBeInTheDocument();
    expect(screen.getByTestId('skeleton')).toBeInTheDocument(); // Предполагается, что Skeleton имеет data-testid="skeleton"
  });

  // it('handles error when fetching pokemon details fails', async () => {
  //   vi.mocked(useSearchParams).mockReturnValue([
  //     new URLSearchParams({ details: 'bulbasaur' }),
  //     mockSetSearchParams,
  //   ]);
  //   vi.mocked(pokeapi.getPokemonDetails).mockRejectedValue(new Error('API Error'));

  //   render(
  //     <MemoryRouter initialEntries={['/?details=bulbasaur']}>
  //       <Card
  //         name={mockPokemonDetails}
  //         setPokemonDetails={mockSetPokemonDetails}
  //         pokemonDetails={null}
  //       />
  //     </MemoryRouter>
  //   );

  //   // Ждем завершения setTimeout
  //   vi.advanceTimersByTime(1000);

  //   await waitFor(() => {
  //     expect(mockSetSearchParams).toHaveBeenCalledWith(expect.any(Function));
  //   });

  //   expect(mockSetPokemonDetails).not.toHaveBeenCalled();
  //   expect(screen.getByText('Failed to load Pokémon details.')).toBeInTheDocument();
  // });
});
