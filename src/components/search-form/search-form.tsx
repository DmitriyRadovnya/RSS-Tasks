import './search-form.css';
import React, { useState, type FC } from 'react';
import { getPokemonDetails } from '../../api/pokeapi';
import { BASE_URL_FOR_POKEAPI } from '../../App';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showCards } from '../../store/cards-slice';
import { usePokemonFromLS } from '../../hook/use-pokemon-from-ls';

export const SearchForm: FC = () => {
  const [query, setQuery] = useState('');
  const { savePokemon } = usePokemonFromLS();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function handleClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    event.preventDefault();
    if (query !== '') {
      try {
        const pokemon = await getPokemonDetails(query);
        savePokemon(query);
        const dataForState = {
          name: pokemon.name,
          url: `${BASE_URL_FOR_POKEAPI}/${pokemon.name}`,
        };
        dispatch(showCards([dataForState]));
      } catch (error) {
        console.error(error);
      }
    } else {
      savePokemon(null);
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
