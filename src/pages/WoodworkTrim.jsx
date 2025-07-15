import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import './ServicePlaceholder.css';

const WoodworkTrim = () => {
  useEffect(() => {
    document.title = 'Woodwork & Trim Painting | The Painter Guys Pros';
    document.querySelector('meta[name="description"]')?.setAttribute('content',
      'Woodwork and trim painting by The Painter Guys Pros. Crisp, clean lines and flawless finishes.'
    );
  }, []);

  return (
    <div className="service-placeholder-page">
      <section className="service-placeholder-hero">
        <img src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80" alt="Woodwork & Trim Painting" className="service-placeholder-img" />
        <div className="service-placeholder-content">
          <h1><FaCheckCircle /> Woodwork & Trim Painting</h1>
          <p>Crisp, clean lines and flawless finishes for all your woodwork and trim.</p>
          <Link to="/free-quote" className="btn btn-cta btn-large">Request a Free Quote</Link>
        </div>
      </section>
    </div>
  );
};

export default WoodworkTrim; 