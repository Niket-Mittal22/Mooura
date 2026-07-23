import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SearchModal from './components/SearchModal';
import Footer from './components/Footer';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import CategoryPage from './pages/CategoryPage';
import { API_CONFIG } from './lib/api';
import GenresPage from './pages/GenresPage';
import LoginPage from './pages/Login';
import WatchlistPage from './pages/Watchlist';
import { AuthProvider } from './context/AuthContext';
import { useScrollToTop } from './hooks/ScrollToTop';

// Inner component wrapped INSIDE <BrowserRouter> so React Router hooks work properly
function AppContent() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Safely called inside <BrowserRouter> context
  useScrollToTop();

  return (
    <>
      <Navbar
        isLoggedIn={false}
        onSearchClick={() => setIsSearchOpen(true)}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/tv/:id" element={<MovieDetails />} />

        {/* WIDE BANNER PAGES */}
        <Route
          path="/trending"
          element={
            <CategoryPage
              title="Trending Now"
              description="The most talked-about movies this week."
              fetchUrl={API_CONFIG.endpoints.trendingMoviesWeek}
            />
          }
        />

        <Route
          path="/series"
          element={
            <CategoryPage
              title="Web Series"
              description="Binge-worthy shows making waves."
              fetchUrl={API_CONFIG.endpoints.topSeriesAllTime}
            />
          }
        />

        <Route path="/genres" element={<GenresPage />} />
        <Route path="/watchlist" element={<WatchlistPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>

      <Footer />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;