import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import QuoteForm from '../components/QuoteForm';
import './FreeQuote.css';

const FreeQuote = () => {
  useEffect(() => {
    document.title = 'Free Quote | The Painter Guys Pros';
    document.querySelector('meta[name="description"]')?.setAttribute('content', 
      'Get a free painting quote from The Painter Guys Pros. No obligation estimate for residential and commercial painting services.'
    );
  }, []);

  return (
    <div className="free-quote-page">
      <section className="hero-section">
        <div className="container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Get Your Free Quote</h1>
            <p>Ready to refresh your space? Request a fast, no-obligation estimate from our friendly team. We respond within 24 hours!</p>
          </motion.div>
          <div className="trust-badges">
            <div className="trust-badge">
              <span role="img" aria-label="No Obligation">📝</span>
              No Obligation
            </div>
            <div className="trust-badge">
              <span role="img" aria-label="Fast Response">⚡</span>
              Fast Response
            </div>
            <div className="trust-badge">
              <span role="img" aria-label="100% Privacy">🔒</span>
              100% Privacy
            </div>
          </div>
        </div>
      </section>

      <section className="quote-form-section">
        <div className="quote-form-flex">
          <div className="quote-form-image">
            <img src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80" alt="Painter at work" />
          </div>
          <div className="quote-form-container">
            <QuoteForm />
          </div>
        </div>
      </section>
    </div>
  );
};

export default FreeQuote; 