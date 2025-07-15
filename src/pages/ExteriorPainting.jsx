import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaHome } from 'react-icons/fa';
import './ExteriorPainting.css';

const features = [
  'Full exterior house painting',
  'Siding, trim, doors, and more',
  'Deck and fence staining/painting',
  'Power washing and surface prep',
  'Weather-resistant, premium paints',
  'Clean-up and protection guaranteed',
];

const ExteriorPainting = () => {
  useEffect(() => {
    document.title = 'Exterior Painting | The Painter Guys Pros';
    document.querySelector('meta[name="description"]')?.setAttribute('content',
      'Boost curb appeal and protect your home with expert exterior painting by The Painter Guys Pros. Free estimates and premium finishes.'
    );
  }, []);

  return (
    <div className="exterior-painting-page">
      <section className="exterior-hero">
        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80" alt="Exterior Painting" className="exterior-hero-img" />
        <div className="exterior-hero-content">
          <h1>Exterior Painting</h1>
          <p>Boost curb appeal and protect your home with flawless exterior finishes.</p>
        </div>
      </section>
      <section className="exterior-features-section">
        <h2>Our Exterior Painting Services Include:</h2>
        <ul className="exterior-features-list">
          {features.map((feature, idx) => (
            <li key={idx}><FaCheckCircle className="feature-icon" /> {feature}</li>
          ))}
        </ul>
        <div className="exterior-cta">
          <Link to="/free-quote" className="btn btn-cta btn-large">Book Your Free Estimate</Link>
        </div>
      </section>
    </div>
  );
};

export default ExteriorPainting; 