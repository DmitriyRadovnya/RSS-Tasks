import './user-tile.css';
import { useEffect, useState, type FC } from 'react';
import type { IFormData } from '../../interfaces/interfaces';
import { getImageSrc } from './user-tile.lib';

interface IUserTileProps {
  data: IFormData;
}

export const UserTile: FC<IUserTileProps> = ({ data: { name, avatar } }) => {
  const [highlight, setHighlight] = useState(true);

  useEffect(() => {
    const timerId = setTimeout(() => setHighlight(false), 3000);
    return () => clearTimeout(timerId);
  }, []);

  const imageSrc = avatar ? getImageSrc(avatar) : '';

  return (
    <div className={`user-tile ${highlight ? 'highlight' : ''}`}>
      {imageSrc && (
        <img
          src={imageSrc}
          alt={`${name}'s avatar`}
          style={{ maxWidth: '100px', maxHeight: '100px' }}
        />
      )}
      <p>{name}</p>
    </div>
  );
};
