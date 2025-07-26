import { useEffect, useState } from 'react';
import './App.css';
import Header from './components/header/header';
import type { PokemonDetails } from './interfaces/interfaces';
import Main from './components/main/main';
import ErrorBoundary from './components/error-boundary/error-boundary';
import BackupUI from './components/error-boundary/backup-ui';
import Skeleton from './components/skeleton/skeleton';
import {
  BASIC_URL_LIMIT,
  getAllPokemons,
  getPokemonDetails,
} from './api/pokeapi';
import { useSearchParams } from 'react-router-dom';

export default function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get('page')) || 1
  );
  const [nextPageURL, setNextPageURL] = useState<string | null>(null);
  const [prevPageURL, setPrevPageURL] = useState<string | null>(null);
  const [pokemonsInfo, setPokemonsInfo] = useState<PokemonDetails[] | null>(
    null
  );
  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    const savedPokemon = localStorage.getItem('pokemon');
    const offset = (Number(currentPage) - 1) * BASIC_URL_LIMIT;
    getAllPokemons(offset)
      .then((data) => {
        if (savedPokemon && savedPokemon !== '') {
          getPokemonDetails(savedPokemon).then((pokemon) => {
            setAppState([pokemon], null, null, false);
          });
        } else {
          Promise.all(
            data.results.map((item) => getPokemonDetails(item.name))
          ).then((results) => {
            setAppState(results, data.previous, data.next, false);
          });
        }
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [currentPage]);

  function setAppState(
    desiredPokemon: PokemonDetails | PokemonDetails[],
    prevPageURL: string | null,
    nextPageURL: string | null,
    loading: boolean
  ) {
    const arrayOfPokemons = Array.isArray(desiredPokemon)
      ? desiredPokemon
      : [desiredPokemon];
    setPokemonsInfo(arrayOfPokemons);
    setPrevPageURL(prevPageURL);
    setNextPageURL(nextPageURL);
    setLoading(loading);
  }

  async function handlePagination(
    direction: 'prev' | 'next',
    pageNumber: string
  ) {
    setCurrentPage((prevPage) => {
      if (direction === 'next') {
        return prevPage + 1;
      } else {
        return prevPage - 1;
      }
    });
    setSearchParams({ page: pageNumber });
    setPokemonDetails(null);
  }

  return (
    <>
      <Header
        setAppState={(desiredPokemon, prevPageURL, nextPageURL, loading) =>
          setAppState(desiredPokemon, prevPageURL, nextPageURL, loading)
        }
        setAppError={(error: Error | null) => {
          setError(error);
        }}
        setAppLoading={(loading: boolean) => setLoading(loading)}
      ></Header>
      <ErrorBoundary fallback={<BackupUI />}>
        {loading ? (
          <Skeleton count={8} />
        ) : error ? (
          <div>
            <h2>Unfortunately, such a Pokemon does not exist!</h2>
            <p>
              I remind you that to catch a Pokemon, you need to know and specify
              its full name.
            </p>
          </div>
        ) : (
          pokemonsInfo && (
            <>
              {nextPageURL || prevPageURL ? (
                <div className="buttonsContainer">
                  <button
                    disabled={!prevPageURL}
                    onClick={() =>
                      handlePagination('prev', String(currentPage - 1))
                    }
                  >
                    Prev
                  </button>
                  <button
                    disabled={!nextPageURL}
                    onClick={() =>
                      handlePagination('next', String(currentPage + 1))
                    }
                  >
                    Next
                  </button>
                </div>
              ) : null}
              <Main
                name={pokemonsInfo}
                pokemonDetails={pokemonDetails}
                setPokemonDetails={setPokemonDetails}
              ></Main>
            </>
          )
        )}
      </ErrorBoundary>
    </>
  );
}

export const BASE_URL_FOR_POKEAPI = 'https://pokeapi.co/api/v2/pokemon';
