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

  if (allPokemons.length > 0) {
    return (
      <>
        <div className="list-container">
          <ul className="card-list">
            {allPokemons.map(({ name }) => (
              <Card key={`${name}`} pokemonName={name} onClick={handleClick} />
            ))}
          </ul>
          <PaginationControls
            handler={handlePagination}
            disabled={{
              prev: page === 1,
              next: page === maxPages,
            }}
          />
        </div>
        {pokemonDetails && (
          <div className="details-container">
            <CardDetails details={pokemonDetails} page={page} />
          </div>
        )}
      </>
    );
  }

  return <div className="placeholder-text">No Pokémon data available</div>;
};
