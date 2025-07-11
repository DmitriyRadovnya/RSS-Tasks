import React from 'react';
import './card.css';
import type { PokemonDetails } from '../../../../interfaces/pokemon';

interface CardProps {
  pokemonInfo: PokemonDetails;
}

export default class CardList extends React.Component<CardProps> {
  render() {
    const {
      name,
      base_experience: baseExperience,
      sprites: { front_default: cardImageUrl },
    } = this.props.pokemonInfo;
    return (
      <li className="card">
        <img src={cardImageUrl} alt="Pokemon Image" />
        <div>
          <h3>Name: {name}</h3>
          <span>Base exp: {baseExperience}</span>
        </div>
      </li>
    );
  }
}
