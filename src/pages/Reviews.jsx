import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaStar, FaQuoteLeft, FaTrash, FaUndo, FaTrashAlt, FaCheck, FaPlus } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { deleteReview, restoreReview, permanentlyDeleteReview, toggleJunkView } from '../store/reviewsSlice';
import './Reviews.css';

const Reviews = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  const { activeReviews, deletedReviews, showJunk } = useSelector(state => state.reviews);

  useEffect(() => {
    document.title = 'Customer Reviews | The Painter Guys Pros';
    document.querySelector('meta[name="description"]')?.setAttribute('content', 
      'Customer reviews and testimonials coming soon for The Painter Guys Pros painting services.'
    );
  }, []);

  const handleDeleteReview = (reviewId) => {
    // No functionality - button is just for display
  };

  const handleApproveReview = (reviewId) => {
    // No functionality - button is just for display
  };

  const handleRestoreReview = (reviewId) => {
    // No functionality - button is just for display
  };

  const handlePermanentlyDeleteReview = (reviewId) => {
    // No functionality - button is just for display
  };

  const handleToggleJunkView = () => {
    // No functionality - button is just for display
  };

  const handleAddReview = () => {
    // No functionality - button is just for display
  };

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
        {/* Admin Controls */}
        {isAuthenticated && (
          <div className="admin-junk-controls">
            <button 
              className="add-review-btn"
              onClick={handleAddReview}
            >
              <FaPlus />
              Add Review
            </button>
          </div>
        )}

        <div className="reviews-grid">
          {(showJunk ? deletedReviews : activeReviews).map((review, idx) => (
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
                {showJunk && review.deletedAt && (
                  <div className="deleted-date">
                    Deleted: {new Date(review.deletedAt).toLocaleDateString()}
                  </div>
                )}
                <div className="review-stars">
                  {[...Array(review.rating)].map((_, i) => (
                    <FaStar key={i} className="star" />
                  ))}
                </div>
                <div className="review-text">"{review.text}"</div>
                
                {/* Admin-only controls */}
                {isAuthenticated && (
                  <div className="admin-controls">
                    {showJunk ? (
                      <>
                        <button 
                          className="admin-btn restore-btn"
                          onClick={() => handleRestoreReview(review.id)}
                          title="Restore Review"
                        >
                          <FaUndo />
                        </button>
                        <button 
                          className="admin-btn permanent-delete-btn"
                          onClick={() => handlePermanentlyDeleteReview(review.id)}
                          title="Permanently Delete Review"
                        >
                          <FaTrashAlt />
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          className="admin-btn approve-btn"
                          onClick={() => handleApproveReview(review.id)}
                          title="Approve Review"
                        >
                          <FaCheck />
                        </button>
                        <button 
                          className="admin-btn delete-btn"
                          onClick={() => handleDeleteReview(review.id)}
                          title="Delete Review"
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Reviews; 