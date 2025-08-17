'use client';
import './card-list.css';
import { Card } from './card/card';
import { FC, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CardListProps } from './card-list.types';
import { PokemonDetails } from '../../../interfaces/interfaces';
import getPokemonDetails from '../../../app/actions/getPokemonDetails';
import { CardDetails } from '../card-details/card-details';
import { PaginationControls } from './pagination-controls/pagination-controls';
import { usePokemonFromLS } from '../../../hook/use-pokemon-from-ls';
import { SearchForm } from '../../search-form/search-form';

export const CardList: FC<CardListProps> = ({
  allPokemons,
  page,
  maxPages,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPokemon = searchParams ? searchParams.get('pokemon') : null;
  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails | null>(
    null
  );
  const { pokemonName, savePokemon } = usePokemonFromLS();
  const [query, setQuery] = useState('');
  const [isFiltered, setIsFiltered] = useState(false);
  const [filteredPokemons, setFilteredPokemons] = useState<{ name: string }[]>(
    []
  );
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    if (pokemonName) {
      setQuery(pokemonName);
      setFilteredPokemons([{ name: pokemonName }]);
      setIsFiltered(true);
    } else {
      setIsFiltered(false);
    }
  }, [pokemonName]);

  useEffect(() => {
    if (selectedPokemon) {
      getPokemonDetails(selectedPokemon)
        .then((result) => {
          setPokemonDetails(result);
        })
        .catch((error) => {
          console.error('Failed to fetch pokemon details:', error);
          setPokemonDetails(null);
        });
    } else {
      setPokemonDetails(null);
    }
  }, [selectedPokemon]);

  const handleClick = (pokemonName: string) => {
    router.push(`/pokemons/${page}?pokemon=${pokemonName}`);
  };

  const handlePagination = (direction: 'prev' | 'next') => {
    const currentPage = page;
    const newPage = direction === 'next' ? currentPage + 1 : currentPage - 1;
    router.push(
      selectedPokemon
        ? `/pokemons/${newPage}?pokemon=${selectedPokemon}`
        : `/pokemons/${newPage}`
    );
  };

  const handleSearch = async (searchQuery: string) => {
    setSearchError(null);
    try {
      if (searchQuery !== '') {
        await getPokemonDetails(searchQuery);
        savePokemon(searchQuery);
        setFilteredPokemons([{ name: searchQuery }]);
        setIsFiltered(true);
      } else {
        savePokemon(null);
        setIsFiltered(false);
      }
    } catch (error) {
      setSearchError('Pokemon not found or an error occurred.');
      console.error(error);
    }
  };

  const displayedPokemons = isFiltered ? filteredPokemons : allPokemons;

  if (displayedPokemons.length > 0) {
    return (
      <>
        <SearchForm
          value={query}
          onChange={(e: { target: { value: string } }) =>
            setQuery(e.target.value.trim().toLowerCase())
          }
          onSubmit={() => handleSearch(query)}
        />
        {searchError && <div className="error-message">{searchError}</div>}
        <div className="content-wrapper">
          <div className="list-container">
            <ul className="card-list">
              {displayedPokemons.map(({ name }) => (
                <Card key={name} pokemonName={name} onClick={handleClick} />
              ))}
            </ul>
            {!isFiltered && (
              <PaginationControls
                handler={handlePagination}
                disabled={{
                  prev: page === 1,
                  next: page === maxPages,
                }}
              />
            )}
          </div>
          {pokemonDetails && (
            <div className="details-container">
              <CardDetails details={pokemonDetails} page={page} />
            </div>
          )}
        </div>
      </>
    );
  }

  return <div className="placeholder-text">No Pokémon data available</div>;
};
