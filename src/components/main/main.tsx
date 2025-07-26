import CardList from './card-list/card-list';
import type { MainProps } from '../../interfaces/interfaces';

export default function Main(props: MainProps) {
  const { name, pokemonDetails, setPokemonDetails } = props;
  return (
    <main className="main_container">
      <CardList
        name={name}
        pokemonDetails={pokemonDetails}
        setPokemonDetails={setPokemonDetails}
      ></CardList>
    </main>
  );
}
