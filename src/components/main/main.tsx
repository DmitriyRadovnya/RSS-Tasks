import './main.css';
import { CardList } from './card-list/card-list';
import { Outlet } from 'react-router-dom';
import { CardFavorite } from './card-favorite/card-favorite';

export const Main = () => {
  return (
    <main className="main-container" data-testid="main-container">
      <div className="list-container" data-testid="list-container">
        <CardList />
      </div>
      <div className="details-container" data-testid="details-container">
        <Outlet />
      </div>
      <div className="fav-container" data-testid="fav-container">
        <CardFavorite />
      </div>
    </main>
  );
};
