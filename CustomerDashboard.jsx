import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as bookingService from '../services/bookingService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertMessage from '../components/common/AlertMessage';

const CustomerDashboard = () => {
  const { user, updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'profile'
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Upcoming' | 'Past' | 'Cancelled'
  const [feedback, setFeedback] = useState({ variant: '', message: '' });

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingService.getMyBookings();
      if (res.success) {
        setBookings(res.bookings || []);
      }
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setFeedback({
        variant: 'danger',
        message: err.response?.data?.message || 'Could not load your reservations history',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you wish to cancel this reservation? This cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(true);
      const res = await bookingService.cancelBooking(bookingId);
      if (res.success) {
        setFeedback({
          variant: 'success',
          message: 'Your reservation was successfully cancelled and the suite released.',
        });
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? res.booking : b))
        );
      }
    } catch (err) {
      console.error('Cancellation failed:', err);
      setFeedback({
        variant: 'danger',
        message: err.response?.data?.message || 'Unable to cancel this reservation.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ variant: '', message: '' });

    if (profileForm.newPassword) {
      if (profileForm.newPassword !== profileForm.confirmPassword) {
        setFeedback({
          variant: 'danger',
          message: 'New password and confirmation do not match',
        });
        return;
      }
      if (!profileForm.currentPassword) {
        setFeedback({
          variant: 'danger',
          message: 'Please provide your current password to set a new password',
        });
        return;
      }
    }

    try {
      setActionLoading(true);
      const payload = {
        name: profileForm.name,
        phone: profileForm.phone,
      };
      if (profileForm.newPassword) {
        payload.currentPassword = profileForm.currentPassword;
        payload.newPassword = profileForm.newPassword;
      }

      const res = await updateUser(payload);
      if (res.success) {
        setFeedback({
          variant: 'success',
          message: 'Guest profile updated successfully!',
        });
        setProfileForm({
          ...profileForm,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (err) {
      console.error('Profile update failed:', err);
      setFeedback({
        variant: 'danger',
        message: err.response?.data?.message || 'Failed to update profile.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === 'All') return true;
    if (statusFilter === 'Cancelled') return b.bookingStatus === 'Cancelled';
    if (statusFilter === 'Upcoming') {
      return b.bookingStatus !== 'Cancelled' && new Date(b.checkOut) >= today;
    }
    if (statusFilter === 'Past') {
      return b.bookingStatus !== 'Cancelled' && new Date(b.checkOut) < today;
    }
    return true;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isEligibleForCancellation = (booking) => {
    if (booking.bookingStatus === 'Cancelled') return false;
    return new Date(booking.checkIn) >= today;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return <span className="badge-status badge-status-confirmed"><i className="bi bi-check-circle"></i> Confirmed</span>;
      case 'Pending':
        return <span className="badge-status badge-status-pending"><i className="bi bi-hourglass-split"></i> Pending</span>;
      case 'Cancelled':
        return <span className="badge-status badge-status-cancelled"><i className="bi bi-x-circle"></i> Cancelled</span>;
      case 'Completed':
        return <span className="badge-status badge-status-completed"><i className="bi bi-check2-all"></i> Completed</span>;
      default:
        return <span className="badge-status badge-status-confirmed">{status}</span>;
    }
  };

  return (
    <div className="py-5" style={{ minHeight: '80vh', backgroundColor: 'var(--color-ivory)' }}>
      <div className="container">
        {/* Guest Portal Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <span className="hero-tag mb-1 d-inline-block">Guest Portal</span>
            <h1 className="display-6 fw-bold font-serif text-indigo mb-1">
              Namaste, {user?.name}
            </h1>
            <p className="text-muted small mb-0">
              Review your upcoming and past sanctuary reservations, access booking references, or update your personal preferences.
            </p>
          </div>
          <Link to="/rooms" className="btn btn-indigo shadow-sm btn-sm">
            <i className="bi bi-compass me-1"></i> Explore New Stays
          </Link>
        </div>

        {/* Global Feedback Alert */}
        {feedback.message && (
          <div className="mb-4">
            <AlertMessage
              variant={feedback.variant}
              message={feedback.message}
              onClose={() => setFeedback({ variant: '', message: '' })}
            />
          </div>
        )}

        {/* Guest Dashboard Container */}
        <div className="card ornamental-border rounded-3 overflow-hidden mb-4 shadow-sm">
          {/* Tab Navigation */}
          <div className="card-header bg-white border-bottom p-0" style={{ borderColor: 'rgba(197, 164, 109, 0.25)' }}>
            <ul className="nav nav-tabs border-0 px-3 pt-2">
              <li className="nav-item">
                <button
                  className={`nav-link border-0 py-3 px-4 fw-semibold ${
                    activeTab === 'bookings'
                      ? 'active text-indigo border-bottom border-indigo border-2'
                      : 'text-muted'
                  }`}
                  style={{
                    backgroundColor: activeTab === 'bookings' ? 'transparent' : 'transparent',
                    borderBottomColor: activeTab === 'bookings' ? 'var(--color-gold) !important' : 'transparent',
                  }}
                  onClick={() => setActiveTab('bookings')}
                >
                  <i className="bi bi-journal-bookmark me-2 text-gold"></i>
                  <span>My Reservations ({bookings.length})</span>
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link border-0 py-3 px-4 fw-semibold ${
                    activeTab === 'profile'
                      ? 'active text-indigo border-bottom border-indigo border-2'
                      : 'text-muted'
                  }`}
                  onClick={() => setActiveTab('profile')}
                >
                  <i className="bi bi-person-gear me-2 text-gold"></i>
                  <span>Profile & Security</span>
                </button>
              </li>
            </ul>
          </div>

          <div className="card-body p-4 bg-white">
            {/* BOOKINGS TAB */}
            {activeTab === 'bookings' && (
              <div>
                {/* Status Filter Sub-bar */}
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2 pb-3 border-bottom" style={{ borderColor: 'rgba(37, 37, 37, 0.08)' }}>
                  <div className="btn-group btn-group-sm" role="group">
                    {['All', 'Upcoming', 'Past', 'Cancelled'].map((status) => (
                      <button
                        key={status}
                        type="button"
                        className={`btn ${
                          statusFilter === status
                            ? 'btn-indigo'
                            : 'btn-outline-indigo'
                        }`}
                        onClick={() => setStatusFilter(status)}
                      >
                        {status}
                      </button>
                    ))}
                  </div>

                  <span className="text-muted small">
                    Showing <strong>{filteredBookings.length}</strong> {statusFilter.toLowerCase()} reservation{filteredBookings.length === 1 ? '' : 's'}
                  </span>
                </div>

                {loading ? (
                  <div className="py-5">
                    <LoadingSpinner text="Retrieving your reservation records..." />
                  </div>
                ) : filteredBookings.length === 0 ? (
                  <div className="text-center py-5 my-3 p-4 bg-ivory rounded-3 border" style={{ borderColor: 'rgba(197, 164, 109, 0.25)' }}>
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                      style={{ width: '56px', height: '56px', background: '#FFFFFF', color: 'var(--color-gold)' }}
                    >
                      <i className="bi bi-calendar-x fs-3"></i>
                    </div>
                    <h5 className="font-serif fw-bold text-indigo mb-2">No Reservations Found</h5>
                    <p className="text-muted small mb-4 mx-auto" style={{ maxWidth: '420px' }}>
                      {statusFilter === 'All'
                        ? "You do not have any room reservations with HotelPro yet."
                        : `No ${statusFilter.toLowerCase()} reservations matching this filter.`}
                    </p>
                    <Link to="/rooms" className="btn btn-indigo btn-sm px-4 py-2">
                      <i className="bi bi-compass me-1"></i> Browse Sanctuaries
                    </Link>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-luxury align-middle">
                      <thead>
                        <tr>
                          <th>Accommodation</th>
                          <th>Reference Code</th>
                          <th>Stay Dates</th>
                          <th>Guests</th>
                          <th>Tariff</th>
                          <th>Status</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBookings.map((b) => {
                          const room = b.room || {};
                          const refCode = `HP-${b._id?.toString().slice(-6).toUpperCase()}`;
                          return (
                            <tr key={b._id}>
                              <td>
                                <div className="d-flex align-items-center gap-3">
                                  <img
                                    src={
                                      room.images?.[0] ||
                                      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'
                                    }
                                    alt={room.title}
                                    className="rounded-2 object-fit-cover shadow-sm"
                                    style={{ width: '56px', height: '46px', background: 'var(--color-indigo)' }}
                                  />
                                  <div>
                                    <div className="fw-bold text-indigo font-serif small">{room.title || 'Sanctuary Suite'}</div>
                                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                                      Suite #{room.roomNumber} &bull; {room.type}
                                    </small>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span className="font-monospace fw-semibold text-charcoal small">
                                  {refCode}
                                </span>
                              </td>
                              <td>
                                <div className="small fw-semibold text-charcoal">
                                  {formatDate(b.checkIn)} &rarr; {formatDate(b.checkOut)}
                                </div>
                                <small className="text-muted" style={{ fontSize: '0.75rem' }}>{b.nights} {b.nights === 1 ? 'Night' : 'Nights'}</small>
                              </td>
                              <td className="small text-muted">{b.guests} {b.guests === 1 ? 'Guest' : 'Guests'}</td>
                              <td>
                                <span className="fw-bold text-indigo font-serif">
                                  ₹{Number(b.totalPrice || 0).toLocaleString('en-IN')}
                                </span>
                              </td>
                              <td>
                                {getStatusBadge(b.bookingStatus)}
                              </td>
                              <td className="text-end">
                                <div className="d-flex justify-content-end gap-2">
                                  <Link
                                    to={`/booking/confirmation/${b._id}`}
                                    className="btn btn-sm btn-outline-indigo py-1 px-2"
                                    title="View Voucher"
                                    style={{ fontSize: '0.8rem' }}
                                  >
                                    <i className="bi bi-file-earmark-text me-1"></i> Voucher
                                  </Link>
                                  {isEligibleForCancellation(b) && (
                                    <button
                                      disabled={actionLoading}
                                      onClick={() => handleCancelBooking(b._id)}
                                      className="btn btn-sm btn-outline-danger py-1 px-2"
                                      title="Cancel Reservation"
                                      style={{ fontSize: '0.8rem' }}
                                    >
                                      <i className="bi bi-x-circle me-1"></i> Cancel
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="row justify-content-center py-2">
                <div className="col-lg-8">
                  <form onSubmit={handleProfileSubmit}>
                    <h5 className="font-serif fw-bold text-indigo mb-2">Guest Profile Information</h5>
                    <div className="gold-rule"></div>

                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <label className="form-label">Full Name</label>
                        <input
                          type="text"
                          required
                          className="form-control"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Registered Email</label>
                        <input
                          type="email"
                          disabled
                          className="form-control bg-light"
                          value={user?.email || ''}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Contact Number</label>
                        <input
                          type="tel"
                          placeholder="+91 98765 43210"
                          className="form-control"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Account Privilege Tier</label>
                        <input
                          type="text"
                          disabled
                          className="form-control bg-light text-capitalize"
                          value={user?.role === 'admin' ? 'Palace Administrator' : 'Guest Circle Member'}
                        />
                      </div>
                    </div>

                    <hr className="my-4" style={{ borderColor: 'rgba(37, 37, 37, 0.1)' }} />

                    <h5 className="font-serif fw-bold text-indigo mb-2">Security & Password</h5>
                    <div className="gold-rule"></div>
                    <p className="text-muted small mb-3">
                      Leave password fields blank unless you wish to update your security credentials.
                    </p>

                    <div className="row g-3 mb-4">
                      <div className="col-md-4">
                        <label className="form-label">Current Password</label>
                        <input
                          type="password"
                          className="form-control"
                          placeholder="••••••••"
                          value={profileForm.currentPassword}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, currentPassword: e.target.value })
                          }
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label">New Password</label>
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Min 6 characters"
                          value={profileForm.newPassword}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, newPassword: e.target.value })
                          }
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label">Confirm Password</label>
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Re-enter password"
                          value={profileForm.confirmPassword}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, confirmPassword: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="d-flex justify-content-end">
                      <button
                        type="submit"
                        disabled={actionLoading}
                        className="btn btn-indigo px-4 py-2 fw-semibold"
                      >
                        {actionLoading ? 'Saving Changes...' : 'Save Profile Changes'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
