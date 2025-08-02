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
              name: "Michael",
              project: "Exterior Painting",
              rating: 5,
              text: "Excellent work. Did exterior paint for condo association and did interior work,also would recommend them to anyone.Very neat, will use them again."
            },
            {
              name: "Kelly",
              project: "Interior Painting",
              rating: 5,
              text: "Sami and his crew were awesome! sami and christy were very responsive and answered all of our questions and concerns. the paint crew was respectable,efficient and showed pride in their work. The cost was reasonable and fair. The entire process was seamless and a pleasure. Thanks Painter guys!"
            },
            {
              name: "Jennifer D",
              project: "Exterior Painting",
              rating: 5,
              text: "The painter guys delivered amazing quality work faster than we could have hoped fori sami was very professional, personable and easy to work with. Working with painter guys was a postivie experience and we're thankful we found them!"
            },
            {
              name: "Donald S",
              project: "Exterior Painting",
              rating: 5,
              text: "They did an awesome job on our house and shed painting project. Sami was extremely knowledgeable, gave us all info about what they were using, and would give us the best results. his crew was very polite and cleaned up ater every shift. We would recommend them for any painting project."
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
              <div className="review-info">
                <div className="review-name">{review.name}</div>
                <div className="review-project">{review.project}</div>
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