import { useTheme } from '../../hook/use-theme';
import './layout.css';
import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  const { theme, toggleTheme } = useTheme();
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
          <button onClick={toggleTheme}>Theme</button>
        </header>
        <Outlet />
        <footer className="footer">
          <p className="footer-text">RSSchool React</p>
        </footer>
      </div>
    </div>
  );
}
