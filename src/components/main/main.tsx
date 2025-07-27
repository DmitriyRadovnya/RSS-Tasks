import CardList from './card-list/card-list';
import type { MainProps } from '../../interfaces/interfaces';

export default function Main(props: MainProps) {
  const { allPokemons, currentPage } = props;
  return (
    <main className="main-container">
      <CardList allPokemons={allPokemons} currentPage={currentPage} />
    </main>
  );
}
