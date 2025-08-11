import { useDispatch } from 'react-redux';
import { useTheme } from '../../hook/use-theme';
import { CardFavorite } from '../main/card-favorite/card-favorite';
import './layout.css';
import { Link, Outlet } from 'react-router-dom';
import { pokemonApi } from '../../api/pokeapi';

export default function Layout() {
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();

  const handleRefresh = () => {
    dispatch(pokemonApi.util.resetApiState());
  };

  return (
    <div className={`app ${theme}`}>
      <div className="app-wrapper">
        <header className="header">
          <Link to={'/'} className="header-link">
            Home
          </Link>
          <Link to={'/about'} className="header-link">
            About
          </Link>
          <button className="app-toggler" onClick={toggleTheme}>
            {theme === 'light' ? 'Dark' : 'Light'} theme
          </button>
          <button className="app-toggler" onClick={handleRefresh}>
            Clear cache
          </button>
        </header>
        <Outlet />
        <footer className="footer">
          <p className="footer-text">RSSchool React</p>
        </footer>
        <CardFavorite />
      </div>
    </div>
  );
}
