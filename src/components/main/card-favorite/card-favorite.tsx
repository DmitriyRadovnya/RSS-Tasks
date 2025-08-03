import s from './card-favorite.module.css';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store';
import { removeAllFavoriteCards } from '../../../store/favorite-cards-slice';
import { downloadFavoritesInCSV } from './card-favorite.lib';

export const CardFavorite = () => {
  const favoriteCards = useSelector((state: RootState) => state.favoriteCards);
  const dispatch = useDispatch<AppDispatch>();

  const handleClearList = () => {
    dispatch(removeAllFavoriteCards());
  };

  const handleDownload = () => {
    downloadFavoritesInCSV(favoriteCards);
  };

  return (
    favoriteCards.length !== 0 && (
      <div className={s.card}>
        <h3 className={s.title}>Favorite cards: {favoriteCards.length}</h3>
        <ul className={s.list}>
          {favoriteCards.map((item) => {
            return (
              <li className={s.item} key={`fav-${item.name}`}>
                {item.name}
              </li>
            );
          })}
        </ul>
        <div className={s.controls}>
          <button className={s.clear} onClick={handleClearList}>
            Clear list
          </button>
          <button className={s.download} onClick={handleDownload}>
            Download list
          </button>
        </div>
      </div>
    )
  );
};
