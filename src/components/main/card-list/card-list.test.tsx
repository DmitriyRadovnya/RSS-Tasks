import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import CardList from './card-list';
import { MemoryRouter } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useSearchParams: vi.fn(),
  };
});

describe('CardList Component', () => {
  const mockSetPokemonDetails = vi.fn();
  const cardListData = [
    {
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
    },
    {
      name: 'ivysaur',
      base_experience: 142,
      sprites: {
        front_default:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png',
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
          base_stat: 60,
          effort: 0,
          stat: { name: 'speed', url: 'https://pokeapi.co/api/v2/stat/6/' },
        },
      ],
    },
  ];

  it('renders list of cards with pokemon names', () => {
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams(),
      vi.fn(),
    ]);

    render(
      <MemoryRouter>
        <CardList
          name={cardListData}
          pokemonDetails={null}
          setPokemonDetails={mockSetPokemonDetails}
        />
      </MemoryRouter>
    );

    const firstCardTitle = screen.getByText('bulbasaur');
    const secondCardTitle = screen.getByText('ivysaur');

    expect(firstCardTitle).toBeInTheDocument();
    expect(secondCardTitle).toBeInTheDocument();
  });

  it('renders Card components with correct props', () => {
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams(),
      vi.fn(),
    ]);

    render(
      <MemoryRouter>
        <CardList
          name={cardListData}
          pokemonDetails={cardListData[0]}
          setPokemonDetails={mockSetPokemonDetails}
        />
      </MemoryRouter>
    );

    const cardList = screen.getByRole('list');
    const cards = within(cardList).getAllByText(/bulbasaur|ivysaur/);
    expect(cards).toHaveLength(2);
    expect(cards[0].closest('.card_style')).toBeInTheDocument();
    expect(cards[1].closest('.card_style')).toBeInTheDocument();
  });

  it('does not render CardDetails when details param does not match', () => {
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams({ details: 'charmander' }),
      vi.fn(),
    ]);

    render(
      <MemoryRouter initialEntries={['/?details=charmander']}>
        <CardList
          name={cardListData}
          pokemonDetails={null}
          setPokemonDetails={mockSetPokemonDetails}
        />
      </MemoryRouter>
    );

    const firstCardAlt = screen.queryByAltText('bulbasaur');
    const secondCardAlt = screen.queryByAltText('ivysaur');
    expect(firstCardAlt).not.toBeInTheDocument();
    expect(secondCardAlt).not.toBeInTheDocument();
    expect(screen.queryByTestId('card-details')).not.toBeInTheDocument();
  });
});
