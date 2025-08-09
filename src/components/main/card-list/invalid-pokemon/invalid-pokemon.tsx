import './invalid-pokemon.css';
import type { FC } from 'react';

export const InvalidPokemon: FC = () => {
  return (
    <div className="error-message">
      <h2>Unfortunately, such a Pokémon does not exist!</h2>
      <p>
        I remind you that to catch a Pokémon, you need to know and specify its
        full name.
      </p>
    </div>
  );
};
