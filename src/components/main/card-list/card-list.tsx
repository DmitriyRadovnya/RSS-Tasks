import './card-list.css';
import { Card } from './card/card';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  BASIC_URL_LIMIT,
  useGetAllPokemonsQuery,
  useGetPokemonDetailsQuery,
} from '../../../api/pokeapi';
import { Skeleton } from '../../skeleton/skeleton';
import { useDispatch } from 'react-redux';
import { showCards } from '../../../store/cards-slice';
import { useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '../../../store/index';
import type { SetListStateType } from './card-list.types';
import { PaginationControls } from './pagination-controls/pagination-controls';
import { InvalidPokemon } from './invalid-pokemon/invalid-pokemon';
import { usePokemonFromLS } from '../../../hook/use-pokemon-from-ls';

export const CardList = () => {
  const { page, detailsId } = useParams<{ page: string; detailsId?: string }>();
  const [nextPageURL, setNextPageURL] = useState<string | null>(null);
  const [prevPageURL, setPrevPageURL] = useState<string | null>(null);
  const navigate = useNavigate();
  const cards = useSelector((state: RootState) => state.cards);
  const dispatch = useDispatch<AppDispatch>();
  const { pokemonName } = usePokemonFromLS();

  const offset = (Number(page) - 1) * BASIC_URL_LIMIT;
  const { data, isLoading, isFetching, error } = useGetAllPokemonsQuery({
    offset,
    limit: BASIC_URL_LIMIT,
  });
  const {
    data: pokemonDetails,
    isLoading: isDetailsLoading,
    isFetching: isDetailsFetching,
    error: detailsError,
  } = useGetPokemonDetailsQuery(pokemonName as string, { skip: !pokemonName });

  useEffect(() => {
    if (pokemonName && pokemonDetails) {
      dispatch(showCards([pokemonDetails.name]));
      setPaginationState(null, null);
    } else if (data) {
      const nameArrayForStore = data.results.map((pokemon) => pokemon.name);
      dispatch(showCards(nameArrayForStore));
      setPaginationState(data.previous, data.next);
    }
  }, [data, pokemonDetails, dispatch, pokemonName]);

  const setPaginationState: SetListStateType = (prevPageURL, nextPageURL) => {
    setPrevPageURL(prevPageURL);
    setNextPageURL(nextPageURL);
  };

  const handlePagination = (direction: 'prev' | 'next') => {
    const currentPage = Number(page);
    const newPage = direction === 'next' ? currentPage + 1 : currentPage - 1;
    navigate(detailsId ? `/${newPage}/${detailsId}` : `/${newPage}`);
  };

  if (isLoading || isFetching || isDetailsLoading || isDetailsFetching) {
    return <Skeleton count={15} width="100%" height="15px" margin="3px 0" />;
  }

  if (error || detailsError) {
    return <InvalidPokemon />;
  }

  if (cards.length > 0) {
    return (
      <>
        <ul className="card-list">
          {cards.map((name) => (
            <Card
              key={`${name}`}
              pokemonName={name}
              currentPage={Number(page)}
            />
          ))}
        </ul>
        {(nextPageURL || prevPageURL) && (
          <PaginationControls
            handler={handlePagination}
            disabled={{
              prev: !prevPageURL,
              next: !nextPageURL,
            }}
          />
        )}
      </>
    );
  }

  return <div className="placeholder-text">No Pokémon data available</div>;
};
