import './header.css';
import SearchForm from './search-form/search-form';
import type { HeaderProps } from '../../interfaces/interfaces';
import { Link } from 'react-router-dom';

export default function Header(props: HeaderProps) {
  return (
    <header className="header">
      <SearchForm
        setAppState={props.setAppState}
        setAppLoading={props.setAppLoading}
        setAppError={props.setAppError}
      ></SearchForm>
      <Link to="/about" className="aboutLink">
        About
      </Link>
    </header>
  );
}
