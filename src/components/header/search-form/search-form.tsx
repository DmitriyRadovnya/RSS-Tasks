import './search-form.css';
import React, { Component } from 'react';
import type { ApiResponse, SetAppState } from '../../../interfaces/interfaces';
import { getAllPokemons, getPokemonDetails } from '../../../api/pokeapi';

interface SearchFormState {
  query: string;
  data: ApiResponse | null;
}

interface SearchFormProps {
  setAppState: SetAppState;
  setAppLoading: (loading: boolean) => void;
  setAppError: (error: Error | null) => void;
}

class SearchForm extends Component<SearchFormProps, SearchFormState> {
  constructor(props: SearchFormProps) {
    super(props);
    this.state = {
      query: '',
      data: null,
    };
  }

  async componentDidMount() {
    this.getPokemonInfo();
  }

  async getPokemonInfo(): Promise<void> {
    this.props.setAppLoading(true);
    const savedPokemon = localStorage.getItem('pokemon') || ``;
    this.setState({ query: savedPokemon });
    try {
      if (savedPokemon) {
        const details = await getPokemonDetails(savedPokemon);
        this.props.setAppState([details], null, null, false);
      } else {
        const data = await getAllPokemons();
        const details = await Promise.all(
          data.results.map((item) => getPokemonDetails(item.name))
        );
        this.props.setAppState(details, data.previous, data.next, false);
      }
    } catch (error) {
      this.props.setAppError(error as Error);
      this.props.setAppLoading(false);
    }
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ query: event.target.value.trim() });
  };

  async handleClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault();
    this.props.setAppError(null);
    const query = this.state.query;
    localStorage.setItem('pokemon', query);
    this.getPokemonInfo();
  }

  render() {
    return (
      <form className="searchForm">
        <input
          type="text"
          placeholder="Unfortunately PokeApi only provides search by full name of Pokemon"
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
