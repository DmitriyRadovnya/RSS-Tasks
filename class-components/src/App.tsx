import React from 'react';
import './App.css';
import Header from './components/header/header';
import type { AppState, Pokemon } from './interfaces/interfaces';
import type { PokemonDetails } from './interfaces/pokemon';
import Main from './components/main/main';
// import ErrorBoundary from './components/error-boundary/error-boundary';
// import BackupUI from './components/error-boundary/backup-ui';
export const BASE_URL_FOR_POKEAPI = 'https://pokeapi.co/api/v2/pokemon';

export default class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      nextPageURL: null,
      prevPageURL: null,
      pokemonsInfo: null,
      loading: true,
      error: null,
    };
  }

  // shouldComponentUpdate(nextProps: Readonly<{}>, nextState: Readonly<AppState>): boolean {
  //   return (
  //     nextState.prevPageURL !== this.state.prevPageURL
  //     ||
  //     nextState.nextPageURL !== this.stat
  //   )
  // }

  setAppState(
    desiredPokemon: PokemonDetails | PokemonDetails[],
    prevPageURL: string | null,
    nextPageURL: string | null,
    loading: boolean
  ) {
    const arrayOfPokemons = Array.isArray(desiredPokemon)
      ? desiredPokemon
      : [desiredPokemon];
    if (prevPageURL && nextPageURL && loading) {
      this.setState({
        pokemonsInfo: arrayOfPokemons,
        prevPageURL,
        nextPageURL,
        loading,
      });
    } else {
      this.setState({
        pokemonsInfo: arrayOfPokemons,
      });
    }
  }

  render() {
    const { pokemonsInfo } = this.state;

    return (
      <>
        <Header
          setAppState={(desiredPokemon, prevPageURL, nextPageURL, loading) =>
            this.setAppState(desiredPokemon, prevPageURL, nextPageURL, loading)
          }
        ></Header>
        {/* <ErrorBoundary fallback={BackupUI}> */}
        {pokemonsInfo ? (
          <Main details={pokemonsInfo}></Main>
        ) : (
          <p>Loading...</p>
        )}
        {/* </ErrorBoundary> */}
      </>
    );
  }
}
