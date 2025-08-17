import './page.css';
import getAllPokemons from '../../../actions/getAllPokemons';
import { notFound } from 'next/navigation';
import { CardList } from '../../../../components/main/card-list/card-list';

export default async function PokemonPage({
  params,
}: {
  params: Promise<{ pageNumber: string; locale: string }>;
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
