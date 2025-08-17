import { GetPokemonsApiResponse } from './actions.types';

const getAllPokemons = async (
  page: number
): Promise<GetPokemonsApiResponse> => {
  const limit = 20;
  const offset = (page - 1) * limit;
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`,
    {
      cache: 'force-cache',
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch pokemons');
  }

  const data = await response.json();

  return { pokemons: data.results, total: data.count };
};

export default getAllPokemons;
