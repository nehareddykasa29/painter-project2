import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaPaintBrush, FaHome, FaBuilding, FaCheckCircle, FaStar, FaQuoteLeft, FaImages, FaPalette, FaCogs } from 'react-icons/fa';
import './Home.css';
import AnnouncementBanner from '../components/AnnouncementBanner';

const heroSlides = [
  {
    title: 'Excellence in Every Brushstroke',
    subtitle: 'The Painter Guys Pros — Premium Painting Services',
    background: "linear-gradient(135deg, rgba(80, 125, 188, 0.7), rgba(80, 125, 188, 0.8)), url('https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80')", // Modern US house
    cta: 'Book Your Free Site Visit',
    ctaLink: '/free-quote',
  },
  {
    title: 'Book a Free Site Visit',
    subtitle: 'Expert Painting with Outstanding Service and Attention to Detail',
    background: "linear-gradient(135deg, rgba(244, 197, 66, 0.7), rgba(80, 125, 188, 0.7)), url('https://images.unsplash.com/photo-1460518451285-97b6aa326961?auto=format&fit=crop&w=1200&q=80')", // Classic US home
    cta: 'Book Now',
    ctaLink: '/free-quote',
  },
  {
    title: 'Free Personalized Color Consultation',
    subtitle: 'Every estimate includes a free color consultation to help you select the perfect shades — confidently and stress-free.',
    background: "linear-gradient(135deg, rgba(80, 125, 188, 0.7), rgba(244, 197, 66, 0.7)), url('https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80')", // Suburban US house
    cta: 'Find Your Perfect Color',
    ctaLink: '/color-consultation',
  },
];

const steps = [
  { icon: <FaHome />, title: 'Step 1', desc: 'Request Your Free Estimate' },
  { icon: <FaCogs />, title: 'Step 2', desc: 'Approve Your Customized Proposal' },
  { icon: <FaPaintBrush />, title: 'Step 3', desc: 'Transform Your Space with Expert Craftsmanship' },
];

const galleryImages = [
  'https://images.unsplash.com/photo-1503389152951-9c3d0c6b7a5a?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
];

