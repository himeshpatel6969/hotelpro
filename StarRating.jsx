import React from 'react';

const StarRating = ({ rating = 5, totalStars = 5, showScore = true }) => {
  const stars = [];
  const rounded = Math.round(rating * 2) / 2;

  for (let i = 1; i <= totalStars; i++) {
    if (i <= rounded) {
      stars.push(
        <i
          key={i}
          className="bi bi-star-fill me-1"
          style={{ color: 'var(--color-gold)', fontSize: '0.85rem' }}
        ></i>
      );
    } else if (i - 0.5 === rounded) {
      stars.push(
        <i
          key={i}
          className="bi bi-star-half me-1"
          style={{ color: 'var(--color-gold)', fontSize: '0.85rem' }}
        ></i>
      );
    } else {
      stars.push(
        <i
          key={i}
          className="bi bi-star me-1"
          style={{ color: 'var(--color-gold-muted)', fontSize: '0.85rem' }}
        ></i>
      );
    }
  }

  return (
    <div className="d-inline-flex align-items-center">
      <div className="d-flex">{stars}</div>
      {showScore && (
        <span className="ms-1 fw-bold text-indigo" style={{ fontSize: '0.82rem' }}>
          {Number(rating).toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
