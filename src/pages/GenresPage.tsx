import React, { useState, useEffect } from 'react';
import { API_CONFIG } from '../lib/api';
import { WideMovieCard } from '../components/WideMovieCard';
import './GenresPage.css';

const GENRES = [
  { id: 28, name: 'Action' },
  { id: 878, name: 'Sci-Fi' },
  { id: 35, name: 'Comedy' },
  { id: 27, name: 'Horror' },
  { id: 18, name: 'Drama' },
  { id: 10749, name: 'Romance' },
  { id: 53, name: 'Thriller' },
  { id: 16, name: 'Animation' },
  { id: 12, name: 'Adventure' },
  { id: 80, name: 'Crime' },
];

export const GenresPage: React.FC = () => {
  const [activeGenre, setActiveGenre] = useState<number>(28);
  const [movies, setMovies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // New state for mobile dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchGenreMovies = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(API_CONFIG.endpoints.discoverByGenre(activeGenre));
        const data = await response.json();
        setMovies(data.results || []);
      } catch (error) {
        console.error("Error fetching genre movies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGenreMovies();
  }, [activeGenre]);

  // Find the name of the currently active genre for the mobile button
  const activeGenreName = GENRES.find(g => g.id === activeGenre)?.name || 'Select Genre';

  return (
    <div className="genres-page-container">
      <div className="genres-header">
        <h1 className="genres-title">Explore by Genre</h1>
        <p className="genres-description">Dive into your favorite cinematic worlds.</p>
        
        {/* DESKTOP: Horizontal Chip Selector */}
        <div className="genres-chip-container">
          {GENRES.map((genre) => (
            <button
              key={genre.id}
              className={`genre-chip ${activeGenre === genre.id ? 'active' : ''}`}
              onClick={() => setActiveGenre(genre.id)}
            >
              {genre.name}
            </button>
          ))}
        </div>

        {/* MOBILE: Custom Dropdown Menu */}
        <div className="genres-mobile-dropdown">
          <button 
            className="mobile-dropdown-btn"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="dropdown-btn-content">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
              <span>{activeGenreName}</span>
            </div>
            <svg 
              className={`dropdown-chevron ${isDropdownOpen ? 'open' : ''}`} 
              width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="mobile-dropdown-menu">
              {GENRES.map((genre) => (
                <button
                  key={genre.id}
                  className={`dropdown-item ${activeGenre === genre.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveGenre(genre.id);
                    setIsDropdownOpen(false); // Close menu on selection
                  }}
                >
                  {genre.name}
                  {activeGenre === genre.id && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="genres-loading"><div className="modern-spinner"></div></div>
      ) : (
        <div className="genres-grid">
          {movies.map((movie) => (
            <WideMovieCard key={movie.id} item={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default GenresPage;