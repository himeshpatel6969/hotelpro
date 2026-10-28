import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import * as roomService from '../services/roomService';
import * as bookingService from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import { getRoomDestination } from '../components/rooms/RoomCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertMessage from '../components/common/AlertMessage';
import StarRating from '../components/common/StarRating';

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [room, setRoom] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingError, setBookingError] = useState('');

  // Booking Form State
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const [bookingForm, setBookingForm] = useState({
    checkIn: todayStr,
    checkOut: tomorrowStr,
    guests: '1',
    specialRequests: '',
  });

  const [nights, setNights] = useState(2);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        const res = await roomService.getRoomById(id);
        if (res.success && res.room) {
          setRoom(res.room);
          setActiveImage(res.room.images?.[0] || '');
          setTotalPrice(2 * res.room.pricePerNight);
        }
      } catch (err) {
        console.error('Failed to load room:', err);
        setError(err.response?.data?.message || 'The requested accommodation could not be found');
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  // Recalculate nights and total price whenever dates change
  useEffect(() => {
    if (bookingForm.checkIn && bookingForm.checkOut && room) {
      const start = new Date(bookingForm.checkIn);
      const end = new Date(bookingForm.checkOut);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 0) {
        setNights(diffDays);
        setTotalPrice(diffDays * room.pricePerNight);
        setBookingError('');
      } else {
        setNights(0);
        setTotalPrice(0);
        setBookingError('Check-out date must be strictly after check-in date');
      }
    }
  }, [bookingForm.checkIn, bookingForm.checkOut, room]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingError('');

    if (!isAuthenticated) {
      navigate(`/login?redirect=/rooms/${id}`);
      return;
    }

    if (nights < 1) {
      setBookingError('Please select valid check-in and check-out dates (minimum 1 night)');
      return;
    }

    try {
      setBookingLoading(true);
      const res = await bookingService.createBooking({
        roomId: room._id,
        checkIn: bookingForm.checkIn,
        checkOut: bookingForm.checkOut,
        guests: Number(bookingForm.guests),
        specialRequests: bookingForm.specialRequests,
      });

      if (res.success && res.booking) {
        navigate(`/booking/confirmation/${res.booking._id}`, {
          state: { booking: res.booking },
        });
      }
    } catch (err) {
      console.error('Booking failed:', err);
      setBookingError(
        err.response?.data?.message || 'Could not complete reservation. Please select alternative dates.'
      );
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving royal accommodation details..." fullPage />;
  }

  if (error || !room) {
    return (
      <div className="container py-5 text-center">
        <div className="card ornamental-border p-5 shadow-sm rounded-3 mx-auto" style={{ maxWidth: '540px' }}>
          <i className="bi bi-exclamation-octagon fs-1 text-terracotta mb-3"></i>
          <h3 className="fw-bold font-serif text-indigo">Accommodation Not Found</h3>
          <p className="text-muted">{error || 'The requested room or suite could not be located.'}</p>
          <div className="mt-3">
            <Link to="/rooms" className="btn btn-indigo">
              Back to Accommodations
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const destination = getRoomDestination(room);
  const gstRate = room.pricePerNight > 7500 ? 0.18 : 0.12;
  const gstAmount = Math.round(totalPrice * gstRate);
  const grandTotal = totalPrice + gstAmount;

  return (
    <div className="py-5" style={{ minHeight: '80vh' }}>
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb small">
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none text-muted">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/rooms" className="text-decoration-none text-muted">Rooms & Suites</Link>
            </li>
            <li className="breadcrumb-item active text-indigo fw-semibold" aria-current="page">
              {room.title}
            </li>
          </ol>
        </nav>

        {/* Room Header Info */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-3 pb-3 border-bottom" style={{ borderColor: 'rgba(197, 164, 109, 0.25)' }}>
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge-status badge-status-available">
                {room.type}
              </span>
              <span className="badge bg-ivory text-indigo border" style={{ borderColor: 'rgba(197, 164, 109, 0.4)' }}>
                Suite #{room.roomNumber}
              </span>
              <StarRating rating={room.rating || 4.9} />
            </div>
            <h1 className="display-6 fw-bold font-serif mb-1 text-indigo">{room.title}</h1>
            <p className="text-muted mb-0 small">
              <i className="bi bi-geo-alt text-gold me-1"></i>
              <span>HotelPro Sanctuary &bull; {destination}</span>
            </p>
          </div>

          <div className="text-md-end">
            <span className="text-muted small text-uppercase" style={{ letterSpacing: '0.5px' }}>
              Nightly Rate
            </span>
            <div className="d-flex align-items-baseline gap-1">
              <span className="display-6 fw-bold font-serif text-indigo">
                ₹{Number(room.pricePerNight).toLocaleString('en-IN')}
              </span>
              <span className="small text-muted">+ taxes</span>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="row g-3 mb-5">
          <div className="col-lg-8">
            <div className="rounded-3 overflow-hidden shadow-sm" style={{ height: '460px', backgroundColor: 'var(--color-indigo)' }}>
              <img
                src={activeImage || room.images[0]}
                alt={room.title}
                className="w-100 h-100 object-fit-cover"
              />
            </div>
          </div>

          <div className="col-lg-4">
            <div className="d-flex flex-lg-column gap-3 h-100 overflow-auto">
              {room.images &&
                room.images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`rounded-3 overflow-hidden border cursor-pointer ${
                      activeImage === img ? 'border-2 shadow-sm' : 'opacity-75'
                    }`}
                    style={{
                      height: '142px',
                      cursor: 'pointer',
                      borderColor: activeImage === img ? 'var(--color-gold)' : 'rgba(37, 37, 37, 0.12)',
                    }}
                    onClick={() => setActiveImage(img)}
                  >
                    <img
                      src={img}
                      alt={`${room.title} view ${idx + 1}`}
                      className="w-100 h-100 object-fit-cover"
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Details & Booking Split */}
        <div className="row g-5">
          {/* Left Column: Room Overview & Amenities */}
          <div className="col-lg-7">
            {/* Quick Specs */}
            <div className="row g-3 mb-4">
              <div className="col-sm-4">
                <div className="p-3 bg-white rounded-3 border text-center shadow-sm">
                  <i className="bi bi-people fs-4 text-gold mb-1 d-block"></i>
                  <span className="small text-muted d-block">Guest Capacity</span>
                  <strong className="text-indigo">Up to {room.capacity} Guests</strong>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="p-3 bg-white rounded-3 border text-center shadow-sm">
                  <i className="bi bi-moon-stars fs-4 text-gold mb-1 d-block"></i>
                  <span className="small text-muted d-block">Bed Type</span>
                  <strong className="text-indigo">{room.bedType || 'Royal King Bed'}</strong>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="p-3 bg-white rounded-3 border text-center shadow-sm">
                  <i className="bi bi-bounding-box fs-4 text-gold mb-1 d-block"></i>
                  <span className="small text-muted d-block">Living Space</span>
                  <strong className="text-indigo">{room.roomSize || 50} m²</strong>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card ornamental-border rounded-3 p-4 mb-4 shadow-sm">
              <h4 className="fw-bold font-serif mb-2 text-indigo">Architectural Heritage & Living</h4>
              <div className="gold-rule"></div>
              <p className="text-charcoal-muted leading-relaxed mb-0" style={{ lineHeight: '1.8' }}>
                {room.description}
              </p>
            </div>

            {/* Room Amenities */}
            <div className="card ornamental-border rounded-3 p-4 mb-4 shadow-sm">
              <h4 className="fw-bold font-serif mb-2 text-indigo">Sanctuary Amenities & Care</h4>
              <div className="gold-rule"></div>
              <div className="row g-3">
                {room.amenities &&
                  room.amenities.map((amenity, idx) => (
                    <div key={idx} className="col-sm-6">
                      <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-check2 text-gold fs-5"></i>
                        <span className="text-charcoal small fw-medium">{amenity}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Hotel Policies (Indian Context) */}
            <div className="card ornamental-border rounded-3 p-4 shadow-sm">
              <h4 className="fw-bold font-serif mb-2 text-indigo">Stay Policies & Guidelines</h4>
              <div className="gold-rule"></div>
              <ul className="list-unstyled d-flex flex-column gap-3 text-muted small mb-0">
                <li className="d-flex gap-2">
                  <i className="bi bi-clock-history text-gold"></i>
                  <span><strong>Check-in:</strong> 2:00 PM &bull; <strong>Check-out:</strong> 11:00 AM (Early check-in subject to room availability).</span>
                </li>
                <li className="d-flex gap-2">
                  <i className="bi bi-person-badge text-gold"></i>
                  <span><strong>Govt. ID Requirement:</strong> All guests must present an official Govt. of India approved photo ID (Aadhaar, Passport, or Driving License) at the concierge desk.</span>
                </li>
                <li className="d-flex gap-2">
                  <i className="bi bi-shield-check text-gold"></i>
                  <span><strong>Transparent Reservation:</strong> Guaranteed room booking. Payment can be settled seamlessly upon arrival via UPI, Credit Card, or Cash.</span>
                </li>
                <li className="d-flex gap-2">
                  <i className="bi bi-arrow-repeat text-gold"></i>
                  <span><strong>Flexible Cancellation:</strong> Cancel anytime prior to check-in directly through your Guest Portal with zero cancellation penalties.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Interactive Booking Card */}
          <div className="col-lg-5">
            <div className="card ornamental-border rounded-3 p-4 shadow-md sticky-top" style={{ top: '100px' }}>
              <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom" style={{ borderColor: 'rgba(197, 164, 109, 0.25)' }}>
                <div>
                  <span className="text-muted small text-uppercase" style={{ letterSpacing: '0.5px' }}>
                    Reserve Your Stay
                  </span>
                  <h4 className="fw-bold font-serif mb-0 text-indigo">
                    ₹{Number(room.pricePerNight).toLocaleString('en-IN')}{' '}
                    <small className="text-muted fs-6 fw-normal">/ night</small>
                  </h4>
                </div>
                <span className={`badge-status ${room.status === 'Available' ? 'badge-status-available' : 'badge-status-maintenance'}`}>
                  {room.status}
                </span>
              </div>

              {bookingError && (
                <div className="mb-3">
                  <AlertMessage
                    variant="danger"
                    message={bookingError}
                    onClose={() => setBookingError('')}
                  />
                </div>
              )}

              <form onSubmit={handleBookingSubmit}>
                {/* Check In Date */}
                <div className="mb-3">
                  <label className="form-label" htmlFor="book-checkIn">
                    Check-in Date
                  </label>
                  <input
                    id="book-checkIn"
                    type="date"
                    required
                    min={todayStr}
                    className="form-control"
                    value={bookingForm.checkIn}
                    onChange={(e) => setBookingForm({ ...bookingForm, checkIn: e.target.value })}
                  />
                </div>

                {/* Check Out Date */}
                <div className="mb-3">
                  <label className="form-label" htmlFor="book-checkOut">
                    Check-out Date
                  </label>
                  <input
                    id="book-checkOut"
                    type="date"
                    required
                    min={bookingForm.checkIn || todayStr}
                    className="form-control"
                    value={bookingForm.checkOut}
                    onChange={(e) => setBookingForm({ ...bookingForm, checkOut: e.target.value })}
                  />
                </div>

                {/* Guests */}
                <div className="mb-3">
                  <label className="form-label" htmlFor="book-guests">
                    Guests (Max {room.capacity})
                  </label>
                  <select
                    id="book-guests"
                    className="form-select"
                    value={bookingForm.guests}
                    onChange={(e) => setBookingForm({ ...bookingForm, guests: e.target.value })}
                  >
                    {Array.from({ length: room.capacity }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        {num} Guest{num > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Special Requests */}
                <div className="mb-4">
                  <label className="form-label" htmlFor="book-requests">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    id="book-requests"
                    rows="2"
                    className="form-control"
                    placeholder="e.g. Traditional Ayurvedic welcome, quiet courtyard wing, dietary preferences..."
                    value={bookingForm.specialRequests}
                    onChange={(e) => setBookingForm({ ...bookingForm, specialRequests: e.target.value })}
                  ></textarea>
                </div>

                {/* Night count & Price breakdown */}
                {nights > 0 && (
                  <div className="bg-ivory p-3 rounded-2 mb-4 border" style={{ borderColor: 'rgba(197, 164, 109, 0.3)' }}>
                    <div className="d-flex justify-content-between small text-muted mb-2">
                      <span>₹{Number(room.pricePerNight).toLocaleString('en-IN')} &times; {nights} {nights === 1 ? 'night' : 'nights'}</span>
                      <span>₹{Number(totalPrice).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="d-flex justify-content-between small text-muted mb-2">
                      <span>Applicable Hospitality GST ({(gstRate * 100).toFixed(0)}%)</span>
                      <span>₹{Number(gstAmount).toLocaleString('en-IN')}</span>
                    </div>
                    <hr className="my-2" style={{ borderColor: 'rgba(197, 164, 109, 0.3)' }} />
                    <div className="d-flex justify-content-between fw-bold text-indigo fs-6">
                      <span>Total Estimated Tariff</span>
                      <span className="font-serif">₹{Number(grandTotal).toLocaleString('en-IN')}</span>
                    </div>
                    <small className="text-muted d-block mt-2" style={{ fontSize: '0.72rem' }}>
                      * The server verifies current rates and dates upon booking confirmation. Pay at check-in via UPI or Card.
                    </small>
                  </div>
                )}

                {/* Clear Book This Stay CTA */}
                <button
                  type="submit"
                  disabled={bookingLoading || nights < 1 || room.status === 'Maintenance'}
                  className="btn btn-gold btn-lg w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                >
                  {bookingLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span>Reserving Your Stay...</span>
                    </>
                  ) : !isAuthenticated ? (
                    <>
                      <i className="bi bi-box-arrow-in-right"></i>
                      <span>Sign In & Book This Stay</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check2-circle"></i>
                      <span>Book This Stay</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
