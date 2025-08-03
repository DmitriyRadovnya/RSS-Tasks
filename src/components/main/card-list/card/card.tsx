import './card.css';
import type {
  Ability,
  CardProps,
  Stat,
} from '../../../../interfaces/interfaces';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, type FC } from 'react';
import { getPokemonDetails } from '../../../../api/pokeapi';
import { useDispatch } from 'react-redux';
import {
  addFavoriteCard,
  removeFavoriteCard,
} from '../../../../store/favorite-cards-slice';
import { useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../../store';

export interface IFavoriteCard {
  name: string;
  baseExp: number;
  stats: Stat[];
  abilities: Ability[];
}

export const Card: FC<CardProps> = ({ currentPage, pokemon: { name } }) => {
  const dispatch = useDispatch<AppDispatch>();
  const favoriteCards = useSelector((state: RootState) => state.favoriteCards);
  const isFavoriteCard = favoriteCards.some((card) => card.name === name);
  const [checked, setChecked] = useState(isFavoriteCard);
  const navigate = useNavigate();

  useEffect(() => {
    if (checked) {
      getPokemonDetails(name).then((details) => {
        const detailsForFavCard: IFavoriteCard = {
          name: details.name,
          baseExp: details.base_experience,
          stats: details.stats,
          abilities: details.abilities,
        };
        dispatch(addFavoriteCard(detailsForFavCard));
      });
    } else {
      dispatch(removeFavoriteCard(name));
    }
  }, [checked, dispatch, name]);

  useEffect(() => {
    setChecked(isFavoriteCard);
  }, [isFavoriteCard]);

  const handleChecked = () => {
    setChecked(!checked);
  };

  const showDetails = () => {
    const formattedName = name.toLowerCase().trim();
    navigate(`/${currentPage}/${formattedName}`);
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
        <svg
          className={`heart-icon ${checked ? 'active' : ''}`}
          viewBox="0 0 24 24"
        >
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
              2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09 
              C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5 
               c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          />
        </svg>
      </label>
      <div className="card-button" onClick={showDetails}>
        <h2 className="card-name">{name}</h2>
      </div>
    </li>
  );
};
