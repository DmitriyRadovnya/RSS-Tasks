import React from 'react';
import './App.css';
import Header from './components/header/header';

export interface AppState {
  currentURL: string;
  nextPageURL: string;
  prevPageURL: string;
  query: string;
  data: ApiResponse | null;
  loading: boolean;
  error: string | null;
}

export interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
}

class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      currentURL: 'https://pokeapi.co/api/v2/pokemon',
      nextPageURL: '',
      prevPageURL: '',
      query: '',
      data: null,
      loading: true,
      error: null,
    };
  }

  async componentDidMount() {
    await fetch(this.state.currentURL)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        this.setState({
          data,
          loading: false,
          nextPageURL: data.next,
          prevPageURL: data.previous || '',
        });
        console.log(data);
        return data;
      })
      .catch((error) => {
        this.setState({ error: error.message, loading: false });
      });
  }

  setQueryResponse(query: string, currentURL: string) {
    this.setState({ query, currentURL });
  }

  render() {
    return (
      <>
        <Header
          setQueryResponse={(query, url) => this.setQueryResponse(query, url)}
        ></Header>
      </>
    );
  }
}

export default App;