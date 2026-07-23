import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

export const useScrollToTop = () => {
  const { pathname } = useLocation();
  const navType = useNavigationType(); // Returns 'PUSH', 'REPLACE', or 'POP'

  useEffect(() => {
    // 'PUSH' or 'REPLACE' means navigating forward -> scroll smoothly to top
    // 'POP' means browser Back/Forward buttons -> preserve scroll position
    if (navType !== 'POP') {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
  }, [pathname, navType]);
};