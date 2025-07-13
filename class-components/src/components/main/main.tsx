import React from 'react';
import CardList from './card-list/card-list';
import type { PokemonDetails } from '../../interfaces/pokemon';

interface MainProps {
  details: PokemonDetails[];
}

export default class Main extends React.Component<MainProps> {
  render() {
    const { details } = this.props;
    // throw new Error('Error')
    return (
      <main>
        <CardList details={details}></CardList>
      </main>
    );
  }
}
