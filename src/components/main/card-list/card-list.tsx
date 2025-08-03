import './card-list.css';
import { Card } from './card/card';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  BASIC_URL_LIMIT,
  getAllPokemons,
  getPokemonDetails,
} from '../../../api/pokeapi';
import { BASE_URL_FOR_POKEAPI } from '../../../App';
import { Skeleton } from '../../skeleton/skeleton';
import { useDispatch } from 'react-redux';
import { showCards } from '../../../store/cards-slice';
import { useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '../../../store/index';
import type { SetListStateType } from './card-list.types';
import type { Pokemon } from '../../../interfaces/interfaces';
import { PaginationControls } from './pagination-controls/pagination-controls';
import { InvalidPokemon } from './invalid-pokemon/invalid-pokemon';

export const CardList = () => {
  const { page, detailsId } = useParams<{ page: string; detailsId?: string }>();
  const [nextPageURL, setNextPageURL] = useState<string | null>(null);
  const [prevPageURL, setPrevPageURL] = useState<string | null>(null);
  const navigate = useNavigate();
  const cards: Pokemon[] = useSelector((state: RootState) => state.cards);
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setListState(null, null, true);
    const savedPokemon = localStorage.getItem('pokemon');
    const offset = (Number(page) - 1) * BASIC_URL_LIMIT;
    getAllPokemons(offset)
      .then((data) => {
        if (savedPokemon && savedPokemon !== '') {
          getPokemonDetails(savedPokemon).then((pokemon) => {
            const pokemonForState = {
              name: pokemon.name,
              url: `${BASE_URL_FOR_POKEAPI}/${pokemon.name}`,
            };
            dispatch(showCards([pokemonForState]));
            setLoading(false);
          });
        } else {
          dispatch(showCards(data.results));
          setListState(data.previous, data.next, false);
        }
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [page, navigate, dispatch]);

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

  return (
    <>
      {loading && <Skeleton count={15} />}
      {error && <InvalidPokemon />}
      {!loading && cards && (
        <>
          <ul className="card-list">
            {cards.map((item: Pokemon) => (
              <Card key={item.name} pokemon={item} currentPage={Number(page)} />
            ))}
          </ul>
          {(nextPageURL || prevPageURL) && (
            <PaginationControls
              handler={handlePagination}
              disabled={{
                prev: Boolean(!prevPageURL),
                next: Boolean(!nextPageURL),
              }}
            />
          )}
        </>
      )}
    </>
  );
};
