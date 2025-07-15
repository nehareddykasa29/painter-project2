import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { motion } from 'framer-motion';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaHome,
  FaBuilding,
  FaUpload,
  FaTrash,
  FaImage
} from 'react-icons/fa';
import './QuoteForm.css';

const QuoteForm = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    serviceType: '',
    projectType: '',
    rooms: '',
    squareFootage: '',
    timeframe: '',
    budget: '',
    description: '',
    appointmentDate: null,
    appointmentSlot: '',
  });

  const [files, setFiles] = useState([]);
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

    if (!formData.address.trim()) {
      newErrors.address = 'Property address is required';
    }

    if (!formData.serviceType) {
      newErrors.serviceType = 'Please select a service type';
    }

    if (!formData.projectType) {
      newErrors.projectType = 'Please select a project type';
    }

    if (!formData.timeframe) {
      newErrors.timeframe = 'Please select your preferred timeframe';
    }

    if (!formData.budget) {
      newErrors.budget = 'Please select your budget range';
    }

    if (!formData.appointmentDate) {
      newErrors.appointmentDate = 'Please select a date for your site visit';
    }
    if (!formData.appointmentSlot) {
      newErrors.appointmentSlot = 'Please select a time slot for your site visit';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = new FormData();
    
    // Append form data
    Object.keys(formData).forEach(key => {
      if (key === 'appointmentDate' && formData.appointmentDate) {
        submitData.append('appointmentDate', formData.appointmentDate.toISOString());
      } else {
        submitData.append(key, formData[key]);
      }
    });
    
    // Append files
    files.forEach((file, index) => {
      submitData.append('images', file);
    });

    try {
      await onSubmit(submitData);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        serviceType: '',
        projectType: '',
        rooms: '',
        squareFootage: '',
        timeframe: '',
        budget: '',
        description: '',
        appointmentDate: null,
        appointmentSlot: '',
      });
      setFiles([]);
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

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      appointmentDate: date
    }));
    if (errors.appointmentDate) {
      setErrors(prev => ({ ...prev, appointmentDate: '' }));
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isValidType && isValidSize;
    });

    setFiles(prev => [...prev, ...validFiles].slice(0, 10)); // Max 10 files
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
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
        <h3>Quote Request Submitted!</h3>
        <p>Thank you for your quote request. We'll review your information and contact you within 24 hours to schedule your free estimate.</p>
        <button 
          className="btn btn-primary"
          onClick={() => setSubmitted(false)}
        >
          Submit Another Quote
        </button>
      </motion.div>
    );
  }

  return (
    <form className="quote-form" onSubmit={handleSubmit}>
      {/* Contact Information */}
      <div className="form-section">
        <h3>Contact Information</h3>
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
            <label htmlFor="address" className="form-label">
              <FaMapMarkerAlt /> Property Address *
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`form-control ${errors.address ? 'error' : ''}`}
              placeholder="Enter property address"
            />
            {errors.address && <div className="form-error">{errors.address}</div>}
          </div>
        </div>
      </div>

      {/* Project Details */}
      <div className="form-section">
        <h3>Project Details</h3>
        <div className="form-row">
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
              <option value="">Select service type</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
            </select>
            {errors.serviceType && <div className="form-error">{errors.serviceType}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="projectType" className="form-label">
              Project Type *
            </label>
            <select
              id="projectType"
              name="projectType"
              value={formData.projectType}
              onChange={handleChange}
              className={`form-control ${errors.projectType ? 'error' : ''}`}
            >
              <option value="">Select project type</option>
              <option value="interior">Interior Only</option>
              <option value="exterior">Exterior Only</option>
              <option value="both">Interior & Exterior</option>
            </select>
            {errors.projectType && <div className="form-error">{errors.projectType}</div>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="rooms" className="form-label">
              Rooms/Areas to Paint
            </label>
            <input
              type="text"
              id="rooms"
              name="rooms"
              value={formData.rooms}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g., Living room, Kitchen, Bedroom"
            />
          </div>

          <div className="form-group">
            <label htmlFor="squareFootage" className="form-label">
              Approximate Square Footage
            </label>
            <input
              type="number"
              id="squareFootage"
              name="squareFootage"
              value={formData.squareFootage}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter square footage"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="timeframe" className="form-label">
              Preferred Timeframe *
            </label>
            <select
              id="timeframe"
              name="timeframe"
              value={formData.timeframe}
              onChange={handleChange}
              className={`form-control ${errors.timeframe ? 'error' : ''}`}
            >
              <option value="">Select timeframe</option>
              <option value="asap">As soon as possible</option>
              <option value="1-2weeks">1-2 weeks</option>
              <option value="1month">Within 1 month</option>
              <option value="2-3months">2-3 months</option>
              <option value="flexible">Flexible</option>
            </select>
            {errors.timeframe && <div className="form-error">{errors.timeframe}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="budget" className="form-label">
              Budget Range *
            </label>
            <select
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className={`form-control ${errors.budget ? 'error' : ''}`}
            >
              <option value="">Select budget range</option>
              <option value="under-1000">Under $1,000</option>
              <option value="1000-3000">$1,000 - $3,000</option>
              <option value="3000-5000">$3,000 - $5,000</option>
              <option value="5000-10000">$5,000 - $10,000</option>
              <option value="over-10000">Over $10,000</option>
            </select>
            {errors.budget && <div className="form-error">{errors.budget}</div>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Project Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-control"
            placeholder="Tell us more about your project..."
            rows="4"
          />
        </div>
      </div>

      {/* Appointment Booking */}
      <div className="form-section">
        <h3>Book Your Free Site Visit</h3>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Select Date *</label>
            <DatePicker
              selected={formData.appointmentDate}
              onChange={handleDateChange}
              minDate={new Date()}
              placeholderText="Choose a date"
              className={`form-control ${errors.appointmentDate ? 'error' : ''}`}
              dateFormat="MMMM d, yyyy"
            />
            {errors.appointmentDate && <div className="form-error">{errors.appointmentDate}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Select Time Slot *</label>
            <select
              name="appointmentSlot"
              value={formData.appointmentSlot}
              onChange={handleChange}
              className={`form-control ${errors.appointmentSlot ? 'error' : ''}`}
            >
              <option value="">Select a time slot</option>
              <option value="9:00 AM - 10:00 AM">9:00 AM - 10:00 AM</option>
              <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
              <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
              <option value="12:00 PM - 1:00 PM">12:00 PM - 1:00 PM</option>
              <option value="1:00 PM - 2:00 PM">1:00 PM - 2:00 PM</option>
              <option value="2:00 PM - 3:00 PM">2:00 PM - 3:00 PM</option>
              <option value="3:00 PM - 4:00 PM">3:00 PM - 4:00 PM</option>
              <option value="4:00 PM - 5:00 PM">4:00 PM - 5:00 PM</option>
            </select>
            {errors.appointmentSlot && <div className="form-error">{errors.appointmentSlot}</div>}
          </div>
        </div>
      </div>

      {/* File Upload */}
      <div className="form-section">
        <h3>Project Images (Optional)</h3>
        <p className="form-help">Upload photos of the areas to be painted (max 10 files, 5MB each)</p>
        
        <div className="file-upload-area">
          <input
            type="file"
            id="fileUpload"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
          />
          <label htmlFor="fileUpload" className="file-upload-label">
            <FaUpload />
            <span>Click to upload images</span>
          </label>
        </div>

        {files.length > 0 && (
          <div className="uploaded-files">
            {files.map((file, index) => (
              <div key={index} className="file-item">
                <FaImage />
                <span>{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="remove-file"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button 
        type="submit" 
        className="btn btn-cta btn-large"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <div className="spinner"></div>
            Submitting...
          </>
        ) : (
          'Get Free Quote'
        )}
      </button>
    </form>
  );
};

export default QuoteForm; 