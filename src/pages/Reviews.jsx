import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import './Reviews.css';

const Reviews = () => {
  useEffect(() => {
    document.title = 'Customer Reviews | The Painter Guys Pros';
    document.querySelector('meta[name="description"]')?.setAttribute('content', 
      'Customer reviews and testimonials coming soon for The Painter Guys Pros painting services.'
    );
  }, []);

  return (
    <div className="reviews-page">
      <section className="hero-section">
        <div className="container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Customer Reviews</h1>
            <p>See what our happy customers are saying about The Painter Guys Pros!</p>
            <Link to="/free-quote" className="btn btn-primary" style={{ marginBottom: '2rem' }}>
              Get Free Quote
            </Link>
          </motion.div>
        </div>
      </section>
      <section className="reviews-section">
        <div className="reviews-grid">
          {[
            {
              name: 'Sarah M.',
              avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
              rating: 5,
              text: 'Absolutely thrilled with the quality and professionalism! The team was on time, tidy, and the results exceeded my expectations.'
            },
            {
              name: 'James R.',
              avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
              rating: 5,
              text: 'From the color consultation to the final touch, everything was seamless. Highly recommend The Painter Guys Pros!'
            },
            {
              name: 'Priya S.',
              avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
              rating: 5,
              text: 'They transformed our home! Friendly crew, great communication, and beautiful results.'
            },
            {
              name: 'Carlos D.',
              avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
              rating: 4,
              text: 'Very satisfied with the exterior paint job. Would use them again for future projects.'
            },
            {
              name: 'Emily W.',
              avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
              rating: 5,
              text: 'The best painting company we have ever worked with. Attention to detail and customer service were top notch.'
            }
          ].map((review, idx) => (
            <motion.div
              className="review-card"
              key={review.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
            >
              <img src={review.avatar} alt={`Avatar of ${review.name}`} className="review-avatar" />
              <div className="review-info">
                <div className="review-name">{review.name}</div>
                <div className="review-stars">
                  {[...Array(review.rating)].map((_, i) => (
                    <FaStar key={i} className="star" />
                  ))}
                </div>
                <div className="review-text">"{review.text}"</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Reviews; 