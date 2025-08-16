import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addFaq, toggleAddModal } from '../store/faqSlice';
import { FaTimes, FaPlus } from 'react-icons/fa';
import './FAQModal.css';

const AddFAQModal = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    question: '',
    answer: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.question.trim()) {
      newErrors.question = 'Question is required';
    }
    
    if (!formData.answer.trim()) {
      newErrors.answer = 'Answer is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      dispatch(addFaq({
        question: formData.question.trim(),
        answer: formData.answer.trim()
      }));
      
      // Reset form
      setFormData({ question: '', answer: '' });
      setErrors({});
      
      // Close modal
      dispatch(toggleAddModal());
    }
  };

  const handleClose = () => {
    dispatch(toggleAddModal());
    setFormData({ question: '', answer: '' });
    setErrors({});
  };

  return (
    <div className="faq-modal-overlay" onClick={handleClose}>
      <div className="faq-modal" onClick={(e) => e.stopPropagation()}>
        <div className="faq-modal-header">
          <h2 className="faq-modal-title">Add New FAQ</h2>
          <button className="faq-modal-close" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>
        
        <form className="faq-form" onSubmit={handleSubmit}>
          <div className="faq-form-group">
            <label htmlFor="question" className="faq-form-label">
              Question *
            </label>
            <input
              type="text"
              id="question"
              name="question"
              value={formData.question}
              onChange={handleInputChange}
              className="faq-form-input"
              placeholder="Enter the question..."
              maxLength={200}
            />
            {errors.question && (
              <span className="faq-error">{errors.question}</span>
            )}
          </div>
          
          <div className="faq-form-group">
            <label htmlFor="answer" className="faq-form-label">
              Answer *
            </label>
            <textarea
              id="answer"
              name="answer"
              value={formData.answer}
              onChange={handleInputChange}
              className="faq-form-textarea"
              placeholder="Enter the answer..."
              maxLength={1000}
            />
            {errors.answer && (
              <span className="faq-error">{errors.answer}</span>
            )}
          </div>
          
          <div className="faq-form-actions">
            <button
              type="button"
              className="faq-btn faq-btn-secondary"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="faq-btn faq-btn-primary"
            >
              <FaPlus />
              Add FAQ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFAQModal;

