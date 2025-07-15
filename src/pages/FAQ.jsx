import React, { useEffect } from 'react';
import FAQ from '../components/FAQ';
import { motion } from 'framer-motion';
import '../components/FAQ.css';

const FAQPage = () => {
  useEffect(() => {
    document.title = 'FAQ | The Painter Guys Pros';
    document.querySelector('meta[name="description"]')?.setAttribute('content',
      'Frequently asked questions about The Painter Guys Pros painting services, process, and policies.'
    );
  }, []);

  return (
    <div className="faq-page">
      <section className="hero-section">
        <div className="container">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Frequently Asked Questions</h1>
            <p>Everything you need to know about our painting services, process, and what to expect.</p>
          </motion.div>
        </div>
      </section>
      <FAQ />
    </div>
  );
};

export default FAQPage; 