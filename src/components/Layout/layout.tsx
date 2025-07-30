import './layout.css';
import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <>
      <header className="header">
        <Link to={'/'} className="header-link">
          Home
        </Link>
        <Link to={'/about'} className="header-link">
          About
        </Link>
      </header>
      <Outlet />
      <footer>
        <p>RSS School React</p>
      </footer>
    </>
  );
}
