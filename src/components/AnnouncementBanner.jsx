import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const AnnouncementBanner = () => (
  <div className="announcement-banner">
    <span>
      Your Trusted Painting Experts Across Milwaukee and Beyond — Delivering Excellence to Homes and Businesses Throughout Southeast Wisconsin
    </span>
    <Link to="/service-areas" className="service-area-link">
      View Full Service Area &rarr;
    </Link>
  </div>
);

export default AnnouncementBanner; 