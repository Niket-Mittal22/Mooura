import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { API_CONFIG } from '../lib/api';
import MovieRow from '../components/MovieRow';
import './MovieDetails.css';

interface MediaInfo {
  title?: string;
  name?: string; 
  backdrop_path: string;
  poster_path: string;
  overview: string;
  release_date?: string;
  first_air_date?: string; 
  vote_average: number;
  runtime?: number;
  episode_run_time?: number[]; 
  genres: { name: string }[];
  number_of_seasons?: number;
  number_of_episodes?: number;
}

export const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  
  // Determine if we are loading a movie or a tv show based on the URL
  const mediaType = location.pathname.includes('/tv/') ? 'tv' : 'movie';

  const [media, setMedia] = useState<MediaInfo | null>(null);
  const [cast, setCast] = useState<any[]>([]);
  const [crew, setCrew] = useState<any[]>([]);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Instantly snap to the top when navigating to a new movie/series
    window.scrollTo(0, 0);

    const fetchMediaData = async () => {
      if (!id) return;
      setIsLoading(true);
      setTrailerKey(null); // Reset trailer when switching pages

      try {
        // Fetch details, credits, and videos concurrently using our dynamic endpoints
        const [detailsRes, creditsRes, videosRes] = await Promise.all([
          fetch(API_CONFIG.endpoints.details(mediaType, id)),
          fetch(API_CONFIG.endpoints.credits(mediaType, id)),
          fetch(API_CONFIG.endpoints.videos(mediaType, id))
        ]);

        const detailsData = await detailsRes.json();
        const creditsData = await creditsRes.json();
        const videosData = await videosRes.json();

        setMedia(detailsData);
        
        // Grab top 8 cast members
        setCast((creditsData.cast || []).slice(0, 8));
        
        // Filter crew for Director, Writers, or TV Creators (Executive Producers)
        const coreCrew = (creditsData.crew || []).filter(
          (member: any) => 
            member.job === 'Director' || 
            member.department === 'Writing' ||
            member.job === 'Executive Producer'
        );
        
        // Remove duplicates by name
        const uniqueCrew = Array.from(new Set(coreCrew.map((c: any) => c.name)))
          .map(name => coreCrew.find((c: any) => c.name === name));
          
        // Limit to top 4 crew members
        setCrew(uniqueCrew.slice(0, 4));

        // Find official YouTube trailer
        const trailer = videosData.results?.find(
          (vid: any) => vid.type === 'Trailer' && vid.site === 'YouTube'
        );
        if (trailer) setTrailerKey(trailer.key);

      } catch (error) {
        console.error(`Error fetching ${mediaType} details:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMediaData();
  }, [id, mediaType]);

  if (isLoading || !media) {
    return <div className="md-loading-screen"><div className="modern-spinner"></div></div>;
  }

  // Safely grab the right properties whether it's a Movie or TV Show
  const displayTitle = media.title || media.name;
  const releaseYear = (media.release_date || media.first_air_date || '').substring(0, 4);
  const backdropUrl = API_CONFIG.images.backdrop(media.backdrop_path, 'original');
  
  // TV Shows usually have an array of runtimes, we'll grab the first one if it exists
  const runTimeVal = media.runtime || (media.episode_run_time && media.episode_run_time[0]);
  
  const formatRuntime = (minutes?: number) => {
    if (!minutes) return '';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <div className="movie-details-page">
      {/* HERO SECTION */}
      <section className="md-hero">
        <div className="md-hero-backdrop">
          <img src={backdropUrl} alt={displayTitle} />
          <div className="md-hero-gradient"></div>
        </div>

        <div className="md-hero-content">
          <h1 className="md-title">{displayTitle}</h1>
          
          <div className="md-meta-actions-row">
            <div className="md-meta">
              <span className="md-rating"><span className="star">★</span> {media.vote_average?.toFixed(1)}</span>
              <span className="md-dot">•</span>
              <span>{releaseYear}</span>
              
              {/* Conditionally show Seasons/Episodes for TV, or Runtime for Movies */}
              {mediaType === 'tv' ? (
                <>
                  {media.number_of_seasons ? (
                    <>
                      <span className="md-dot">•</span>
                      <span>{media.number_of_seasons} Season{media.number_of_seasons > 1 ? 's' : ''}</span>
                    </>
                  ) : null}
                  {media.number_of_episodes ? (
                    <>
                      <span className="md-dot">•</span>
                      <span>{media.number_of_episodes} Episode{media.number_of_episodes > 1 ? 's' : ''}</span>
                    </>
                  ) : null}
                </>
              ) : (
                media.runtime ? (
                  <>
                    <span className="md-dot">•</span>
                    <span>{formatRuntime(media.runtime)}</span>
                  </>
                ) : null
              )}

              <span className="md-dot">•</span>
              <span className="md-genres">{media.genres?.map(g => g.name).join(', ')}</span>
            </div>

            <button className="md-watchlist-btn" onClick={() => console.log('Firebase Watchlist Logic Here')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add to Watchlist
            </button>
          </div>
        </div>
      </section>

      {/* CONTENT LAYOUT: Left (Info/Cast) & Right (Trailer) */}
      <section className="md-body">
        <div className="md-main-column">
          <div className="md-section">
            <h3>Overview</h3>
            <p className="md-overview-text">{media.overview}</p>
          </div>

          <div className="md-section">
            <h3>Top Cast</h3>
            <div className="md-cast-grid">
              {cast.map((actor) => (
                <div key={actor.id} className="md-cast-card">
                  <div className="md-cast-img-wrap">
                    {actor.profile_path ? (
                      <img src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`} alt={actor.name} />
                    ) : (
                      <div className="md-cast-placeholder">{actor.name.charAt(0)}</div>
                    )}
                  </div>
                  <div className="md-cast-info">
                    <span className="md-cast-name">{actor.name}</span>
                    <span className="md-cast-role">{actor.character}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="md-section">
            <h3>Featured Crew</h3>
            <div className="md-crew-grid">
              {crew.map((member) => (
                <div key={member.id} className="md-crew-item">
                  <span className="md-crew-name">{member.name}</span>
                  <span className="md-crew-job">{member.job}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Trailer */}
        <div className="md-side-column">
          <div className="md-section md-trailer-section">
            <h3>Official Trailer</h3>
            {trailerKey ? (
              <div className="md-trailer-wrapper">
                <iframe
                  src={`https://www.youtube.com/embed/${trailerKey}?controls=1&modestbranding=1&rel=0`}
                  title="Movie Trailer"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <div className="md-no-trailer-card">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
                <p>Trailer not available</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SIMILAR ITEMS ROW */}
      {id && (
        <section className="md-similar-section">
          <MovieRow 
            title={mediaType === 'tv' ? 'Similar Series' : 'Similar Movies'} 
            fetchUrl={API_CONFIG.endpoints.recommendations(mediaType, id)} 
          />
        </section>
      )}
    </div>
  );
};

export default MovieDetails;