import { Pokemon } from '../../../interfaces/interfaces';

export type SetListStateType = (
  prevPageURL: string | null,
  nextPageURL: string | null
  // loading: boolean
) => void;

export interface CardListProps {
  allPokemons: Pokemon[];
  page: number;
  maxPages: number;
}
