import './App.css';
import { Main } from './components/main/main';
import ErrorBoundary from './components/error-boundary/error-boundary';
import { BackupUI } from './components/error-boundary/backup-ui';
// import { SearchForm } from './components/search-form/search-form';

const App = () => {
  return (
    <div className="app-container">
      {/* <SearchForm setSearchError={setSearchError} /> */}
      <ErrorBoundary fallback={<BackupUI />}>
        <Main />
      </ErrorBoundary>
    </div>
  );
};

export default App;

export const BASE_URL_FOR_POKEAPI = 'https://pokeapi.co/api/v2/pokemon';
