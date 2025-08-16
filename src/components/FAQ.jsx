import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaChevronUp, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFaqs, toggleAddModal, toggleEditModal, setEditingFaq, deleteFaqAsync } from '../store/faqSlice';
import AddFAQModal from './AddFAQModal'; // Import the modal
import EditFAQModal from './EditFAQModal';
import './FAQ.css';

const FAQ = () => {
  const dispatch = useDispatch();
  const faqs = useSelector(state => state.faq.faqs);
  const showAddModal = useSelector(state => state.faq.showAddModal);
  const showEditModal = useSelector(state => state.faq.showEditModal);
  const token = useSelector(state => state.auth.token);
  const isAdmin = !!token; // Only show admin buttons if logged in

  useEffect(() => {
    dispatch(fetchFaqs()).then((action) => {
      if (action.type === 'faq/fetchFaqs/fulfilled') {
        console.log('Fetched FAQs:', action.payload);
      }
    });
  }, [dispatch]);

  const [activeIndex, setActiveIndex] = useState(null);

  const handleEditFaq = (faq) => {
    dispatch(setEditingFaq(faq));
    dispatch(toggleEditModal());
  };

  const handleDeleteFaq = (faqId) => {
    if (window.confirm('Are you sure you want to delete this FAQ? This action cannot be undone.')) {
      dispatch(deleteFaqAsync({ id: faqId, token }));
    }
  };

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <div className="faq-header">
        <div className="faq-header-content">
          <h2>Frequently Asked Questions</h2>
          <p>Get answers to common questions about our painting services</p>
        </div>
        {isAdmin && (
          <div className="faq-admin-controls">
            <button
              className="faq-admin-btn faq-admin-btn-primary"
              onClick={() => dispatch(toggleAddModal())}
            >
              <FaPlus />
              Add New FAQ
            </button>
          </div>
        )}
      </div>
      
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <motion.div
            key={faq.id ?? index} // Ensure key is always present and unique
            className="faq-item"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <div className="faq-question-container">
              <button
                className={`faq-question ${activeIndex === index ? 'active' : ''}`}
                onClick={() => toggleFAQ(index)}
                aria-expanded={activeIndex === index}
              >
                <span>{faq.question}</span>
                <motion.div
                  className="faq-icon"
                  animate={{ rotate: activeIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaChevronDown />
                </motion.div>
              </button>
              {isAdmin && (
                <div className="faq-admin-actions">
                  <button
                    className="faq-admin-action-btn faq-edit-btn"
                    onClick={() => handleEditFaq(faq)}
                    title="Edit FAQ"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="faq-admin-action-btn faq-delete-btn"
                    onClick={() => handleDeleteFaq(faq._id || faq.id)}
                    title="Delete FAQ"
                  >
                    <FaTrash />
                  </button>
                </div>
              )}
            </div>
            
            <AnimatePresence>
              {activeIndex === index && (
                <motion.div
                  className="faq-answer"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <div className="faq-answer-content">
                    <p>{faq.answer}</p>
                    {faq.category && (
                      <div className="faq-category" style={{ marginTop: '0.5rem', fontStyle: 'italic', color: '#888' }}>
                        Category: {faq.category}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
      
      <div className="faq-footer">
        <h3>Still have questions?</h3>
        <p>Can't find the answer you're looking for? Our team is here to help!</p>
        <div className="faq-contact-buttons">
          <a href="tel:+1234567890" className="btn btn-primary">
            Call Us Now
          </a>
          <a href="/contact" className="btn btn-outline">
            Send a Message
          </a>
        </div>
      </div>

      {isAdmin && showAddModal && <AddFAQModal />} {/* Show modal if toggled */}
      {isAdmin && showEditModal && <EditFAQModal />} {/* Show edit modal if toggled */}
    </div>
  );
};

export default FAQ;