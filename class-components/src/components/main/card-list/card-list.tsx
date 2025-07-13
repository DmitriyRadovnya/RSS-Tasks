import React from 'react';
import './card-list.css';
import Card from './card/card';
import type { PokemonDetails } from '../../../interfaces/pokemon';

interface CardListProps {
  details: PokemonDetails[];
}

export default class CardList extends React.Component<CardListProps> {
  render() {
    return (
      <ul className="card-list">
        {this.props.details.map((item) => (
          <Card key={item.name} pokemonInfo={item}></Card>
        ))}
      </ul>
    );
  }
}
