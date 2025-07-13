import React from 'react';
import './App.css';
import Header from './components/header/header';
import type { AppState, Pokemon } from './interfaces/interfaces';
import type { PokemonDetails } from './interfaces/pokemon';
import Main from './components/main/main';
import ErrorBoundary from './components/error-boundary/error-boundary';

export default class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      currentURL: 'https://pokeapi.co/api/v2/pokemon',
      nextPageURL: '',
      prevPageURL: '',
      query: '',
      data: null,
      pokemonsInfo: null,
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    this.getData()
  }

  async getData() {
    await fetch(this.state.currentURL)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        this.setState(
          {
            data,
            loading: false,
            nextPageURL: data.next,
            prevPageURL: data.previous || '',
          },
          () => {
            this.getPokemonInfo();
          }
        );
        console.log(data);
        return data;
      })
      .catch((error) => {
        this.setState({ error: error.message, loading: false });
      });
  }

  async getPokemonInfo(): Promise<void> {
    if (!this.state.data) return;
    console.log('da');

    const allPromises: Promise<PokemonDetails>[] = this.state.data.results.map(
      (item: Pokemon) =>
        fetch(item.url)
          .then((res) => res.json() as Promise<PokemonDetails>)
          .catch((error) => {
            console.error(`Ошибка при загрузке ${item.url}:`, error);
            return null as unknown as PokemonDetails;
          })
    );

    try {
      const detailedData = await Promise.all(allPromises);
      const filteredData = detailedData.filter((d) => d !== null);
      console.log(detailedData);
      this.setState({ pokemonsInfo: filteredData }, () => {
        console.log(this.state.pokemonsInfo);
      });
    } catch (error) {
      console.error('Ошибка при загрузке данных о покемонах:', error);
    }
  }

  setQueryResponse(query: string, currentURL: string) {
    this.setState({ query, currentURL });
  }

  render() {
    const { pokemonsInfo } = this.state;

    return (
      <>
        <Header
          setQueryResponse={(query, url) => this.setQueryResponse(query, url)}
        ></Header>
        <ErrorBoundary fallback={BackupUI}>
                  {pokemonsInfo ? (
          <Main details={pokemonsInfo}></Main>
        ) : (
          <p>Loading...</p>
        )}
        </ErrorBoundary>
      </>
    );
  }
}
