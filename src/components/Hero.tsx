import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_CONFIG } from '../lib/api';
import TrailerModal from './TrailerModal';
import './Hero.css';

// Type declaration for the YouTube API we will inject
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface MovieData {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string;
  vote_average: number;
  runtime?: number;
}

export const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieData | null>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  
  // Track exact video state to hide/show the image cover
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const playerRef = useRef<any>(null);

  // 1. Fetch Movie Data
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const trendingRes = await fetch(API_CONFIG.endpoints.trendingMoviesDay);
        const trendingData = await trendingRes.json();
        const topMovie = trendingData.results[0];

        if (!topMovie) return;

        // UPDATED: Using the new dynamic endpoints for 'movie'
        const detailsRes = await fetch(API_CONFIG.endpoints.details('movie', topMovie.id));
        const detailsData = await detailsRes.json();

        const videosRes = await fetch(API_CONFIG.endpoints.videos('movie', topMovie.id));
        const videosData = await videosRes.json();
        
        const trailer = videosData.results.find(
          (vid: any) => vid.type === 'Trailer' && vid.site === 'YouTube'
        );

        setMovie({
          id: detailsData.id,
          title: detailsData.title,
          overview: detailsData.overview,
          backdrop_path: detailsData.backdrop_path,
          vote_average: detailsData.vote_average,
          runtime: detailsData.runtime,
        });

        if (trailer) setTrailerKey(trailer.key);

      } catch (error) {
        console.error("Error fetching hero data:", error);
      }
    };

    fetchHeroData();
  }, []);

  // 2. Initialize YouTube API & Sync Playback State
  useEffect(() => {
    if (!trailerKey) return;

    const loadYouTubeAPI = () => {
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = () => {
          initializePlayer();
        };
      } else {
        initializePlayer();
      }
    };

    const initializePlayer = () => {
      playerRef.current = new window.YT.Player('hero-youtube-player', {
        videoId: trailerKey,
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          mute: 1,
          loop: 1,
          playlist: trailerKey, // Required for loop to work
          playsinline: 1,
          disablekb: 1,
        },
        events: {
          onReady: (event: any) => {
            event.target.mute();
            event.target.playVideo();
          },
          onStateChange: (event: any) => {
            // State 1 is PLAYING. If it's playing, hide the image cover.
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsVideoPlaying(true);
            } else {
              // If it buffers, pauses (tab switch), or ends, instantly show the image cover.
              setIsVideoPlaying(false);
            }
          },
        },
      });
    };

    loadYouTubeAPI();

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [trailerKey]);

  if (!movie) return <div className="hero-skeleton"></div>;

  const backdropUrl = API_CONFIG.images.backdrop(movie.backdrop_path, 'original');
  
  const formatRuntime = (minutes?: number) => {
    if (!minutes) return '';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  return (
    <>
      <section className="hero-container">
        {/* BACKGROUND MEDIA LAYER */}
        <div className="hero-media-wrapper">
          {/* 1. The Video (Always running in background) */}
          {trailerKey && <div id="hero-youtube-player" className="hero-video-embed" />}
          
          {/* 2. The Image Cover (Fades in/out based on exact video state to hide glitches) */}
          <img 
            src={backdropUrl} 
            alt={movie.title} 
            className={`hero-backdrop-cover ${isVideoPlaying ? 'hidden' : 'visible'}`}
          />
        </div>

        <div className="hero-gradient-overlay"></div>

        {/* CONTENT LAYER */}
        <div className="hero-content">
          <h1 className="hero-title">{movie.title}</h1>
          
          <div className="hero-meta">
            <span className="hero-rating">
              <span className="star">★</span> {movie.vote_average.toFixed(1)}
            </span>
            {movie.runtime && (
              <>
                <span className="hero-meta-dot">•</span>
                <span className="hero-runtime">{formatRuntime(movie.runtime)}</span>
              </>
            )}
          </div>

          <p className="hero-overview">{movie.overview}</p>

          <div className="hero-actions">
            <button 
              className="hero-btn-primary" 
              onClick={() => setIsModalOpen(true)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch Trailer
            </button>
            
            <button 
              className="hero-btn-secondary" 
              onClick={() => navigate(`/movie/${movie.id}`)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              More Info
            </button>
          </div>
        </div>
      </section>

      {/* Renders safely on top without a page reload */}
      <TrailerModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        videoKey={trailerKey} 
      />
    </>
  );
};

export default Hero;