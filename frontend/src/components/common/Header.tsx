import { Link } from 'react-router-dom';
import logo from '../../logo.png';

interface HeaderProps {
  isAdmin?: boolean;
}


export default function Header({ isAdmin = false }: HeaderProps) {
  return (
    <header className="main-header">
      <Link to={`/${isAdmin ? 'admin' : ''}`} className="header-logo-link">
        <div className="header-text-container">
          <span className="header-title">
            Cake Affairs by E
          </span>
          <span className="header-subtitle">
            Where every bite matters
          </span>
        </div>
        <img
          src={logo}
          alt="Cake Affairs by E Logo"
          className="header-logo-img"
        />
      </Link>

      {isAdmin && (
        <div className="header-actions">
          <Link to="/" className="label-md btn-secondary" style={{ textDecoration: 'none', padding: '8px 16px' }}>
            View Catalogue
          </Link>
        </div>
      )}
    </header>
  );
}

