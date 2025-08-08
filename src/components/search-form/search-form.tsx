import './search-form.css';
import React, { useEffect, useState, type FC } from 'react';
import { getAllPokemons, getPokemonDetails } from '../../api/pokeapi';
import { BASE_URL_FOR_POKEAPI } from '../../App';
import { useDispatch } from 'react-redux';
import { showCards } from '../../store/cards-slice';
import { usePokemonFromLS } from '../../hook/use-pokemon-from-ls';
import type { SearchFormProps } from './search-form.types';

export const SearchForm: FC<SearchFormProps> = ({ setSearchError }) => {
  const [query, setQuery] = useState('');
  const { pokemonName, savePokemon } = usePokemonFromLS();
  const dispatch = useDispatch();

  useEffect(() => {
    if (pokemonName !== null) {
      setQuery(pokemonName);
    }
  }, []);

  const handleClick = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (query !== '') {
      try {
        const pokemon = await getPokemonDetails(query);
        savePokemon(query);
        setSearchError(null);
        const dataForState = {
          name: pokemon.name,
          url: `${BASE_URL_FOR_POKEAPI}/${pokemon.name}`,
        };
        dispatch(showCards([dataForState]));
      } catch (error) {
        setSearchError(error as Error);
      }
    } else {
      getAllPokemons().then((data) => {
        dispatch(showCards(data.results));
        setSearchError(null);
        savePokemon(null);
      });
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value.trim().toLowerCase());
  };

  return (
    <form data-testid="search-form" className="search-form">
      <input
        type="text"
        placeholder="Unfortunately PokeApi only provides search by full name of Pokemon"
        value={query}
        onChange={handleChange}
        className="search-input"
      />
      <button className="search-button" onClick={(event) => handleClick(event)}>
        Catch Pokemon
      </button>
    </form>
  );
};
