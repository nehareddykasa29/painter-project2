import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateFaq, toggleEditModal, setEditingFaq, deleteFaq } from '../store/faqSlice';
import { FaTimes, FaSave, FaTrash } from 'react-icons/fa';
import './FAQModal.css';

const EditFAQModal = () => {
  const dispatch = useDispatch();
  const editingFaq = useSelector(state => state.faq.editingFaq);
  
  const [formData, setFormData] = useState({
    question: '',
    answer: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingFaq) {
      setFormData({
        question: editingFaq.question,
        answer: editingFaq.answer
      });
      setErrors({});
    }
  }, [editingFaq]);

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
      dispatch(updateFaq({
        id: editingFaq.id,
        question: formData.question.trim(),
        answer: formData.answer.trim()
      }));
      
      handleClose();
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this FAQ? This action cannot be undone.')) {
      dispatch(deleteFaq(editingFaq.id));
      handleClose();
    }
  };

  const handleClose = () => {
    dispatch(toggleEditModal());
    dispatch(setEditingFaq(null));
    setFormData({ question: '', answer: '' });
    setErrors({});
  };

  if (!editingFaq) {
    return null;
  }

  return (
    <div className="faq-modal-overlay" onClick={handleClose}>
      <div className="faq-modal" onClick={(e) => e.stopPropagation()}>
        <div className="faq-modal-header">
          <h2 className="faq-modal-title">Edit FAQ</h2>
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
              className="faq-btn faq-btn-danger"
              onClick={handleDelete}
            >
              <FaTrash />
              Delete
            </button>
            <div style={{ display: 'flex', gap: '1rem' }}>
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
                <FaSave />
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFAQModal;
