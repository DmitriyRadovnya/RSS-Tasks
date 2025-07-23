import CardList from './card-list/card-list';
import type { PokemonDetails } from '../../interfaces/interfaces';

interface MainProps {
  details: PokemonDetails[];
}

export default function Main(props: MainProps) {
  const { details } = props;
  return (
    <main>
      <CardList details={details}></CardList>
    </main>
  );
}
