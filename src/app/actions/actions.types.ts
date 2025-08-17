import { Pokemon } from '../../interfaces/interfaces';

export interface GetPokemonsApiResponse {
  pokemons: Pokemon[];
  total: number;
}
