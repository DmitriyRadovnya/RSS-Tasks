import SearchForm from './search-form/search-form';
import './header.css';
import React from 'react';
import type { PokemonDetails } from '../../interfaces/pokemon';

interface HeaderProps {
  setQueryResponse: (desiredPokemon: PokemonDetails) => void;
}

export default class Header extends React.Component<HeaderProps> {
  render(): React.ReactNode {
    return (
      <header className="header">
        <SearchForm setQueryResponse={this.props.setQueryResponse}></SearchForm>
      </header>
    );
  }
}
