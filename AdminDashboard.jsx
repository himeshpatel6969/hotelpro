import React, { useState, useEffect } from 'react';
import * as adminService from '../services/adminService';
import * as roomService from '../services/roomService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertMessage from '../components/common/AlertMessage';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'rooms' | 'bookings' | 'users'
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState({ variant: '', message: '' });

  // Room Form Modal State (Add or Edit)
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [isEditingRoom, setIsEditingRoom] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [roomForm, setRoomForm] = useState({
    roomNumber: '',
    title: '',
    type: 'Deluxe',
    description: '',
    pricePerNight: '',
    capacity: 2,
    bedType: '1 Royal King Bed',
    roomSize: 45,
    status: 'Available',
    featured: false,
    images: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    amenities: 'High-speed Wi-Fi, Air Conditioning, Flat-screen TV, Ensuite Bathroom, Courtyard View',
  });

  // Booking Filter State
  const [bookingFilter, setBookingFilter] = useState('All');
  const [bookingSearch, setBookingSearch] = useState('');

  // Initial Data Load
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, roomsRes, bookingsRes, usersRes] = await Promise.all([
        adminService.getDashboardStats(),
        roomService.getRooms(),
        adminService.getAllBookings(),
        adminService.getAllUsers(),
      ]);

      if (statsRes.success) {
        setStats(statsRes.stats);
        setRecentBookings(statsRes.recentBookings || []);
      }
      if (roomsRes.success) setRooms(roomsRes.rooms || []);
      if (bookingsRes.success) setBookings(bookingsRes.bookings || []);
      if (usersRes.success) setUsers(usersRes.users || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setFeedback({
        variant: 'danger',
        message: err.response?.data?.message || 'Failed to load administrator records.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Room Actions
  const handleOpenAddRoom = () => {
    setIsEditingRoom(false);
    setCurrentRoomId(null);
    setRoomForm({
      roomNumber: '',
      title: '',
      type: 'Deluxe',
      description: 'Experience utmost luxury and modern comfort.',
      pricePerNight: '7500',
      capacity: 2,
      bedType: '1 Royal King Bed',
      roomSize: 45,
      status: 'Available',
      featured: false,
      images: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      amenities: 'High-speed Wi-Fi, Air Conditioning, Flat-screen TV, Ensuite Bathroom, Courtyard View',
    });
    setShowRoomModal(true);
  };

  const handleOpenEditRoom = (room) => {
    setIsEditingRoom(true);
    setCurrentRoomId(room._id);
    setRoomForm({
      roomNumber: room.roomNumber,
      title: room.title,
      type: room.type,
      description: room.description,
      pricePerNight: room.pricePerNight,
      capacity: room.capacity,
      bedType: room.bedType || '1 Royal King Bed',
      roomSize: room.roomSize || 45,
      status: room.status,
      featured: !!room.featured,
      images: Array.isArray(room.images) ? room.images.join(', ') : '',
      amenities: Array.isArray(room.amenities) ? room.amenities.join(', ') : '',
    });
    setShowRoomModal(true);
  };

  const handleSaveRoom = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const payload = {
        roomNumber: roomForm.roomNumber.trim().toUpperCase(),
        title: roomForm.title.trim(),
        type: roomForm.type,
        description: roomForm.description.trim(),
        pricePerNight: Number(roomForm.pricePerNight),
        capacity: Number(roomForm.capacity),
        bedType: roomForm.bedType,
        roomSize: Number(roomForm.roomSize),
        status: roomForm.status,
        featured: roomForm.featured,
        images: roomForm.images
          .split(',')
          .map((url) => url.trim())
          .filter(Boolean),
        amenities: roomForm.amenities
          .split(',')
          .map((a) => a.trim())
          .filter(Boolean),
      };

      if (isEditingRoom) {
        const res = await roomService.updateRoom(currentRoomId, payload);
        if (res.success) {
          setFeedback({ variant: 'success', message: 'Room updated successfully!' });
          setRooms((prev) => prev.map((r) => (r._id === currentRoomId ? res.room : r)));
        }
      } else {
        const res = await roomService.createRoom(payload);
        if (res.success) {
          setFeedback({ variant: 'success', message: 'New room created successfully!' });
          setRooms((prev) => [res.room, ...prev]);
        }
      }

      setShowRoomModal(false);
      // Reload stats
      const statsRes = await adminService.getDashboardStats();
      if (statsRes.success) setStats(statsRes.stats);
    } catch (err) {
      console.error('Room save failed:', err);
      setFeedback({
        variant: 'danger',
        message: err.response?.data?.message || 'Could not save room.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteRoom = async (roomId, roomNumber) => {
    if (!window.confirm(`Are you sure you want to permanently delete Room ${roomNumber}?`)) {
      return;
    }

    try {
      setActionLoading(true);
      const res = await roomService.deleteRoom(roomId);
      if (res.success) {
        setFeedback({ variant: 'success', message: `Room ${roomNumber} deleted successfully.` });
        setRooms((prev) => prev.filter((r) => r._id !== roomId));
        const statsRes = await adminService.getDashboardStats();
        if (statsRes.success) setStats(statsRes.stats);
      }
    } catch (err) {
      console.error('Delete room failed:', err);
      setFeedback({
        variant: 'danger',
        message: err.response?.data?.message || 'Failed to delete room.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Booking Actions
  const handleUpdateBookingStatus = async (bookingId, bookingStatus, paymentStatus) => {
    try {
      setActionLoading(true);
      const res = await adminService.updateBookingStatus(bookingId, {
        bookingStatus,
        paymentStatus,
      });

      if (res.success) {
        setFeedback({ variant: 'success', message: 'Booking status updated!' });
        setBookings((prev) => prev.map((b) => (b._id === bookingId ? res.booking : b)));
        const statsRes = await adminService.getDashboardStats();
        if (statsRes.success) setStats(statsRes.stats);
      }
    } catch (err) {
      console.error('Update booking failed:', err);
      setFeedback({
        variant: 'danger',
        message: err.response?.data?.message || 'Failed to update booking status.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // User Role Action
  const handleToggleUserRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole.toUpperCase()}?`)) {
      return;
    }

    try {
      setActionLoading(true);
      const res = await adminService.updateUserRole(userId, newRole);
      if (res.success) {
        setFeedback({
          variant: 'success',
          message: `User role successfully updated to ${newRole}!`,
        });
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (err) {
      console.error('Update user role failed:', err);
      setFeedback({
        variant: 'danger',
        message: err.response?.data?.message || 'Could not change user role.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter !== 'All' && b.bookingStatus !== bookingFilter) return false;
    if (bookingSearch) {
      const q = bookingSearch.toLowerCase();
      const userName = b.user?.name?.toLowerCase() || '';
      const userEmail = b.user?.email?.toLowerCase() || '';
      const roomNum = b.room?.roomNumber?.toLowerCase() || '';
      return userName.includes(q) || userEmail.includes(q) || roomNum.includes(q);
    }
    return true;
  });

  return (
    <div className="container-fluid p-0">
      <div className="row g-0">
        {/* Admin Sidebar Navigation */}
        <div className="col-lg-2 col-md-3 dashboard-sidebar p-3 d-flex flex-column">
          <div className="px-3 py-3 border-bottom mb-3" style={{ borderColor: 'rgba(197, 164, 109, 0.25)' }}>
            <span className="badge-status badge-status-pending mb-1" style={{ fontSize: '0.65rem' }}>
              Operations Hub
            </span>
            <div className="hotelpro-wordmark mt-1" style={{ color: '#FFFFFF', fontSize: '1.25rem' }}>
              HOTEL<span className="accent">PRO</span>
            </div>
            <small style={{ color: 'var(--color-gold-muted)', fontSize: '0.65rem', letterSpacing: '1.5px', textTransform: 'uppercase', display: 'block' }}>
              Palace Administration
            </small>
          </div>

          <nav className="nav flex-column gap-1 flex-grow-1">
            <button
              className={`btn dashboard-nav-item text-start w-100 ${
                activeTab === 'overview' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('overview')}
            >
              <i className="bi bi-speedometer2 text-gold"></i>
              <span>Overview & Analytics</span>
            </button>

            <button
              className={`btn dashboard-nav-item text-start w-100 ${
                activeTab === 'rooms' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('rooms')}
            >
              <i className="bi bi-door-open text-gold"></i>
              <span>Room Inventory ({rooms.length})</span>
            </button>

            <button
              className={`btn dashboard-nav-item text-start w-100 ${
                activeTab === 'bookings' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('bookings')}
            >
              <i className="bi bi-calendar2-range text-gold"></i>
              <span>Bookings ({bookings.length})</span>
            </button>

            <button
              className={`btn dashboard-nav-item text-start w-100 ${
                activeTab === 'users' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('users')}
            >
              <i className="bi bi-people text-gold"></i>
              <span>Guest Records ({users.length})</span>
            </button>
          </nav>

          <div className="p-3 border-top small" style={{ borderColor: 'rgba(197, 164, 109, 0.2)', color: 'rgba(247, 242, 232, 0.6)' }}>
            <div>HotelPro Operations v1.0</div>
            <small>Database: MongoDB Connected</small>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="col-lg-10 col-md-9 p-4 min-vh-100" style={{ backgroundColor: 'var(--color-ivory)' }}>
          {/* Top Header */}
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3 bg-white p-3 rounded-3 shadow-sm border" style={{ borderColor: 'rgba(197, 164, 109, 0.25)' }}>
            <div>
              <h3 className="fw-bold font-serif mb-0 text-indigo" style={{ fontSize: '1.4rem' }}>
                {activeTab === 'overview' && 'Executive Analytics & Revenue Overview'}
                {activeTab === 'rooms' && 'Sanctuary Inventory & Suite Management'}
                {activeTab === 'bookings' && 'Guest Reservations & Front Desk Controls'}
                {activeTab === 'users' && 'Registered Guests & Staff Directory'}
              </h3>
              <small className="text-muted">Real-time hospitality management data from server</small>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button
                onClick={loadDashboardData}
                disabled={loading}
                className="btn btn-outline-indigo btn-sm d-flex align-items-center gap-1"
                title="Refresh records"
              >
                <i className="bi bi-arrow-clockwise"></i> Refresh
              </button>
              {activeTab === 'rooms' && (
                <button
                  onClick={handleOpenAddRoom}
                  className="btn btn-gold btn-sm d-flex align-items-center gap-1 shadow-sm"
                >
                  <i className="bi bi-plus-lg"></i> Add New Suite
                </button>
              )}
            </div>
          </div>

          {/* Feedback banner */}
          {feedback.message && (
            <div className="mb-4">
              <AlertMessage
                variant={feedback.variant}
                message={feedback.message}
                onClose={() => setFeedback({ variant: '', message: '' })}
              />
            </div>
          )}

          {loading ? (
            <div className="py-5">
              <LoadingSpinner text="Retrieving administrative data..." fullPage />
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div>
                  {/* Metric Cards Row */}
                  <div className="row g-3 mb-4">
                    {/* Total Revenue */}
                    <div className="col-xl-3 col-sm-6">
                      <div className="stat-card-luxury h-100">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <span className="text-muted small fw-semibold text-uppercase" style={{ letterSpacing: '0.5px' }}>
                              Total Booking Revenue
                            </span>
                            <h3 className="fw-bold font-serif text-indigo mt-2 mb-0">
                              ₹{Number(stats?.totalRevenue || 0).toLocaleString('en-IN')}
                            </h3>
                          </div>
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: '48px', height: '48px', background: 'var(--color-ivory)', color: 'var(--color-gold)' }}
                          >
                            <i className="bi bi-cash-stack fs-4"></i>
                          </div>
                        </div>
                        <small className="text-muted mt-3 d-block" style={{ fontSize: '0.75rem' }}>
                          Real confirmed & completed booking revenue
                        </small>
                      </div>
                    </div>

                    {/* Total Rooms */}
                    <div className="col-xl-3 col-sm-6">
                      <div className="stat-card-luxury h-100">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <span className="text-muted small fw-semibold text-uppercase" style={{ letterSpacing: '0.5px' }}>
                              Room Inventory
                            </span>
                            <h3 className="fw-bold font-serif text-indigo mt-2 mb-0">
                              {stats?.totalRooms || 0}
                            </h3>
                          </div>
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: '48px', height: '48px', background: 'var(--color-ivory)', color: 'var(--color-indigo)' }}
                          >
                            <i className="bi bi-door-open fs-4"></i>
                          </div>
                        </div>
                        <div className="d-flex gap-2 mt-3 small text-muted" style={{ fontSize: '0.75rem' }}>
                          <span className="text-success fw-bold">{stats?.availableRooms || 0} Available</span>
                          <span>&bull;</span>
                          <span className="text-warning fw-bold">{stats?.maintenanceRooms || 0} Maint</span>
                        </div>
                      </div>
                    </div>

                    {/* Total Bookings */}
                    <div className="col-xl-3 col-sm-6">
                      <div className="stat-card-luxury h-100">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <span className="text-muted small fw-semibold text-uppercase" style={{ letterSpacing: '0.5px' }}>
                              Total Bookings
                            </span>
                            <h3 className="fw-bold font-serif text-indigo mt-2 mb-0">
                              {stats?.totalBookings || 0}
                            </h3>
                          </div>
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: '48px', height: '48px', background: 'var(--color-ivory)', color: 'var(--color-maroon)' }}
                          >
                            <i className="bi bi-calendar-check fs-4"></i>
                          </div>
                        </div>
                        <div className="d-flex gap-2 mt-3 small text-muted" style={{ fontSize: '0.75rem' }}>
                          <span className="text-success fw-bold">{stats?.confirmedBookings || 0} Confirmed</span>
                          <span>&bull;</span>
                          <span className="text-danger fw-bold">{stats?.cancelledBookings || 0} Cancelled</span>
                        </div>
                      </div>
                    </div>

                    {/* Estimated Occupancy */}
                    <div className="col-xl-3 col-sm-6">
                      <div className="stat-card-luxury h-100">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <span className="text-muted small fw-semibold text-uppercase" style={{ letterSpacing: '0.5px' }}>
                              Live Occupancy Rate
                            </span>
                            <h3 className="fw-bold font-serif text-indigo mt-2 mb-0">
                              {stats?.occupancyRate || 0}%
                            </h3>
                          </div>
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: '48px', height: '48px', background: 'var(--color-ivory)', color: 'var(--color-gold)' }}
                          >
                            <i className="bi bi-pie-chart fs-4"></i>
                          </div>
                        </div>
                        <div className="progress mt-3" style={{ height: '6px' }}>
                          <div
                            className="progress-bar"
                            style={{ width: `${stats?.occupancyRate || 0}%`, backgroundColor: 'var(--color-gold)' }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Bookings Table */}
                  <div className="card ornamental-border rounded-3 shadow-sm bg-white p-4 mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <h5 className="font-serif fw-bold text-indigo mb-0">Recent Guest Reservations</h5>
                        <small className="text-muted">Most recent reservation records created in the system</small>
                      </div>
                      <button
                        onClick={() => setActiveTab('bookings')}
                        className="btn btn-outline-indigo btn-sm"
                      >
                        View All Bookings &rarr;
                      </button>
                    </div>

                    {recentBookings.length === 0 ? (
                      <p className="text-muted small my-3">No reservation records currently on file.</p>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-luxury align-middle">
                          <thead>
                            <tr>
                              <th>Ref Code</th>
                              <th>Guest Name</th>
                              <th>Suite</th>
                              <th>Dates</th>
                              <th>Total Tariff</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentBookings.map((b) => (
                              <tr key={b._id}>
                                <td className="font-monospace small fw-bold text-charcoal">
                                  HP-{b._id?.toString().slice(-6).toUpperCase()}
                                </td>
                                <td>
                                  <div className="fw-semibold text-indigo">{b.user?.name || 'Guest'}</div>
                                  <small className="text-muted">{b.user?.email}</small>
                                </td>
                                <td>
                                  <div className="small fw-semibold">{b.room?.title}</div>
                                  <small className="text-muted">Suite #{b.room?.roomNumber}</small>
                                </td>
                                <td className="small">
                                  {formatDate(b.checkIn)} &rarr; {formatDate(b.checkOut)}
                                </td>
                                <td className="fw-bold font-serif text-indigo">
                                  ₹{Number(b.totalPrice || 0).toLocaleString('en-IN')}
                                </td>
                                <td>
                                  <span
                                    className={`badge-status ${
                                      b.bookingStatus === 'Confirmed'
                                        ? 'badge-status-confirmed'
                                        : b.bookingStatus === 'Cancelled'
                                        ? 'badge-status-cancelled'
                                        : 'badge-status-pending'
                                    }`}
                                  >
                                    {b.bookingStatus}
                                  </span>
                                </td>
                                <td>
                                  <button
                                    onClick={() => setActiveTab('bookings')}
                                    className="btn btn-outline-indigo btn-sm py-0 px-2"
                                    style={{ fontSize: '0.78rem' }}
                                  >
                                    Manage
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: ROOM INVENTORY */}
              {activeTab === 'rooms' && (
                <div className="card ornamental-border rounded-3 shadow-sm bg-white p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h5 className="font-serif fw-bold text-indigo mb-0">Suite & Room Inventory</h5>
                      <small className="text-muted">Total inventory: {rooms.length} suites across India</small>
                    </div>
                    <button onClick={handleOpenAddRoom} className="btn btn-gold btn-sm">
                      <i className="bi bi-plus-lg me-1"></i> Add Room
                    </button>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-luxury align-middle">
                      <thead>
                        <tr>
                          <th>Room #</th>
                          <th>Suite Details</th>
                          <th>Category</th>
                          <th>Capacity</th>
                          <th>Nightly Tariff</th>
                          <th>Status</th>
                          <th>Featured</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rooms.map((room) => (
                          <tr key={room._id}>
                            <td className="fw-bold font-monospace text-indigo">
                              #{room.roomNumber}
                            </td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <img
                                  src={
                                    room.images?.[0] ||
                                    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'
                                  }
                                  alt={room.title}
                                  className="rounded-2 object-fit-cover shadow-sm"
                                  style={{ width: '48px', height: '40px', background: 'var(--color-indigo)' }}
                                />
                                <div>
                                  <div className="fw-semibold text-charcoal small">{room.title}</div>
                                  <small className="text-muted">{room.bedType || 'King Bed'} &bull; {room.roomSize || 45} m²</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="badge-status badge-status-available" style={{ fontSize: '0.72rem' }}>
                                {room.type}
                              </span>
                            </td>
                            <td className="small">{room.capacity} Guests</td>
                            <td className="fw-bold font-serif text-indigo">
                              ₹{Number(room.pricePerNight).toLocaleString('en-IN')}
                            </td>
                            <td>
                              <span
                                className={`badge-status ${
                                  room.status === 'Available'
                                    ? 'badge-status-available'
                                    : room.status === 'Booked'
                                    ? 'badge-status-booked'
                                    : 'badge-status-maintenance'
                                }`}
                              >
                                {room.status}
                              </span>
                            </td>
                            <td>
                              {room.featured ? (
                                <i className="bi bi-star-fill text-gold" title="Featured on Homepage"></i>
                              ) : (
                                <span className="text-muted small">-</span>
                              )}
                            </td>
                            <td className="text-end">
                              <div className="d-flex justify-content-end gap-1">
                                <button
                                  onClick={() => handleOpenEditRoom(room)}
                                  className="btn btn-sm btn-outline-indigo py-1 px-2"
                                  title="Edit Suite"
                                  style={{ fontSize: '0.8rem' }}
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                  onClick={() => handleDeleteRoom(room._id, room.roomNumber)}
                                  className="btn btn-sm btn-outline-danger py-1 px-2"
                                  title="Delete Suite"
                                  style={{ fontSize: '0.8rem' }}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: BOOKINGS MANAGEMENT */}
              {activeTab === 'bookings' && (
                <div className="card ornamental-border rounded-3 shadow-sm bg-white p-4">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                    <div>
                      <h5 className="font-serif fw-bold text-indigo mb-0">Reservations & Guest Stays</h5>
                      <small className="text-muted">Manage check-in status, verification, and payment confirmation</small>
                    </div>

                    <div className="d-flex flex-wrap align-items-center gap-2">
                      <div className="input-group input-group-sm" style={{ width: '220px' }}>
                        <span className="input-group-text bg-white border-end-0">
                          <i className="bi bi-search text-gold"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control border-start-0"
                          placeholder="Search guest or suite..."
                          value={bookingSearch}
                          onChange={(e) => setBookingSearch(e.target.value)}
                        />
                      </div>

                      <select
                        className="form-select form-select-sm"
                        style={{ width: '140px' }}
                        value={bookingFilter}
                        onChange={(e) => setBookingFilter(e.target.value)}
                      >
                        <option value="All">All Statuses</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-luxury align-middle">
                      <thead>
                        <tr>
                          <th>Reference</th>
                          <th>Guest Details</th>
                          <th>Suite</th>
                          <th>Dates</th>
                          <th>Tariff</th>
                          <th>Status</th>
                          <th>Payment</th>
                          <th className="text-end">Manage Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBookings.length === 0 ? (
                          <tr>
                            <td colSpan="8" className="text-center py-4 text-muted">
                              No reservations match your filter criteria.
                            </td>
                          </tr>
                        ) : (
                          filteredBookings.map((b) => (
                            <tr key={b._id}>
                              <td className="font-monospace small fw-bold text-charcoal">
                                HP-{b._id?.toString().slice(-6).toUpperCase()}
                              </td>
                              <td>
                                <div className="fw-semibold text-indigo small">{b.user?.name || 'Guest'}</div>
                                <small className="text-muted d-block">{b.user?.email}</small>
                                <small className="text-muted">{b.user?.phone || 'No phone'}</small>
                              </td>
                              <td>
                                <div className="small fw-semibold">{b.room?.title}</div>
                                <small className="text-muted">Suite #{b.room?.roomNumber}</small>
                              </td>
                              <td className="small">
                                <div>{formatDate(b.checkIn)} &rarr; {formatDate(b.checkOut)}</div>
                                <small className="text-muted">{b.nights} Night(s) &bull; {b.guests} Guests</small>
                              </td>
                              <td className="fw-bold font-serif text-indigo">
                                ₹{Number(b.totalPrice || 0).toLocaleString('en-IN')}
                              </td>
                              <td>
                                <span
                                  className={`badge-status ${
                                    b.bookingStatus === 'Confirmed'
                                      ? 'badge-status-confirmed'
                                      : b.bookingStatus === 'Cancelled'
                                      ? 'badge-status-cancelled'
                                      : b.bookingStatus === 'Completed'
                                      ? 'badge-status-completed'
                                      : 'badge-status-pending'
                                  }`}
                                >
                                  {b.bookingStatus}
                                </span>
                              </td>
                              <td>
                                <span className="small text-muted fw-semibold">
                                  {b.paymentStatus || 'Pending'}
                                </span>
                              </td>
                              <td className="text-end">
                                <div className="btn-group btn-group-sm">
                                  {b.bookingStatus !== 'Confirmed' && (
                                    <button
                                      disabled={actionLoading}
                                      onClick={() => handleUpdateBookingStatus(b._id, 'Confirmed', 'Paid')}
                                      className="btn btn-outline-success py-1 px-2"
                                      title="Confirm & Mark Paid"
                                      style={{ fontSize: '0.75rem' }}
                                    >
                                      Confirm
                                    </button>
                                  )}
                                  {b.bookingStatus !== 'Completed' && (
                                    <button
                                      disabled={actionLoading}
                                      onClick={() => handleUpdateBookingStatus(b._id, 'Completed', 'Paid')}
                                      className="btn btn-outline-indigo py-1 px-2"
                                      title="Complete Stay"
                                      style={{ fontSize: '0.75rem' }}
                                    >
                                      Complete
                                    </button>
                                  )}
                                  {b.bookingStatus !== 'Cancelled' && (
                                    <button
                                      disabled={actionLoading}
                                      onClick={() => handleUpdateBookingStatus(b._id, 'Cancelled', 'Refunded')}
                                      className="btn btn-outline-danger py-1 px-2"
                                      title="Cancel Reservation"
                                      style={{ fontSize: '0.75rem' }}
                                    >
                                      Cancel
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: GUEST DIRECTORY */}
              {activeTab === 'users' && (
                <div className="card ornamental-border rounded-3 shadow-sm bg-white p-4">
                  <div className="mb-3">
                    <h5 className="font-serif fw-bold text-indigo mb-0">Registered Guest Directory</h5>
                    <small className="text-muted">Total registered users: {users.length}</small>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-luxury align-middle">
                      <thead>
                        <tr>
                          <th>Guest Name</th>
                          <th>Email Address</th>
                          <th>Contact</th>
                          <th>Role</th>
                          <th>Registered Date</th>
                          <th className="text-end">Permissions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u._id}>
                            <td className="fw-semibold text-indigo">{u.name}</td>
                            <td className="small text-muted">{u.email}</td>
                            <td className="small">{u.phone || 'N/A'}</td>
                            <td>
                              <span
                                className={`badge-status ${
                                  u.role === 'admin'
                                    ? 'badge-status-pending'
                                    : 'badge-status-available'
                                }`}
                              >
                                {u.role === 'admin' ? 'Administrator' : 'Guest'}
                              </span>
                            </td>
                            <td className="small text-muted">{formatDate(u.createdAt)}</td>
                            <td className="text-end">
                              <button
                                disabled={actionLoading}
                                onClick={() => handleToggleUserRole(u._id, u.role)}
                                className="btn btn-sm btn-outline-indigo py-1 px-2"
                                style={{ fontSize: '0.78rem' }}
                              >
                                Make {u.role === 'admin' ? 'Customer' : 'Admin'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add / Edit Room Modal */}
      {showRoomModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: 'rgba(23, 39, 71, 0.65)' }}
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content border-0 shadow-lg rounded-3 overflow-hidden">
              <div className="modal-header bg-indigo px-4 py-3 border-0">
                <h5 className="modal-title font-serif text-white fw-bold">
                  {isEditingRoom ? `Edit Suite #${roomForm.roomNumber}` : 'Add New Indian Sanctuary Suite'}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowRoomModal(false)}
                ></button>
              </div>

              <form onSubmit={handleSaveRoom}>
                <div className="modal-body p-4 bg-white">
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label">Room Number *</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        placeholder="e.g. 101"
                        value={roomForm.roomNumber}
                        onChange={(e) => setRoomForm({ ...roomForm, roomNumber: e.target.value })}
                      />
                    </div>

                    <div className="col-md-8">
                      <label className="form-label">Suite Title *</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        placeholder="e.g. Maharaja Royal Heritage Suite"
                        value={roomForm.title}
                        onChange={(e) => setRoomForm({ ...roomForm, title: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Room Type *</label>
                      <select
                        className="form-select"
                        value={roomForm.type}
                        onChange={(e) => setRoomForm({ ...roomForm, type: e.target.value })}
                      >
                        <option value="Single">Single</option>
                        <option value="Double">Double</option>
                        <option value="Deluxe">Deluxe</option>
                        <option value="Suite">Suite</option>
                        <option value="Presidential">Presidential</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Tariff Per Night (₹) *</label>
                      <input
                        type="number"
                        required
                        min="1"
                        className="form-control"
                        value={roomForm.pricePerNight}
                        onChange={(e) => setRoomForm({ ...roomForm, pricePerNight: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Max Guest Capacity *</label>
                      <input
                        type="number"
                        required
                        min="1"
                        max="10"
                        className="form-control"
                        value={roomForm.capacity}
                        onChange={(e) => setRoomForm({ ...roomForm, capacity: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Bed Type</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. 1 Royal King Bed"
                        value={roomForm.bedType}
                        onChange={(e) => setRoomForm({ ...roomForm, bedType: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Living Space (m²)</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="55"
                        value={roomForm.roomSize}
                        onChange={(e) => setRoomForm({ ...roomForm, roomSize: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Inventory Status</label>
                      <select
                        className="form-select"
                        value={roomForm.status}
                        onChange={(e) => setRoomForm({ ...roomForm, status: e.target.value })}
                      >
                        <option value="Available">Available</option>
                        <option value="Booked">Booked</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label">Description *</label>
                      <textarea
                        rows="3"
                        required
                        className="form-control"
                        placeholder="Describe architectural inspiration, courtyards, furnishings, and view..."
                        value={roomForm.description}
                        onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })}
                      ></textarea>
                    </div>

                    <div className="col-12">
                      <label className="form-label">Image URLs (comma separated)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="https://image1.jpg, https://image2.jpg"
                        value={roomForm.images}
                        onChange={(e) => setRoomForm({ ...roomForm, images: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">Amenities (comma separated)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="High-speed Wi-Fi, Royal Butler, Courtyard Balcony, Ayurvedic Bath"
                        value={roomForm.amenities}
                        onChange={(e) => setRoomForm({ ...roomForm, amenities: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="featuredCheck"
                          checked={roomForm.featured}
                          onChange={(e) => setRoomForm({ ...roomForm, featured: e.target.checked })}
                          style={{ accentColor: 'var(--color-gold)' }}
                        />
                        <label className="form-check-label small fw-semibold text-indigo" htmlFor="featuredCheck">
                          Feature this suite prominently on the Home Page
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light px-4 py-3 border-top" style={{ borderColor: 'rgba(37, 37, 37, 0.1)' }}>
                  <button
                    type="button"
                    className="btn btn-outline-indigo"
                    onClick={() => setShowRoomModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="btn btn-indigo px-4 fw-semibold"
                  >
                    {actionLoading ? 'Saving Suite...' : 'Save Suite'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
