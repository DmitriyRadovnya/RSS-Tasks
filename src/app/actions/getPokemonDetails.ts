import { BASE_POKEAPI_URL } from '../../constants/constants';
import { Ability, PokemonDetails, Stat } from '../../interfaces/interfaces';

export default async function getPokemonDetails(
  pokemonName: string
): Promise<PokemonDetails> {
  try {
    const response = await fetch(
      `${BASE_POKEAPI_URL}/${pokemonName.toLowerCase().trim()}`
    );
    if (!response.ok) {
      throw new Error(
        `Failed to fetch Pokémon: ${pokemonName}, status: ${response.status}`
      );
    }
    const { base_experience, name, stats, abilities, sprites } =
      await response.json();

    return {
      name,
      base_experience,
      stats: stats.map((stat: Stat) => ({
        stat: { name: stat.stat.name },
        base_stat: stat.base_stat,
      })),
      abilities: abilities.map((ability: Ability) => ({
        ability: { name: ability.ability.name },
      })),
      sprites: {
        front_default: sprites.front_default,
      },
    };
  } catch (error) {
    console.error('Error in getPokemonDetails:', error);
    throw error;
  }
}
