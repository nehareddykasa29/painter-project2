import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaUpload, FaImage, FaFileUpload, FaTrash } from 'react-icons/fa';
import './ImageUploadModal.css';

const ImageUploadModal = ({ isOpen, onClose }) => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    alt: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleClose = useCallback(() => {
    console.log('Closing modal...'); // Debug log
    setFormData({ alt: '' });
    setSelectedFile(null);
    setPreviewUrl('');
    setIsDragOver(false);
    if (onClose) {
      console.log('Calling onClose...'); // Debug log
      onClose();
    }
  }, [onClose]);

  // Add keyboard event listener for Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleClose]);

  // Cleanup preview URL when component unmounts or previewUrl changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      // Show alert for demo purposes
      alert('File selected: ' + file.name + ' (Upload functionality would be implemented here)');
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
    // Show alert for demo purposes
    alert('File dropped: ' + (file ? file.name : 'No file') + ' (Upload functionality would be implemented here)');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsLoading(true);
    
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show alert instead of actual upload
      alert('Image upload functionality would be implemented here');
      
      // Reset form and close modal
      handleClose();
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // Show alert for demo purposes
    alert('File removed (Remove functionality would be implemented here)');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="image-upload-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <motion.div
          className="image-upload-modal"
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              handleClose();
            }
          }}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="modal-header">
            <h2 id="modal-title">Upload New Image</h2>
            <button 
              type="button"
              className="close-button" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Close button clicked'); // Debug log
                handleClose();
              }}
              aria-label="Close modal"
              title="Close (Esc)"
            >
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="upload-form">
            {/* File Upload Area */}
            <div className="form-group">
              <label htmlFor="alt">
                <FaImage className="input-icon" />
                Image Description (Optional)
              </label>
              <input
                type="text"
                id="alt"
                name="alt"
                value={formData.alt}
                onChange={handleInputChange}
                placeholder="Enter image description"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label>
                <FaFileUpload className="input-icon" />
                Select Image File
              </label>
              
              <div 
                className={`file-upload-area ${isDragOver ? 'drag-over' : ''} ${previewUrl ? 'has-file' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  style={{ display: 'none' }}
                />
                
                {previewUrl ? (
                  <div className="file-preview">
                    <img src={previewUrl} alt="Preview" />
                    <div className="file-info">
                      <p>{selectedFile.name}</p>
                      <p>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button
                      type="button"
                      className="remove-file-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile();
                      }}
                      title="Remove file"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <FaUpload className="upload-icon" />
                    <p>Click to select or drag and drop an image file</p>
                    <p className="upload-hint">Supports: JPG, PNG, GIF, WebP (Max 10MB)</p>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="upload-button"
              disabled={isLoading || !selectedFile}
            >
              {isLoading ? 'Uploading...' : (
                <>
                  <FaUpload /> Upload Image
                </>
              )}
            </button>
          </form>

          <div className="upload-info">
            <p><strong>Note:</strong> This is a demo modal - no actual upload functionality is implemented.</p>
            <p>For best results, use high-quality images with aspect ratios between 1:1 and 16:9.</p>
            <p>Maximum file size: 10MB</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageUploadModal;

