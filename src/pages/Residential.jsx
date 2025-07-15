import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FaHome, 
  FaPaintBrush, 
  FaShieldAlt, 
  FaClock, 
  FaCheckCircle, 
  FaStar,
  FaPhone,
  FaQuoteLeft
} from 'react-icons/fa';
import './Residential.css';

const Residential = () => {
  useEffect(() => {
    document.title = 'Residential Painting Services | The Painter Guys Pros';
    document.querySelector('meta[name="description"]')?.setAttribute('content', 
      'Professional residential painting services. Interior & exterior house painting, color consultation, and premium finishes. Licensed, insured, and guaranteed.'
    );
  }, []);

  const services = [
    {
      icon: <FaHome />,
      title: 'Interior Painting',
      description: 'Transform your living spaces with expert interior painting services. We handle walls, ceilings, trim, and specialty finishes.',
      features: ['Premium paint brands', 'Color consultation', 'Furniture protection', 'Clean-up included']
    },
    {
      icon: <FaPaintBrush />,
      title: 'Exterior Painting',
      description: 'Protect and beautify your home\'s exterior with weather-resistant paints and professional techniques.',
      features: ['Weather-resistant coatings', 'Surface preparation', 'Power washing', '10-year warranty']
    },
    {
      icon: <FaShieldAlt />,
      title: 'Cabinet Refinishing',
      description: 'Give your kitchen a fresh new look with professional cabinet painting and refinishing services.',
      features: ['Kitchen cabinets', 'Bathroom vanities', 'Built-in furniture', 'Hardware installation']
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      location: 'Downtown Area',
      rating: 5,
      text: 'The Painter Guys Pros transformed our entire home. The attention to detail and quality of work exceeded our expectations. Highly recommend!'
    },
    {
      name: 'Mike Chen',
      location: 'Suburban District',
      rating: 5,
      text: 'Professional, punctual, and pristine work. They painted our exterior and it looks amazing. The team was respectful and cleaned up perfectly.'
    },
    {
      name: 'Lisa Rodriguez',
      location: 'Historic Neighborhood',
      rating: 5,
      text: 'Excellent cabinet refinishing service. Our kitchen looks brand new! The color consultation was invaluable in choosing the perfect shade.'
    }
  ];

  const processSteps = [
    {
      step: '01',
      title: 'Free Consultation',
      description: 'We visit your home to assess the project, discuss your vision, and provide a detailed estimate.'
    },
    {
      step: '02',
      title: 'Color Selection',
      description: 'Our color experts help you choose the perfect palette that complements your home and style.'
    },
    {
      step: '03',
      title: 'Preparation',
      description: 'We protect your furniture, prepare surfaces, and ensure everything is ready for painting.'
    },
    {
      step: '04',
      title: 'Professional Painting',
      description: 'Our skilled painters apply premium paints with precision and attention to detail.'
    },
    {
      step: '05',
      title: 'Final Inspection',
      description: 'We conduct a thorough inspection and touch-ups to ensure perfect results.'
    }
  ];

  return (
    <div className="residential-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <motion.div 
              className="hero-text"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1>Professional Residential Painting Services</h1>
              <p>Transform your home with expert painting services. From interior walls to exterior facades, we deliver exceptional results that last.</p>
              <div className="hero-buttons">
                <Link to="/free-quote" className="btn btn-primary">
                  Get Free Quote
                </Link>
                <Link to="/color-consultation" className="btn btn-secondary">
                  Free Color Consultation
                </Link>
              </div>
            </motion.div>
            <motion.div 
              className="hero-image"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img src="/api/placeholder/600/400" alt="Professional residential painting" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Our Residential Services</h2>
            <p>Comprehensive painting solutions for every room and surface in your home</p>
          </motion.div>

          <div className="services-grid">
            {services.map((service, index) => (
              <motion.div 
                key={index}
                className="service-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <ul className="service-features">
                  {service.features.map((feature, idx) => (
                    <li key={idx}>
                      <FaCheckCircle /> {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Our Painting Process</h2>
            <p>A systematic approach ensuring quality results every time</p>
          </motion.div>

          <div className="process-steps">
            {processSteps.map((step, index) => (
              <motion.div 
                key={index}
                className="process-step"
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="step-number">{step.step}</div>
                <div className="step-content">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-section">
        <div className="container">
          <div className="why-choose-content">
            <motion.div 
              className="why-choose-text"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2>Why Choose The Painter Guys Pros?</h2>
              <div className="benefits-list">
                <div className="benefit-item">
                  <FaShieldAlt className="benefit-icon" />
                  <div>
                    <h4>Licensed & Insured</h4>
                    <p>Fully licensed and insured for your peace of mind</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <FaClock className="benefit-icon" />
                  <div>
                    <h4>On-Time Completion</h4>
                    <p>We respect your schedule and complete projects on time</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <FaStar className="benefit-icon" />
                  <div>
                    <h4>Quality Guarantee</h4>
                    <p>100% satisfaction guarantee on all our work</p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div 
              className="why-choose-image"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img src="/api/placeholder/500/400" alt="Professional painting team" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2>What Our Clients Say</h2>
            <p>Real feedback from satisfied homeowners</p>
          </motion.div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                className="testimonial-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="testimonial-content">
                  <FaQuoteLeft className="quote-icon" />
                  <p>"{testimonial.text}"</p>
                  <div className="testimonial-rating">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className="star" />
                    ))}
                  </div>
                  <div className="testimonial-author">
                    <strong>{testimonial.name}</strong>
                    <span>{testimonial.location}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <motion.div 
            className="cta-content"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Ready to Transform Your Home?</h2>
            <p>Get a free, no-obligation quote for your residential painting project today</p>
            <div className="cta-buttons">
              <Link to="/free-quote" className="btn btn-primary">
                Get Free Quote
              </Link>
              <a href="tel:+1234567890" className="btn btn-secondary">
                <FaPhone /> Call Now
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Residential; 