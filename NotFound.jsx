import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="py-5 d-flex align-items-center text-center" style={{ minHeight: '75vh', backgroundColor: 'var(--color-ivory)' }}>
      <div className="container" style={{ maxWidth: '540px' }}>
        <div className="card ornamental-border rounded-3 p-5 bg-white shadow-sm">
          <span className="display-2 fw-bold font-serif text-gold mb-2">404</span>
          <h2 className="fw-bold font-serif mb-2 text-indigo">Sanctuary Not Found</h2>
          <p className="text-muted small mb-4">
            The destination or suite you are searching for might have been moved or is currently undergoing private restoration.
          </p>
          <div className="d-flex justify-content-center gap-2">
            <Link to="/" className="btn btn-indigo px-4 py-2">
              Return to Sanctuary
            </Link>
            <Link to="/rooms" className="btn btn-outline-indigo px-4 py-2">
              Explore Stays
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
