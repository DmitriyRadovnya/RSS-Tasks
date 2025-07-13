import './search-form.css';
import React, { Component } from 'react';
import type { PokemonDetails } from '../../../interfaces/pokemon';

interface SearchFormState {
  query: string;
}

interface SearchFormProps {
  setSearchParams: (query: string, desiredPokemon: PokemonDetails) => void;
}

class SearchForm extends Component<SearchFormProps, SearchFormState> {
  constructor(props: SearchFormProps) {
    super(props);
    this.state = {
      query: '',
    };
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ query: event.target.value.trim() });
  };

  // componentDidMount() {
  //   console.log('Search компонент появился в DOM');
  // }

  // componentWillUnmount() {
  //   console.log('Search компонент исчезает из DOM');
  // }

  handleClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault();
    const query = this.state.query;
    fetch(`https://pokeapi.co/api/v2/pokemon/${query}`)
      .then((response) => {
        return response.json();
      })
      .then((data: PokemonDetails) => {
        this.props.setSearchParams(query, data);
        localStorage.setItem('pokemon', query);
        // console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
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
