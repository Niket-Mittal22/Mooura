import React from 'react';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import { API_CONFIG } from '../lib/api';
import './Home.css';

function Home() {
  return (
    <main className="home-container">
      <Hero />
      
      {/* 
        Negative margin pulls the rows up to overlap the 
        bottom black gradient of the Hero section 
      */}
      <div className="home-content-rows">
        <MovieRow 
          title="Trending This Week" 
          fetchUrl={API_CONFIG.endpoints.trendingMoviesWeek} 
        />
        
        <MovieRow 
          title="Animated Masterpieces" 
          fetchUrl={API_CONFIG.endpoints.discoverByGenre(16)} 
        />
        
        <MovieRow 
          title="Critically Acclaimed" 
          fetchUrl={API_CONFIG.endpoints.topRatedMovies} 
        />
        
        <MovieRow 
          title="Sci-Fi & Fantasy Masterpieces" 
          fetchUrl={API_CONFIG.endpoints.discoverByGenre(878)} 
        />
        
        <MovieRow 
          title="Horror Thrillers" 
          fetchUrl={API_CONFIG.endpoints.discoverByGenre(27)} 
        />

        <MovieRow 
          title="Trending Series" 
          fetchUrl={API_CONFIG.endpoints.trendingSeries} 
        />
      </div>
    </main>
  );
}

export default Home;