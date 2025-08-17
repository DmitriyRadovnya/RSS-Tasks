import '../pages/not-found/not-found.css';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page not found</h2>
        <p className="not-found-text">
          Sorry, the page you requested does not exist or has been moved.
        </p>
        <Link href={'/pokemons/1'} className="not-found-button">
          Go Home
        </Link>
      </div>
    </div>
  );
}
