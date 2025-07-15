import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBars, FaTimes, FaPhone, FaEnvelope, FaChevronDown } from 'react-icons/fa';
import AnnouncementBanner from './AnnouncementBanner';
import './Header.css';
import logoPainter from '../assets/logo_painter.png';

const residentialDropdown = [
  { path: '/interior-painting', label: 'Interior Painting' },
  { path: '/exterior-painting', label: 'Exterior Painting' },
  { path: '/power-washing', label: 'Power Washing' },
  { path: '/stucco-repair', label: 'Stucco Repair and Painting' },
  { path: '/vinyl-aluminum', label: 'Vinyl and Aluminum Siding' },
  { path: '/deck-fence', label: 'Deck & Fence Services' },
  { path: '/cabinet-refinishing', label: 'Cabinet Refinishing/Repainting' },
  { path: '/wallpaper-removal', label: 'Wallpaper Removal' },
  { path: '/textured-walls', label: 'Textured Wall & Ceiling Painting' },
  { path: '/woodwork-trim', label: 'Woodwork and Trim Painting' },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [resDropdownOpen, setResDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setResDropdownOpen(false);
  }, [location]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleResDropdown = () => setResDropdownOpen((open) => !open);

  const navLinks = [
    { path: '/residential', label: 'Residential', dropdown: true },
    { path: '/commercial', label: 'Commercial' },
    { path: '/reviews', label: 'Reviews' },
    { path: '/about', label: 'About Us' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/faq', label: 'FAQ' },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="top-bar">
        <div className="container">
          <div className="top-bar-content">
            <div className="contact-info">
              <a href="tel:1-262-993-3465" className="contact-link">
                <FaPhone /> 1-262-993-3465
              </a>
            </div>
            <div className="top-bar-cta">
              <Link to="/free-quote" className="btn btn-cta btn-small">
                Get Free Site Visit
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Announcement Banner */}
      {/* <AnnouncementBanner /> */}

      {/* Main Header */}
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}> 
        <div className="container">
          <div className="header-content">
            {/* Logo */}
            <Link to="/" className="logo">
              <div className="logo-icon">
                <img src={logoPainter} alt="The Painter Guys Pros Logo" className="logo-img" />
              </div>
              <div className="logo-text">
                <h1>The Painter Guys Pros</h1>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="desktop-nav">
              <ul className="nav-links">
                {navLinks.map((link) => (
                  <li key={link.path} className={link.dropdown ? 'has-dropdown' : ''}
                      onMouseEnter={() => link.dropdown && setResDropdownOpen(true)}
                      onMouseLeave={() => link.dropdown && setResDropdownOpen(false)}>
                    {link.dropdown ? (
                      <>
                        <Link to={link.path} className={location.pathname.startsWith('/residential') ? 'active' : ''}>
                          {link.label} <FaChevronDown className="dropdown-icon" />
                        </Link>
                        <ul className={`dropdown-menu${resDropdownOpen ? ' open' : ''}`}>
                          {residentialDropdown.map((item) => (
                            <li key={item.path}>
                              <Link to={item.path}>{item.label}</Link>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <Link to={link.path} className={location.pathname === link.path ? 'active' : ''}>
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            {/* Mobile Menu Toggle */}
            <button 
              className="mobile-menu-toggle"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.nav 
          className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: isMenuOpen ? 1 : 0, 
            height: isMenuOpen ? 'auto' : 0 
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="container">
            <ul className="mobile-nav-links">
              <li>
                <Link to="/" className="mobile-logo" onClick={() => setIsMenuOpen(false)}>
                  <img src={logoPainter} alt="The Painter Guys Pros Logo" className="logo-img" style={{ height: '40px', width: 'auto', display: 'block', margin: '0 auto' }} />
                  <div className="logo-text" style={{ textAlign: 'center', color: 'var(--palette-yellow)', fontWeight: 'bold', letterSpacing: '2px', fontSize: '1.1rem' }}>THE PAINTER GUYS PROS</div>
                </Link>
              </li>
              <li>
                <a href="tel:1-262-993-3465" className="contact-link">
                  <FaPhone /> 1-262-993-3465
                </a>
              </li>
              <li>
                <Link to="/free-quote" className="btn btn-cta">
                  Get Free Site Visit
                </Link>
              </li>
              <li className="has-dropdown">
                <button className="dropdown-toggle" onClick={toggleResDropdown}>
                  Residential <FaChevronDown className="dropdown-icon" />
                </button>
                <ul className={`dropdown-menu${resDropdownOpen ? ' open' : ''}`}>
                  {residentialDropdown.map((item) => (
                    <li key={item.path}>
                      <Link to={item.path} onClick={() => setIsMenuOpen(false)}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li><Link to="/commercial" onClick={() => setIsMenuOpen(false)}>Commercial</Link></li>
              <li><Link to="/reviews" onClick={() => setIsMenuOpen(false)}>Reviews</Link></li>
              <li><Link to="/about" onClick={() => setIsMenuOpen(false)}>About Us</Link></li>
              <li><Link to="/gallery" onClick={() => setIsMenuOpen(false)}>Gallery</Link></li>
              <li><Link to="/faq" onClick={() => setIsMenuOpen(false)}>FAQ</Link></li>
            </ul>
          </div>
        </motion.nav>
      </header>
    </>
  );
};

export default Header; 