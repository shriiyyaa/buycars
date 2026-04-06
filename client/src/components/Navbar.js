import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function CarIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.5 11L7.5 6C7.8 5.1 8.65 4.5 9.6 4.5H14.4C15.35 4.5 16.2 5.1 16.5 6L18.5 11"
        stroke="#C0392B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="3" y="11" width="18" height="7" rx="2" fill="#C0392B"/>
      <circle cx="7.5" cy="18" r="2" fill="white"/>
      <circle cx="16.5" cy="18" r="2" fill="white"/>
      <rect x="3" y="11" width="18" height="2.5" rx="1" fill="#E74C3C"/>
    </svg>
  );
}

function Navbar({ theme, toggleTheme }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const name = localStorage.getItem('name');

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">

        {/* LEFT: Logo — clicking redirects to dashboard if logged in, else login */}
        <Link to={token ? '/manage-cars' : '/login'} className="logo">
          <CarIcon />
          <span className="logo-wordmark">Buy<span>Cars</span></span>
        </Link>

        {/* CENTER: My Listings */}
        <div className="nav-center">
          {token && (
            <Link to="/manage-cars" className="nav-center-link">My Listings</Link>
          )}
        </div>

        {/* RIGHT */}
        <div className="nav-right">
          {token ? (
            <>
              <Link to="/add-car" className="nav-add-btn">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Add Car
              </Link>
              <span className="nav-avatar">{name?.charAt(0).toUpperCase()}</span>
              <button className="glass-btn" onClick={logout}>Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="glass-btn">Sign In</Link>
              <Link to="/signup" className="glass-btn-primary">Register as Dealer</Link>
            </>
          )}
          <button className="theme-btn" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? '🌞' : '🌙'}
          </button>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;