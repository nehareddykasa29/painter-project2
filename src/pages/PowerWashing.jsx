import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCogs } from 'react-icons/fa';
import './ServicePlaceholder.css';

const PowerWashing = () => {
  useEffect(() => {
    document.title = 'Power Washing | The Painter Guys Pros';
    document.querySelector('meta[name="description"]')?.setAttribute('content',
      'Professional power washing for homes and businesses. Clean, prep, and restore with The Painter Guys Pros.'
    );
  }, []);

  return (
    <div className="service-placeholder-page">
      <section className="service-placeholder-hero">
        <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1200&q=80" alt="Power Washing" className="service-placeholder-img" />
        <div className="service-placeholder-content">
          <h1><FaCogs /> Power Washing</h1>
          <p>Clean, prep, and restore your property’s surfaces for a flawless finish.</p>
          <Link to="/free-quote" className="btn btn-cta btn-large">Request a Free Quote</Link>
        </div>
      </section>
    </div>
  );
};

export default PowerWashing; 