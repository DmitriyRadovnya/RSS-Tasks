import './search-form.css';
import React, { Component } from 'react';
import type { PokemonDetails } from '../../../interfaces/pokemon';
import { BASE_URL_FOR_POKEAPI } from '../../../App';
import type {
  ApiResponse,
  Pokemon,
  SetAppState,
} from '../../../interfaces/interfaces';

interface SearchFormState {
  query: string;
  data: ApiResponse | null;
}

interface SearchFormProps {
  setAppState: SetAppState;
}

class SearchForm extends Component<SearchFormProps, SearchFormState> {
  constructor(props: SearchFormProps) {
    super(props);
    this.state = {
      query: '',
      data: null,
    };
  }

  componentDidMount() {
    const query = localStorage.getItem('pokemon') || ``;
    this.getData(query);
  }

  async getData(query?: string) {
    // const isListOfPokemon = query ? false : true;

    // "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20"
    await fetch(`${BASE_URL_FOR_POKEAPI}/${query}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        if (data.count) {
          const pokeapiStorage = JSON.stringify({
            currentURL: `${BASE_URL_FOR_POKEAPI}/${query}`,
            prevPageURL: data.previous,
            nextPageURL: data.next,
          });

          localStorage.setItem('pokeapiStorage', pokeapiStorage);

          // console.log(data);
          this.setState({ data }, () => {
            this.getPokemonInfo();
          });
        } else if (query && !query.includes('limit')) {
          localStorage.setItem('pokemon', query);

          this.props.setAppState(data, null, null, false);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async getPokemonInfo(): Promise<void> {
    if (!this.state.data) return;

    const prevPageURL = this.state.data.previous;
    const nextPageURL = this.state.data.next;

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
      // console.log(detailedData);
      this.props.setAppState(filteredData, prevPageURL, nextPageURL, false);
    } catch (error) {
      console.error('Ошибка при загрузке данных о покемонах:', error);
    }
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ query: event.target.value.trim() });
  };

  handleClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault();
    const query = this.state.query;
    this.getData(query);
  }

  render() {
    return (
      <form className="searchForm">
        <input
          type="text"
          placeholder="Unfortunately PokeApi only provides search by full name of Pokemon, the list of which I provided in the console"
          value={this.state.query}
          onChange={this.handleChange}
          className="searchInput"
        />
        <button onClick={(event) => this.handleClick(event)}>
          Catch Pokemon
        </button>
      </form>
    );
  }
}

export default SearchForm;
