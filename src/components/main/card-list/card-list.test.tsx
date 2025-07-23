import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CardList from './card-list';

describe('testing Card', () => {
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

  it('Card rendering', async () => {
    render(<CardList details={cardListData} />);

    const firstCardTitle = await screen.findByText('bulbasaur');
    const secondCardTitle = await screen.findByText('ivysaur');

    expect(firstCardTitle).toBeInTheDocument();
    expect(secondCardTitle).toBeInTheDocument();
  });

  it('Card image rendering', async () => {
    render(<CardList details={cardListData} />);

    const firstCardAlt = await screen.findByAltText('bulbasaur');
    const secondCardAlt = await screen.findByAltText('ivysaur');

    expect(firstCardAlt).toBeInTheDocument();
    expect(secondCardAlt).toBeInTheDocument();
  });
});
