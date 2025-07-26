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
  BASIC_URL_OFFSET,
  getAllPokemons,
  getPokemonDetails,
} from './api/pokeapi';

export default function App() {
  const [nextPageURL, setNextPageURL] = useState<string | null>(null);
  const [prevPageURL, setPrevPageURL] = useState<string | null>(null);
  const [pokemonsInfo, setPokemonsInfo] = useState<PokemonDetails[] | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    const savedPokemon = localStorage.getItem('pokemon');

    getAllPokemons()
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
  }, []);

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

  async function handlePagination(direction: 'prev' | 'next') {
    const urlSearchParams =
      direction === 'prev' && prevPageURL
        ? new URL(prevPageURL).searchParams
        : direction === 'next' && nextPageURL
          ? new URL(nextPageURL).searchParams
          : null;

    if (urlSearchParams) {
      const urlOffset = urlSearchParams.get('offset');
      const urlLimit = urlSearchParams.get('limit');
      const offset = urlOffset ? parseInt(urlOffset) : BASIC_URL_OFFSET;
      const limit = urlLimit ? parseInt(urlLimit) : BASIC_URL_LIMIT;
      setError(null);
      setLoading(true);
      try {
        const data = await getAllPokemons(offset, limit);
        const details = await Promise.all(
          data.results.map((item) => getPokemonDetails(item.name))
        );

        setAppState(details, data.previous, data.next, false);
      } catch (error) {
        setError(error as Error);
        setLoading(false);
      }
    }
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
                    onClick={() => handlePagination('prev')}
                  >
                    Prev
                  </button>
                  <button
                    disabled={!nextPageURL}
                    onClick={() => handlePagination('next')}
                  >
                    Next
                  </button>
                </div>
              ) : null}
              <Main details={pokemonsInfo}></Main>
            </>
          )
        )}
      </ErrorBoundary>
    </>
  );
}

export const BASE_URL_FOR_POKEAPI = 'https://pokeapi.co/api/v2/pokemon';
