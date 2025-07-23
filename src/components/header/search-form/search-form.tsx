import './search-form.css';
import React, { useEffect, useState } from 'react';
import type {
  HeaderProps,
  PokemonDetails,
} from '../../../interfaces/interfaces';
import { getAllPokemons, getPokemonDetails } from '../../../api/pokeapi';

export default function SearchForm(props: HeaderProps) {
  const { setAppState, setAppLoading, setAppError } = props;
  const [query, setQuery] = useState('');
  const [data, setData] = useState<PokemonDetails[] | null>(null);

  useEffect(() => {
    props.setAppLoading(true);
    const savedPokemon = localStorage.getItem('pokemon');

    getAllPokemons()
      .then((data) => {
        if (savedPokemon && savedPokemon !== '') {
          getPokemonDetails(savedPokemon).then((pokemon) => {
            setAppState([pokemon], null, null, false);
          });
        } else {
          Promise.all(
            data.results.map((item) => getPokemonDetails(item.name))
          ).then((results) => {
            setAppState(results, data.previous, data.next, false);
          });
        }
      })
      .catch((error) => {
        setAppError(error);
        setAppLoading(false);
      });
  }, [data]);

  async function handleClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    setAppLoading(true);
    event.preventDefault();
    setAppError(null);
    if (query !== '') {
      localStorage.setItem('pokemon', query);
      const pokemon = await getPokemonDetails(query);
      setData([pokemon]);
    } else {
      localStorage.removeItem('pokemon');
      getAllPokemons().then((data) => {
        Promise.all(
          data.results.map((item) => getPokemonDetails(item.name))
        ).then((results) => {
          setData(results);
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
