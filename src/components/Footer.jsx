import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin,
  FaClock,
  FaShieldAlt
} from 'react-icons/fa';
import './Footer.css';
import logoPainter from '../assets/logo_painter.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="container">
          <div className="footer-content">
            {/* Company Info */}
            <div className="footer-section">
              <div className="footer-logo">
                <div className="logo-icon">
                  <img src={logoPainter} alt="The Painter Guys Pros Logo" className="footer-logo-img" style={{height: '40px', width: 'auto'}} />
                </div>
                <div className="logo-text">
                  <h3 style={{ textTransform: 'uppercase' }}>
                    <span className="footer-logo-name">THE PAINTER GUYS PROS</span>
                  </h3>
                  <p>Professional Painting Services</p>
                </div>
              </div>
              <p className="footer-description">
                Transform your space with our professional painting services. 
                Quality workmanship, premium materials, and exceptional customer service.
              </p>
              <div className="social-links">
                <a href="https://www.facebook.com/thepainterguysmke/" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                  <FaFacebook />
                </a>
                <a href="https://www.instagram.com/thepainterguysllc/" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                  <FaInstagram />
                </a>
                <a href="https://www.linkedin.com/in/sami-hasbani-32574869/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                  <FaLinkedin />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h4>Services</h4>
              <ul className="footer-links">
                <li><Link to="/residential">Residential Painting</Link></li>
                <li><Link to="/commercial">Commercial Painting</Link></li>
                <li><Link to="/color-consultation">Color Consultation</Link></li>
                <li><Link to="/gallery">Project Gallery</Link></li>
                <li><Link to="/free-quote">Free Quote</Link></li>
              </ul>
            </div>

            {/* Company Links */}
            <div className="footer-section">
              <h4>Company</h4>
              <ul className="footer-links">
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/reviews">Customer Reviews</Link></li>
                <li><Link to="/service-areas">Service Areas</Link></li>
                <li><Link to="/warranty">Warranty</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/faq">FAQ</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="footer-section">
              <h4>Contact Information</h4>
              <div className="contact-details">
                <div className="contact-item">
                  <FaPhone />
                  <div>
                    <strong>Phone</strong>
                    <p><a href="tel:1-262-993-3465">1-262-993-3465</a></p>
                  </div>
                </div>
                <div className="contact-item">
                  <FaEnvelope />
                  <div>
                    <strong>Email</strong>
                    <p><a href="mailto:the.painter.guys@live.com">the.painter.guys@live.com</a></p>
                  </div>
                </div>
                <div className="contact-item">
                  <FaMapMarkerAlt />
                  <div>
                    <strong>Service Area</strong>
                    <p>25 miles from city center</p>
                  </div>
                </div>
                <div className="contact-item">
                  <FaClock />
                  <div>
                    <strong>Hours</strong>
                    <p>Mon-Fri: 8AM-6PM<br />Sat: 9AM-4PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <div className="footer-bottom-left">
              <p>&copy; {currentYear} The Painter Guys Pros. All rights reserved.</p>
              <div className="footer-bottom-links">
                <Link to="/privacy">Privacy Policy</Link>
                <Link to="/terms">Terms of Service</Link>
                <Link to="/warranty">
                  <FaShieldAlt /> 2-Year Warranty
                </Link>
              </div>
            </div>
            <div className="footer-bottom-right">
              <div className="service-area-link">
                <Link to="/service-areas">View Full Service Area</Link>
              </div>
              <div className="certifications">
                <span>Licensed & Insured</span>
                <span>•</span>
                <span>Free Estimates</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-service-area-line">
        <span>Serving Milwaukee and Southeast Wisconsin</span>
        <Link to="/service-areas" className="footer-service-area-link">View Full Service Area &rarr;</Link>
      </div>
    </footer>
  );
};

export default Footer; 