const serviceCards = [
  { icon: <FaHome />, title: 'Interior Painting', desc: 'Flawless finishes for every room.' },
  { icon: <FaBuilding />, title: 'Exterior Painting', desc: 'Curb appeal and protection.' },
  { icon: <FaPaintBrush />, title: 'Cabinet Refinishing', desc: 'Modernize your kitchen or bath.' },
  { icon: <FaCogs />, title: 'Power Washing', desc: 'Clean, prep, and restore surfaces.' },
  { icon: <FaCheckCircle />, title: 'Deck Services', desc: 'Stain, seal, and protect your deck.' },
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    rating: 5,
    text: 'Excellent work! The team was professional, punctual, and the quality exceeded our expectations.',
    project: 'Interior Painting',
  },
  {
    name: 'Mike Chen',
    rating: 5,
    text: 'They transformed our office space completely. Great attention to detail and competitive pricing.',
    project: 'Commercial Painting',
  },
  {
    name: 'Lisa Rodriguez',
    rating: 5,
    text: 'The color consultation was invaluable. Our home looks amazing with the new paint scheme.',
    project: 'Color Consultation',
  },
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  return (
    <div className="home">
      {/* Hero Slideshow */}
      <section className="hero-slideshow">
        <div className="slideshow-container">
          {heroSlides.map((slide, idx) => (
            <motion.div
              key={idx}
              className={`slide${idx === currentSlide ? ' active' : ''}`}
              style={{ background: slide.background }}
              initial={{ opacity: 0 }}
              animate={{ opacity: idx === currentSlide ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="container">
                <div className="slide-content">
                  <motion.div
                    className="slide-text"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                  >
                    <h1>{slide.title}</h1>
                    <h2>{slide.subtitle}</h2>
                    <Link to={slide.ctaLink} className="btn btn-cta btn-large">
                      {slide.cta}
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
          <button className="slide-nav prev" onClick={prevSlide}><FaChevronLeft /></button>
          <button className="slide-nav next" onClick={nextSlide}><FaChevronRight /></button>
          <div className="slide-indicators">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                className={`indicator${idx === currentSlide ? ' active' : ''}`}
                onClick={() => setCurrentSlide(idx)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Announcement Banner below slider */}

      {/* Three-Step Process Section */}
      <section className="three-step-section section">
        <div className="container">
          <div className="section-header text-center">
            <h2>Book Free Site Visit: Our Simple 3-Step Process</h2>
          </div>
          <div className="three-step-grid">
            {steps.map((step, idx) => (
              <div className="step-card" key={idx}>
                <div className="step-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
          {/* Calendar-based booking for free site visit */}
          <div className="calendar-booking-placeholder" style={{marginTop: '2rem', textAlign: 'center'}}>
            <h3 className="step-form-heading">Book Your Free Site Visit</h3>
            {/* Calendar and slot selection UI will be implemented here */}
            <p>Select a date and one-hour slot (9AM–5PM) for your free site visit appointment.</p>
          </div>
        </div>
      </section>

      {/* Inspiration Gallery Showcase */}
      <section className="gallery-showcase-section section">
        <div className="container gallery-showcase-grid">
          <div className="gallery-showcase-banner">
            <h2>Where Precision Meets Elegance</h2>
            <p>Premium Painting for every surface.</p>
          </div>
          <div className="gallery-showcase-images">
            {galleryImages.map((img, idx) => (
              <img src={img} alt="Project" key={idx} className="gallery-thumb" />
            ))}
          </div>
          <div className="gallery-showcase-cta">
            <h3>Get Inspired by Our Transformations</h3>
            <p>Elevate your space with fresh color, expert finishes, and professional craftsmanship.</p>
            <Link to="/gallery" className="btn btn-primary">View Our Work</Link>
          </div>
        </div>
      </section>

      {/* Content Cards Horizontal Scroller */}
      <section className="service-cards-section section">
        <div className="container">
          <div className="service-cards-scroller">
            {serviceCards.map((card, idx) => (
              <div className="service-card-scroller" key={idx}>
                <div className="service-card-icon">{card.icon}</div>
                <h4>{card.title}</h4>
                <p>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Review Section */}
      <section className="testimonials section">
        <div className="container">
          <div className="section-header text-center">
            <h2>What Our Customers Say</h2>
            <p>Don’t just take our word for it</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                className="testimonial-card card"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="testimonial-header">
                  <FaQuoteLeft className="quote-icon" />
                  <div className="stars">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                </div>
                <p>"{testimonial.text}"</p>
                <div className="testimonial-footer">
                  <strong>{testimonial.name}</strong>
                  <span>{testimonial.project}</span>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-4">
            <Link to="/reviews" className="btn btn-primary">
              Read More Reviews
            </Link>
          </div>
        </div>
      </section>

      {/* Color Consultation Callout */}
      <section className="color-consultation-section section">
        <div className="container color-consultation-content">
          <div className="color-consultation-info">
            <h2>Find Your Perfect Color — With Help from the Pros!</h2>
            <p>Every estimate includes a free personalized color consultation to help you select the perfect shades for your space — confidently and stress-free.<br/>
            Our experts work with trusted premium brands like Sherwin-Williams and Benjamin Moore to ensure your color choices are both beautiful and long-lasting.</p>
            <div className="color-consultation-links">
              <a href="https://www.sherwin-williams.com/visualizer/" target="_blank" rel="noopener noreferrer">Sherwin-Williams ColorSnap Visualizer</a>
              <a href="https://www.benjaminmoore.com/en-us/color-overview/find-your-color" target="_blank" rel="noopener noreferrer">Benjamin Moore Personal Color Viewer</a>
            </div>
            <Link to="/free-quote" className="btn btn-cta btn-large">Book Your Free Estimate & Color Consultation</Link>
            <div className="color-blog-callout">
              <span>Looking for even more inspiration? <Link to="/blog">Check out our latest color trends, style guides, and project ideas!</Link></span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 