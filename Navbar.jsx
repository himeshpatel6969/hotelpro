import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleExperiencesClick = (e) => {
    setIsNavCollapsed(true);
    if (location.pathname === '/') {
      const el = document.getElementById('experiences');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    navigate('/#experiences');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-hotelpro sticky-top shadow-sm">
      <div className="container">
        {/* Brand Wordmark */}
        <Link className="navbar-brand d-flex flex-column" to="/" onClick={() => setIsNavCollapsed(true)}>
          <span className="hotelpro-wordmark">
            HOTEL<span className="accent">PRO</span>
          </span>
          <span className="hotelpro-submark">Sanctuary &bull; India</span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0 p-2"
          type="button"
          onClick={() => setIsNavCollapsed(!isNavCollapsed)}
          aria-controls="hotelproNavbar"
          aria-expanded={!isNavCollapsed}
          aria-label="Toggle navigation"
        >
          <i className={`bi ${isNavCollapsed ? 'bi-list' : 'bi-x-lg'} fs-3 text-indigo`}></i>
        </button>

        {/* Navigation Items */}
        <div className={`collapse navbar-collapse ${!isNavCollapsed ? 'show' : ''}`} id="hotelproNavbar">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-2">
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => `nav-link nav-link-hotelpro ${isActive ? 'active' : ''}`}
                to="/rooms"
                onClick={() => setIsNavCollapsed(true)}
              >
                Rooms
              </NavLink>
            </li>
            <li className="nav-item">
              <a
                className="nav-link nav-link-hotelpro cursor-pointer"
                href="#experiences"
                onClick={handleExperiencesClick}
              >
                Experiences
              </a>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => `nav-link nav-link-hotelpro ${isActive ? 'active' : ''}`}
                to="/about"
                onClick={() => setIsNavCollapsed(true)}
              >
                Our Story
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => `nav-link nav-link-hotelpro ${isActive ? 'active' : ''}`}
                to="/contact"
                onClick={() => setIsNavCollapsed(true)}
              >
                Contact
              </NavLink>
            </li>
          </ul>

          {/* Action CTAs */}
          <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">
            {isAuthenticated ? (
              <div className="d-flex align-items-center gap-2">
                <Link
                  to="/dashboard"
                  className="btn btn-outline-indigo btn-sm px-3 py-2"
                  onClick={() => setIsNavCollapsed(true)}
                >
                  <i className="bi bi-calendar-check me-1"></i>
                  <span>My Bookings</span>
                </Link>

                <div className="dropdown">
                  <button
                    className="btn btn-indigo btn-sm d-flex align-items-center gap-2 px-3 py-2 dropdown-toggle"
                    type="button"
                    id="userAccountDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="bi bi-person-circle"></i>
                    <span className="text-truncate" style={{ maxWidth: '110px' }}>
                      {user?.name?.split(' ')[0] || 'Account'}
                    </span>
                    {isAdmin && (
                      <span className="badge bg-gold text-dark ms-1" style={{ fontSize: '0.65rem' }}>
                        Admin
                      </span>
                    )}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow-md border-0 p-2 mt-2 rounded-3" aria-labelledby="userAccountDropdown">
                    <li className="px-3 py-2 border-bottom">
                      <p className="mb-0 fw-bold text-indigo font-serif small">{user?.name}</p>
                      <small className="text-muted d-block text-truncate" style={{ maxWidth: '180px' }}>{user?.email}</small>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item py-2 small d-flex align-items-center gap-2 rounded-2"
                        to="/dashboard"
                        onClick={() => setIsNavCollapsed(true)}
                      >
                        <i className="bi bi-journal-bookmark text-maroon"></i>
                        <span>My Reservations</span>
                      </Link>
                    </li>
                    {isAdmin && (
                      <li>
                        <Link
                          className="dropdown-item py-2 small d-flex align-items-center gap-2 rounded-2"
                          to="/admin"
                          onClick={() => setIsNavCollapsed(true)}
                        >
                          <i className="bi bi-speedometer2 text-gold"></i>
                          <span>Operations Dashboard</span>
                        </Link>
                      </li>
                    )}
                    <li><hr className="dropdown-divider my-1" /></li>
                    <li>
                      <button
                        className="dropdown-item py-2 small text-danger d-flex align-items-center gap-2 rounded-2"
                        onClick={() => {
                          setIsNavCollapsed(true);
                          handleLogout();
                        }}
                      >
                        <i className="bi bi-box-arrow-right"></i>
                        <span>Sign Out</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link
                  to="/login?redirect=/dashboard"
                  className="btn btn-outline-indigo btn-sm px-3 py-2"
                  onClick={() => setIsNavCollapsed(true)}
                >
                  <i className="bi bi-calendar-check me-1"></i>
                  <span>My Bookings</span>
                </Link>
                <Link
                  to="/login"
                  className="btn btn-indigo btn-sm px-3 py-2"
                  onClick={() => setIsNavCollapsed(true)}
                >
                  <i className="bi bi-person me-1"></i>
                  <span>Sign In</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
