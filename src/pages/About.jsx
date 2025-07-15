import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaPaintBrush, FaUsers, FaAward } from 'react-icons/fa';
import './About.css';

const About = () => {
  useEffect(() => {
    document.title = 'About Us | The Painter Guys Pros';
    document.querySelector('meta[name="description"]')?.setAttribute('content', 
      'Learn about The Painter Guys Pros - professional painting contractors. More information coming soon.'
    );
  }, []);

  return (
    <div className="about-page">
      <section className="about-story-section" style={{paddingTop: 'var(--spacing-xl)'}}>
        <div className="about-story-container">
          <motion.div
            className="about-story-text"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2>Our Story</h2>
            <p>
              The Painter Guys Pros is a team of passionate, skilled professionals dedicated to transforming spaces with color and care. Our mission is to deliver exceptional painting services with integrity, reliability, and a personal touch—every time.
            </p>
            <p>
              Founded on the belief that a fresh coat of paint can do wonders, The Painter Guys Pros has been serving homeowners and businesses for over a decade. We pride ourselves on our attention to detail, friendly service, and commitment to making every project stress-free and beautiful.
            </p>
            <p>
              Whether it’s a single room or an entire building, we approach every job with the same level of care and professionalism. Our team is fully insured, background-checked, and trained in the latest techniques and safety standards.
            </p>
          </motion.div>
          <motion.img
            src="https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=600&q=80"
            alt="Beautiful house exterior in the United States"
            className="about-story-img"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          />
        </div>
      </section>

      <section className="hero-section">
        <div className="container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>About The Painter Guys Pros</h1>
          </motion.div>
        </div>
      </section>

      <section className="about-features-section">
        <h2>Why Choose Us?</h2>
        <div className="about-features-grid">
          <div className="feature-item">
            <FaPaintBrush className="feature-icon" />
            <span>Professional Excellence</span>
            <p>We use only premium materials and meticulous prep to ensure a flawless, lasting finish—every time.</p>
          </div>
          <div className="feature-item">
            <FaUsers className="feature-icon" />
            <span>Experienced Team</span>
            <p>Our painters are highly trained, background-checked, and bring years of expertise to every project.</p>
          </div>
          <div className="feature-item">
            <FaAward className="feature-icon" />
            <span>Quality Guaranteed</span>
            <p>We stand behind our work with a satisfaction guarantee and clear, honest communication from start to finish.</p>
          </div>
        </div>
      </section>

      <section className="about-numbers-section">
        <div className="about-numbers-grid">
          <div className="number-card">
            <div className="number">10+</div>
            <div className="number-label">Years in Business</div>
          </div>
          <div className="number-card">
            <div className="number">500+</div>
            <div className="number-label">Projects Completed</div>
          </div>
          <div className="number-card">
            <div className="number">100%</div>
            <div className="number-label">Satisfaction Guarantee</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 