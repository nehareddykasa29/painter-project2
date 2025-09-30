import React, { useState, useEffect } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { fetchAvailability, submitQuote } from '../store/bookingSlice';
import { BACKEND_URL } from '../store/backend';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app as firebaseApp } from "../firebase";
import './QuoteForm.css';

// Add a small set of country codes for the dropdown
const COUNTRY_CODES = [
  { code: '+1', label: 'US/Canada (+1)', short: 'US/CA' },
  { code: '+44', label: 'UK (+44)', short: 'UK' },
  { code: '+91', label: 'India (+91)', short: 'IN' },
  { code: '+61', label: 'Australia (+61)', short: 'AU' },
  { code: '+81', label: 'Japan (+81)', short: 'JP' },
  { code: '+49', label: 'Germany (+49)', short: 'DE' },
  { code: '+33', label: 'France (+33)', short: 'FR' },
  { code: '+971', label: 'UAE (+971)', short: 'UAE' },
  { code: '+65', label: 'Singapore (+65)', short: 'SG' },
  // ...add more as needed
];

const QuoteForm = ({ onSubmit, isLoading = false, initialData = null }) => {
  const dispatch = useDispatch();
  const appointmentAvailability = useSelector(state => state.booking.availability);
  const appointmentLoading = useSelector(state => state.booking.appointmentLoading);
  const appointmentError = useSelector(state => state.booking.appointmentError);
  const quoteSubmitting = useSelector(state => state.booking.quoteSubmitting);
  const quoteSuccess = useSelector(state => state.booking.quoteSuccess);
  const quoteError = useSelector(state => state.booking.quoteError);

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    address: initialData?.address || '',
    serviceType: initialData?.serviceType || '',
    projectType: initialData?.projectType || '',
    rooms: initialData?.rooms || '',
    squareFootage: initialData?.squareFootage || '',
    timeframe: initialData?.timeframe || '',
    budget: initialData?.budget || '',
    description: initialData?.description || '',
    appointmentDate: initialData?.appointmentDate ? new Date(initialData.appointmentDate) : null,
    appointmentSlot: initialData?.appointmentSlot || '',
    countryCode: initialData?.countryCode || '+1', // default to US/Canada
  });

  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [uploadingImages, setUploadingImages] = useState(false);

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        address: initialData.address || '',
        serviceType: initialData.serviceType || '',
        projectType: initialData.projectType || '',
        rooms: initialData.rooms || '',
        squareFootage: initialData.squareFootage || '',
        timeframe: initialData.timeframe || '',
        budget: initialData.budget || '',
        description: initialData.description || '',
        appointmentDate: initialData.appointmentDate ? new Date(initialData.appointmentDate) : null,
        appointmentSlot: initialData.appointmentSlot || '',
        countryCode: initialData.countryCode || '+1',
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (appointmentAvailability) {
      console.log('Appointment availability:', appointmentAvailability);
    }
    if (appointmentError) {
      console.error('Appointment availability error:', appointmentError);
    }
  }, [appointmentAvailability, appointmentError]);

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
    } else if (!/^\d{7,15}$/.test(formData.phone.replace(/\D/g, ''))) {
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
      alert('Please correct the highlighted errors in the form.');
      return;
    }

    setUploadingImages(true);

    let imageUrls = [];
    let images = [];
    if (files.length > 0) {
      const storage = getStorage(firebaseApp);
      imageUrls = await Promise.all(
        files.map(async (file) => {
          const storageRef = ref(storage, `quote-images/${Date.now()}-${file.name}`);
          await uploadBytes(storageRef, file);
          const url = await getDownloadURL(storageRef);
          return { url, file };
        })
      );
      console.log("Uploaded image URLs:", imageUrls.map(i => i.url));
      // Build images array for backend
      images = imageUrls.map(({ url, file }) => ({
        filename: file.name,
        path: url,
        mimetype: file.type
      }));
    }

    setUploadingImages(false);

    // Find the slot index for the selected time
    const slotIndex = allPossibleSlots.findIndex(slot => slot === formData.appointmentSlot);

    // Format appointmentDate as "YYYY-MM-DD"
    const appointmentDateStr = formatDate(formData.appointmentDate);

    // Prepend country code to phone number
    const fullPhone = `${formData.countryCode}${formData.phone.replace(/^0+/, '')}`;

    // Build the JSON body
    const quoteBody = {
      name: formData.name,
      email: formData.email,
      phone: fullPhone,
      address: formData.address,
      serviceType: formData.serviceType,
      projectType: formData.projectType,
      timeframe: formData.timeframe,
      budget: formData.budget,
      description: formData.description,
      appointmentDate: appointmentDateStr,
      appointmentSlot: slotIndex,
      images // <-- add images array here
    };

    dispatch(submitQuote(quoteBody));
    setFormData({
      name: initialData?.name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      address: initialData?.address || '',
      serviceType: initialData?.serviceType || '',
      projectType: initialData?.projectType || '',
      rooms: initialData?.rooms || '',
      squareFootage: initialData?.squareFootage || '',
      timeframe: initialData?.timeframe || '',
      budget: initialData?.budget || '',
      description: initialData?.description || '',
      appointmentDate: initialData?.appointmentDate ? new Date(initialData.appointmentDate) : null,
      appointmentSlot: initialData?.appointmentSlot || '',
    });
    setFiles([]);
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

    // Limit to 5 images
    setFiles(prev => [...prev, ...validFiles].slice(0, 5));
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Replace fetchAvailability with Redux thunk dispatch
  const handleAvailabilityFetch = () => {
    dispatch(fetchAvailability());
  };

  // Helper to format date to YYYY-MM-DD for comparison
  const formatDate = date =>
    date
      ? date.getFullYear() +
        '-' +
        String(date.getMonth() + 1).padStart(2, '0') +
        '-' +
        String(date.getDate()).padStart(2, '0')
      : null;

  const selectedDateStr = formatDate(formData.appointmentDate);

  // Convert keys of appointmentAvailability to formatted strings for matching
  let blockedIndexes = [];
  if (
    appointmentAvailability &&
    formData.appointmentDate
  ) {
    Object.keys(appointmentAvailability).forEach(key => {
      // key is a Date object, so format it
      let keyStr;
      if (typeof key === 'string' && key.includes('-')) {
        keyStr = key;
      } else if (key instanceof Date) {
        keyStr = formatDate(key);
      } else {
        // Try to parse if it's not a string or Date
        try {
          keyStr = formatDate(new Date(key));
        } catch {
          keyStr = key;
        }
      }
      if (keyStr === selectedDateStr) {
        blockedIndexes = appointmentAvailability[key];
      }
    });
  }

  const allPossibleSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'
  ];

  // Block slots that are already completed for today
  let availableSlots = [];
  if (selectedDateStr) {
    // Remove blocked indexes from backend
    availableSlots = allPossibleSlots.filter((_, idx) => blockedIndexes.indexOf(idx) === -1);

    // If selected date is today, filter out past slots
    const today = new Date();
    const isToday =
      formData.appointmentDate &&
      today.getFullYear() === formData.appointmentDate.getFullYear() &&
      today.getMonth() === formData.appointmentDate.getMonth() &&
      today.getDate() === formData.appointmentDate.getDate();

    if (isToday) {
      const nowMinutes = today.getHours() * 60 + today.getMinutes();
      availableSlots = availableSlots.filter(slot => {
        const [h, m] = slot.split(':').map(Number);
        const slotMinutes = h * 60 + m;
        return slotMinutes > nowMinutes;
      });
    }
  }

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  if (quoteSubmitting) {
    return (
      <motion.div
        className="form-success"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center', padding: '40px 0' }}
      >
        <div className="spinner" style={{
          width: '40px',
          height: '40px',
          border: '5px solid #eee',
          borderTop: '5px solid #007bff',
          borderRadius: '50%',
          margin: '0 auto 16px auto',
          animation: 'spin 1s linear infinite'
        }} />
        <div style={{ fontSize: '18px', color: '#007bff' }}>Submitting your quote...</div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg);}
              100% { transform: rotate(360deg);}
            }
          `}
        </style>
      </motion.div>
    );
  }

  if (quoteSuccess) {
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
          onClick={() => window.location.reload()}
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
            <div className="phone-input-row">
              <select
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                className="form-control country-code-select"
                aria-label="Country code"
              >
                {COUNTRY_CODES.map(opt => (
                  <option key={opt.code} value={opt.code}>
                    {opt.short} {opt.code}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`form-control phone-number-input ${errors.phone ? 'error' : ''}`}
                placeholder="e.g., 9876543210"
              />
            </div>
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
            <div style={{ position: 'relative' }}>
              <DatePicker
                selected={formData.appointmentDate}
                onChange={handleDateChange}
                minDate={minDate}
                maxDate={maxDate}
                placeholderText="Choose a date"
                className={`form-control ${errors.appointmentDate ? 'error' : ''}`}
                dateFormat="dd/MM/yy"
                onFocus={handleAvailabilityFetch}
                disabled={appointmentLoading}
                filterDate={date => date.getDay() !== 0} // Block Sundays
              />
              {appointmentLoading && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255,255,255,0.7)',
                    zIndex: 2,
                    borderRadius: '4px'
                  }}
                >
                  <div className="spinner" style={{
                    width: '32px',
                    height: '32px',
                    border: '4px solid #eee',
                    borderTop: '4px solid #007bff',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  <style>
                    {`
                      @keyframes spin {
                        0% { transform: rotate(0deg);}
                        100% { transform: rotate(360deg);}
                      }
                    `}
                  </style>
                </div>
              )}
            </div>
            {errors.appointmentDate && <div className="form-error">{errors.appointmentDate}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Select Time Slot *</label>
            <select
              name="appointmentSlot"
              value={formData.appointmentSlot}
              onChange={handleChange}
              className={`form-control ${errors.appointmentSlot ? 'error' : ''}`}
              disabled={!formData.appointmentDate || availableSlots.length === 0}
            >
              <option value="">Select a time slot</option>
              {availableSlots.length > 0 && availableSlots.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
            {availableSlots.length === 0 && formData.appointmentDate && (
              <div className="form-error" style={{ marginTop: '8px' }}>
                No available time slots for the selected date. Please choose another date.
              </div>
            )}
            {errors.appointmentSlot && <div className="form-error">{errors.appointmentSlot}</div>}
          </div>
        </div>
      </div>

      {/* File Upload */}
      <div className="form-section">
        <h3>Project Images (Optional)</h3>
        <p className="form-help">Upload photos of the areas to be painted (max 5 files, 5MB each)</p>
        
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
        {files.length === 5 && (
          <div className="form-help" style={{ color: "#f44336" }}>
            Maximum 5 images allowed.
          </div>
        )}
      </div>

      <button 
        type="submit" 
        className="btn btn-cta btn-large"
        disabled={isLoading || uploadingImages}
      >
        {(isLoading || uploadingImages) ? (
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