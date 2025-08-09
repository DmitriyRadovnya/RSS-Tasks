import './card-details.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetPokemonDetailsQuery } from '../../../api/pokeapi';
import { Skeleton } from '../../skeleton/skeleton';
import { useEffect } from 'react';

export const CardDetails = () => {
  const { page, detailsId } = useParams<{ page: string; detailsId?: string }>();
  const {
    data: pokemon,
    isLoading,
    isFetching,
    isError,
  } = useGetPokemonDetailsQuery(detailsId as string, { skip: !detailsId });
  const navigate = useNavigate();

  useEffect(() => {
    if (page && isNaN(Number(page))) {
      navigate('/404', { replace: true });
    }
  }, [page, navigate]);

  if (isLoading || isFetching) {
    return (
      <div className="card-details" data-testid="card-details">
        <div className="card-details-container">
          <Skeleton count={1} width="350px" height="400px" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="card-details" data-testid="card-details">
        <div className="card-details-container">
          <p className="error-text">Error loading Pokémon details</p>
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
    return <div className="placeholder-text">Pokémon not found</div>;
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
              {stats.map(({ stat: { name }, base_stat }) => (
                <li key={`${name}`} className="criteria-item">
                  {name}: {base_stat}
                </li>
              ))}
            </ul>
          </div>
          <div className="criteria-column">
            <h4 className="card-details-title">Abilities</h4>
            <ul className="criteria-list">
              {abilities.map(({ ability: { name } }) => (
                <li key={`${name}`}>{name || 'unknown ability'}</li>
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
};
