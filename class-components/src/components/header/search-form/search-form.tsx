import React, { Component } from 'react';
import type { PokemonDetails } from '../../../interfaces/pokemon';

interface SearchFormState {
  query: string;
}

interface SearchFormProps {
  setQueryResponse: (desiredPokemon: PokemonDetails) => void;
}

class SearchForm extends Component<SearchFormProps, SearchFormState> {
  constructor(props: SearchFormProps) {
    super(props);
    this.state = {
      query: '',
    };
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ query: event.target.value });
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
      .then((data) => {
        this.props.setQueryResponse(data);
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    return (
      <form>
        <input
          type="text"
          placeholder="Поиск..."
          value={this.state.query}
          onChange={this.handleChange}
        />
        <button onClick={(event) => this.handleClick(event)}>Найти</button>
      </form>
    );
  }
}

export default SearchForm;
