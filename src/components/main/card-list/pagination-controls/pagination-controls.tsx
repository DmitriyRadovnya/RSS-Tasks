import './pagination-controls.css';
import type { FC } from 'react';
import type { IPaginationControlsProps } from './pagination-controls.types';
import { useTranslations } from 'next-intl';

export const PaginationControls: FC<IPaginationControlsProps> = ({
  handler,
  disabled,
}) => {
  if (disabled.next && disabled.prev) return null;

  const t = useTranslations('paginationControls');

  return (
    <div className="buttons-container">
      <button
        className="pagination-button"
        disabled={disabled.prev}
        onClick={() => handler('prev')}
      >
        {t('prevPage')}
      </button>
      <button
        className="pagination-button"
        disabled={disabled.next}
        onClick={() => handler('next')}
      >
        {t('nextPage')}
      </button>
    </div>
  );
};
