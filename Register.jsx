import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AlertMessage from '../components/common/AlertMessage';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please provide your name, email address, and password.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please verify your entry.');
      return;
    }

    try {
      setLoading(true);
      const res = await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      if (res.success) {
        navigate('/rooms');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(
        err.response?.data?.message || 'Unable to create guest account. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5 d-flex align-items-center" style={{ minHeight: '80vh', backgroundColor: 'var(--color-ivory)' }}>
      <div className="container" style={{ maxWidth: '500px' }}>
        <div className="card ornamental-border rounded-3 p-4 p-md-5 shadow-md">
          {/* Brand & Welcome */}
          <div className="text-center mb-4">
            <Link to="/" className="text-decoration-none d-inline-block mb-2">
              <span className="hotelpro-wordmark">
                HOTEL<span className="accent">PRO</span>
              </span>
              <span className="hotelpro-submark">Sanctuary &bull; India</span>
            </Link>
            <h2 className="font-serif fw-bold text-indigo mt-3 mb-1" style={{ fontSize: '1.5rem' }}>
              Create Your Guest Profile
            </h2>
            <p className="text-muted small mb-0">
              Join HotelPro for curated reservations, direct tariffs, and mindful stays
            </p>
            <div className="jali-divider my-3">
              <span className="jali-symbol">✦</span>
            </div>
          </div>

          {error && (
            <div className="mb-3">
              <AlertMessage variant="danger" message={error} onClose={() => setError('')} />
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label" htmlFor="reg-name">
                Full Name
              </label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted" style={{ borderColor: 'rgba(37, 37, 37, 0.16)' }}>
                  <i className="bi bi-person text-gold"></i>
                </span>
                <input
                  id="reg-name"
                  type="text"
                  name="name"
                  required
                  autoComplete="name"
                  placeholder="e.g. Arjun Patel"
                  className="form-control border-start-0 ps-0"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="reg-email">
                Email Address
              </label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted" style={{ borderColor: 'rgba(37, 37, 37, 0.16)' }}>
                  <i className="bi bi-envelope text-gold"></i>
                </span>
                <input
                  id="reg-email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="name@example.com"
                  className="form-control border-start-0 ps-0"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="reg-phone">
                Phone Number <span className="text-muted fw-normal">(Optional)</span>
              </label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted" style={{ borderColor: 'rgba(37, 37, 37, 0.16)' }}>
                  <i className="bi bi-telephone text-gold"></i>
                </span>
                <input
                  id="reg-phone"
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  placeholder="+91 98765 43210"
                  className="form-control border-start-0 ps-0"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row g-2 mb-4">
              <div className="col-sm-6">
                <label className="form-label" htmlFor="reg-password">
                  Password
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0 text-muted" style={{ borderColor: 'rgba(37, 37, 37, 0.16)' }}>
                    <i className="bi bi-lock text-gold"></i>
                  </span>
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    placeholder="Min 6 characters"
                    className="form-control border-start-0 ps-0"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-sm-6">
                <label className="form-label" htmlFor="reg-confirmPassword">
                  Confirm Password
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0 text-muted" style={{ borderColor: 'rgba(37, 37, 37, 0.16)' }}>
                    <i className="bi bi-shield-lock text-gold"></i>
                  </span>
                  <input
                    id="reg-confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    placeholder="Repeat password"
                    className="form-control border-start-0 ps-0"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-check mb-4 small text-muted">
              <input
                className="form-check-input"
                type="checkbox"
                id="togglePassVisibility"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                style={{ accentColor: 'var(--color-gold)' }}
              />
              <label className="form-check-label" htmlFor="togglePassVisibility">
                Show passwords
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-indigo w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-sm mb-3"
              style={{ height: '44px' }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span>Creating Profile...</span>
                </>
              ) : (
                <>
                  <i className="bi bi-person-check"></i>
                  <span>Create Account</span>
                </>
              )}
            </button>

            <div className="text-center pt-2 border-top small" style={{ borderColor: 'rgba(37, 37, 37, 0.08)' }}>
              <span className="text-muted">Already registered? </span>
              <Link to="/login" className="fw-semibold text-maroon text-decoration-none">
                Sign In to Your Account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
