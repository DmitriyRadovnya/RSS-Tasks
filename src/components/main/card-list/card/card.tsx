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
    <div className="card">
      <input
        onChange={handleChecked}
        checked={checked}
        type="checkbox"
        name="fav"
        id=""
        className="card-checkbox"
      />
      <div className="card-button" onClick={showDetails}>
        <h2 className="card-name">{name}</h2>
      </div>
    </div>
  );
};
