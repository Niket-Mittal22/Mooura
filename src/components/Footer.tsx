import React from 'react';
import { useNavigate } from 'react-router-dom';
import BrandLogo from '../assets/logo2.png';
import './Footer.css';

export const Footer: React.FC = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="modern-footer">
      {/* Top Divider with subtle gradient glow */}
      <div className="footer-divider"></div>

      <div className="footer-content">
        {/* Brand Section */}
        <div className="footer-brand">
          <img 
            src={BrandLogo} 
            alt="Platform Logo" 
            className="footer-logo" 
            onClick={() => navigate('/')} 
          />
          <p className="footer-tagline">
            Your gateway to the cinematic universe. Discover, track, and experience the best in entertainment.
          </p>
        </div>

        {/* Links Grid */}
        <div className="footer-links-grid">
          <div className="footer-link-group">
            <h4>Explore</h4>
            <button onClick={() => navigate('/')}>Discover</button>
            <button onClick={() => navigate('/trending')}>Trending</button>
            <button onClick={() => navigate('/collections')}>Collections</button>
            <button onClick={() => navigate('/series')}>Series</button>
          </div>

          <div className="footer-link-group">
            <h4>Legal</h4>
            <button>Terms of Service</button>
            <button>Privacy Policy</button>
            <button>Cookie Preferences</button>
          </div>

          <div className="footer-link-group">
            <h4>Connect</h4>
            <div className="social-icons">
              {/* X / Twitter */}
              <button aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.005 4.15H5.059z"/>
                </svg>
              </button>
              {/* Instagram */}
              <button aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </button>
              {/* GitHub / Discord / etc */}
              <button aria-label="Discord">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="footer-bottom">
        <p>&copy; {currentYear} Cinematic Platform. All rights reserved.</p>
        <p className="footer-disclaimer">
          Data provided by TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.
        </p>
      </div>
    </footer>
  );
};

export default Footer;