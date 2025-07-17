import type { ApiResponse } from '../interfaces/interfaces';
import type { PokemonDetails } from '../interfaces/pokemon';

export const BASIC_URL_OFFSET = 0;
export const BASIC_URL_LIMIT = 20; 

export async function getAllPokemons(
  offset = BASIC_URL_OFFSET,
  limit = BASIC_URL_LIMIT
): Promise<ApiResponse> {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error(`Error getAllPokemons: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

export async function getPokemonDetails(name: string): Promise<PokemonDetails> {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);

  if (!response.ok) {
    throw new Error(`"${name}" not found (${response.status})`);
  }

  const data = await response.json();
  return data;
}
