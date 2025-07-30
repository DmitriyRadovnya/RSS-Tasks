import { useEffect, type Dispatch, type SetStateAction } from 'react';
import { getPokemonDetails } from '../api/pokeapi';
import type { SetAppState } from '../interfaces/interfaces';
import { BASE_URL_FOR_POKEAPI } from '../App';

export const usePokemonSearch = (
  setAppState: SetAppState,
  setAppLoading: (value: boolean) => void,
  setAppError: (value: Error | null) => void,
  setQuery: Dispatch<SetStateAction<string>>
) => {
  useEffect(() => {
    const storedPokemon = localStorage.getItem('pokemon');

    if (storedPokemon) {
      setQuery(storedPokemon);
      const fetchPokemonDetails = async () => {
        setAppLoading(true);
        setAppError(null);

        try {
          const pokemon = await getPokemonDetails(storedPokemon);
          const dataForState = {
            name: pokemon.name,
            url: `${BASE_URL_FOR_POKEAPI}/${pokemon.name}`,
          };
          setAppState([dataForState], null, null, false);
        } catch (error) {
          setAppError(error as Error);
        } finally {
          setAppLoading(false);
        }
      };

      fetchPokemonDetails();
    }
  }, []);
};
