import { CardList } from './card-list/card-list';
import type { MainProps } from '../../interfaces/interfaces';
import type { FC } from 'react';

export const Main: FC<MainProps> = ({ allPokemons, currentPage }) => {
  return (
    <main className="main-container">
      <CardList allPokemons={allPokemons} currentPage={currentPage} />
    </main>
  );
};
