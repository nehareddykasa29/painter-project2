import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import './ServicePlaceholder.css';

const WallpaperRemoval = () => {
  useEffect(() => {
    document.title = 'Wallpaper Removal | The Painter Guys Pros';
    document.querySelector('meta[name="description"]')?.setAttribute('content',
      'Wallpaper removal and wall prep by The Painter Guys Pros. Smooth, paint-ready surfaces guaranteed.'
    );
  }, []);

  return (
    <div className="service-placeholder-page">
      <section className="service-placeholder-hero">
        <img src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1200&q=80" alt="Wallpaper Removal" className="service-placeholder-img" />
        <div className="service-placeholder-content">
          <h1><FaCheckCircle /> Wallpaper Removal</h1>
          <p>Remove old wallpaper and prep your walls for a flawless new finish.</p>
          <Link to="/free-quote" className="btn btn-cta btn-large">Request a Free Quote</Link>
        </div>
      </section>
    </div>
  );
};

export default WallpaperRemoval; 