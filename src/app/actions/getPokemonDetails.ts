import { PokemonDetails } from '../../interfaces/interfaces';

const getPokemonDetails = async (
  pokemonName: string
): Promise<PokemonDetails> => {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${pokemonName}`,
    {
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch pokemon details');
  }

  return await response.json();
};

export default getPokemonDetails;
