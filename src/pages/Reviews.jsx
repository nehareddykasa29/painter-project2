import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaStar, FaQuoteLeft, FaTrash, FaUndo, FaTrashAlt, FaCheck, FaPlus } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleJunkView, fetchReviews, editReview, deleteReview } from '../store/reviewsSlice';
import './Reviews.css';

const Reviews = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  const { activeReviews, deletedReviews, showJunk, loading, error, editLoading, editError, deleteLoading, deleteError } = useSelector(state => state.reviews);
  const { token } = useSelector(state => state.auth); // Assuming token is in auth slice

  useEffect(() => {
    document.title = 'Customer Reviews | The Painter Guys Pros';
    document.querySelector('meta[name="description"]')?.setAttribute('content', 
      'Customer reviews and testimonials coming soon for The Painter Guys Pros painting services.'
    );
    dispatch(fetchReviews());
  }, [dispatch]);

  // Print reviews to console when they change
  useEffect(() => {
    if (activeReviews && activeReviews.length > 0) {
      console.log("Fetched reviews:", activeReviews);
    }
  }, [activeReviews]);

  const handleApproveReview = (reviewId) => {
    // No functionality - button is just for display
  };

  const handleToggleJunkView = () => {
    // No functionality - button is just for display
  };

  const handleAddReview = () => {
    // No functionality - button is just for display
  };

  const handleEditReview = (reviewId, currentStatus) => {
    if (!token) return;
    dispatch(editReview({ id: reviewId, updates: { isApproved: !currentStatus }, token }));
  };

  const handleDeleteReview = (reviewId) => {
    if (!token) return;
    if (window.confirm("Are you sure you want to delete this review? This action cannot be undone.")) {
      dispatch(deleteReview({ id: reviewId, token }));
    }
  };

  // Filter reviews based on authentication
  const displayedReviews = isAuthenticated
    ? activeReviews
    : activeReviews.filter(review => review.isApproved);

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

        {loading && <div>Loading reviews...</div>}
        {error && <div>Error: {error}</div>}
        <div className="reviews-grid">
          {displayedReviews.length === 0 && !loading && !error && (
            <div>No reviews found.</div>
          )}
          {displayedReviews.map((review, idx) => (
            <motion.div
              className="review-card"
              key={review._id || review.customerName || idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
            >
              <div className="review-info">
                <div className="review-name">{review.customerName}</div>
                {/* Optionally show date */}
                {review.createdAt && (
                  <div className="review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                )}
                {/* If you have a project field, display it; otherwise remove */}
                {/* <div className="review-project">{review.project}</div> */}
                <div className="review-stars">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className="star"
                      style={{
                        color: i < review.rating ? "#FFD700" : "#e4e5e9"
                      }}
                    />
                  ))}
                </div>
                <div className="review-text">"{review.comment}"</div>
                {/* Admin-only controls */}
                {isAuthenticated && (
                  <div className="admin-controls">
                    <button 
                      className="admin-btn approve-btn"
                      onClick={() => handleEditReview(review._id, review.isApproved)}
                      title={review.isApproved ? "Approved (Click to unapprove)" : "Disapproved (Click to approve)"}
                      disabled={editLoading}
                      style={{
                        color: review.isApproved ? "green" : "red",
                        borderColor: review.isApproved ? "green" : "red"
                      }}
                    >
                      <FaCheck />
                    </button>
                    <button
                      className="admin-btn delete-btn"
                      onClick={() => handleDeleteReview(review._id)}
                      title="Delete Review"
                      disabled={deleteLoading}
                      style={{
                        color: "red",
                        marginLeft: "0.5rem"
                      }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        {editError && <div className="error">Edit error: {editError}</div>}
        {deleteError && <div className="error">Delete error: {deleteError}</div>}
        {/* ...existing code... */}
      </section>
    </div>
  );
};

export default Reviews;