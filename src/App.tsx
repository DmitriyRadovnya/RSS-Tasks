import React from 'react';
import './App.css';
import Header from './components/header/header';
import type { AppState, PokemonDetails } from './interfaces/interfaces';
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

  setAppLoading(loading: boolean) {
    this.setState({ loading });
  }

  setSearchError(error: Error | null) {
    if (error) {
      this.setState({ error });
    } else {
      this.setState({ error: null });
    }
  }

  async handlePagination(direction: 'prev' | 'next') {
    const urlSearchParams =
      direction === 'prev' && this.state.prevPageURL
        ? new URL(this.state.prevPageURL).searchParams
        : direction === 'next' && this.state.nextPageURL
          ? new URL(this.state.nextPageURL).searchParams
          : null;

    if (urlSearchParams) {
      const urlOffset = urlSearchParams.get('offset');
      const urlLimit = urlSearchParams.get('limit');
      const offset = urlOffset ? parseInt(urlOffset) : BASIC_URL_OFFSET;
      const limit = urlLimit ? parseInt(urlLimit) : BASIC_URL_LIMIT;
      this.setState({ loading: true, error: null });
      try {
        const data = await getAllPokemons(offset, limit);
        const details = await Promise.all(
          data.results.map((item) => getPokemonDetails(item.name))
        );

        this.setState({
          pokemonsInfo: details,
          prevPageURL: data.previous,
          nextPageURL: data.next,
          loading: false,
        });
      } catch (error) {
        this.setState({ loading: false, error: error as Error });
      }
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
          setAppLoading={(loading: boolean) => this.setAppLoading(loading)}
        ></Header>
        <ErrorBoundary fallback={<BackupUI />}>
          {loading ? (
            <Skeleton count={8} />
          ) : error ? (
            <div>
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
                  <div className="buttonsContainer">
                    <button
                      disabled={!this.state.prevPageURL}
                      onClick={() => this.handlePagination('prev')}
                    >
                      Prev
                    </button>
                    <button
                      disabled={!this.state.nextPageURL}
                      onClick={() => this.handlePagination('next')}
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
}
