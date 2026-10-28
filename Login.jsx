import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AlertMessage from '../components/common/AlertMessage';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get('redirect') || '/';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
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

    if (!formData.email || !formData.password) {
      setError('Please provide both your registered email and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await login(formData);
      if (res.success) {
        if (res.user.role === 'admin' && redirectPath === '/') {
          navigate('/admin');
        } else {
          navigate(redirectPath);
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid email or password. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5 d-flex align-items-center" style={{ minHeight: '80vh', backgroundColor: 'var(--color-ivory)' }}>
      <div className="container" style={{ maxWidth: '460px' }}>
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
              Welcome to Your Sanctuary
            </h2>
            <p className="text-muted small mb-0">
              Sign in to manage your reservations and guest preferences
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
              <label className="form-label" htmlFor="login-email">
                Email Address
              </label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted" style={{ borderColor: 'rgba(37, 37, 37, 0.16)' }}>
                  <i className="bi bi-envelope text-gold"></i>
                </span>
                <input
                  id="login-email"
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

            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label mb-0" htmlFor="login-password">
                  Password
                </label>
                <button
                  type="button"
                  className="btn btn-link p-0 small text-decoration-none text-muted"
                  style={{ fontSize: '0.78rem' }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted" style={{ borderColor: 'rgba(37, 37, 37, 0.16)' }}>
                  <i className="bi bi-lock text-gold"></i>
                </span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="form-control border-start-0 ps-0"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
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
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right"></i>
                  <span>Sign In</span>
                </>
              )}
            </button>

            <div className="text-center pt-2 border-top small" style={{ borderColor: 'rgba(37, 37, 37, 0.08)' }}>
              <span className="text-muted">New to HotelPro? </span>
              <Link to="/register" className="fw-semibold text-maroon text-decoration-none">
                Create a Guest Account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
