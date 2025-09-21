import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaStar, FaQuoteLeft, FaTrash, FaUndo, FaTrashAlt, FaCheck, FaPlus } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleJunkView, fetchReviews, editReview, deleteReview, submitReview } from '../store/reviewsSlice';
import reviewsHeroImage from '../../public/assets/reviews-hero.jpg';
import './Reviews.css';

const Reviews = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  const { activeReviews, deletedReviews, showJunk, loading, error, editLoading, editError, deleteLoading, deleteError } = useSelector(state => state.reviews);
  const { token } = useSelector(state => state.auth); // Assuming token is in auth slice

  // Add local state for rating
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // Submit state for review form
  const submitLoading = useSelector(state => state.reviews.submitLoading);
  const submitError = useSelector(state => state.reviews.submitError);
  const submitSuccess = useSelector(state => state.reviews.submitSuccess);

  // Ref for scrolling to review form
  const reviewFormRef = useRef(null);

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

  // Static reviews as fallback
  const staticReviews = [
    {
      _id: 'static-1',
      customerName: "Deborah Bednar-Miswald",
      comment: "Great job. Extremely happy with the work.",
      rating: 5,
      isApproved: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'static-2',
      customerName: "Chelsea",
      comment: "Would recommend for any paint job!",
      rating: 5,
      isApproved: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'static-3',
      customerName: "Jennifer D.",
      comment: "The Painter Guys delivered amazing quality work faster than we could have hoped for! Sami was very professional, personable, and easy to work with. Working with The Painter Guys was a positive experience and we're thankful we found them!",
      rating: 5,
      isApproved: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'static-4',
      customerName: "Kelly",
      comment: "Sami and his crew were awesome! Sami and Christy were very responsive and answered all of our questions and concerns. The paint crew was respectable, efficient, and showed pride in their work. The cost was reasonable and fair. The entire process was seamless and a pleasure. Thanks Painter Guys!",
      rating: 5,
      isApproved: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'static-5',
      customerName: "Donald S.",
      comment: "The Painter Guys did an awesome job on our house and shed painting project. Sami was extremely knowledgeable, gave us all the info about what they were using, and what would give us the best results. His crew was very polite, and cleaned up after every shift. We would recommend them for any painting project.",
      rating: 5,
      isApproved: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'static-6',
      customerName: "Michael",
      comment: "Excellent work. Did exterior paint for condo association and did interior work, also would recommend them to anyone. Very neat, will use them again.",
      rating: 5,
      isApproved: true,
      createdAt: new Date().toISOString()
    }
  ];

  // Use static reviews for consistent display across all pages
  // TODO: Update backend with these reviews for persistent storage
  const displayedReviews = staticReviews;

  return (
    <div className="reviews-page">
      <section 
        className="hero-section"
        style={{
          backgroundImage: `url(${reviewsHeroImage})`
        }}
      >
        <div className="container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Customer Reviews</h1>
            <p>See what our happy customers are saying about The Painter Guys Pros!</p>
            <button
              className="btn btn-primary"
              style={{ marginBottom: '2rem' }}
              onClick={() => {
                reviewFormRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Write a Review
            </button>
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
      </section>

      {/* Review Form Section */}
      <section className="review-form-section" ref={reviewFormRef}>
        <div className="container">
          <motion.div 
            className="review-form-container"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2>Share Your Experience</h2>
            <p>We'd love to hear about your experience with The Painter Guys Pros!</p>
            
            <form className="review-form"
              onSubmit={e => {
                e.preventDefault();
                const customerName = e.target.name.value;
                const comment = e.target.review.value;
                // Use selected rating
                const reviewData = { customerName, rating, comment };
                console.log("Submitted review:", reviewData);
                dispatch(submitReview(reviewData));
              }}
            >
              <div className="form-group">
                <label htmlFor="name">Your Name *</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="review">Your Review *</label>
                <textarea 
                  id="review" 
                  name="review" 
                  placeholder="Tell us about your experience with our services..."
                  rows="5"
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label>Rating *</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className="star-input"
                      style={{ color: (hoverRating || rating) >= star ? "#FFD700" : "#e4e5e9", cursor: "pointer" }}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      data-testid={`star-${star}`}
                    />
                  ))}
                  <span className="rating-text">{rating ? `You rated ${rating}` : "Click to rate"}</span>
                </div>
              </div>

              <button type="submit" className="btn btn-primary submit-review-btn">
                Submit Review
              </button>
              <button type="submit" className="btn btn-primary submit-google-btn" 
              onClick={() => {
                  window.open(
                    "https://www.google.com/search?sca_esv=6b419d715691fe69&hl=en-GB&gl=us&output=search&kgmid=%2Fg%2F11c1p395d0&q=The%20Painter%20Guys%20LLC&shndl=30&shem=lsptbl1%2Cptotplc&source=sh%2Fx%2Floc%2Fact%2Fm4%2F3",
                    "_blank"
                  );
                }}>
                Write Google Review
              </button>
              <button type="submit" className="btn btn-primary submit-angi-btn" 
              onClick={() => {
                  window.open(
                    "https://www.angi.com/companylist/us/wi/waukesha/the-painter-guys-llc-reviews-2049387.htm"
                  );
                }}>
                Write Angi Review
              </button>
            </form>
            {submitLoading && <div>Submitting review...</div>}
            {submitError && <div className="error">Error: {submitError}</div>}
            {submitSuccess && <div className="success">Review submitted successfully!</div>}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Reviews;