import React from 'react';

const RoomFilter = ({ filters, onFilterChange, onReset }) => {
  return (
    <div className="card ornamental-border rounded-3 p-4 mb-5 shadow-sm">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 pb-2 border-bottom" style={{ borderColor: 'rgba(197, 164, 109, 0.25)' }}>
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-sliders2 text-gold fs-5"></i>
          <h6 className="font-serif fw-bold mb-0 text-indigo" style={{ fontSize: '1.05rem' }}>
            Refine Stays & Accommodations
          </h6>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="btn btn-sm btn-link text-decoration-none text-muted p-0 d-flex align-items-center gap-1"
          style={{ fontSize: '0.85rem' }}
        >
          <i className="bi bi-arrow-counterclockwise"></i>
          <span>Reset Filters</span>
        </button>
      </div>

      <div className="row g-3">
        {/* Search by Destination / Keyword */}
        <div className="col-lg-3 col-md-6">
          <label className="form-label" htmlFor="filter-search">
            Destination or Keyword
          </label>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0 text-muted" style={{ borderColor: 'rgba(37, 37, 37, 0.16)' }}>
              <i className="bi bi-search text-gold"></i>
            </span>
            <input
              id="filter-search"
              type="text"
              name="search"
              className="form-control border-start-0 ps-0"
              placeholder="e.g. Udaipur, Maharaja, Suite..."
              value={filters.search || ''}
              onChange={onFilterChange}
            />
          </div>
        </div>

        {/* Category */}
        <div className="col-lg-3 col-md-6">
          <label className="form-label" htmlFor="filter-type">
            Suite Category
          </label>
          <select
            id="filter-type"
            name="type"
            className="form-select"
            value={filters.type || 'All'}
            onChange={onFilterChange}
          >
            <option value="All">All Categories</option>
            <option value="Single">Single &bull; Solo Sanctuary</option>
            <option value="Double">Double &bull; Courtyard Heritage</option>
            <option value="Deluxe">Deluxe &bull; Royal Palace Haveli</option>
            <option value="Suite">Suite &bull; Backwaters Retreat</option>
            <option value="Presidential">Presidential &bull; Kohinoor Penthouse</option>
          </select>
        </div>

        {/* Guests Capacity */}
        <div className="col-lg-3 col-md-6">
          <label className="form-label" htmlFor="filter-guests">
            Guest Capacity
          </label>
          <select
            id="filter-guests"
            name="guests"
            className="form-select"
            value={filters.guests || ''}
            onChange={onFilterChange}
          >
            <option value="">Any Guest Count</option>
            <option value="1">1+ Guest</option>
            <option value="2">2+ Guests</option>
            <option value="3">3+ Guests</option>
            <option value="4">4+ Guests</option>
          </select>
        </div>

        {/* Max Tariff Slider (INR) */}
        <div className="col-lg-3 col-md-6">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <label className="form-label mb-0" htmlFor="filter-maxPrice">
              Max Nightly Tariff
            </label>
            <span className="fw-semibold text-indigo small">
              {filters.maxPrice ? `₹${Number(filters.maxPrice).toLocaleString('en-IN')}` : 'Any Tariff'}
            </span>
          </div>
          <input
            id="filter-maxPrice"
            type="range"
            name="maxPrice"
            className="form-range mt-2"
            min="2000"
            max="30000"
            step="1000"
            value={filters.maxPrice || 30000}
            onChange={onFilterChange}
            style={{ accentColor: 'var(--color-gold)' }}
          />
          <div className="d-flex justify-content-between text-muted" style={{ fontSize: '0.72rem' }}>
            <span>₹2,000</span>
            <span>₹30,000</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomFilter;
