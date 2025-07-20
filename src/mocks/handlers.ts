import { http, HttpResponse } from 'msw';
import type { PokemonDetails } from '../interfaces/interfaces';

export const handlers = [
  http.get('https://pokeapi.co/api/v2/pokemon', () => {
    return HttpResponse.json({
      count: 1118,
      next: 'https://pokeapi.co/api/v2/pokemon?offset=2&limit=2',
      previous: null,
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
      ],
    });
  }),

  http.get('https://pokeapi.co/api/v2/pokemon/:name', ({ params }) => {
    const name = Array.isArray(params.name) ? params.name[0] : params.name;
    if (!name || typeof name !== 'string') {
      return HttpResponse.json({ message: 'Invalid name' }, { status: 400 });
    }

    const pokemonData: { [key: string]: PokemonDetails } = {
      bulbasaur: {
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
      ivysaur: {
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
    };

    return pokemonData[name]
      ? HttpResponse.json(pokemonData[name])
      : HttpResponse.json({ message: 'Not found' }, { status: 404 });
  }),
];
