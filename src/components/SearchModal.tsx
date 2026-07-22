import React, { useState, useEffect, useRef } from 'react';
import { API_CONFIG } from '../lib/api';
import { MovieCard } from './MovieCard';
import './SearchModal.css';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(API_CONFIG.endpoints.searchMulti(query));
        const data = await res.json();
        const filtered = (data.results || []).filter(
          (item: any) => item.media_type === 'movie' || item.media_type === 'tv'
        );
        setResults(filtered);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="search-backdrop" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-input-wrapper">
          <svg className="search-lens-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="search-input-field"
            placeholder="Search movies, series, cinematic universes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button className="clear-query-btn" onClick={() => setQuery('')}>
              Clear
            </button>
          )}
          <button className="close-modal-btn" onClick={onClose}>
            <span className="close-text-mobile">Close</span>
            <span className="close-text-desktop">ESC</span>
          </button>
        </div>

        <div className="search-results-container">
          {isLoading && (
            <div className="search-status-message">
              <div className="modern-spinner"></div>
              <span>Searching the cinematic database...</span>
            </div>
          )}

          {!isLoading && query && results.length === 0 && (
            <div className="search-status-message">
              <p>No results found for &ldquo;{query}&rdquo;</p>
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div className="search-results-grid">
              {results.map((item) => (
                <MovieCard 
                  key={item.id} 
                  item={item} 
                  onSelect={onClose}
                />
              ))}
            </div>
          )}

          {!query && (
            <div className="search-suggestions-prompt">
              <span>Try searching for &ldquo;Dune&rdquo;, &ldquo;Interstellar&rdquo;, or &ldquo;Succession&rdquo;</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;