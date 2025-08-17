import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuotes } from '../store/bookingSlice';
import './ViewQuotes.css';

const ViewQuotes = () => {
  const dispatch = useDispatch();
  const { quotes, quotesLoading, quotesError } = useSelector(state => state.booking);

  useEffect(() => {
    dispatch(fetchQuotes());
  }, [dispatch]);

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
          {quotesLoading && <p>Loading quotes...</p>}
          {quotesError && <p style={{ color: 'red' }}>Error: {quotesError}</p>}
          {!quotesLoading && !quotesError && (
            <div className="quotes-list">
              {quotes.length === 0 ? (
                <p>No quotes found.</p>
              ) : (
                <ul>
                  {quotes.map(q => (
                    <li key={q._id}>
                      <strong>{q.name}</strong> - {q.email} - {q.details}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ViewQuotes;
