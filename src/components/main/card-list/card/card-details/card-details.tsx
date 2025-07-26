import './card-detaills.css';
import type { PokemonDetails } from '../../../../../interfaces/interfaces';
import Skeleton from '../../../../skeleton/skeleton';

interface CardDetailsProps {
  pokemonDetails: PokemonDetails | null;
  loading: boolean;
}

export const CardDetails = (props: CardDetailsProps) => {
  const { loading, pokemonDetails } = props;

  if (loading) {
    return (
      <div className="card__details" data-testid="card-details">
        <div className="card__details_container">
          <Skeleton count={1} width="350px" height="400px" />
        </div>
      </div>
    );
  }

  if (!pokemonDetails) {
    return (
      <div className="card__details" data-testid="card-details">
        <div className="card__details_container">
          <p>Failed to load Pokémon details.</p>
        </div>
      </div>
    );
  }

  const {
    name,
    stats,
    abilities,
    base_experience: baseExp,
    sprites: { front_default },
  } = pokemonDetails;

  return (
    <div className="card__details" data-testid="card-details">
      <div className="card__details_container">
        <img src={front_default} alt={name} className="card__details_img" />
        <h2 className="card__details_name">{name}</h2>
        <p className="card__details_exp">Base experience: {baseExp}</p>
        <div className="card__details_criteria">
          <div>
            <h4 className="card__details_title">Stats</h4>
            <ul className="listStyle">
              {stats.map((statObject, index) => (
                <li style={{ textAlign: 'start' }} key={index}>
                  {statObject.stat.name}: {statObject.base_stat}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="card__details_title">Abilities</h4>
            <ul className="listStyle">
              {abilities.map((abilityObject, index) => (
                <li style={{ textAlign: 'start' }} key={index}>
                  {abilityObject.ability.name || 'unknown ability'}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
