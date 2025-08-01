import './main.css';
import { CardList } from './card-list/card-list';
import { Outlet } from 'react-router-dom';

export const Main = () => {
  return (
    <main className="main-container">
      <div className="list-container">
        <CardList />
      </div>
      <div className="details-container">
        <Outlet />
      </div>
      <div className="fav-container"></div>
    </main>
  );
};
