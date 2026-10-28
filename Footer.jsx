import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="footer-hotelpro">
      <div className="container">
        {/* Main Footer Content */}
        <div className="row g-4 mb-5">
          {/* Brand & Ethos */}
          <div className="col-lg-4 col-md-6">
            <Link to="/" className="text-decoration-none d-inline-block mb-3">
              <span className="hotelpro-wordmark" style={{ color: '#FFFFFF' }}>
                HOTEL<span style={{ color: 'var(--color-gold)', fontStyle: 'italic' }}>PRO</span>
              </span>
              <span className="hotelpro-submark" style={{ color: 'var(--color-gold-muted)' }}>
                Sanctuary &bull; India
              </span>
            </Link>
            <p className="small pe-lg-4 mb-3" style={{ color: 'rgba(247, 242, 232, 0.78)', lineHeight: '1.7' }}>
              Rooted in the timeless Indian philosophy of <em>Atithi Devo Bhava</em> — where every traveler is welcomed as a divine presence. Extraordinary stays, artisanal architecture, and mindful hospitality across India's most evocative landscapes.
            </p>
            <div className="d-flex align-items-center gap-3 fs-5">
              <a href="#instagram" aria-label="HotelPro Instagram" className="text-decoration-none">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#facebook" aria-label="HotelPro Facebook" className="text-decoration-none">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#pinterest" aria-label="HotelPro Pinterest" className="text-decoration-none">
                <i className="bi bi-pinterest"></i>
              </a>
              <a href="#linkedin" aria-label="HotelPro LinkedIn" className="text-decoration-none">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </div>

          {/* Stays & Destinations */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="mb-3">Explore Stays</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li><Link to="/rooms">All Palaces & Suites</Link></li>
              <li><Link to="/rooms?type=Deluxe">Royal Deluxe Suites</Link></li>
              <li><Link to="/rooms?type=Presidential">Kohinoor Penthouses</Link></li>
              <li><Link to="/rooms?type=Suite">Backwaters Retreats</Link></li>
              <li><Link to="/rooms?type=Double">Heritage Courtyards</Link></li>
              <li><Link to="/rooms?type=Single">Vedic Solo Stays</Link></li>
            </ul>
          </div>

          {/* Hospitality & Experiences */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="mb-3">Our Sanctuary</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li><Link to="/about">Our Story</Link></li>
              <li><a href="/#experiences">Indian Experiences</a></li>
              <li><Link to="/about#architecture">Heritage Craft</Link></li>
              <li><Link to="/contact">Concierge Desk</Link></li>
              <li><Link to="/dashboard">My Reservations</Link></li>
            </ul>
          </div>

          {/* Concierge & Royal Newsletter */}
          <div className="col-lg-4 col-md-6">
            <h6 className="mb-3">Palace Concierge Desk</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small mb-4" style={{ color: 'rgba(247, 242, 232, 0.78)' }}>
              <li className="d-flex align-items-start gap-2">
                <i className="bi bi-geo-alt text-gold mt-1"></i>
                <span>Lake Pichola Road, Udaipur, Rajasthan 313001, India</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <i className="bi bi-telephone text-gold"></i>
                <span>+91 (0294) 555-4683 &bull; 24/7 Desk</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <i className="bi bi-envelope text-gold"></i>
                <span>concierge@hotelpro.in</span>
              </li>
            </ul>

            <h6 className="mb-2" style={{ fontSize: '0.85rem' }}>The Curated Gazette</h6>
            <p className="small mb-2" style={{ color: 'rgba(247, 242, 232, 0.7)' }}>
              Occasional notes on Indian heritage journeys, seasonal harvests, and private tariffs.
            </p>
            {subscribed ? (
              <div className="p-2 small rounded" style={{ background: 'rgba(197, 164, 109, 0.2)', border: '1px solid var(--color-gold)', color: 'var(--color-ivory)' }}>
                <i className="bi bi-check2-circle me-1 text-gold"></i>
                <span>Namaste. You are now subscribed to our private gazette.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="d-flex gap-2">
                <input
                  type="email"
                  required
                  className="form-control form-control-sm"
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF', borderColor: 'rgba(197, 164, 109, 0.3)' }}
                />
                <button type="submit" className="btn btn-gold btn-sm px-3">
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 border-top d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 small" style={{ borderColor: 'rgba(255, 255, 255, 0.1) !important' }}>
          <p className="mb-0" style={{ color: 'rgba(247, 242, 232, 0.6)' }}>
            &copy; {new Date().getFullYear()} HotelPro India Hospitality Pvt. Ltd. All rights reserved.
          </p>
          <div className="d-flex gap-4" style={{ color: 'rgba(247, 242, 232, 0.6)' }}>
            <Link to="/about" className="text-decoration-none">Hospitality Code</Link>
            <Link to="/contact" className="text-decoration-none">Guest Privacy</Link>
            <Link to="/contact" className="text-decoration-none">Terms of Stay</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
