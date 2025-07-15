import React from 'react';
import './App.css';
import Header from './components/header/header';
import type { AppState } from './interfaces/interfaces';
import type { PokemonDetails } from './interfaces/pokemon';
import Main from './components/main/main';
import PaginationButton from './components/pagination-button/pagination-button';
import ErrorBoundary from './components/error-boundary/error-boundary';
import BackupUI from './components/error-boundary/backup-ui';
import Skeleton from './components/skeleton/skeleton';
export const BASE_URL_FOR_POKEAPI = 'https://pokeapi.co/api/v2/pokemon';

export default class App extends React.Component<object, AppState> {
  constructor(props: object) {
    super(props);
    this.state = {
      nextPageURL: null,
      prevPageURL: null,
      pokemonsInfo: null,
      loading: true,
      error: null,
    };
  }

  setAppState(
    desiredPokemon: PokemonDetails | PokemonDetails[],
    prevPageURL: string | null,
    nextPageURL: string | null,
    loading: boolean
  ) {
    const arrayOfPokemons = Array.isArray(desiredPokemon)
      ? desiredPokemon
      : [desiredPokemon];
    this.setState({
      pokemonsInfo: arrayOfPokemons,
      prevPageURL,
      nextPageURL,
      loading,
    });
  }

  setSearchError(error: Error | null) {
    if (error) {
      this.setState({ error });
    } else {
      this.setState({ error: null });
    }
  }

  render() {
    const { pokemonsInfo, nextPageURL, prevPageURL, loading, error } =
      this.state;

    return (
      <>
        <Header
          setAppState={(desiredPokemon, prevPageURL, nextPageURL, loading) =>
            this.setAppState(desiredPokemon, prevPageURL, nextPageURL, loading)
          }
          setAppError={(error: Error | null) => {
            this.setSearchError(error);
          }}
        ></Header>
        <ErrorBoundary fallback={<BackupUI />}>
          {loading ? (
            <Skeleton count={6} />
          ) : error ? (
            <div>
              <h2>Unfortunately, such a Pokemon does not exist!</h2>
              <p>
                I remind you that to catch a Pokemon, you need to know and
                specify its full name.
              </p>
            </div>
          ) : pokemonsInfo ? (
            <>
              {nextPageURL || prevPageURL ? (
                <div className="buttonsContainer">
                  <PaginationButton
                    url={this.state.prevPageURL}
                    direction="Prev"
                    setAppState={(
                      desiredPokemon,
                      prevPageURL,
                      nextPageURL,
                      loading
                    ) =>
                      this.setAppState(
                        desiredPokemon,
                        prevPageURL,
                        nextPageURL,
                        loading
                      )
                    }
                  ></PaginationButton>
                  <PaginationButton
                    url={this.state.nextPageURL}
                    direction="Next"
                    setAppState={(
                      desiredPokemon,
                      prevPageURL,
                      nextPageURL,
                      loading
                    ) =>
                      this.setAppState(
                        desiredPokemon,
                        prevPageURL,
                        nextPageURL,
                        loading
                      )
                    }
                  ></PaginationButton>
                </div>
              ) : null}
              <Main details={pokemonsInfo}></Main>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </ErrorBoundary>
      </>
    );
  }
}
