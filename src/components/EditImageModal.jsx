import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaEdit, FaImage } from "react-icons/fa";
import './ImageUploadModal.css';

const serviceTypeOptions = [
  "Interior Painting",
  "Exterior Painting",
  "Residential Painting",
  "Commercial Painting",
  "Cabinet Refinishing",
  "Deck Staining",
  "Other"
];

const EditImageModal = ({ image, isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    caption: image?.caption || "",
    imageUrl: image?.imageUrl || "",
    serviceType: image?.serviceType || ""
  });

  useEffect(() => {
    setFormData({
      caption: image?.caption || "",
      imageUrl: image?.imageUrl || "",
      serviceType: image?.serviceType || ""
    });
  }, [image]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen || !image) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="image-upload-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="image-upload-modal"
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          onClick={e => e.stopPropagation()}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="modal-header">
            <h2 id="modal-title">Edit Image</h2>
            <button
              type="button"
              className="close-button"
              onClick={onClose}
              aria-label="Close modal"
              title="Close (Esc)"
            >
              <FaTimes />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="upload-form">
            <div className="form-group">
              <label htmlFor="caption">Caption</label>
              <input
                type="text"
                id="caption"
                name="caption"
                value={formData.caption}
                onChange={handleInputChange}
                placeholder="Edit caption"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="imageUrl">
                <FaImage className="input-icon" />
                Image URL
              </label>
              <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                placeholder="Edit image URL"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="serviceType">Service Type</label>
              <select
                id="serviceType"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleInputChange}
                required
              >
                <option value="">Select service type</option>
                {serviceTypeOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="upload-button"
            >
              <FaEdit /> Update
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditImageModal;
