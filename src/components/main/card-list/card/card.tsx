import './card.css';
import type { CardProps } from '../../../../interfaces/interfaces';
import { useEffect, useState } from 'react';
import { getPokemonDetails } from '../../../../api/pokeapi';
import { useSearchParams } from 'react-router-dom';
import { CardDetails } from './card-details/card-details';

export default function Card(props: CardProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);

  const { name } = props.name;
  const { setPokemonDetails, pokemonDetails } = props;

  useEffect(() => {
    const detailsFromUrl = searchParams.get('details');
    if (detailsFromUrl === name) {
      // setPokemonDetails(null);
      setLoading(true);
      setTimeout(() => {
        getPokemonDetails(detailsFromUrl)
          .then((pokemon) => {
            setPokemonDetails(pokemon);
            setLoading(false);
          })
          .catch((error) => {
            console.log(error);
            setSearchParams((prev) => {
              prev.delete('details');
              return prev;
            });
            setLoading(false);
          });
      }, 1000);
    }
  }, [searchParams]);

  const showDetails = () => {
    // setLoading(true);
    setSearchParams((prev) => {
      prev.set('details', name.trim());
      return prev;
    });
  };

  return (
    <div className="card_style" onClick={showDetails}>
      <h2 style={{ margin: 0, fontSize: 20 }}>{name}</h2>
      <div className="card__details_container">
        {searchParams.get('details') === name ? (
          <CardDetails loading={loading} pokemonDetails={pokemonDetails} />
        ) : null}
      </div>
    </div>
  );
}
