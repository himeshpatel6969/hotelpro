import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import * as bookingService from '../services/bookingService';
import { getRoomDestination } from '../components/rooms/RoomCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const BookingConfirmation = () => {
  const { id } = useParams();
  const location = useLocation();

  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!booking);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!booking && id) {
      const fetchBooking = async () => {
        try {
          setLoading(true);
          const res = await bookingService.getBookingById(id);
          if (res.success && res.booking) {
            setBooking(res.booking);
          }
        } catch (err) {
          console.error('Failed to load booking:', err);
          setError(err.response?.data?.message || 'Could not load booking details');
        } finally {
          setLoading(false);
        }
      };

      fetchBooking();
    }
  }, [id, booking]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving reservation voucher..." fullPage />;
  }

  if (error || !booking) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: '70vh' }}>
        <div className="card ornamental-border p-5 shadow-sm rounded-3 mx-auto" style={{ maxWidth: '540px' }}>
          <i className="bi bi-exclamation-triangle fs-1 text-gold mb-3"></i>
          <h3 className="fw-bold font-serif text-indigo">Reservation Not Found</h3>
          <p className="text-muted">{error || 'Unable to retrieve this reservation voucher.'}</p>
          <div className="mt-3">
            <Link to="/dashboard" className="btn btn-indigo">
              Go to My Reservations
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const room = booking.room || {};
  const user = booking.user || {};
  const destination = getRoomDestination(room);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formattedTotal = Number(booking.totalPrice || 0).toLocaleString('en-IN');
  const formattedRate = Number(booking.pricePerNight || 0).toLocaleString('en-IN');
  const refCode = `HP-${booking._id?.toString().slice(-8).toUpperCase()}`;

  return (
    <div className="py-5" style={{ minHeight: '80vh', backgroundColor: 'var(--color-ivory)' }}>
      <div className="container" style={{ maxWidth: '820px' }}>
        {/* Success Header Card */}
        <div className="card ornamental-border rounded-3 p-4 text-center bg-white mb-4 shadow-sm">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
            style={{ width: '64px', height: '64px', background: 'var(--color-ivory)', color: 'var(--color-gold)' }}
          >
            <i className="bi bi-check2 fs-1"></i>
          </div>
          <span className="hero-tag mb-1 d-inline-block">
            शुभ यात्रा &bull; Reservation Confirmed
          </span>
          <h2 className="display-6 fw-bold font-serif text-indigo mt-1">
            We Await Your Arrival
          </h2>
          <p className="text-muted mb-3 mx-auto small" style={{ maxWidth: '560px' }}>
            Your sanctuary reservation has been confirmed in the server database. A traditional welcome and dedicated hospitality service await you.
          </p>
          <div className="d-inline-flex align-items-center justify-content-center gap-2 p-2 px-3 bg-ivory rounded-2 mx-auto border" style={{ borderColor: 'rgba(197, 164, 109, 0.3)' }}>
            <span className="text-muted small">Booking Reference Code:</span>
            <strong className="text-indigo font-monospace fs-6">
              {refCode}
            </strong>
          </div>
        </div>

        {/* Printable Reservation Receipt Card */}
        <div className="card ornamental-border rounded-3 p-4 p-md-5 bg-white mb-4 shadow-md" id="printable-receipt">
          {/* Receipt Top Bar */}
          <div className="d-flex justify-content-between align-items-center pb-4 border-bottom mb-4" style={{ borderColor: 'rgba(197, 164, 109, 0.25)' }}>
            <div>
              <div className="hotelpro-wordmark">
                HOTEL<span className="accent">PRO</span>
              </div>
              <p className="text-muted small mb-0">Sanctuary Stays & Boutique Heritage Accommodations &bull; {destination}</p>
              <small className="text-muted" style={{ fontSize: '0.72rem' }}>Govt Tax ID: 08AAACH9876K1Z9 &bull; State Code: 08 (Rajasthan)</small>
            </div>
            <div className="text-end">
              <span className="badge-status badge-status-confirmed py-1 px-3">
                Status: {booking.bookingStatus}
              </span>
              <small className="d-block text-muted mt-1" style={{ fontSize: '0.75rem' }}>
                Confirmed: {formatDate(booking.createdAt)}
              </small>
            </div>
          </div>

          {/* Reserved Room Summary */}
          <div className="row g-4 align-items-center mb-4 pb-4 border-bottom" style={{ borderColor: 'rgba(37, 37, 37, 0.08)' }}>
            <div className="col-md-4">
              <div className="rounded-2 overflow-hidden shadow-sm" style={{ height: '140px', backgroundColor: 'var(--color-indigo)' }}>
                <img
                  src={
                    room.images?.[0] ||
                    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'
                  }
                  alt={room.title}
                  className="w-100 h-100 object-fit-cover"
                />
              </div>
            </div>
            <div className="col-md-8">
              <div className="d-flex gap-2 align-items-center mb-1">
                <span className="badge-status badge-status-available" style={{ fontSize: '0.72rem' }}>{room.type}</span>
                <span className="badge bg-ivory text-indigo border" style={{ fontSize: '0.72rem', borderColor: 'rgba(197, 164, 109, 0.3)' }}>Suite #{room.roomNumber}</span>
              </div>
              <h4 className="fw-bold font-serif text-indigo mb-2">{room.title}</h4>
              <p className="text-muted small mb-0">
                <i className="bi bi-moon-stars me-1 text-gold"></i>
                {room.bedType || 'Royal King Bed'} &bull; Up to {booking.guests} Guest(s)
              </p>
            </div>
          </div>

          {/* Booking Details Grid */}
          <div className="row g-4 mb-4 pb-4 border-bottom" style={{ borderColor: 'rgba(37, 37, 37, 0.08)' }}>
            <div className="col-sm-6 col-md-3">
              <small className="text-muted d-block fw-semibold" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Check-in</small>
              <strong className="fs-6 text-indigo">{formatDate(booking.checkIn)}</strong>
              <small className="d-block text-muted" style={{ fontSize: '0.75rem' }}>From 2:00 PM IST</small>
            </div>
            <div className="col-sm-6 col-md-3">
              <small className="text-muted d-block fw-semibold" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Check-out</small>
              <strong className="fs-6 text-indigo">{formatDate(booking.checkOut)}</strong>
              <small className="d-block text-muted" style={{ fontSize: '0.75rem' }}>Until 11:00 AM IST</small>
            </div>
            <div className="col-sm-6 col-md-3">
              <small className="text-muted d-block fw-semibold" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Duration</small>
              <strong className="fs-6 text-indigo">
                {booking.nights} {booking.nights > 1 ? 'Nights' : 'Night'}
              </strong>
              <small className="d-block text-muted" style={{ fontSize: '0.75rem' }}>{booking.guests} Guest(s)</small>
            </div>
            <div className="col-sm-6 col-md-3">
              <small className="text-muted d-block fw-semibold" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Payment Mode</small>
              <span className="badge-status badge-status-pending mt-1">
                {booking.paymentStatus}
              </span>
              <small className="d-block text-muted mt-1" style={{ fontSize: '0.75rem' }}>Payable at Concierge</small>
            </div>
          </div>

          {/* Guest Information */}
          <div className="mb-4 pb-4 border-bottom" style={{ borderColor: 'rgba(37, 37, 37, 0.08)' }}>
            <h6 className="fw-bold text-uppercase small text-indigo mb-3" style={{ letterSpacing: '1px' }}>
              Primary Guest & Contact
            </h6>
            <div className="row g-3">
              <div className="col-md-4">
                <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Guest Name</small>
                <strong className="text-charcoal">{user.name || 'Valued Guest'}</strong>
              </div>
              <div className="col-md-4">
                <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Email Address</small>
                <strong className="text-charcoal">{user.email || 'N/A'}</strong>
              </div>
              <div className="col-md-4">
                <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Contact Phone</small>
                <strong className="text-charcoal">{user.phone || 'On Record'}</strong>
              </div>
            </div>
            {booking.specialRequests && (
              <div className="mt-3 p-3 bg-ivory rounded-2 small border" style={{ borderColor: 'rgba(197, 164, 109, 0.25)' }}>
                <strong>Special Requests:</strong> {booking.specialRequests}
              </div>
            )}
          </div>

          {/* Pricing Summary in INR */}
          <div>
            <h6 className="fw-bold text-uppercase small text-indigo mb-3" style={{ letterSpacing: '1px' }}>
              Tariff & Invoice Estimate
            </h6>
            <div className="d-flex justify-content-between mb-2 small text-muted">
              <span>Suite Tariff (₹{formattedRate} &times; {booking.nights} nights)</span>
              <span>₹{formattedTotal}</span>
            </div>
            <div className="d-flex justify-content-between mb-2 small text-muted">
              <span>Hospitality GST</span>
              <span>Included</span>
            </div>
            <div className="d-flex justify-content-between fw-bold fs-5 text-indigo pt-2 border-top" style={{ borderColor: 'rgba(37, 37, 37, 0.1)' }}>
              <span>Total Estimated Amount</span>
              <span className="font-serif">₹{formattedTotal}</span>
            </div>
            <small className="text-muted d-block mt-2" style={{ fontSize: '0.75rem' }}>
              Payment is settled upon arrival via UPI (Google Pay, PhonePe, Paytm), Debit/Credit Cards, or Cash. Please carry an official Govt. photo ID.
            </small>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="d-flex flex-wrap justify-content-between gap-3">
          <Link to="/" className="btn btn-outline-indigo px-4 py-2">
            <i className="bi bi-house me-1"></i> Return to Home
          </Link>
          <div className="d-flex gap-2">
            <button onClick={handlePrint} className="btn btn-outline-indigo px-4 py-2">
              <i className="bi bi-printer me-1"></i> Print Voucher
            </button>
            <Link to="/dashboard" className="btn btn-indigo px-4 py-2 shadow-sm">
              <i className="bi bi-calendar2-check me-1"></i> View My Reservations
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
