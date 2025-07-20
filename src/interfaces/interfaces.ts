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

export interface PokemonDetails {
  name: string;
  base_experience: number;
  sprites: {
    front_default: string;
  };
  abilities: Ability[];
  stats: Stat[];
}

export interface Ability {
  ability: Species;
  is_hidden: boolean;
  slot: number;
}

export interface Species {
  name: string;
  url: string;
}

export interface Stat {
  base_stat: number;
  effort: number;
  stat: Species;
}
