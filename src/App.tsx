import { useEffect, useState } from 'react';
import './App.css';
import { Main } from './components/main/main';
import ErrorBoundary from './components/error-boundary/error-boundary';
import { BackupUI } from './components/error-boundary/backup-ui';
import { useNavigate, useParams } from 'react-router-dom';
import { SearchForm } from './components/search-form/search-form';

export const App = () => {
  const [searchError, setSearchError] = useState<Error | null>(null);
  const { page } = useParams<{ page: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const pageNum = Number(page);
    if (isNaN(pageNum) || pageNum <= 0) {
      navigate('/404', { replace: true });
      return;
    }
  }, [page, navigate]);

  return (
    <div className="app-container">
      <SearchForm setSearchError={setSearchError} />
      <ErrorBoundary fallback={<BackupUI />}>
        <Main searchError={searchError} />
      </ErrorBoundary>
    </div>
  );
};

export const BASE_URL_FOR_POKEAPI = 'https://pokeapi.co/api/v2/pokemon';
