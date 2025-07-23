import './header.css';
import SearchForm from './search-form/search-form';
import type { HeaderProps } from '../../interfaces/interfaces';

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
