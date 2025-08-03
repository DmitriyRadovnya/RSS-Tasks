import s from './layout.module.css';
import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className={s.app}>
      <header className={s.header}>
        <Link to={'/'} className={s.link}>
          Home
        </Link>
        <Link to={'/about'} className={s.link}>
          About
        </Link>
      </header>
      <Outlet />
      <footer className={s.footer}>
        <p>RSSchool React</p>
      </footer>
    </div>
  );
}
