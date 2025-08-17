'use client';

import './card-favorite.css';
import { useFavorites } from '../../../app/context/FavoritesContext';

export const CardFavorite = () => {
  const { favorites, clearFavorites } = useFavorites();

  const handleDownload = async () => {
    try {
      const response = await fetch('/api/download-favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(favorites),
      });

      if (!response.ok) {
        throw new Error('Error downloading CSV');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${favorites.length}_items.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error while downloading:', error);
    }
  };

  if (favorites.length === 0) {
    return null;
  }

  return (
    <div className="card-favorite">
      <h3 className="title-favorite">Favorite cards: {favorites.length}</h3>
      <ul className="list-favorite">
        {favorites.map(({ name }) => (
          <li className="item-favorite" key={name}>
            {name}
          </li>
        ))}
      </ul>
      <div className="controls-favorite">
        <button className="clear-favorite" onClick={clearFavorites}>
          Clear list
        </button>
        <button className="download-favorite" onClick={handleDownload}>
          Download list
        </button>
      </div>
    </div>
  );
};
