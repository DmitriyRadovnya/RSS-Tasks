import './card-list.css';
import Card from './card/card';
import type { PokemonDetails } from '../../../interfaces/interfaces';

interface CardListProps {
  details: PokemonDetails[];
}

export default function CardList(props: CardListProps) {
  return (
    <ul className="card-list">
      {props.details.map((item) => (
        <Card key={item.name} pokemonInfo={item}></Card>
      ))}
    </ul>
  );
}
