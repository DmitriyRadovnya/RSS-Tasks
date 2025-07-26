import './search-form.css';
import React, { useState } from 'react';
import type {
  HeaderProps,
  // PokemonDetails,
} from '../../../interfaces/interfaces';
import { getAllPokemons, getPokemonDetails } from '../../../api/pokeapi';

export default function SearchForm(props: HeaderProps) {
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
        // setData([pokemon]);
        setAppState([pokemon], null, null, false);
      } catch (error) {
        setAppError(error as Error);
        setAppLoading(false);
      }
    } else {
      localStorage.removeItem('pokemon');
      getAllPokemons().then((data) => {
        Promise.all(
          data.results.map((item) => getPokemonDetails(item.name))
        ).then((results) => {
          setAppState(results, data.previous, data.next, false);
          // setData(results);
        });
      });
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
