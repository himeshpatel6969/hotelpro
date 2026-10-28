import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import * as roomService from '../services/roomService';
import RoomCard from '../components/rooms/RoomCard';
import RoomFilter from '../components/rooms/RoomFilter';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertMessage from '../components/common/AlertMessage';

const Rooms = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters state initialized from URL search params
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    type: searchParams.get('type') || 'All',
    guests: searchParams.get('guests') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
  });

  const fetchRooms = async (currentFilters) => {
    try {
      setLoading(true);
      setError('');

      const params = {};
      if (currentFilters.search) params.search = currentFilters.search;
      if (currentFilters.type && currentFilters.type !== 'All') params.type = currentFilters.type;
      if (currentFilters.guests) params.guests = currentFilters.guests;
      if (currentFilters.maxPrice) params.maxPrice = currentFilters.maxPrice;
      if (currentFilters.checkIn && currentFilters.checkOut) {
        params.checkIn = currentFilters.checkIn;
        params.checkOut = currentFilters.checkOut;
      }

      const res = await roomService.getRooms(params);
      if (res.success) {
        setRooms(res.rooms || []);
      }
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError(err.response?.data?.message || 'Failed to load accommodations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms(filters);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...filters, [name]: value };
    setFilters(updated);

    // Update URL params
    const newParams = new URLSearchParams();
    Object.keys(updated).forEach((key) => {
      if (updated[key] && updated[key] !== 'All') {
        newParams.set(key, updated[key]);
      }
    });
    setSearchParams(newParams);

    // Refetch
    fetchRooms(updated);
  };

  const handleReset = () => {
    const cleared = {
      search: '',
      type: 'All',
      guests: '',
      maxPrice: '',
      checkIn: '',
      checkOut: '',
    };
    setFilters(cleared);
    setSearchParams(new URLSearchParams());
    fetchRooms(cleared);
  };

  const hasActiveFilters = Boolean(
    filters.search ||
    (filters.type && filters.type !== 'All') ||
    filters.guests ||
    filters.maxPrice ||
    filters.checkIn
  );

  return (
    <div className="py-5" style={{ minHeight: '80vh' }}>
      <div className="container">
        {/* Header Section */}
        <div className="text-center mb-5">
          <span className="hero-tag">
            Artisanal Indian Sanctuaries
          </span>
          <h1 className="display-5 fw-bold font-serif mt-1 text-indigo">
            Palaces, Havelis & Boutique Stays
          </h1>
          <p className="text-muted mx-auto" style={{ maxWidth: '680px' }}>
            Every sanctuary is curated for cultural depth, architectural elegance, and modern tranquility — from Mewar lake courtyards to tranquil Kerala backwaters.
          </p>
          <div className="jali-divider">
            <span className="jali-symbol">✦</span>
          </div>
        </div>

        {/* Filter Box */}
        <RoomFilter
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />

        {/* Date Filter Alert if set from homepage search */}
        {filters.checkIn && filters.checkOut && (
          <div className="alert alert-light border p-3 rounded-3 mb-4 d-flex justify-content-between align-items-center shadow-sm">
            <div className="d-flex align-items-center gap-2 small">
              <i className="bi bi-calendar-range text-gold fs-5"></i>
              <span>
                Filtering available stays for <strong>{filters.checkIn}</strong> to <strong>{filters.checkOut}</strong>
              </span>
            </div>
            <button
              onClick={() => {
                const updated = { ...filters, checkIn: '', checkOut: '' };
                setFilters(updated);
                fetchRooms(updated);
              }}
              className="btn btn-sm btn-outline-secondary py-1 px-2"
            >
              Clear Dates
            </button>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-4">
            <AlertMessage
              variant="danger"
              message={error}
              onClose={() => setError('')}
            />
            <div className="text-center mt-3">
              <button onClick={() => fetchRooms(filters)} className="btn btn-outline-indigo btn-sm">
                <i className="bi bi-arrow-repeat me-1"></i> Retry Loading
              </button>
            </div>
          </div>
        )}

        {/* Stays Count Bar */}
        {!loading && !error && (
          <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom" style={{ borderColor: 'rgba(197, 164, 109, 0.2)' }}>
            <span className="small text-muted">
              Showing <strong className="text-indigo">{rooms.length}</strong> available {rooms.length === 1 ? 'stay' : 'stays'}
              {hasActiveFilters && ' matching your criteria'}
            </span>
            {hasActiveFilters && (
              <button
                onClick={handleReset}
                className="btn btn-link btn-sm text-decoration-none text-maroon p-0"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="py-5">
            <LoadingSpinner text="Presenting our royal accommodations..." />
          </div>
        ) : rooms.length === 0 ? (
          /* Empty State */
          <div className="text-center py-5 my-4 bg-white rounded-3 p-5 shadow-sm ornamental-border">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{ width: '64px', height: '64px', background: 'var(--color-gold-light)', color: 'var(--color-maroon)' }}
            >
              <i className="bi bi-search fs-3"></i>
            </div>
            <h4 className="font-serif fw-bold text-indigo mb-2">No Stays Match Your Search</h4>
            <p className="text-muted mx-auto mb-4" style={{ maxWidth: '440px' }}>
              We could not find accommodations matching your exact dates or filters. Try adjusting your guest count or resetting the tariff range.
            </p>
            <button
              onClick={handleReset}
              className="btn btn-indigo px-4 py-2"
            >
              <i className="bi bi-arrow-counterclockwise me-1"></i> Reset All Filters
            </button>
          </div>
        ) : (
          /* Stays Grid */
          <div className="row g-4">
            {rooms.map((room) => (
              <div key={room._id} className="col-lg-4 col-md-6">
                <RoomCard room={room} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rooms;
