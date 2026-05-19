import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  const styles = {
    nav: {
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      padding: '0 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '64px',
      boxShadow: '0 2px 20px rgba(0,0,0,0.3)',
    },
    logo: {
      color: '#e94560',
      fontSize: '1.4rem',
      fontWeight: '700',
      textDecoration: 'none',
      letterSpacing: '0.5px',
    },
    logoSpan: {
      color: '#fff',
    },
    links: {
      display: 'flex',
      gap: '1rem',
    },
    link: {
      color: '#a0aec0',
      textDecoration: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      fontSize: '0.9rem',
      fontWeight: '500',
      transition: 'all 0.2s',
    },
    activeLink: {
      color: '#fff',
      background: 'rgba(233, 69, 96, 0.2)',
      textDecoration: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      fontSize: '0.9rem',
      fontWeight: '500',
    },
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>
        AI<span style={styles.logoSpan}>CRM</span> HCP
      </Link>
      <div style={styles.links}>
        <Link
          to="/"
          style={location.pathname === '/' ? styles.activeLink : styles.link}
        >
          📝 Log Interaction
        </Link>
        <Link
          to="/interactions"
          style={location.pathname === '/interactions' ? styles.activeLink : styles.link}
        >
          📋 All Interactions
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;