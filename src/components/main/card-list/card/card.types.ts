import type { Ability, Stat } from '../../../../interfaces/interfaces';

export interface CardProps {
  pokemonName: string;
  onClick: (pokemonName: string) => void;
  currentPage: number;
}

export interface IFavoriteCard {
  name: string;
  baseExp: number;
  stats: Stat[];
  abilities: Ability[];
}
