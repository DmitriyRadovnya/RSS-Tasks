import './modal.css';
import { useEffect, type FC } from 'react';
import { createPortal } from 'react-dom';
import type { IModalProps } from '../../interfaces/interfaces';

export const Modal: FC<IModalProps> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;
  return createPortal(
    <div className="modal-wrapper" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
};
