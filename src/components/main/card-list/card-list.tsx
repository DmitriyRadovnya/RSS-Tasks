import './card-list.css';
import Card from './card/card';
import type { MainProps } from '../../../interfaces/interfaces';

export default function CardList(props: MainProps) {
  return (
    <ul className="card-list">
      {props.details.map((item) => (
        <Card key={item.name} pokemonInfo={item}></Card>
      ))}
    </ul>
  );
}
