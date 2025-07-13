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

  setSearchError(error: Error) {
    this.setState({ error }, () => {
      console.log(this.state.error);
    });
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
          setAppError={(error: Error) => {
            this.setSearchError(error);
          }}
        ></Header>
        <ErrorBoundary fallback={<BackupUI />}>
          {loading ? (
            <Skeleton count={6} />
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
            <p>load...</p>
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
// // остальные методы
//   setSearchError(error: Error) { // этот метод пробрасываю в header, там форма для отправки поискового запроса, и вызываю этот метод в блоке catch если код ответа 404
//     this.setState({error})
//   }

//   render() {
//     const { pokemonsInfo, error } = this.state;

//     return (
//       <>
//         <Header
//           setAppState={(desiredPokemon, prevPageURL, nextPageURL, loading) =>
//             this.setAppState(desiredPokemon, prevPageURL, nextPageURL, loading)
//           }
//           setAppError={(error: Error) => {this.setSearchError(error)}}
//         ></Header>
//         <ErrorBoundary fallback={<BackupUI />}>
//           {pokemonsInfo ? (
//               <Main details={error !== null ? error : pokemonsInfo}></Main>
//           ) : (
//             <p>Loading...</p>
//           )}
//         </ErrorBoundary>
//       </>
//     );
//   }
// }
