import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';
import BrandLogo from '../assets/logo2.png';

interface NavbarProps {
  onSearchClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearchClick }) => {
  const { user, loading: authLoading, logout } = useAuth(); // Grab global auth loading state
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Automatically close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [location.pathname]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'discover', label: 'Discover', path: '/' },
    { id: 'trending', label: 'Trending', path: '/trending' },
    { id: 'collections', label: 'Genres', path: '/genres' },
    { id: 'series', label: 'Series', path: '/series' },
    { id: 'watchlist', label: 'Watchlist', path: '/watchlist' },
  ];

  // Generate an avatar from /assets/avatar/avatar{1..6}.png based on user UID/email
  const getUserAvatar = () => {
    if (!user) return new URL(`../assets/avatar/avatar1.png`, import.meta.url).href;
    
    const str = user.uid || user.email || '1';
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const avatarIndex = (Math.abs(hash) % 6) + 1;
    return new URL(`../assets/avatar/avatar${avatarIndex}.png`, import.meta.url).href;
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
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

          {/* AUTHENTICATION STATE SWITCHER */}
          {authLoading ? (
            /* 1. LOADING SKELETON: Keeps layout size locked while Firebase initializes */
            <div className="nav-auth-skeleton"></div>
          ) : user ? (
            /* 2. AUTHENTICATED: Profile Avatar & Dropdown */
            <div className="nav-profile-wrapper" ref={profileRef}>
              <button 
                className="nav-profile-btn" 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                aria-label="Profile Menu"
              >
                <img 
                  src={getUserAvatar()} 
                  alt="Profile Avatar" 
                  className="nav-profile-img"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/avatar/avatar1.png';
                  }}
                />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="profile-dropdown-menu">
                  <div className="profile-dropdown-header">
                    <span className="user-name">{user.displayName || 'User'}</span>
                    <span className="user-email">{user.email}</span>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={() => navigate('/watchlist')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                    My Watchlist
                  </button>
                  <button className="dropdown-item logout-btn" onClick={handleLogout}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* 3. UNAUTHENTICATED: Sign In Button */
            <button 
              className="nav-signin-btn" 
              onClick={() => navigate('/login')}
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