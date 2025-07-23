import './header.css';
import SearchForm from './search-form/search-form';
import type { SetAppState } from '../../interfaces/interfaces';

interface HeaderProps {
  setAppState: SetAppState;
  setAppLoading: (loading: boolean) => void;
  setAppError: (error: Error | null) => void;
}

export default function Header(props: HeaderProps) {
  return (
    <header className="header">
      <SearchForm
        setAppState={props.setAppState}
        setAppLoading={props.setAppLoading}
        setAppError={props.setAppError}
      ></SearchForm>
    </header>
  );
}
