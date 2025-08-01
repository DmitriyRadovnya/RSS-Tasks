import './card.css';
import type { CardProps } from '../../../../interfaces/interfaces';
import { useNavigate } from 'react-router-dom';
import type { FC } from 'react';

export const Card: FC<CardProps> = ({ currentPage, allPokemons: { name } }) => {
  const navigate = useNavigate();

  const showDetails = () => {
    const formattedName = name.toLowerCase().trim();
    navigate(`/${currentPage}/${formattedName}`);
  };

  return (
    <div className="card">
      <input
        // checked
        type="checkbox"
        name="fav"
        id=""
        className="card-checkbox"
      />
      <div className="card-button" onClick={showDetails}>
        <h2 className="card-name">{name}</h2>
      </div>
    </div>
  );
};
