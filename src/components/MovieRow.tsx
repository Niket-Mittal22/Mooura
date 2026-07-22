import React, { useState, useEffect, useRef } from 'react';
import { MovieCard } from './MovieCard';
import './MovieRow.css';

interface MovieRowProps {
  title: string;
  fetchUrl: string;
}

export const MovieRow: React.FC<MovieRowProps> = ({ title, fetchUrl }) => {
  const [movies, setMovies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(fetchUrl);
        const data = await response.json();
        // Filter out items without posters to keep the design clean
        const validMovies = data.results.filter((movie: any) => movie.poster_path);
        setMovies(validMovies);
      } catch (error) {
        console.error(`Error fetching ${title}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fetchUrl, title]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      // Scroll by the width of the container minus a small offset so one card peeks through
      const offset = direction === 'left' ? -(clientWidth - 150) : clientWidth - 150;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="movie-row-container">
        <h2 className="movie-row-title skeleton-text">Loading...</h2>
        <div className="movie-row-slider">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="row-item-wrapper skeleton-card"></div>
          ))}
        </div>
      </div>
    );
  }

  if (movies.length === 0) return null;

  return (
    <div className="movie-row-container">
      <h2 className="movie-row-title">{title}</h2>
      
      <div className="movie-row-wrapper">
        <button 
          className="row-scroll-btn left" 
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <div className="movie-row-slider" ref={scrollRef}>
          {movies.map((movie) => (
            <div key={movie.id} className="row-item-wrapper">
              <MovieCard item={movie} />
            </div>
          ))}
        </div>

        <button 
          className="row-scroll-btn right" 
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MovieRow;