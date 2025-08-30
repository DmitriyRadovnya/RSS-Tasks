import { type FC } from 'react';
import s from './modal-checkbox.module.css';
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
    <label className={s.label}>
      <input
        type="checkbox"
        value={columnKey}
        checked={isChecked}
        onChange={handleSelectColumn}
        className={s.input}
      />
      {columnName}
    </label>
  );
};
