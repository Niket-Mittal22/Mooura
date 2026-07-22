// src/lib/api.ts

const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const API_CONFIG = {
  key: API_KEY,
  baseUrl: BASE_URL,
  images: {
    poster: (path: string, size: 'w92' | 'w185' | 'w300' | 'w500' | 'original' = 'w500') => 
      path ? `${IMAGE_BASE_URL}/${size}${path}` : 'https://via.placeholder.com/300x450?text=No+Image',
    backdrop: (path: string, size: 'w300' | 'w780' | 'w1280' | 'original' = 'original') => 
      path ? `${IMAGE_BASE_URL}/${size}${path}` : '',
  },
  endpoints: {
    // --- SEARCH & DISCOVER ---
    searchMovie: (query: string) => `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`,
    searchMulti: (query: string) => `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`,
    discoverMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}`,
    
    // --- GENRES DICTIONARY ---
    /*
      TMDB Movie Genre IDs:
      Action: 28          Horror: 27
      Adventure: 12       Music: 10402
      Animation: 16       Mystery: 9648
      Comedy: 35          Romance: 10749
      Crime: 80           Science Fiction: 878
      Documentary: 99     TV Movie: 10770
      Drama: 18           Thriller: 53
      Family: 10751       War: 10752
      Fantasy: 14         Western: 37
      History: 36
    */
    discoverByGenre: (genreId: number | string) => `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`,

    // --- HOME PAGE ROWS ---
    trendingMoviesDay: `${BASE_URL}/trending/movie/day?api_key=${API_KEY}`,
    trendingMoviesWeek: `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`,
    topRatedMovies: `${BASE_URL}/movie/top_rated?api_key=${API_KEY}`,
    upcomingMovies: `${BASE_URL}/movie/upcoming?api_key=${API_KEY}`,
    
    // --- TV SERIES ENDPOINTS ---
    topSeriesAllTime: `${BASE_URL}/discover/tv?api_key=${API_KEY}&sort_by=vote_count.desc`,
    trendingSeries: `${BASE_URL}/trending/tv/week?api_key=${API_KEY}`,

    // --- DYNAMIC DETAILS ENDPOINTS (For Universal MovieDetails.tsx) ---
    details: (type: string, id: number | string) => `${BASE_URL}/${type}/${id}?api_key=${API_KEY}`,
    credits: (type: string, id: number | string) => `${BASE_URL}/${type}/${id}/credits?api_key=${API_KEY}`,
    videos: (type: string, id: number | string) => `${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}`,
    similar: (type: string, id: number | string) => `${BASE_URL}/${type}/${id}/similar?api_key=${API_KEY}`,
    recommendations: (type: string, id: number | string) => `${BASE_URL}/${type}/${id}/recommendations?api_key=${API_KEY}`,
  },
};