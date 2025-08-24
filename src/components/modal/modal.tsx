import type { FC } from 'react';
import { createPortal } from 'react-dom';
import type { IModalProps } from '../../interfaces/interfaces';

export const Modal: FC<IModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return createPortal(
    <div className="modal-wrapper" onClick={onClose}>
      <div className="modal-content">{children}</div>
    </div>,
    document.body
  );
};
