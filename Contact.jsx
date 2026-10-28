import React, { useState } from 'react';
import AlertMessage from '../components/common/AlertMessage';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 500);
  };

  return (
    <div className="py-5" style={{ minHeight: '80vh', backgroundColor: 'var(--color-ivory)' }}>
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <span className="hero-tag mb-1 d-inline-block">
            Palace Concierge Desk
          </span>
          <h1 className="display-4 fw-bold font-serif text-indigo mt-1">
            Connect with HotelPro
          </h1>
          <p className="lead text-muted mx-auto" style={{ maxWidth: '680px' }}>
            Our 24/7 Royal Khidmatgar and palace guest experience team are dedicated to ensuring every inquiry receives prompt, courteous attention.
          </p>
          <div className="jali-divider">
            <span className="jali-symbol">✦</span>
          </div>
        </div>

        <div className="row g-5 mb-5">
          {/* Contact Details */}
          <div className="col-lg-5">
            <div className="card ornamental-border rounded-3 p-4 p-md-5 bg-white h-100 shadow-sm">
              <h4 className="fw-bold font-serif mb-2 text-indigo">Concierge & Front Desk</h4>
              <div className="gold-rule"></div>

              <div className="d-flex flex-column gap-4 mb-4">
                <div className="d-flex align-items-start gap-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: '44px', height: '44px', background: 'var(--color-ivory)', color: 'var(--color-gold)' }}
                  >
                    <i className="bi bi-geo-alt fs-5"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1 text-indigo">Palace Sanctuary Location</h6>
                    <p className="text-muted small mb-0">
                      HotelPro Heritage Sanctuaries<br />
                      Lake Pichola Road, Near City Palace<br />
                      Udaipur, Rajasthan 313001, India
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: '44px', height: '44px', background: 'var(--color-ivory)', color: 'var(--color-gold)' }}
                  >
                    <i className="bi bi-telephone fs-5"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1 text-indigo">Telephone & WhatsApp</h6>
                    <p className="text-muted small mb-0">
                      Front Desk: +91 (0294) 555-4683<br />
                      Toll-Free (India): 1800 120 4683<br />
                      Concierge WhatsApp: +91 98110 23456
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: '44px', height: '44px', background: 'var(--color-ivory)', color: 'var(--color-gold)' }}
                  >
                    <i className="bi bi-envelope fs-5"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1 text-indigo">Direct Inquiries</h6>
                    <p className="text-muted small mb-0">
                      Reservations: reservations@hotelpro.in<br />
                      Concierge Desk: concierge@hotelpro.in
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: '44px', height: '44px', background: 'var(--color-ivory)', color: 'var(--color-gold)' }}
                  >
                    <i className="bi bi-clock fs-5"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1 text-indigo">Hours of Hospitality</h6>
                    <p className="text-muted small mb-0">
                      24 hours a day, 7 days a week, 365 days a year.<br />
                      Check-in from 2:00 PM &bull; Check-out until 11:00 AM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="col-lg-7">
            <div className="card ornamental-border rounded-3 p-4 p-md-5 bg-white shadow-sm h-100">
              <h4 className="fw-bold font-serif mb-2 text-indigo">Send an Inquiry</h4>
              <div className="gold-rule"></div>

              {submitted && (
                <div className="mb-4">
                  <AlertMessage
                    variant="success"
                    message="Namaste. Your message has reached our concierge desk. We will respond within 4 hours."
                    onClose={() => setSubmitted(false)}
                  />
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Katherine Sterling"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      className="form-control"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Subject</label>
                  <select
                    className="form-select"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  >
                    <option value="">Select subject of inquiry...</option>
                    <option value="Reservation inquiry">Reservation or tariff inquiry</option>
                    <option value="Special dietary request">Jain / Satvik dietary request</option>
                    <option value="Airport transfer">Maharana Pratap Airport transfer</option>
                    <option value="Celebration or retreat">Private celebration / retreat</option>
                    <option value="General inquiry">General assistance</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label">Your Message *</label>
                  <textarea
                    rows="4"
                    required
                    placeholder="How may our concierge team be of assistance to your upcoming stay?"
                    className="form-control"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-indigo px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span>Delivering Message...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send"></i>
                      <span>Send to Concierge</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="card ornamental-border bg-white rounded-3 shadow-sm p-4 p-md-5">
          <div className="text-center mb-4">
            <span className="hero-tag mb-1 d-inline-block">Guest Queries</span>
            <h4 className="fw-bold font-serif text-indigo">Frequently Asked Questions</h4>
            <div className="gold-rule gold-rule-center"></div>
          </div>

          <div className="row g-4">
            <div className="col-md-6">
              <h6 className="fw-bold text-indigo mb-1">What government identity proof is mandatory?</h6>
              <p className="text-muted small mb-0">
                As per Govt. of India regulations, all Indian citizens must present a valid Aadhaar Card, Passport, Voter ID, or Driving License. International guests must present a valid Passport and Indian Visa or OCI card.
              </p>
            </div>

            <div className="col-md-6">
              <h6 className="fw-bold text-indigo mb-1">Can I cancel my reservation without charges?</h6>
              <p className="text-muted small mb-0">
                Yes, reservations can be cancelled directly through your personal Guest Portal up to the day of check-in with zero cancellation penalties.
              </p>
            </div>

            <div className="col-md-6">
              <h6 className="fw-bold text-indigo mb-1">Are Jain and Satvik meals available?</h6>
              <p className="text-muted small mb-0">
                Absolutely. Our royal kitchens prepare separate Sattvik, Jain, and vegan delicacies without onion or garlic upon prior intimation during reservation.
              </p>
            </div>

            <div className="col-md-6">
              <h6 className="fw-bold text-indigo mb-1">How is the booking tariff paid?</h6>
              <p className="text-muted small mb-0">
                HotelPro guarantees your booking without upfront deductions. The room tariff is settled upon check-in via UPI (GPay/PhonePe), Credit Card, or Cash.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
