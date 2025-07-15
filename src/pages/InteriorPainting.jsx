import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaPaintBrush } from 'react-icons/fa';
import './InteriorPainting.css';

const features = [
  'Walls, ceilings, and trim expertly painted',
  'Cabinet and woodwork refinishing',
  'Wallpaper removal and surface prep',
  'Color consultation included',
  'Clean, careful, and respectful crews',
  'Premium paints for lasting beauty',
];

const InteriorPainting = () => {
  useEffect(() => {
    document.title = 'Interior Painting | The Painter Guys Pros';
    document.querySelector('meta[name="description"]')?.setAttribute('content',
      'Transform your home with flawless interior painting by The Painter Guys Pros. Free color consultation and premium finishes.'
    );
  }, []);

  return (
    <div className="interior-painting-page">
      <section className="interior-hero">
        <img src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80" alt="Interior Painting" className="interior-hero-img" />
        <div className="interior-hero-content">
          <h1>Interior Painting</h1>
          <p>Flawless finishes, beautiful colors, and a home you’ll love coming back to.</p>
        </div>
      </section>
      <section className="interior-features-section">
        <h2>Our Interior Painting Services Include:</h2>
        <ul className="interior-features-list">
          {features.map((feature, idx) => (
            <li key={idx}><FaCheckCircle className="feature-icon" /> {feature}</li>
          ))}
        </ul>
        <div className="interior-cta">
          <Link to="/free-quote" className="btn btn-cta btn-large">Book Your Free Estimate</Link>
        </div>
      </section>
    </div>
  );
};

export default InteriorPainting; 