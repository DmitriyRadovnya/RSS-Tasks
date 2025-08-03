import type { Ability, Pokemon, Stat } from '../../../../interfaces/interfaces';

export interface CardProps {
  pokemon: Pokemon;
  currentPage: number;
}

export interface IFavoriteCard {
  name: string;
  baseExp: number;
  stats: Stat[];
  abilities: Ability[];
}
