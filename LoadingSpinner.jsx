import React from 'react';

const LoadingSpinner = ({ text = 'Preparing your royal sanctuary...', fullPage = false }) => {
  const content = (
    <div className="d-flex flex-column align-items-center justify-content-center p-4">
      <div
        className="spinner-border"
        style={{ color: 'var(--color-gold)', width: '2.8rem', height: '2.8rem', borderWidth: '0.22rem' }}
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      {text && <p className="mt-3 text-muted fw-semibold small font-serif">{text}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: '60vh' }}
      >
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
