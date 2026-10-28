import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as roomService from '../services/roomService';
import RoomCard from '../components/rooms/RoomCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Home = () => {
  const navigate = useNavigate();
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search Bar State
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const [searchForm, setSearchForm] = useState({
    destination: 'All',
    checkIn: todayStr,
    checkOut: tomorrowStr,
    guests: '2',
    type: 'All',
  });

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await roomService.getRooms({ featured: 'true', limit: 3 });
        if (res.success && res.rooms && res.rooms.length > 0) {
          setFeaturedRooms(res.rooms);
        } else {
          const allRes = await roomService.getRooms({ limit: 3 });
          if (allRes.success) {
            setFeaturedRooms(allRes.rooms);
          }
        }
      } catch (err) {
        console.error('Failed to load featured rooms:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchForm.destination && searchForm.destination !== 'All') {
      query.append('search', searchForm.destination);
    }
    if (searchForm.checkIn) query.append('checkIn', searchForm.checkIn);
    if (searchForm.checkOut) query.append('checkOut', searchForm.checkOut);
    if (searchForm.guests) query.append('guests', searchForm.guests);
    if (searchForm.type && searchForm.type !== 'All') query.append('type', searchForm.type);

    navigate(`/rooms?${query.toString()}`);
  };

  return (
    <div>
      {/* 1. Hero Section */}
      <section className="hero-indian-heritage text-center">
        <div className="container py-4">
          <div className="hero-tag">
            अतिथि देवो भव &bull; Timeless Indian Hospitality
          </div>
          <h1 className="hero-title">
            A Stay Rooted in India.
          </h1>
          <p className="hero-description">
            Discover extraordinary stays, timeless hospitality, and the art of Indian living across iconic palace courtyards, backwater retreats, and artisanal boutique sanctuaries.
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Link to="/rooms" className="btn btn-gold btn-lg px-4 py-3 shadow-sm">
              <i className="bi bi-compass me-1"></i>
              <span>Explore Stays</span>
            </Link>
            <Link to="/about" className="btn btn-outline-light btn-lg px-4 py-3">
              <span>Discover Our Story</span>
              <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Integrated Booking Search Panel */}
      <div className="container">
        <div className="booking-search-panel">
          <form onSubmit={handleSearchSubmit} className="row g-3 align-items-end">
            {/* Destination */}
            <div className="col-lg-3 col-md-6">
              <label className="form-label" htmlFor="hero-destination">
                <i className="bi bi-geo-alt text-gold me-1"></i> Destination
              </label>
              <select
                id="hero-destination"
                className="form-select"
                value={searchForm.destination}
                onChange={(e) => setSearchForm({ ...searchForm, destination: e.target.value })}
              >
                <option value="All">All Indian Sanctuaries</option>
                <option value="Udaipur">Udaipur, Rajasthan</option>
                <option value="Jaipur">Jaipur, Rajasthan</option>
                <option value="Jodhpur">Jodhpur, Rajasthan</option>
                <option value="Kerala">Kumarakom, Kerala</option>
                <option value="Varanasi">Varanasi, Uttar Pradesh</option>
              </select>
            </div>

            {/* Check-In */}
            <div className="col-lg-2 col-md-6">
              <label className="form-label" htmlFor="hero-checkIn">
                <i className="bi bi-calendar-event text-gold me-1"></i> Check-in
              </label>
              <input
                id="hero-checkIn"
                type="date"
                min={todayStr}
                required
                className="form-control"
                value={searchForm.checkIn}
                onChange={(e) => setSearchForm({ ...searchForm, checkIn: e.target.value })}
              />
            </div>

            {/* Check-Out */}
            <div className="col-lg-2 col-md-6">
              <label className="form-label" htmlFor="hero-checkOut">
                <i className="bi bi-calendar-check text-gold me-1"></i> Check-out
              </label>
              <input
                id="hero-checkOut"
                type="date"
                min={searchForm.checkIn || todayStr}
                required
                className="form-control"
                value={searchForm.checkOut}
                onChange={(e) => setSearchForm({ ...searchForm, checkOut: e.target.value })}
              />
            </div>

            {/* Guests & Category */}
            <div className="col-lg-2 col-md-3 col-6">
              <label className="form-label" htmlFor="hero-guests">
                <i className="bi bi-people text-gold me-1"></i> Guests
              </label>
              <select
                id="hero-guests"
                className="form-select"
                value={searchForm.guests}
                onChange={(e) => setSearchForm({ ...searchForm, guests: e.target.value })}
              >
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
              </select>
            </div>

            <div className="col-lg-3 col-md-3 col-6">
              <button
                type="submit"
                className="btn btn-indigo w-100 py-2 fs-6 fw-semibold d-flex align-items-center justify-content-center gap-2"
                style={{ height: '42px' }}
              >
                <i className="bi bi-search"></i>
                <span>Search Availability</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 3. Featured Stays (Editorial Cards) */}
      <section className="py-5 mt-4">
        <div className="container py-2">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
            <div>
              <span className="hero-tag mb-1 d-inline-block">Curated Sanctuaries</span>
              <h2 className="display-6 fw-bold font-serif text-indigo mb-1">
                Featured Accommodations
              </h2>
              <p className="text-muted small mb-0">
                Spacious suites inspired by historic havelis, royal residences, and tranquil backwaters.
              </p>
            </div>
            <Link to="/rooms" className="btn btn-outline-indigo mt-3 mt-md-0 btn-sm">
              <span>View All Stays</span>
              <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>

          <div className="jali-divider mb-4">
            <span className="jali-symbol">✦</span>
          </div>

          {loading ? (
            <div className="py-5">
              <LoadingSpinner text="Presenting curated Indian sanctuaries..." />
            </div>
          ) : (
            <div className="row g-4">
              {featuredRooms.map((room) => (
                <div key={room._id} className="col-lg-4 col-md-6">
                  <RoomCard room={room} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Indian Hospitality Experiences (Visual Sections) */}
      <section id="experiences" className="py-5 bg-white border-top border-bottom">
        <div className="container py-3">
          <div className="text-center mb-5">
            <span className="hero-tag mb-1 d-inline-block">The Art of Indian Living</span>
            <h2 className="display-6 fw-bold font-serif text-indigo">
              Cultural Experiences & Inspirations
            </h2>
            <div className="jali-divider">
              <span className="jali-symbol">✦</span>
            </div>
            <p className="text-muted mx-auto small" style={{ maxWidth: '640px' }}>
              <em>Editorial discovery:</em> Explore the heritage traditions and regional craftsmanship that inspire HotelPro stays across India.
            </p>
          </div>

          <div className="row g-4">
            {/* Experience 1: Royal Rajasthani Architecture */}
            <div className="col-lg-3 col-md-6">
              <div className="card ornamental-card h-100 p-0 border-0 overflow-hidden">
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  <img
                    src="https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80"
                    alt="Royal Rajasthani architecture"
                    className="w-100 h-100 object-fit-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 d-flex flex-column flex-grow-1">
                  <span className="text-gold small fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>
                    Rajasthan
                  </span>
                  <h5 className="font-serif fw-bold text-indigo my-2">
                    Royal Rajasthani Architecture
                  </h5>
                  <p className="small text-muted mb-3 flex-grow-1">
                    Stone jaali carvings that temper desert light, jharokha balconies overlooking ancient waters, and hand-painted fresco ceilings.
                  </p>
                  <div className="pt-2 border-top small text-muted">
                    <span className="text-terracotta fw-semibold">Design Detail:</span> Mewar archways & marble courtyards
                  </div>
                </div>
              </div>
            </div>

            {/* Experience 2: Kerala Backwaters */}
            <div className="col-lg-3 col-md-6">
              <div className="card ornamental-card h-100 p-0 border-0 overflow-hidden">
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  <img
                    src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80"
                    alt="Kerala backwaters and serene waterways"
                    className="w-100 h-100 object-fit-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 d-flex flex-column flex-grow-1">
                  <span className="text-gold small fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>
                    Kerala
                  </span>
                  <h5 className="font-serif fw-bold text-indigo my-2">
                    Backwaters & Tranquil Retreats
                  </h5>
                  <p className="small text-muted mb-3 flex-grow-1">
                    Verdant coconut palms, tranquil lagoons, rosewood verandas, and gentle Ayurvedic rituals designed to restore inner equilibrium.
                  </p>
                  <div className="pt-2 border-top small text-muted">
                    <span className="text-terracotta fw-semibold">Design Detail:</span> Malabar teak & open lotus courtyards
                  </div>
                </div>
              </div>
            </div>

            {/* Experience 3: Contemporary Boutique Stays */}
            <div className="col-lg-3 col-md-6">
              <div className="card ornamental-card h-100 p-0 border-0 overflow-hidden">
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  <img
                    src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80"
                    alt="Contemporary boutique luxury interior"
                    className="w-100 h-100 object-fit-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 d-flex flex-column flex-grow-1">
                  <span className="text-gold small fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>
                    Modern India
                  </span>
                  <h5 className="font-serif fw-bold text-indigo my-2">
                    Contemporary Boutique Stays
                  </h5>
                  <p className="small text-muted mb-3 flex-grow-1">
                    Where traditional brass smithing and hand-knotted textiles meet quiet minimalism, acoustic serenity, and modern eco-luxury.
                  </p>
                  <div className="pt-2 border-top small text-muted">
                    <span className="text-terracotta fw-semibold">Design Detail:</span> Artisanal linens & smart comfort
                  </div>
                </div>
              </div>
            </div>

            {/* Experience 4: Indian Culinary & Cultural Living */}
            <div className="col-lg-3 col-md-6">
              <div className="card ornamental-card h-100 p-0 border-0 overflow-hidden">
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  <img
                    src="https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&w=800&q=80"
                    alt="Indian culinary and royal dining experience"
                    className="w-100 h-100 object-fit-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 d-flex flex-column flex-grow-1">
                  <span className="text-gold small fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>
                    Culinary Art
                  </span>
                  <h5 className="font-serif fw-bold text-indigo my-2">
                    Culinary & Living Traditions
                  </h5>
                  <p className="small text-muted mb-3 flex-grow-1">
                    Multi-course Royal Thalis, organic farm-to-table harvests, courtyard masala chai rituals, and fragrant marigold welcomes.
                  </p>
                  <div className="pt-2 border-top small text-muted">
                    <span className="text-terracotta fw-semibold">Design Detail:</span> Kansa bronze thalis & slow cooking
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Trust and Service (Truthful, functional information) */}
      <section className="py-5">
        <div className="container py-3">
          <div className="text-center mb-5">
            <span className="hero-tag mb-1 d-inline-block">The HotelPro Promise</span>
            <h2 className="display-6 fw-bold font-serif text-indigo">
              Thoughtful, Dependable Hospitality
            </h2>
            <div className="jali-divider">
              <span className="jali-symbol">✦</span>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-md-3 col-sm-6">
              <div className="p-4 bg-white rounded-3 ornamental-border h-100 text-center shadow-sm">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{ width: '56px', height: '56px', background: 'var(--color-ivory)', color: 'var(--color-gold)' }}
                >
                  <i className="bi bi-shield-check fs-3"></i>
                </div>
                <h6 className="fw-bold text-indigo mb-2 font-serif">Transparent Pricing</h6>
                <p className="text-muted small mb-0">
                  Direct server rates with no hidden processing fees. Clear tax breakdowns before reservation confirmation.
                </p>
              </div>
            </div>

            <div className="col-md-3 col-sm-6">
              <div className="p-4 bg-white rounded-3 ornamental-border h-100 text-center shadow-sm">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{ width: '56px', height: '56px', background: 'var(--color-ivory)', color: 'var(--color-gold)' }}
                >
                  <i className="bi bi-key fs-3"></i>
                </div>
                <h6 className="fw-bold text-indigo mb-2 font-serif">Secure Authentication</h6>
                <p className="text-muted small mb-0">
                  Protected guest profiles with JWT token authorization, bcrypt password protection, and safe booking storage.
                </p>
              </div>
            </div>

            <div className="col-md-3 col-sm-6">
              <div className="p-4 bg-white rounded-3 ornamental-border h-100 text-center shadow-sm">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{ width: '56px', height: '56px', background: 'var(--color-ivory)', color: 'var(--color-gold)' }}
                >
                  <i className="bi bi-calendar2-check fs-3"></i>
                </div>
                <h6 className="fw-bold text-indigo mb-2 font-serif">Reservation Management</h6>
                <p className="text-muted small mb-0">
                  Check upcoming stays, review booking references, and cancel reservations directly from your personal guest portal.
                </p>
              </div>
            </div>

            <div className="col-md-3 col-sm-6">
              <div className="p-4 bg-white rounded-3 ornamental-border h-100 text-center shadow-sm">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{ width: '56px', height: '56px', background: 'var(--color-ivory)', color: 'var(--color-gold)' }}
                >
                  <i className="bi bi-headset fs-3"></i>
                </div>
                <h6 className="fw-bold text-indigo mb-2 font-serif">24/7 Concierge Support</h6>
                <p className="text-muted small mb-0">
                  Round-the-clock front desk and guest experience team ready to assist with arrivals, itinerary questions, and requests.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Guest Reflections (Indian Hospitality Testimonials) */}
      <section className="py-5 bg-white border-top">
        <div className="container py-2">
          <div className="text-center mb-5">
            <span className="hero-tag mb-1 d-inline-block">Guest Reflections</span>
            <h2 className="display-6 fw-bold font-serif text-indigo">
              Cherished Moments from Our Guests
            </h2>
            <div className="jali-divider">
              <span className="jali-symbol">✦</span>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 ornamental-border rounded-3 p-4 shadow-sm bg-white">
                <div className="d-flex text-gold mb-3 small">
                  <i className="bi bi-star-fill me-1"></i>
                  <i className="bi bi-star-fill me-1"></i>
                  <i className="bi bi-star-fill me-1"></i>
                  <i className="bi bi-star-fill me-1"></i>
                  <i className="bi bi-star-fill"></i>
                </div>
                <p className="small text-charcoal-muted fst-italic mb-4" style={{ lineHeight: '1.7' }}>
                  "The calm courtyards and the traditional aarti welcome made our stay in Udaipur feel like entering an ancient royal home. Every detail, from the rose sherbet to the jharokha breakfast, was impeccable."
                </p>
                <div className="d-flex align-items-center gap-3 mt-auto pt-3 border-top">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center fw-bold small"
                    style={{ width: '38px', height: '38px', background: 'var(--color-indigo)', color: '#FFFFFF' }}
                  >
                    RM
                  </div>
                  <div>
                    <h6 className="mb-0 fw-semibold text-indigo small">Rohan & Priya Mehta</h6>
                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>Mumbai, Maharashtra</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 ornamental-border rounded-3 p-4 shadow-sm bg-white">
                <div className="d-flex text-gold mb-3 small">
                  <i className="bi bi-star-fill me-1"></i>
                  <i className="bi bi-star-fill me-1"></i>
                  <i className="bi bi-star-fill me-1"></i>
                  <i className="bi bi-star-fill me-1"></i>
                  <i className="bi bi-star-fill"></i>
                </div>
                <p className="small text-charcoal-muted fst-italic mb-4" style={{ lineHeight: '1.7' }}>
                  "HotelPro combines the grandeur of Indian palace architecture with the convenience of instant reservations. Our family reunion in Jaipur will be remembered for years."
                </p>
                <div className="d-flex align-items-center gap-3 mt-auto pt-3 border-top">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center fw-bold small"
                    style={{ width: '38px', height: '38px', background: 'var(--color-maroon)', color: '#FFFFFF' }}
                  >
                    VR
                  </div>
                  <div>
                    <h6 className="mb-0 fw-semibold text-indigo small">Col. Vikramaditya Rathore</h6>
                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>Jaipur, Rajasthan</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 ornamental-border rounded-3 p-4 shadow-sm bg-white">
                <div className="d-flex text-gold mb-3 small">
                  <i className="bi bi-star-fill me-1"></i>
                  <i className="bi bi-star-fill me-1"></i>
                  <i className="bi bi-star-fill me-1"></i>
                  <i className="bi bi-star-fill me-1"></i>
                  <i className="bi bi-star-fill"></i>
                </div>
                <p className="small text-charcoal-muted fst-italic mb-4" style={{ lineHeight: '1.7' }}>
                  "The Malabar Backwaters suite was a haven of stillness. Honest pricing, no surprise fees, and a genuine warmth from the concierge team made all the difference."
                </p>
                <div className="d-flex align-items-center gap-3 mt-auto pt-3 border-top">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center fw-bold small"
                    style={{ width: '38px', height: '38px', background: 'var(--color-indigo)', color: '#FFFFFF' }}
                  >
                    SK
                  </div>
                  <div>
                    <h6 className="mb-0 fw-semibold text-indigo small">Sneha & Aditya Kulkarni</h6>
                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>Bengaluru, Karnataka</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
