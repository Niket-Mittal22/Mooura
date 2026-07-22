import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_CONFIG } from '../lib/api';
import './MovieCard.css';

interface MovieCardProps {
  item: {
    id: number;
    title?: string;
    name?: string;
    poster_path?: string;
    media_type?: string;
    release_date?: string;
    first_air_date?: string;
    vote_average?: number;
  };
  onSelect?: () => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ item, onSelect }) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const title = item.title || item.name || 'Untitled';
  const releaseYear = (item.release_date || item.first_air_date || '').substring(0, 4);
  const posterUrl = item.poster_path ? API_CONFIG.images.poster(item.poster_path, 'w300') : null;
  const mediaTypeLabel = item.media_type === 'tv' ? 'Series' : 'Movie';
  const isTV = item.media_type === 'tv' || item.first_air_date;
  const mediaType = isTV ? 'tv' : 'movie'; // Add this line

  const handleClick = () => {
    navigate(`/${mediaType}/${item.id}`);
    if (onSelect) {
      onSelect();
    }
  };

  return (
    <div className="search-result-card" onClick={handleClick}>
      <div className="search-poster-wrap">
        {posterUrl ? (
          <>
            {!imageLoaded && <div className="card-skeleton" />}
            <img 
              src={posterUrl} 
              alt={title} 
              loading="lazy" 
              onLoad={() => setImageLoaded(true)}
              style={{ opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.3s ease' }}
            />
          </>
        ) : (
          <div className="card-no-image-fallback">
            <span className="fallback-title">{title}</span>
          </div>
        )}

        {item.media_type && (
          <span className="media-badge">{mediaTypeLabel}</span>
        )}
      </div>
      <div className="search-card-info">
        <h4>{title}</h4>
        <div className="search-card-meta">
          {releaseYear && <span>{releaseYear}</span>}
          {item.vote_average !== undefined && item.vote_average > 0 && (
            <span className="rating-tag">
              ★ {item.vote_average.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;