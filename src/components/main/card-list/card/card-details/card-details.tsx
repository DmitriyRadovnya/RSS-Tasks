import './card-detaills.css';
import { useParams, useNavigate } from 'react-router-dom';
import type { PokemonDetails } from '../../../../../interfaces/interfaces';
import { useEffect, useState } from 'react';
import { getPokemonDetails } from '../../../../../api/pokeapi';
import Skeleton from '../../../../skeleton/skeleton';

export default function CardDetails() {
  const { page, detailsId } = useParams<{ page: string; detailsId?: string }>();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!detailsId) {
      setError('Pokemon not selected');
      setLoading(false);
      return;
    }

    const pageNum = Number(page);
    if (isNaN(pageNum) || pageNum <= 0) {
      navigate('/404', { replace: true });
      return;
    }

    let isMounted = true;
    setLoading(true);
    const formattedName = detailsId.toLowerCase().trim();
    getPokemonDetails(formattedName)
      .then((pokemonDetails) => {
        if (isMounted) {
          setPokemon(pokemonDetails);
          setLoading(false);
          setError(null);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError('Error loading pokemon details');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [detailsId, page, navigate]);

  if (loading) {
    return (
      <div className="card-details" data-testid="card-details">
        <div className="card-details-container">
          <Skeleton count={1} width="350px" height="400px" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-details" data-testid="card-details">
        <div className="card-details-container">
          <p className="error-text">{error}</p>
          <button
            onClick={() => navigate(`/${page || 1}`)}
            className="close-button"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!pokemon) {
    return <div className="placeholder-text">Loading...</div>;
  }

  const {
    name: pokemonName,
    stats,
    abilities,
    base_experience: baseExp,
    sprites: { front_default },
  } = pokemon;

  return (
    <div className="card-details" data-testid="card-details">
      <div className="card-details-container">
        <img
          src={front_default}
          alt={pokemonName}
          className="card-details-img"
        />
        <h2 className="card-details-name">{pokemonName}</h2>
        <p className="card-details-exp">Base experience: {baseExp}</p>
        <div className="card-details-criteria">
          <div className="criteria-column">
            <h4 className="card-details-title">Stats</h4>
            <ul className="criteria-list">
              {stats.map((statObject, index) => (
                <li key={index}>
                  {statObject.stat.name}: {statObject.base_stat}
                </li>
              ))}
            </ul>
          </div>
          <div className="criteria-column">
            <h4 className="card-details-title">Abilities</h4>
            <ul className="criteria-list">
              {abilities.map((abilityObject, index) => (
                <li key={index}>
                  {abilityObject.ability.name || 'unknown ability'}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <button className="close-button" onClick={() => navigate(`/${page}`)}>
          Close
        </button>
      </div>
    </div>
  );
}
