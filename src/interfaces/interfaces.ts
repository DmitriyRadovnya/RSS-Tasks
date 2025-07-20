import type { PokemonDetails } from './pokemon';

export interface AppState {
  nextPageURL: string | null;
  prevPageURL: string | null;
  pokemonsInfo: PokemonDetails[] | null;
  loading: boolean;
  error: Error | null;
}

export interface Pokemon {
  name: string;
  url: string;
}

export interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
}

export type SetAppState = (
  desiredPokemon: PokemonDetails[],
  prevPageURL: string | null,
  nextPageURL: string | null,
  loading: boolean
) => void;
