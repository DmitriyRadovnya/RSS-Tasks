import React from 'react';
import s from './modal.module.css';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';

import { ModalCheckbox } from './modal-checkbox/modal-checkbox';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const columns = useSelector((state: RootState) => state.columns);

  if (!isOpen) return null;
  return (
    <div className={s.container}>
      <div className={s.content}>
        <h3 className={s.header}>Select columns</h3>
        <div className={s.checkbox_container}>
          {columns.map(({ key, columnName, isSelected }) => (
            <ModalCheckbox
              key={key}
              isChecked={isSelected}
              columnKey={key}
              columnName={columnName}
            />
          ))}
        </div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};
