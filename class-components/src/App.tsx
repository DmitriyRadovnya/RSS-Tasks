import React from 'react';
import './App.css';
import Header from './components/header/header';
import type { AppState } from './interfaces/interfaces';
import type { PokemonDetails } from './interfaces/pokemon';
import Main from './components/main/main';
import PaginationButton from './components/pagination-button/pagination-button';
import ErrorBoundary from './components/error-boundary/error-boundary';
import BackupUI from './components/error-boundary/backup-ui';
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
    // if (prevPageURL && nextPageURL && loading) {
    this.setState(
      {
        pokemonsInfo: arrayOfPokemons,
        prevPageURL,
        nextPageURL,
        loading,
      },
      () => {
        console.log(this.state.pokemonsInfo);
      }
    );
    // }
    // else {
    //   this.setState({
    //     pokemonsInfo: arrayOfPokemons,
    //   });
    // }
  }

  render() {
    const { pokemonsInfo, nextPageURL, prevPageURL } = this.state;

    return (
      <>
        <Header
          setAppState={(desiredPokemon, prevPageURL, nextPageURL, loading) =>
            this.setAppState(desiredPokemon, prevPageURL, nextPageURL, loading)
          }
        ></Header>
        <ErrorBoundary fallback={<BackupUI />}>
          {pokemonsInfo ? (
            <>
              <Main details={pokemonsInfo}></Main>
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
            </>
          ) : (
            <p>Loading...</p>
          )}
        </ErrorBoundary>
      </>
    );
  }
}

// export default class App extends React.Component<{}, AppState> {
//   constructor(props: {}) {
//     super(props);
//     this.state = {
//       nextPageURL: null,
//       prevPageURL: null,
//       pokemonsInfo: null,
//       loading: true,
//       error: null,
//     };
//   }
//   // методы компонента
//   render() {
//     const { pokemonsInfo } = this.state;

//     return (
//       <>
//         <Header
//           setAppState={(desiredPokemon, prevPageURL, nextPageURL, loading) =>
//             this.setAppState(desiredPokemon, prevPageURL, nextPageURL, loading)
//           }
//         ></Header>
//         <ErrorBoundary fallback={<BackupUI />}>
//         {pokemonsInfo ? (
//             <Main details={pokemonsInfo}></Main>
//         ) : (
//           <p>Loading...</p>
//         )}
//         </ErrorBoundary>
//       </>
//     );
//   }
// }
