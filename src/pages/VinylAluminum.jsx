import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import './ServicePlaceholder.css';

const VinylAluminum = () => {
  useEffect(() => {
    document.title = 'Vinyl & Aluminum Siding | The Painter Guys Pros';
    document.querySelector('meta[name="description"]')?.setAttribute('content',
      'Vinyl and aluminum siding painting and restoration by The Painter Guys Pros. Boost curb appeal and protection.'
    );
  }, []);

  return (
    <div className="service-placeholder-page">
      <section className="service-placeholder-hero">
        <img src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80" alt="Vinyl & Aluminum Siding" className="service-placeholder-img" />
        <div className="service-placeholder-content">
          <h1><FaHome /> Vinyl & Aluminum Siding</h1>
          <p>Refresh and protect your home’s exterior with professional siding painting and restoration.</p>
          <Link to="/free-quote" className="btn btn-cta btn-large">Request a Free Quote</Link>
        </div>
      </section>
    </div>
  );
};

export default VinylAluminum; 