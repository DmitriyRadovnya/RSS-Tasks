import './card-list.css';
import Card from './card/card';
import type { MainProps } from '../../../interfaces/interfaces';

export default function CardList(props: MainProps) {
  const { pokemonDetails, setPokemonDetails } = props;
  return (
    <ul className="card-list">
      {props.name.map((item) => (
        <Card
          key={item.name}
          name={item}
          pokemonDetails={pokemonDetails}
          setPokemonDetails={setPokemonDetails}
        ></Card>
      ))}
    </ul>
  );
}
