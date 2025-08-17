'use client';

import './search-form.css';
import { FC } from 'react';
import { SearchFormProps } from './search-form.types';

export const SearchForm: FC<SearchFormProps> = ({
  value,
  onChange,
  onSubmit,
}) => {
  return (
    <div data-testid="search-form" className="search-form">
      <input
        type="text"
        placeholder="Unfortunately PokéAPI only provides search by full name of Pokémon"
        value={value}
        onChange={onChange}
        className="search-input"
      />
      <button className="search-button" onClick={onSubmit}>
        Catch Pokémon
      </button>
    </div>
  );
};
