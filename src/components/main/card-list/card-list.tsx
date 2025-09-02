'use client';
import './card-list.css';
import { Card } from './card/card';
import { FC, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CardListProps } from './card-list.types';
import { PokemonDetails } from '../../../interfaces/interfaces';
import getPokemonDetails from '../../../app/actions/getPokemonDetails';
import { CardDetails } from '../card-details/card-details';
import { PaginationControls } from './pagination-controls/pagination-controls';
import { usePokemonFromLS } from '../../../hook/use-pokemon-from-ls';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from '../../../i18n/routing';
import { SearchForm } from '../../search-form/search-form';

export const CardList: FC<CardListProps> = ({
  allPokemons,
  page,
  maxPages,
}) => {
  const t = useTranslations('CardList');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedPokemon = searchParams
    ? searchParams.get('pokemon')?.toLowerCase().trim()
    : null;
  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails | null>(
    null
  );
  const { pokemonName, savePokemon } = usePokemonFromLS();
  const [query, setQuery] = useState(pokemonName || '');
  const [isFiltered, setIsFiltered] = useState(false);
  const [filteredPokemons, setFilteredPokemons] = useState<{ name: string }[]>(
    []
  );
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedPokemon) {
      getPokemonDetails(selectedPokemon)
        .then((result) => {
          setPokemonDetails(result);
          setSearchError(null);
        })
        .catch((error) => {
          console.error('Failed to fetch Pokémon details:', error);
          setPokemonDetails(null);
          setSearchError(t('searchError'));
        });
    } else {
      setPokemonDetails(null);
    }
  }, [selectedPokemon, t]);

  useEffect(() => {
    if (pokemonName) {
      setQuery(pokemonName);
      setFilteredPokemons([{ name: pokemonName }]);
      setIsFiltered(true);
    } else {
      setQuery('');
      setFilteredPokemons([]);
      setIsFiltered(false);
    }
  }, [pokemonName]);

  const handleClick = (pokemonName: string) => {
    const normalizedName = pokemonName.toLowerCase().trim();
    const newSearchParams = new URLSearchParams(searchParams || undefined);
    newSearchParams.set('pokemon', normalizedName);
    const newUrl = `${pathname}?${newSearchParams.toString()}`;
    router.push(newUrl);
  };

  const handlePagination = (direction: 'prev' | 'next') => {
    const newPage = direction === 'next' ? page + 1 : page - 1;
    const newSearchParams = new URLSearchParams(searchParams || undefined);
    if (selectedPokemon) {
      newSearchParams.set('pokemon', selectedPokemon);
    }
    const newUrl = `/pokemons/${newPage}?${newSearchParams.toString()}`;
    router.push(newUrl);
  };

  const handleSearch = async (searchQuery: string) => {
    setSearchError(null);
    try {
      const normalizedQuery = searchQuery.toLowerCase().trim();
      if (normalizedQuery !== '') {
        await getPokemonDetails(normalizedQuery);
        savePokemon(normalizedQuery);
        setFilteredPokemons([{ name: normalizedQuery }]);
        setIsFiltered(true);
        const newSearchParams = new URLSearchParams(searchParams || undefined);
        newSearchParams.set('pokemon', normalizedQuery);
        const newUrl = `${pathname}?${newSearchParams.toString()}`;
        router.push(newUrl);
      } else {
        savePokemon(null);
        setIsFiltered(false);
        setFilteredPokemons([]);
        router.push(`/pokemons/${page}`);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setSearchError(t('searchError'));
    }
  };

  const handleChange = (event: { target: { value: string } }) => {
    setQuery(event.target.value.trim().toLowerCase());
  };

  const handleSubmit = () => {
    handleSearch(query);
  };

  const displayedPokemons = isFiltered ? filteredPokemons : allPokemons;

  if (displayedPokemons.length > 0) {
    return (
      <>
        <SearchForm
          value={query}
          onChange={handleChange}
          onSubmit={handleSubmit}
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

  return <div className="placeholder-text">{t('noData')}</div>;
};
