import React from 'react';
import type {
  ApiResponse,
  Pokemon,
  SetAppState,
} from '../../interfaces/interfaces';
import type { PokemonDetails } from '../../interfaces/pokemon';

interface PaginationButtonProps {
  direction: string;
  url: string | null;
  setAppState: SetAppState;
}

export default class PaginationButton extends React.Component<PaginationButtonProps> {
  handleClick = async () => {
    const url = this.props.url;
    console.log(url);
    if (url) {
      await fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          // this.setState({ data }, () => {
          this.getPokemons(data);
          // });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  async getPokemons(data: ApiResponse): Promise<void> {
    const allPromises: Promise<PokemonDetails>[] = data.results.map(
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
      const prevPageURL = data.previous;
      const nextPageURL = data.next;

      // console.log(detailedData);
      this.props.setAppState(filteredData, prevPageURL, nextPageURL, false);
    } catch (error) {
      console.error('Ошибка при загрузке данных о покемонах:', error);
    }
  }

  render() {
    const { direction, url } = this.props;

    return (
      <button disabled={!url} onClick={this.handleClick}>
        {direction}
      </button>
    );
  }
}
