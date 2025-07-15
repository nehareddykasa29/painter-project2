import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPaintBrush } from 'react-icons/fa';
import './ServicePlaceholder.css';

const CabinetRefinishing = () => {
  useEffect(() => {
    document.title = 'Cabinet Refinishing & Repainting | The Painter Guys Pros';
    document.querySelector('meta[name="description"]')?.setAttribute('content',
      'Cabinet refinishing and repainting by The Painter Guys Pros. Modernize your kitchen or bath with flawless finishes.'
    );
  }, []);

  return (
    <div className="service-placeholder-page">
      <section className="service-placeholder-hero">
        <img src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1200&q=80" alt="Cabinet Refinishing" className="service-placeholder-img" />
        <div className="service-placeholder-content">
          <h1><FaPaintBrush /> Cabinet Refinishing</h1>
          <p>Modernize your kitchen or bath with flawless cabinet refinishing and repainting.</p>
          <Link to="/free-quote" className="btn btn-cta btn-large">Request a Free Quote</Link>
        </div>
      </section>
    </div>
  );
};

export default CabinetRefinishing; 