import './card.css';
import { useState, type FC } from 'react';
import type { CardProps } from './card.types';
import { HeartIcon } from './heart-icon/heart-icon';

export const Card: FC<CardProps> = ({ pokemonName, onClick }) => {
  const [checked, setChecked] = useState(false);

  const handleChecked = () => {
    setChecked(!checked);
  };

  return (
    <li className="card">
      <label className="favorite-label">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChecked}
          className="card-checkbox"
        />
        <HeartIcon checked={checked} />
      </label>
      <div className="card-button" onClick={() => onClick(pokemonName)}>
        <h2 className="card-name">{pokemonName}</h2>
      </div>
    </li>
  );
};
