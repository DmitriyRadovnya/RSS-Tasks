import './search-form.css';
import React, { useEffect, useState, type FC } from 'react';
import {
  BASIC_URL_LIMIT,
  BASIC_URL_OFFSET,
  useLazyGetAllPokemonsQuery,
  useLazyGetPokemonDetailsQuery,
} from '../../api/pokeapi';
import { useDispatch } from 'react-redux';
import { showCards } from '../../store/cards-slice';
import { usePokemonFromLS } from '../../hook/use-pokemon-from-ls';
import type { SearchFormProps } from './search-form.types';
import type { Pokemon } from '../../interfaces/interfaces';

export const SearchForm: FC<SearchFormProps> = ({ setSearchError }) => {
  const [triggerGetPokemonDetails] = useLazyGetPokemonDetailsQuery();
  const [triggerGetAllPokemons] = useLazyGetAllPokemonsQuery();
  const { pokemonName, savePokemon } = usePokemonFromLS();
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    if (pokemonName !== null) {
      setQuery(pokemonName);
    }
  }, [pokemonName]);

  const handleClick = async () => {
    try {
      if (query !== '') {
        const { data: pokemon, error } = await triggerGetPokemonDetails(query);
        if (error || !pokemon) throw new Error('Pokémon not found');
        savePokemon(query);
        setSearchError(null);
        dispatch(showCards([pokemon.name]));
      } else {
        const { data, error } = await triggerGetAllPokemons({
          offset: BASIC_URL_OFFSET,
          limit: BASIC_URL_LIMIT,
        });
        if (error || !data) throw new Error('Pokémon list not found');
        dispatch(
          showCards(data.results.map((pokemon: Pokemon) => pokemon.name))
        );
        setSearchError(null);
        savePokemon(null);
      }
    } catch (error) {
      setSearchError(error as Error);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value.trim().toLowerCase());
  };

  return (
    <div data-testid="search-form" className="search-form">
      <input
        type="text"
        placeholder="Unfortunately PokéAPI only provides search by full name of Pokémon"
        value={query}
        onChange={handleChange}
        className="search-input"
      />
      <button className="search-button" onClick={handleClick}>
        Catch Pokémon
      </button>
    </div>
  );
};
