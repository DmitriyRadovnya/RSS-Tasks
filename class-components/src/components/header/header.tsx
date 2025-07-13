import SearchForm from './search-form/search-form';
import './header.css';
import React from 'react';
import type { PokemonDetails } from '../../interfaces/pokemon';
import type { SetAppState } from '../../interfaces/interfaces';

interface HeaderProps {
  setAppState: SetAppState;
}

export default class Header extends React.Component<HeaderProps> {
  render(): React.ReactNode {
    return (
      <header className="header">
        <SearchForm setAppState={this.props.setAppState}></SearchForm>
      </header>
    );
  }
}
