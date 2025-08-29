import { type FC } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../store/store';
import { toggleColumn } from '../../../store/columns-slice';

interface ModalCheckboxProps {
  isChecked: boolean;
  columnKey: string;
  columnName: string;
}

export const ModalCheckbox: FC<ModalCheckboxProps> = ({
  isChecked,
  columnKey,
  columnName,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const handleSelectColumn = () => {
    dispatch(toggleColumn(columnKey));
  };

  return (
    <label>
      <input
        type="checkbox"
        value={columnKey}
        checked={isChecked}
        onChange={handleSelectColumn}
      />
      {columnName}
    </label>
  );
};
