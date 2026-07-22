import React, { useEffect } from 'react';
import './TrailerModal.css';

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoKey: string | null;
}

export const TrailerModal: React.FC<TrailerModalProps> = ({ isOpen, onClose, videoKey }) => {
  // Handle ESC key and prevent body scrolling when open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !videoKey) return null;

  return (
    <div className="trailer-modal-backdrop" onClick={onClose}>
      <div className="trailer-modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="trailer-modal-close" onClick={onClose} aria-label="Close trailer">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div className="trailer-video-wrapper">
          <iframe
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&controls=1&modestbranding=1&rel=0`}
            title="Movie Trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;