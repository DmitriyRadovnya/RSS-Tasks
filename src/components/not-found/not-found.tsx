import { useNavigate } from 'react-router-dom';
import './not-found.css';

export const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/1');
  };

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page not found</h2>
        <p className="not-found-text">
          Sorry, the page you requested does not exist or has been moved.
        </p>
        <button className="not-found-button" onClick={handleGoHome}>
          Go Back
        </button>
      </div>
    </div>
  );
};
