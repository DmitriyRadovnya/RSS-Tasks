import './card.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, type FC } from 'react';
// import { getPokemonDetails } from '../../../../api/pokeapi';
import { useDispatch } from 'react-redux';
import {
  addFavoriteCard,
  removeFavoriteCard,
} from '../../../../store/favorite-cards-slice';
import { useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../../store';
import type { CardProps, IFavoriteCard } from './card.types';
import { HeartIcon } from './heart-icon/heart-icon';
import { useGetPokemonDetailsQuery } from '../../../../api/pokeapi';

export const Card: FC<CardProps> = ({ currentPage, pokemonName }) => {
  const dispatch = useDispatch<AppDispatch>();
  const favoriteCards = useSelector((state: RootState) => state.favoriteCards);
  const isFavoriteCard = favoriteCards.some(
    (card) => card.name === pokemonName
  );
  const [checked, setChecked] = useState(isFavoriteCard);
  const navigate = useNavigate();

  const { data: pokemonDetails } = useGetPokemonDetailsQuery(pokemonName, {
    skip: !checked,
  });

  useEffect(() => {
    if (checked && pokemonDetails) {
      const { name, base_experience, stats, abilities } = pokemonDetails;
      const detailsForFavCard: IFavoriteCard = {
        name,
        baseExp: base_experience,
        stats,
        abilities,
      };
      dispatch(addFavoriteCard(detailsForFavCard));
    } else if (!checked) {
      dispatch(removeFavoriteCard(pokemonName));
    }
  }, [checked, pokemonDetails, dispatch, pokemonName]);

  useEffect(() => {
    setChecked(isFavoriteCard);
  }, [isFavoriteCard]);

  const handleChecked = () => {
    setChecked(!checked);
  };

  const showDetails = () => {
    const formattedName = pokemonName.toLowerCase().trim();
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
        <HeartIcon checked={checked} />
      </label>
      <div className="card-button" onClick={showDetails}>
        <h2 className="card-name">{pokemonName}</h2>
      </div>
    </li>
  );
};
