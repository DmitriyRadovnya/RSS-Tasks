import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Main from './main';

describe('Main component', () => {
  const mockDetails = [
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

  it('throws error when button is clicked', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    let errorCaught = null;
    try {
      render(<Main details={mockDetails} />);
      const button = (await screen.findByText(
        'Throw My Error'
      )) as HTMLButtonElement;
      if (button) {
        fireEvent.click(button);
      }
    } catch (e) {
      errorCaught = e;
    }

    expect(errorCaught).not.toBeNull();
    expect(errorCaught).toBeInstanceOf(Error);

    consoleErrorSpy.mockRestore();
  });
});
