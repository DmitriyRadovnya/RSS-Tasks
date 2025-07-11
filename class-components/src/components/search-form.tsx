import React, { Component } from 'react';

interface SearchFormState {
  query: string;
}

interface SearchFormProps {
  setQueryResponse: (query: string, currentURL: string) => void;
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

  componentDidMount() {
    console.log('Search компонент появился в DOM');
  }

  componentWillUnmount() {
    console.log('Search компонент исчезает из DOM');
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
        <button>Найти</button>
      </form>
    );
  }
}

export default SearchForm;
