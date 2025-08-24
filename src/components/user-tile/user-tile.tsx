import type { FC } from 'react';
import type { IFormData } from '../../interfaces/interfaces';

interface IUserTileProps {
  data: IFormData;
}

export const UserTile: FC<IUserTileProps> = ({ data: { name } }) => {
  return (
    <div className="user-tile">
      <p>{name}</p>
    </div>
  );
};
