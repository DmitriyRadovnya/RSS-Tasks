import { CardList } from '../../../components/main/card-list/card-list';
import getAllPokemons from '../../actions/getAllPokemons';
import './page.css';
import { notFound } from 'next/navigation';

export default async function PokemonPage({
  params,
}: {
  params: Promise<{ pageNumber: string }>;
}) {
  const resolvedParams = await params;
  const page = parseInt(resolvedParams.pageNumber, 10);

  if (isNaN(page) || page < 1) {
    notFound();
  }

  try {
    const { pokemons, total } = await getAllPokemons(page);
    const maxPages = Math.ceil(total / 20);

    return <CardList allPokemons={pokemons} page={page} maxPages={maxPages} />;
  } catch (error) {
    console.error(error);
    notFound();
  }
}
