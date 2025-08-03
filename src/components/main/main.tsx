import './main.css';
import { CardList } from './card-list/card-list';
import { Outlet } from 'react-router-dom';
import type { FC } from 'react';
import { InvalidPokemon } from './card-list/invalid-pokemon/invalid-pokemon';
import type { MainProps } from './main.types';

export const Main: FC<MainProps> = ({ searchError }) => {
  return (
    <main className="main-container" data-testid="main-container">
      {searchError !== null ? (
        <InvalidPokemon />
      ) : (
        <div className="content-wrapper">
          <div className="list-container" data-testid="list-container">
            <CardList />
          </div>
          <div className="details-container" data-testid="details-container">
            <Outlet />
          </div>
        </div>
      )}
    </main>
  );
};
