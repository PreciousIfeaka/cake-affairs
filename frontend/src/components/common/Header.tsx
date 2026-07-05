import { Link } from 'react-router-dom';
import logo from '../../logo.png';

interface HeaderProps {
  isAdmin?: boolean;
}

export default function Header({ isAdmin = false }: HeaderProps) {
  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      height: 96, backgroundColor: 'var(--color-background)',
      boxShadow: '0 1px 4px rgba(54,31,26,0.07)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '0 var(--spacing-margin-mobile)',
    }}>
      <Link to={`/${isAdmin ? 'admin' : ''}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 14 }}>
        <img
          src={logo}
          alt="Cake Affairs by E Logo"
          style={{ height: 68, width: 'auto', objectFit: 'contain' }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{
            color: 'var(--color-primary)',
            fontFamily: "'Libre Caslon Text', serif",
            fontSize: 32,
            lineHeight: 1.1,
            letterSpacing: '-0.3px'
          }}>
            Cake Affairs by E
          </span>
          <span style={{
            fontFamily: "'Brittany', 'Herr Von Muellerhoff', 'Satisfy', cursive",
            fontSize: 22,
            fontWeight: 600,
            color: 'var(--color-secondary)',
            lineHeight: 1,
            marginTop: 4
          }}>
            Where every bite matters
          </span>
        </div>
      </Link>

      {isAdmin && (
        <div style={{ position: 'absolute', right: 'var(--spacing-margin-mobile)', display: 'flex', alignItems: 'center' }}>
          <Link to="/" className="label-md btn-secondary" style={{ textDecoration: 'none', padding: '8px 16px' }}>View Catalogue</Link>
        </div>
      )}
    </header>
  );
}

