import './card-list.css';
import { Card } from './card/card';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  BASIC_URL_LIMIT,
  getAllPokemons,
  getPokemonDetails,
} from '../../../api/pokeapi';
// import { BASE_URL_FOR_POKEAPI } from '../../../App';
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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { pokemonName } = usePokemonFromLS();

  useEffect(() => {
    setListState(null, null, true);
    const offset = (Number(page) - 1) * BASIC_URL_LIMIT;
    getAllPokemons(offset)
      .then((data) => {
        if (pokemonName !== null) {
          getPokemonDetails(pokemonName).then(({ name }) => {
            dispatch(showCards([name]));
            setLoading(false);
          });
        } else {
          const nameArrayForStore = data.results.map((pokemon) => pokemon.name);
          dispatch(showCards(nameArrayForStore));
          setListState(data.previous, data.next, false);
        }
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [page, dispatch, pokemonName]);

  const setListState: SetListStateType = (
    prevPageURL,
    nextPageURL,
    loading
  ) => {
    setPrevPageURL(prevPageURL);
    setNextPageURL(nextPageURL);
    setLoading(loading);
  };

  const handlePagination = (direction: 'prev' | 'next') => {
    const currentPage = Number(page);
    const newPage = direction === 'next' ? currentPage + 1 : currentPage - 1;
    navigate(detailsId ? `/${newPage}/${detailsId}` : `/${newPage}`);
  };

  if (loading)
    return <Skeleton count={15} width="100%" height="20px" margin="3px 0" />;
  if (error) return <InvalidPokemon />;
  if (!loading && cards) {
    return (
      <>
        <ul className="card-list">
          {cards.map((name) => (
            <Card
              key={`pokemon-${name}`}
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
};
