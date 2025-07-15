import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import './ServicePlaceholder.css';

const StuccoRepair = () => {
  useEffect(() => {
    document.title = 'Stucco Repair and Painting | The Painter Guys Pros';
    document.querySelector('meta[name="description"]')?.setAttribute('content',
      'Expert stucco repair and painting for homes and businesses. Restore and beautify with The Painter Guys Pros.'
    );
  }, []);

  return (
    <div className="service-placeholder-page">
      <section className="service-placeholder-hero">
        <img src="https://images.unsplash.com/photo-1503389152951-9c3d0c6b7a5a?auto=format&fit=crop&w=1200&q=80" alt="Stucco Repair and Painting" className="service-placeholder-img" />
        <div className="service-placeholder-content">
          <h1><FaCheckCircle /> Stucco Repair & Painting</h1>
          <p>Restore, repair, and refresh your stucco surfaces for lasting beauty and protection.</p>
          <Link to="/free-quote" className="btn btn-cta btn-large">Request a Free Quote</Link>
        </div>
      </section>
    </div>
  );
};

export default StuccoRepair; 