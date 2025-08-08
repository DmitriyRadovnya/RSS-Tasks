import type { Ability, Stat } from '../../../../interfaces/interfaces';

export interface CardProps {
  pokemonName: string;
  currentPage: number;
}

export interface IFavoriteCard {
  name: string;
  baseExp: number;
  stats: Stat[];
  abilities: Ability[];
}
