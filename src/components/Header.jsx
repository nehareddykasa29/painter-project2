import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaPaintBrush, FaHome, FaBuilding, FaCheckCircle, 
  FaStar, FaQuoteLeft, FaImages, FaPalette, FaCogs, FaPhone, FaChevronDown, FaBars, FaTimes, FaSearch, FaEnvelope } from 'react-icons/fa';
import './Header.css';
import logoPainter from '../assets/logo_painter.png';

// Dropdown structure
const residentialDropdown = {
  exterior: {
    title: 'Exterior Services',
    mainLink: '/exterior-painting',
    services: [
      { path: '/exterior-painting', label: 'Exterior Painting' },
      { path: '/power-washing', label: 'Power Washing' },
      { path: '/stucco-repair', label: 'Stucco Repair and Painting' },
      { path: '/vinyl-aluminum', label: 'Vinyl and Aluminum Siding' },
      { path: '/deck-fence', label: 'Deck & Fence Services' },
    ]
  },
  interior: {
    title: 'Interior Services',
    mainLink: '/interior-painting',
    services: [
      { path: '/interior-painting', label: 'Interior Painting' },
      { path: '/cabinet-refinishing', label: 'Cabinet Refinishing/Repainting' },
      { path: '/wallpaper-removal', label: 'Wallpaper Removal' },
      { path: '/textured-walls', label: 'Textured Wall & Ceiling Painting' },
      { path: '/woodwork-trim', label: 'Woodwork and Trim Painting' },
    ]
  }
};

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
        <div className="top-bar-content">
          <a href="tel:1-262-993-3465" className="contact-link">
            <FaPhone /> 1-262-993-3465
          </a>
          <a href="mailto:the.painter.guys@live.com" className="contact-link">
            <FaEnvelope /> the.painter.guys@live.com
          </a>
          <Link to="/free-quote" className="btn btn-cta btn-small">
            Book Free Visit
          </Link>
        </div>
      </div>

      {/* Main Header */}
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}> 
        <div className="header-content">
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
                        {link.label}
                      </Link>
                      <div className={`dropdown-menu${resDropdownOpen ? ' open' : ''}`}>
                        <div className="dropdown-content">
                          {/* Exterior Services Column */}
                          <div className="dropdown-column">
                            <div className="dropdown-header">
                              <FaPaintBrush className="dropdown-icon-small" />
                              <h4>{residentialDropdown.exterior.title}</h4>
                              <Link to={residentialDropdown.exterior.mainLink} className="dropdown-main-link">
                                View All Exterior Services
                              </Link>
                            </div>
                            <ul className="dropdown-services">
                              {residentialDropdown.exterior.services.map((item) => (
                                <li key={item.path}>
                                  <Link to={item.path}>{item.label}</Link>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Interior Services Column */}
                          <div className="dropdown-column">
                            <div className="dropdown-header">
                              <FaHome className="dropdown-icon-small" />
                              <h4>{residentialDropdown.interior.title}</h4>
                              <Link to={residentialDropdown.interior.mainLink} className="dropdown-main-link">
                                View All Interior Services
                              </Link>
                            </div>
                            <ul className="dropdown-services">
                              {residentialDropdown.interior.services.map((item) => (
                                <li key={item.path}>
                                  <Link to={item.path}>{item.label}</Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link to={link.path} className={location.pathname === link.path ? 'active' : ''}>
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            <div className="search-container">
              <input 
                type="text" 
                placeholder="Search for color inspiration" 
                className="search-input"
              />
              <button className="search-icon" aria-label="Search">
                <FaSearch />
              </button>
            </div>
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
      </header>
    </>
  );
};

export default Header; 