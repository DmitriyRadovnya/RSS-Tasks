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
      <div>
        <h3>Favorite cards: {favoriteCards.length}</h3>
        <ul>
          {favoriteCards.map((item) => {
            return <li key={`fav-${item.name}`}>{item.name}</li>;
          })}
        </ul>
        <div>
          <button onClick={handleClearList}>Clear list</button>
          <button onClick={handleDownload}>Download list</button>
        </div>
      </div>
    )
  );
};
