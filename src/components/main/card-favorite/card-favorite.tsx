import './card-favorite.css';
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
      <div className="card-favorite">
        <h3 className="title-favorite">
          Favorite cards: {favoriteCards.length}
        </h3>
        <ul className="list-favorite">
          {favoriteCards.map((item) => {
            return (
              <li className="item-favorite" key={`fav-${item.name}`}>
                {item.name}
              </li>
            );
          })}
        </ul>
        <div className="controls-favorite">
          <button className="clear-favorite" onClick={handleClearList}>
            Clear list
          </button>
          <button className="download-favorite" onClick={handleDownload}>
            Download list
          </button>
        </div>
      </div>
    )
  );
};
