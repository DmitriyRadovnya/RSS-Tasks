import './card-list.css';
import { Card } from './card/card';
import type { MainProps } from '../../../interfaces/interfaces';
import type { FC } from 'react';

export const CardList: FC<MainProps> = ({ allPokemons, currentPage }) => {
  return (
    <ul className="card-list">
      {allPokemons.map((item) => (
        <Card key={item.name} allPokemons={item} currentPage={currentPage} />
      ))}
    </ul>
  );
};
