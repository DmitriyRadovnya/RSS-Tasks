import { Ability, PokemonDetails, Stat } from '../../interfaces/interfaces';

export default async function getPokemonDetails(
  name: string
): Promise<PokemonDetails> {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase().trim()}`
    );
    if (!response.ok) {
      throw new Error(
        `Failed to fetch Pokémon: ${name}, status: ${response.status}`
      );
    }
    const data = await response.json();
    return {
      name: data.name,
      base_experience: data.base_experience,
      stats: data.stats.map((stat: Stat) => ({
        stat: { name: stat.stat.name },
        base_stat: stat.base_stat,
      })),
      abilities: data.abilities.map((ability: Ability) => ({
        ability: { name: ability.ability.name },
      })),
      sprites: {
        front_default: data.sprites.front_default,
      },
    };
  } catch (error) {
    console.error('Error in getPokemonDetails:', error);
    throw error;
  }
}
