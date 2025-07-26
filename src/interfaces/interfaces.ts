import type { ReactNode } from 'react';

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

export type SkeletonProps = {
  count: number;
  width?: string;
  height?: string;
  margin?: string;
};

export interface MainProps {
  name: PokemonDetails[];
  pokemonDetails: PokemonDetails | null;
  setPokemonDetails: (PokemonDetails: PokemonDetails | null) => void;
}

export interface CardProps {
  name: PokemonDetails;
  pokemonDetails: PokemonDetails | null;
  setPokemonDetails: (PokemonDetails: PokemonDetails | null) => void;
}

export interface HeaderProps {
  setAppState: SetAppState;
  setAppLoading: (loading: boolean) => void;
  setAppError: (error: Error | null) => void;
}

export interface ErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
}
