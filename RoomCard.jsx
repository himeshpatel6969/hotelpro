import React from 'react';
import { Link } from 'react-router-dom';
import StarRating from '../common/StarRating';

export const getRoomDestination = (room) => {
  if (!room) return 'Rajasthan, India';
  const title = (room.title || '').toLowerCase();
  const desc = (room.description || '').toLowerCase();
  if (title.includes('malabar') || title.includes('kerala') || desc.includes('kerala') || desc.includes('backwater')) {
    return 'Kumarakom, Kerala';
  }
  if (title.includes('kohinoor') || title.includes('jaipur') || desc.includes('jaipur')) {
    return 'Jaipur, Rajasthan';
  }
  if (title.includes('maharaja') || title.includes('lake') || desc.includes('pichola') || desc.includes('mewar')) {
    return 'Udaipur, Rajasthan';
  }
  if (title.includes('haveli') || title.includes('courtyard') || desc.includes('marwar') || title.includes('jodhpur')) {
    return 'Jodhpur, Rajasthan';
  }
  if (title.includes('vedic') || title.includes('varanasi') || desc.includes('ghat')) {
    return 'Varanasi, Uttar Pradesh';
  }
  return 'Udaipur, Rajasthan';
};

const RoomCard = ({ room }) => {
  if (!room) return null;

  const mainImage =
    room.images && room.images.length > 0
      ? room.images[0]
      : 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80';

  const destination = getRoomDestination(room);
  const formattedPrice = Number(room.pricePerNight || 0).toLocaleString('en-IN');

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Available':
        return 'badge-status-available';
      case 'Booked':
        return 'badge-status-booked';
      case 'Maintenance':
        return 'badge-status-maintenance';
      default:
        return 'badge-status-available';
    }
  };

  return (
    <div className="editorial-stay-card">
      {/* Photograph Container */}
      <div className="editorial-img-wrap">
        <img
          src={mainImage}
          alt={room.title}
          loading="lazy"
        />
        <div className="stay-location-badge">
          <i className="bi bi-geo-alt me-1 text-gold"></i>
          {destination}
        </div>
        <div className="stay-category-badge">
          {room.type}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 d-flex flex-column justify-content-between flex-grow-1">
        <div>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="small text-muted" style={{ fontSize: '0.8rem' }}>
              Suite #{room.roomNumber} &bull; {room.bedType || 'King Bed'}
            </span>
            <StarRating rating={room.rating || 4.8} />
          </div>

          <h5 className="font-serif fw-bold mb-2" style={{ fontSize: '1.2rem', lineHeight: '1.35' }}>
            <Link
              to={`/rooms/${room._id}`}
              className="text-indigo text-decoration-none"
            >
              {room.title}
            </Link>
          </h5>

          <p className="small text-muted text-truncate-2 mb-3" style={{ minHeight: '38px', lineHeight: '1.5' }}>
            {room.description}
          </p>

          {/* Quick Specifications */}
          <div className="d-flex flex-wrap align-items-center gap-3 py-2 border-top border-bottom mb-3 text-muted" style={{ fontSize: '0.8rem' }}>
            <div className="d-flex align-items-center gap-1">
              <i className="bi bi-people text-gold"></i>
              <span>Up to {room.capacity} Guests</span>
            </div>
            <div className="d-flex align-items-center gap-1">
              <i className="bi bi-bounding-box text-gold"></i>
              <span>{room.roomSize || 45} m²</span>
            </div>
            <div className="ms-auto">
              <span className={`badge-status ${getStatusBadgeClass(room.status)}`}>
                {room.status}
              </span>
            </div>
          </div>

          {/* Amenities Preview */}
          <div className="d-flex flex-wrap gap-1 mb-4">
            {room.amenities &&
              room.amenities.slice(0, 3).map((amenity, idx) => (
                <span
                  key={idx}
                  className="badge bg-ivory text-charcoal border fw-normal"
                  style={{ fontSize: '0.72rem', borderColor: 'rgba(197, 164, 109, 0.3)' }}
                >
                  {amenity}
                </span>
              ))}
            {room.amenities && room.amenities.length > 3 && (
              <span
                className="badge bg-ivory text-muted border fw-normal"
                style={{ fontSize: '0.72rem', borderColor: 'rgba(197, 164, 109, 0.3)' }}
              >
                +{room.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Price & CTA */}
        <div className="d-flex align-items-center justify-content-between pt-3 border-top" style={{ borderColor: 'rgba(37, 37, 37, 0.08)' }}>
          <div>
            <span className="d-block text-muted" style={{ fontSize: '0.75rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Nightly Tariff
            </span>
            <div className="d-flex align-baseline gap-1">
              <span className="font-serif fw-bold text-indigo fs-5">
                ₹{formattedPrice}
              </span>
              <span className="small text-muted" style={{ fontSize: '0.75rem' }}>+ taxes</span>
            </div>
          </div>

          <Link
            to={`/rooms/${room._id}`}
            className="btn btn-outline-indigo btn-sm px-3 py-2 fw-semibold"
          >
            <span>View Stay</span>
            <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
