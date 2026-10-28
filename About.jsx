import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="py-5" style={{ minHeight: '80vh', backgroundColor: 'var(--color-ivory)' }}>
      <div className="container">
        {/* Hero Banner */}
        <div className="text-center mb-5">
          <span className="hero-tag mb-1 d-inline-block">
            अतिथि देवो भव &bull; Our Story & Ethos
          </span>
          <h1 className="display-4 fw-bold font-serif text-indigo mt-1">
            The Art of Indian Living
          </h1>
          <p className="lead text-muted mx-auto" style={{ maxWidth: '720px' }}>
            Born from a deep devotion to Rajputana architectural majesty, Kerala Ayurvedic serenity, and the ancient Indian ethos of treating every traveler as a sacred presence.
          </p>
          <div className="jali-divider">
            <span className="jali-symbol">✦</span>
          </div>
        </div>

        {/* Narrative Section 1 */}
        <div className="row align-items-center g-5 mb-5 pb-4">
          <div className="col-lg-6">
            <div className="position-relative">
              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
                alt="Udaipur palace lake reflection"
                className="rounded-3 shadow-md w-100 object-fit-cover"
                style={{ height: '420px', border: '1px solid rgba(197, 164, 109, 0.3)' }}
              />
              <div
                className="position-absolute bottom-0 start-0 m-4 p-3 bg-white rounded-2 shadow-sm border"
                style={{ maxWidth: '260px', borderColor: 'rgba(197, 164, 109, 0.4)' }}
              >
                <div className="fw-bold font-serif text-indigo">Preserving Living Heritage</div>
                <small className="text-muted">Over 8 years of authentic boutique Indian hospitality</small>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <span className="text-gold small fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>
              Architectural Roots
            </span>
            <h3 className="fw-bold font-serif text-indigo my-2">A Celebration of Indian Artisanal Splendor</h3>
            <div className="gold-rule"></div>
            <p className="text-charcoal-muted mb-3" style={{ lineHeight: '1.8' }}>
              At HotelPro, our vision is to revive the contemplative grandeur of Indian royal residences while providing contemporary five-star eco-luxury. Drawing inspiration from Mewar palaces, Jaipur havelis, and tranquil Malabar backwaters, our suites feature hand-chiseled stone jaalis, brass lanterns, fresco motifs, and Italian marble courtyards.
            </p>
            <p className="text-charcoal-muted mb-4" style={{ lineHeight: '1.8' }}>
              Every guest is welcomed with traditional marigold garlands and sandalwood tilak. Whether you are traveling for a quiet retreat, a cultural pilgrimage, or an executive summit, our devoted Khidmatgars orchestrate each moment with grace and discretion.
            </p>

            <div className="row g-3">
              <div className="col-sm-6">
                <div className="p-3 bg-white rounded-2 border" style={{ borderColor: 'rgba(197, 164, 109, 0.3)' }}>
                  <h4 className="fw-bold text-indigo font-serif mb-1">99.4%</h4>
                  <small className="text-muted">Guest Satisfaction & Return Index</small>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="p-3 bg-white rounded-2 border" style={{ borderColor: 'rgba(197, 164, 109, 0.3)' }}>
                  <h4 className="fw-bold text-indigo font-serif mb-1">100%</h4>
                  <small className="text-muted">Eco-Minded Heritage Restoration</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Pillars */}
        <div id="architecture" className="card ornamental-border bg-white rounded-3 shadow-sm p-4 p-md-5 mb-5">
          <div className="text-center mb-5">
            <span className="hero-tag mb-1 d-inline-block">Cultural Tenets</span>
            <h3 className="fw-bold font-serif text-indigo">Pillars of Indian Hospitality</h3>
            <p className="text-muted small">Honoring centuries of cultural reverence and mindful care</p>
            <div className="jali-divider">
              <span className="jali-symbol">✦</span>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-md-4 text-center">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: '56px', height: '56px', background: 'var(--color-ivory)', color: 'var(--color-gold)' }}
              >
                <i className="bi bi-heart-pulse fs-3"></i>
              </div>
              <h5 className="fw-bold font-serif text-indigo mb-2">Atithi Devo Bhava</h5>
              <p className="text-muted small">
                The guest is divine. Anticipating your wishes with heartfelt warmth, from authentic Sattvik and Jain dietary preparations to evening courtyard tea ceremonies.
              </p>
            </div>

            <div className="col-md-4 text-center">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: '56px', height: '56px', background: 'var(--color-ivory)', color: 'var(--color-gold)' }}
              >
                <i className="bi bi-flower2 fs-3"></i>
              </div>
              <h5 className="fw-bold font-serif text-indigo mb-2">Mindful Craft & Architecture</h5>
              <p className="text-muted small">
                Partnering with multi-generational master stone carvers, textile weavers, and brass smiths to sustain living Indian artisan traditions.
              </p>
            </div>

            <div className="col-md-4 text-center">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: '56px', height: '56px', background: 'var(--color-ivory)', color: 'var(--color-gold)' }}
              >
                <i className="bi bi-droplet-half fs-3"></i>
              </div>
              <h5 className="fw-bold font-serif text-indigo mb-2">Ayurveda & Rejuvenation</h5>
              <p className="text-muted small">
                Rooted in authentic Kerala Ayurvedic healing principles, therapeutic herbal oil formulations, and morning yoga overlooking calm waters.
              </p>
            </div>
          </div>
        </div>

        {/* CTA to Explore */}
        <div className="text-center py-4">
          <Link to="/rooms" className="btn btn-indigo px-4 py-2 me-2">
            Explore Stays & Sanctuaries
          </Link>
          <Link to="/contact" className="btn btn-outline-indigo px-4 py-2">
            Contact Concierge Desk
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
