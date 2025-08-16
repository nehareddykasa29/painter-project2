import React from 'react';
import { motion } from 'framer-motion';
import './ViewQuotes.css';

const ViewQuotes = () => {
  return (
    <div className="view-quotes-page">
      <section className="hero-section">
        <div className="container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>View Quotes</h1>
            <p>Quote management dashboard</p>
          </motion.div>
        </div>
      </section>

      <section className="content-section">
        <div className="container">
          <div className="blank-content">
            <p>Quote management functionality coming soon...</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ViewQuotes;
