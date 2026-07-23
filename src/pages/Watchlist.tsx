import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { WideMovieCard } from '../components/WideMovieCard';
import './Watchlist.css';

export const Watchlist: React.FC = () => {
  const { user, loading: authLoading } = useAuth(); // Grab global auth loading state
  const navigate = useNavigate();
  const [watchlistItems, setWatchlistItems] = useState<any[]>([]);
  const [watchlistLoading, setWatchlistLoading] = useState(true);

  // Fetch Firestore Watchlist items when user is logged in
  useEffect(() => {
    // If auth is still checking, do nothing yet
    if (authLoading) return;

    // If user is not logged in, stop loading state so gate can render safely
    if (!user) {
      setWatchlistLoading(false);
      return;
    }

    setWatchlistLoading(true);
    const q = query(collection(db, 'users', user.uid, 'watchlist'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setWatchlistItems(items);
      setWatchlistLoading(false);
    }, (error) => {
      console.error("Error fetching watchlist:", error);
      setWatchlistLoading(false);
    });

    return () => unsubscribe();
  }, [user, authLoading]);

  // 1. UNIFIED LOADING STATE: Show modern spinner until Auth AND Firestore are resolved
  if (authLoading || (user && watchlistLoading)) {
    return (
      <div className="watchlist-loading-screen">
        <div className="modern-spinner"></div>
      </div>
    );
  }

  // 2. UNAUTHENTICATED GATE: Renders cleanly ONLY after Auth confirms no user is logged in
  if (!user) {
    return (
      <div className="watchlist-gate-container">
        <div className="watchlist-gate-card">
          <div className="gate-icon-wrap">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <h2>Your Personal Watchlist</h2>
          <p>Sign in to unlock your watchlist, save your favorite movies and web series, and access them anytime.</p>
          
          <div className="gate-actions">
            <button className="gate-btn primary" onClick={() => navigate('/login')}>
              Log In
            </button>
            <button className="gate-btn secondary" onClick={() => navigate('/login')}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. AUTHENTICATED WATCHLIST VIEW
  return (
    <div className="watchlist-page-container">
      <div className="watchlist-header">
        <h1 className="watchlist-title">Your Watchlist</h1>
        <p className="watchlist-description">Titles you've saved to watch later.</p>
      </div>

      {watchlistItems.length === 0 ? (
        <div className="watchlist-empty">
          <p>Your watchlist is empty. Explore movies and series and click "Add to Watchlist" to save them here!</p>
          <button className="browse-btn" onClick={() => navigate('/')}>Explore Now</button>
        </div>
      ) : (
        <div className="watchlist-grid">
          {watchlistItems.map((item) => (
            <WideMovieCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;