import './card.css';
import type { PokemonDetails } from '../../../../interfaces/interfaces';

interface CardProps {
  pokemonInfo: PokemonDetails;
}

export default function Card(props: CardProps) {
  const {
    name,
    base_experience: baseExp,
    sprites: { front_default: cardImageUrl },
    abilities,
    stats,
  } = props.pokemonInfo;

  return (
    <div className="cardStyle">
      <div style={{ width: '30%' }}>
        <img src={cardImageUrl} alt={name} className="imageStyle" />
        <h2 style={{ margin: 0 }}>{name}</h2>
      </div>
      <div className="infoStyle">
        <p style={{ margin: '8px 0' }}>Base experience: {baseExp}</p>

        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div>
            <h4 style={{ margin: 0 }} className="titleStyle">
              Stats
            </h4>
            <ul className="listStyle">
              {stats.map((statObject, index) => (
                <li style={{ textAlign: 'start' }} key={index}>
                  {statObject.stat.name}: {statObject.base_stat}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{ margin: 0 }} className="titleStyle">
              Abilities
            </h4>
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
}
