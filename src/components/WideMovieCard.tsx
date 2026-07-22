import React from 'react';
import { useNavigate } from 'react-router-dom';
import { API_CONFIG } from '../lib/api';
import './WideMovieCard.css';

interface WideMovieCardProps {
  item: {
    id: number;
    title?: string;
    name?: string;
    poster_path?: string;
    media_type?: string;
    release_date?: string;
    first_air_date?: string;
    vote_average?: number;
    overview?: string;
  };
}

export const WideMovieCard: React.FC<WideMovieCardProps> = ({ item }) => {
  const navigate = useNavigate();
  
  const title = item.title || item.name || 'Untitled';
  const releaseYear = (item.release_date || item.first_air_date || '').substring(0, 4);
  const posterUrl = item.poster_path ? API_CONFIG.images.poster(item.poster_path, 'w500') : null;
  const isTV = item.media_type === 'tv' || item.first_air_date;
  const mediaType = isTV ? 'tv' : 'movie';
  const mediaTypeLabel = isTV ? 'Series' : 'Movie';

  const handleCardClick = () => {
    navigate(`/${mediaType}/${item.id}`);
  };

  const handleTrailerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/${mediaType}/${item.id}`);
  };

  return (
    <div className="wide-movie-card" onClick={handleCardClick}>
      <div className="wide-card-poster">
        {posterUrl ? (
          <img src={posterUrl} alt={title} loading="lazy" />
        ) : (
          <div className="wide-card-no-image">{title}</div>
        )}
        <span className="wide-media-badge">{mediaTypeLabel}</span>
      </div>

      <div className="wide-card-content">
        <div className="wide-card-header">
          <h3 className="wide-card-title">{title}</h3>
          
          <div className="wide-card-meta">
            {item.vote_average !== undefined && item.vote_average > 0 && (
              <span className="wide-rating">★ {item.vote_average.toFixed(1)}</span>
            )}
            {releaseYear && (
              <>
                <span className="meta-dot">•</span>
                <span className="wide-year">{releaseYear}</span>
              </>
            )}
          </div>
        </div>

        <p className="wide-card-overview">
          {item.overview || "No overview available for this title."}
        </p>

        <div className="wide-card-footer">
          <button className="wide-card-btn primary" onClick={handleTrailerClick}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            Watch Trailer
          </button>
          
          <button className="wide-card-btn secondary">
            More Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default WideMovieCard;