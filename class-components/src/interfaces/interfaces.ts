import type { PokemonDetails } from './pokemon';

export interface AppState {
  currentURL: string;
  nextPageURL: string;
  prevPageURL: string;
  query: string;
  data: ApiResponse | null;
  pokemonsInfo: PokemonDetails[] | null;
  loading: boolean;
  error: string | null;
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
