import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaPaintBrush, FaUsers, FaAward } from 'react-icons/fa';
import paintbrushIcon from '../../public/assets/paintbrush.png';
import ourJourneyImage from '../../public/assets/our-journey.png';
import qualityCraftsmanshipIcon from '../../public/assets/quality-craftmenship.png';
import customerFirstIcon from '../../public/assets/customer-first.png';
import integrityTransparencyIcon from '../../public/assets/integrity-and-transparency.png';
import sustainablePracticesIcon from '../../public/assets/sustainable-practices.png';
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
      <section className="about-hero-section">
        <div className="about-hero-overlay"></div>
        <div className="about-hero-content">
          <motion.div 
            className="about-hero-text"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Bringing Color, Craftsmanship, and Care to Every Space</h1>
            <p>
              For over 15 years, Painter Guys Pros has been delivering premium painting services to homes and businesses across Southeast Wisconsin. Our mission is simple — provide flawless finishes, reliable service, and a stress-free experience from start to finish.
            </p>
            <Link to="/free-quote" className="about-hero-cta">
              Get Your Free Estimate
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="our-journey-section">
        <div className="our-journey-container">
          <motion.div
            className="our-journey-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2>Our Journey</h2>
            <p>
              It all started with a passion for transforming spaces and a commitment to quality. From a small local crew to a trusted name in residential and commercial painting, our growth has always been fueled by customer trust and word-of-mouth referrals.
            </p>
          </motion.div>
          
          <div className="our-journey-content">
            <motion.div
              className="our-journey-timeline"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-marker timeline-marker-first">
                    <img src={paintbrushIcon} alt="Paintbrush icon" className="timeline-icon timeline-icon-first" />
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-year">2008</div>
                    <div className="timeline-description">Founded in Milwaukee with 2 painters and 1 van</div>
                  </div>
                </div>
                
                <div className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="timeline-year">2012</div>
                    <div className="timeline-description">Expanded to 10 painters and 3 vans</div>
                  </div>
                </div>
                
                <div className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="timeline-year">2016</div>
                    <div className="timeline-description">Launched commercial painting division</div>
                  </div>
                </div>
                
                <div className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="timeline-year">2023</div>
                    <div className="timeline-description">Reached 500+ projects milestone</div>
                  </div>
                </div>
                
                <div className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="timeline-year">2025</div>
                    <div className="timeline-description">Continuing to serve Southeast Wisconsin</div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              className="our-journey-image"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <img 
                src={ourJourneyImage} 
                alt="Painter working on a wall" 
                className="journey-img"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="stats-banner-section">
        <div className="stats-banner-container">
          <div className="stat-item">
            <div className="stat-number">15+</div>
            <div className="stat-label">Years Experience</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">1,200+</div>
            <div className="stat-label">Projects Completed</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">98%</div>
            <div className="stat-label">Customer Satisfaction</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">2</div>
            <div className="stat-label">Year Warranty</div>
          </div>
        </div>
      </section>

      <section className="principles-section">
        <div className="principles-container">
          <motion.div
            className="principles-image"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80"
              alt="Professional painters working on interior painting project"
              className="principles-img"
            />
          </motion.div>
          
          <motion.div
            className="principles-content"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2>The Principles That Guide Every Brushstroke</h2>
            
            <div className="principles-grid">
              <div className="principle-item">
                <div className="principle-icon">
                  <img src={qualityCraftsmanshipIcon} alt="Quality Craftsmanship" />
                </div>
                <div className="principle-content">
                  <h3>Quality Craftsmanship</h3>
                  <p>Every detail matters, from prep to final coat.</p>
                </div>
              </div>
              
              <div className="principle-item">
                <div className="principle-icon">
                  <img src={customerFirstIcon} alt="Customer First" />
                </div>
                <div className="principle-content">
                  <h3>Customer First</h3>
                  <p>Your satisfaction drives everything we do.</p>
                </div>
              </div>
              
              <div className="principle-item">
                <div className="principle-icon">
                  <img src={integrityTransparencyIcon} alt="Integrity & Transparency" />
                </div>
                <div className="principle-content">
                  <h3>Integrity & Transparency</h3>
                  <p>Clear communication and honest pricing.</p>
                </div>
              </div>
              
              <div className="principle-item">
                <div className="principle-icon">
                  <img src={sustainablePracticesIcon} alt="Sustainable Practices" />
                </div>
                <div className="principle-content">
                  <h3>Sustainable Practices</h3>
                  <p>Eco-friendly paints and waste reduction.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="about-story-section">
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
              Whether it's a single room or an entire building, we approach every job with the same level of care and professionalism. Our team is fully insured, background-checked, and trained in the latest techniques and safety standards.
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
            <div className="number">15+</div>
            <div className="number-label">Years Experience</div>
          </div>
          <div className="number-card">
            <div className="number">1,200+</div>
            <div className="number-label">Projects Completed</div>
          </div>
          <div className="number-card">
            <div className="number">98%</div>
            <div className="number-label">Customer Satisfaction</div>
          </div>
          <div className="number-card">
            <div className="number">2</div>
            <div className="number-label">Year Warranty</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 