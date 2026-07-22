import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';
import BrandLogo from '../assets/logo2.png';

interface NavbarProps {
  isLoggedIn?: boolean;
  onSearchClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isLoggedIn = false,
  onSearchClick,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Automatically close mobile menu when navigating to a new page
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { id: 'discover', label: 'Discover', path: '/' },
    { id: 'trending', label: 'Trending', path: '/trending' },
    { id: 'collections', label: 'Genres', path: '/genres' },
    { id: 'series', label: 'Series', path: '/series' },
  ];

  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate('/profile');
    } else {
      navigate('/signin');
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="modern-navbar-container">
      <nav className="modern-navbar">
        {/* LEFT: Logo Image */}
        <div className="nav-left">
          <button onClick={() => navigate('/')} className="nav-logo-btn" aria-label="Home">
            <img src={BrandLogo} alt="Platform Logo" className="nav-logo" />
          </button>
        </div>

        {/* CENTER: Navigation Links */}
        <div className={`nav-center ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <ul className="nav-links">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.id}>
                  <button
                    className={`nav-link-item ${isActive ? 'active' : ''}`}
                    onClick={() => navigate(item.path)}
                  >
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* RIGHT: Search, Profile & Mobile Menu Toggle */}
        <div className="nav-right">
          <button 
            className="nav-icon-btn search-btn" 
            onClick={() => {
              if (onSearchClick) onSearchClick();
              setIsMobileMenuOpen(false);
            }}
            aria-label="Search"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span className="search-shortcut">Search</span>
          </button>

          {isLoggedIn ? (
            <button 
              className="nav-profile-btn" 
              onClick={handleProfileClick}
              aria-label="Profile"
            >
              <img src="/assets/profile.png" alt="Profile" className="nav-profile-img" />
            </button>
          ) : (
            <button 
              className="nav-signin-btn" 
              onClick={handleProfileClick}
            >
              Sign In
            </button>
          )}

          {/* Mobile Hamburger Button */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {isMobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;