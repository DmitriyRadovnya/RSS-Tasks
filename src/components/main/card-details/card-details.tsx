'use client';
import './card-details.css';
import { FC } from 'react';
import { PokemonDetails } from '../../../interfaces/interfaces';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface CardDetailsProps {
  details: PokemonDetails;
  page: number;
}

export const CardDetails: FC<CardDetailsProps> = ({ details, page }) => {
  const router = useRouter();
  const {
    name: pokemonName,
    stats,
    abilities,
    base_experience: baseExp,
    sprites: { front_default },
  } = details;

  const handleClose = () => {
    router.push(`${page}`);
  };

  return (
    <div className="card-details" data-testid="card-details">
      <div className="card-details-container">
        <Image
          width={150}
          height={150}
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
        <button className="close-button" onClick={handleClose}>
          Close
        </button>
      </div>
    </div>
  );
};
