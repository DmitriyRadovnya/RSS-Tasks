'use client';

import './search-form.css';
import { FC, ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';

interface SearchFormProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

export const SearchForm: FC<SearchFormProps> = ({
  value,
  onChange,
  onSubmit,
}) => {
  const t = useTranslations('CardList');

  return (
    <div data-testid="search-form" className="search-form">
      <input
        type="text"
        placeholder={t('searchPlaceholder')}
        value={value}
        onChange={onChange}
        className="search-input"
      />
      <button className="search-button" onClick={onSubmit}>
        {t('searchButton')}
      </button>
    </div>
  );
};
