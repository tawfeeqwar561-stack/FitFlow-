import React from 'react';
import './Loader.css';

// ✅ ADDED: variant prop for different use cases
const Loader = ({ variant = 'page', message = '' }) => {

  // Full page loader (default) — used when pageLoading = true
  if (variant === 'page') {
    return (
      <div className="loader-page">
        <div className="loader-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        {message && (
          <p className="loader-message">{message}</p>
        )}
      </div>
    );
  }

  // Inline spinner — used inside buttons/cards
  if (variant === 'inline') {
    return <span className="loader-inline" />;
  }

  // Overlay — used over existing content
  if (variant === 'overlay') {
    return (
      <div className="loader-overlay">
        <div className="loader-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  // Default fallback
  return (
    <div className="loader-container">
      <div className="loader"></div>
    </div>
  );
};

export default Loader;