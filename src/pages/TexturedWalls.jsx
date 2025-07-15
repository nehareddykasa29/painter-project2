import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPaintBrush } from 'react-icons/fa';
import './ServicePlaceholder.css';

const TexturedWalls = () => {
  useEffect(() => {
    document.title = 'Textured Wall & Ceiling Painting | The Painter Guys Pros';
    document.querySelector('meta[name="description"]')?.setAttribute('content',
      'Textured wall and ceiling painting by The Painter Guys Pros. Add depth and style to your space.'
    );
  }, []);

  return (
    <div className="service-placeholder-page">
      <section className="service-placeholder-hero">
        <img src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1200&q=80" alt="Textured Wall & Ceiling Painting" className="service-placeholder-img" />
        <div className="service-placeholder-content">
          <h1><FaPaintBrush /> Textured Wall & Ceiling Painting</h1>
          <p>Add depth and style to your home with expert textured wall and ceiling painting.</p>
          <Link to="/free-quote" className="btn btn-cta btn-large">Request a Free Quote</Link>
        </div>
      </section>
    </div>
  );
};

export default TexturedWalls; 