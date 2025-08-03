import './search-form.css';
import React, { useState, type FC } from 'react';
import { getPokemonDetails } from '../../api/pokeapi';
import { BASE_URL_FOR_POKEAPI } from '../../App';
import { useNavigate } from 'react-router-dom';
// import { usePokemonSearch } from '../../hook/use-search-query';
import { useDispatch } from 'react-redux';
import { showCards } from '../../store/cards-slice';

export const SearchForm: FC = () => {
  // const { page } = useParams<{ page: string }>();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // usePokemonSearch(setAppState, setAppLoading, setAppError, setQuery);

  async function handleClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    event.preventDefault();
    if (query !== '') {
      try {
        const pokemon = await getPokemonDetails(query);
        localStorage.setItem('pokemon', query);
        const dataForState = {
          name: pokemon.name,
          url: `${BASE_URL_FOR_POKEAPI}/${pokemon.name}`,
        };
        dispatch(showCards([dataForState]));
      } catch (error) {
        console.error(error);
      }
    } else {
      localStorage.removeItem('pokemon');
      // navigate(`/${page}`);
      navigate('/1');
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value.trim().toLowerCase());
  }

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
