import './card.css';
import { FC } from 'react';
import type { CardProps } from './card.types';
import { HeartIcon } from './heart-icon/heart-icon';
import { useFavorites } from '../../../../app/context/FavoritesContext';
import getPokemonDetails from '../../../../app/actions/getPokemonDetails';

export const Card: FC<CardProps> = ({ pokemonName, onClick }) => {
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const isFavorite = favorites.some((p) => p.name === pokemonName);

  const handleToggle = async () => {
    if (isFavorite) {
      removeFavorite(pokemonName);
    } else {
      try {
        const details = await getPokemonDetails(pokemonName);
        addFavorite(details);
      } catch (error) {
        console.error('Failed to add to favorites:', error);
      }
    }
  };

  return (
    <li className="card">
      <label className="favorite-label">
        <input
          type="checkbox"
          checked={isFavorite}
          onChange={handleToggle}
          className="card-checkbox"
        />
        <HeartIcon checked={isFavorite} />
      </label>
      <div className="card-button" onClick={() => onClick(pokemonName)}>
        <h2 className="card-name">{pokemonName}</h2>
      </div>
    </li>
  );
};
