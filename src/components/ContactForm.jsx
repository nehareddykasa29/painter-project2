import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaComments } from 'react-icons/fa';
import './ContactForm.css';

const ContactForm = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: '',
    message: '',
    address: '',
    preferredContactMethod: 'email'
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }

    if (!formData.serviceType) {
      newErrors.serviceType = 'Please select a service type';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        serviceType: '',
        message: '',
        address: '',
        preferredContactMethod: 'email'
      });
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleChange = (e) => {
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

  if (submitted) {
    return (
      <motion.div 
        className="form-success"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="success-icon">✓</div>
        <h3>Thank You!</h3>
        <p>Your message has been sent successfully. We'll get back to you within 24 hours.</p>
        <button 
          className="btn btn-primary"
          onClick={() => setSubmitted(false)}
        >
          Send Another Message
        </button>
      </motion.div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            <FaUser /> Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`form-control ${errors.name ? 'error' : ''}`}
            placeholder="Enter your full name"
          />
          {errors.name && <div className="form-error">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            <FaEnvelope /> Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`form-control ${errors.email ? 'error' : ''}`}
            placeholder="Enter your email address"
          />
          {errors.email && <div className="form-error">{errors.email}</div>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="phone" className="form-label">
            <FaPhone /> Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`form-control ${errors.phone ? 'error' : ''}`}
            placeholder="(123) 456-7890"
          />
          {errors.phone && <div className="form-error">{errors.phone}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="serviceType" className="form-label">
            Service Type *
          </label>
          <select
            id="serviceType"
            name="serviceType"
            value={formData.serviceType}
            onChange={handleChange}
            className={`form-control ${errors.serviceType ? 'error' : ''}`}
          >
            <option value="">Select a service</option>
            <option value="residential">Residential Painting</option>
            <option value="commercial">Commercial Painting</option>
            <option value="consultation">Color Consultation</option>
          </select>
          {errors.serviceType && <div className="form-error">{errors.serviceType}</div>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="address" className="form-label">
          <FaMapMarkerAlt /> Property Address
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="form-control"
          placeholder="Enter property address (optional)"
        />
      </div>

      <div className="form-group">
        <label htmlFor="preferredContactMethod" className="form-label">
          Preferred Contact Method
        </label>
        <select
          id="preferredContactMethod"
          name="preferredContactMethod"
          value={formData.preferredContactMethod}
          onChange={handleChange}
          className="form-control"
        >
          <option value="email">Email</option>
          <option value="phone">Phone Call</option>
          <option value="text">Text Message</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="message" className="form-label">
          <FaComments /> Message *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          className={`form-control ${errors.message ? 'error' : ''}`}
          placeholder="Tell us about your project..."
          rows="5"
        />
        {errors.message && <div className="form-error">{errors.message}</div>}
      </div>

      <button 
        type="submit" 
        className="btn btn-cta btn-large"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <div className="spinner"></div>
            Sending...
          </>
        ) : (
          'Send Message'
        )}
      </button>
    </form>
  );
};

export default ContactForm; 