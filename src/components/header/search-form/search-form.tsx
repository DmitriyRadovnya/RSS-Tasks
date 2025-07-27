import './search-form.css';
import React, { useState } from 'react';
import type {
  HeaderProps,
  // PokemonDetails,
} from '../../../interfaces/interfaces';
import {
  BASIC_URL_OFFSET,
  getAllPokemons,
  getPokemonDetails,
} from '../../../api/pokeapi';
import { BASE_URL_FOR_POKEAPI } from '../../../App';
import { useNavigate } from 'react-router-dom';

export default function SearchForm(props: HeaderProps) {
  const navigate = useNavigate();
  const { setAppState, setAppLoading, setAppError } = props;
  const [query, setQuery] = useState('');
  // const [data, setData] = useState<PokemonDetails[] | null>(null);

  async function handleClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    setAppLoading(true);
    event.preventDefault();
    setAppError(null);
    if (query !== '') {
      try {
        const pokemon = await getPokemonDetails(query);
        localStorage.setItem('pokemon', query);
        const dataForState = {
          name: pokemon.name,
          url: `${BASE_URL_FOR_POKEAPI}/${pokemon.name}`,
        };
        setAppState([dataForState], null, null, false);
      } catch (error) {
        setAppError(error as Error);
        setAppLoading(false);
      }
    } else {
      localStorage.removeItem('pokemon');
      try {
        const data = await getAllPokemons(BASIC_URL_OFFSET);
        setAppState(data.results, data.previous, data.next, false);
        navigate('/1');
      } catch (error) {
        setAppError(error as Error);
        setAppLoading(false);
      }
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value.trim().toLowerCase());
  }

  return (
    <form data-testid="search-form" className="searchForm">
      <input
        type="text"
        placeholder="Unfortunately PokeApi only provides search by full name of Pokemon"
        value={query}
        onChange={handleChange}
        className="searchInput"
      />
      <button onClick={(event) => handleClick(event)}>Catch Pokemon</button>
    </form>
  );
}
