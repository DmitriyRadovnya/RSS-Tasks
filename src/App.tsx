import { useEffect, useState } from 'react';
import './App.css';
import Header from './components/header/header';
import type { Pokemon } from './interfaces/interfaces';
import Main from './components/main/main';
import ErrorBoundary from './components/error-boundary/error-boundary';
import BackupUI from './components/error-boundary/backup-ui';
import Skeleton from './components/skeleton/skeleton';
import {
  BASIC_URL_LIMIT,
  getAllPokemons,
  getPokemonDetails,
} from './api/pokeapi';
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import CardDetails from './components/main/card-list/card/card-details/card-details';

export default function App() {
  const { page, name } = useParams<{ page: string; name: string }>();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(Number(page) || 1);
  const [nextPageURL, setNextPageURL] = useState<string | null>(null);
  const [prevPageURL, setPrevPageURL] = useState<string | null>(null);
  const [pokemonsInfo, setPokemonsInfo] = useState<Pokemon[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const pageNum = Number(page);
    if (!isNaN(pageNum) && pageNum > 0) {
      setCurrentPage(pageNum);
    } else if (!page && !name) {
      navigate('/1');
    }
  }, [page, name]);

  useEffect(() => {
    setLoading(true);
    const savedPokemon = localStorage.getItem('pokemon');
    const offset = (Number(currentPage) - 1) * BASIC_URL_LIMIT;
    getAllPokemons(offset)
      .then((data) => {
        if (savedPokemon && savedPokemon !== '') {
          getPokemonDetails(savedPokemon).then((pokemon) => {
            const pokemonForState = {
              name: pokemon.name,
              url: `${BASE_URL_FOR_POKEAPI}/${pokemon.name}`,
            };
            setAppState([pokemonForState], data.previous, data.next, false);
          });
        } else {
          setAppState(data.results, data.previous, data.next, false);
        }
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [currentPage]);

  function setAppState(
    desiredPokemon: Pokemon[],
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

  function handlePagination(direction: 'prev' | 'next') {
    const newPage = direction === 'next' ? currentPage + 1 : currentPage - 1;
    const currentDetailsId = name || window.location.pathname.split('/')[2];
    navigate(
      currentDetailsId ? `/${newPage}/${currentDetailsId}` : `/${newPage}`
    );
    setCurrentPage(newPage);
  }

  return (
    <div className="app-container">
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
        <div className="content-container">
          <div className="left-container">
            {loading ? (
              <Skeleton count={20} />
            ) : error ? (
              <div className="error-message">
                <h2>Unfortunately, such a Pokemon does not exist!</h2>
                <p>
                  I remind you that to catch a Pokemon, you need to know and
                  specify its full name.
                </p>
              </div>
            ) : (
              pokemonsInfo && (
                <>
                  {nextPageURL || prevPageURL ? (
                    <div className="buttons-container">
                      <button
                        className="pagination-button"
                        disabled={!prevPageURL}
                        onClick={() => handlePagination('prev')}
                      >
                        Prev
                      </button>
                      <button
                        className="pagination-button"
                        disabled={!nextPageURL}
                        onClick={() => handlePagination('next')}
                      >
                        Next
                      </button>
                    </div>
                  ) : null}
                  <Main
                    allPokemons={pokemonsInfo}
                    currentPage={currentPage}
                  ></Main>
                </>
              )
            )}
          </div>
          <div className="right-container">
            <Routes>
              <Route
                path="/"
                element={
                  <div className="placeholder-text">Выберите покемона</div>
                }
              />
              <Route
                path="/:page"
                element={
                  <div className="placeholder-text">Выберите покемона</div>
                }
              />
              <Route path="/:page/:name" element={<CardDetails />} />
            </Routes>
          </div>
        </div>
      </ErrorBoundary>
    </div>
  );
}

export const BASE_URL_FOR_POKEAPI = 'https://pokeapi.co/api/v2/pokemon';
