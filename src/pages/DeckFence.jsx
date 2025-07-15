import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import './ServicePlaceholder.css';

const DeckFence = () => {
  useEffect(() => {
    document.title = 'Deck & Fence Services | The Painter Guys Pros';
    document.querySelector('meta[name="description"]')?.setAttribute('content',
      'Deck and fence painting, staining, and restoration by The Painter Guys Pros. Protect and beautify your outdoor spaces.'
    );
  }, []);

  return (
    <div className="service-placeholder-page">
      <section className="service-placeholder-hero">
        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80" alt="Deck & Fence Services" className="service-placeholder-img" />
        <div className="service-placeholder-content">
          <h1><FaCheckCircle /> Deck & Fence Services</h1>
          <p>Stain, seal, and protect your deck and fence for years of beauty and durability.</p>
          <Link to="/free-quote" className="btn btn-cta btn-large">Request a Free Quote</Link>
        </div>
      </section>
    </div>
  );
};

export default DeckFence; 