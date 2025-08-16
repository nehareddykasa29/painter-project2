import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addFaqAsync, toggleAddModal } from '../store/faqSlice';
import { FaTimes, FaPlus } from 'react-icons/fa';
import './FAQModal.css';

const AddFAQModal = () => {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token); // Get JWT token from Redux

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: '',
    displayOrder: 1
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "displayOrder" ? Number(value) : value
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
    
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.displayOrder) {
      newErrors.displayOrder = 'Display order is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      await dispatch(addFaqAsync({
        faq: {
          question: formData.question.trim(),
          answer: formData.answer.trim(),
          category: formData.category.trim(),
          displayOrder: formData.displayOrder
        },
        token
      }));
      
      // Reset form
      setFormData({ question: '', answer: '', category: '', displayOrder: 1 });
      setErrors({});
      
      // Close modal
      dispatch(toggleAddModal());
    }
  };

  const handleClose = () => {
    dispatch(toggleAddModal());
    setFormData({ question: '', answer: '', category: '', displayOrder: 1 });
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
          
          <div className="faq-form-group">
            <label htmlFor="category" className="faq-form-label">
              Category *
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="faq-form-input"
              placeholder="Enter the category..."
              maxLength={100}
            />
            {errors.category && (
              <span className="faq-error">{errors.category}</span>
            )}
          </div>
          
          <div className="faq-form-group">
            <label htmlFor="displayOrder" className="faq-form-label">
              Display Order *
            </label>
            <input
              type="number"
              id="displayOrder"
              name="displayOrder"
              value={formData.displayOrder}
              onChange={handleInputChange}
              className="faq-form-input"
              min={1}
            />
            {errors.displayOrder && (
              <span className="faq-error">{errors.displayOrder}</span>
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

