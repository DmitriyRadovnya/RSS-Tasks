import './card-list.css';
import Card from './card/card';
import type { MainProps } from '../../../interfaces/interfaces';

export default function CardList(props: MainProps) {
  const { allPokemons, currentPage } = props;
  return (
    <ul className="card-list">
      {allPokemons.map((item) => (
        <Card key={item.name} allPokemons={item} currentPage={currentPage} />
      ))}
    </ul>
  );
}
