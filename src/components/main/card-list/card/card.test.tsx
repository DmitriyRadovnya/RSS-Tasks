import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Card from './card';

describe('testing Card', () => {
  const testCardProps = {
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
  it('Card rendering', async () => {
    render(<Card pokemonInfo={testCardProps} />);

    const nameTitle = await screen.findByText('bulbasaur');
    // const statsTitle = await screen.findByText('Stats');
    // const abilityTitle = await screen.findByText('Abilities');

    expect(nameTitle).toBeInTheDocument();
    // expect(statsTitle).toBeInTheDocument();
    // expect(abilityTitle).toBeInTheDocument();
  });

  it('Card image rendering', async () => {
    render(<Card pokemonInfo={testCardProps} />);

    const imgAlt = await screen.findByAltText('bulbasaur');

    expect(imgAlt).toBeInTheDocument();
  });
});
