import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaChevronLeft, FaChevronRight, FaExpand, FaTrash, FaEdit } from 'react-icons/fa';
import './Gallery.css';

const Gallery = ({ images = [], showFilters = true, limit = null, isAuthenticated = false, onOpenUploadModal, onDeleteImage, onEditImage }) => {
  const [filter, setFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filtering logic based on serviceType
  const filteredImages = images
    .slice() // copy array to avoid mutating original
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // sort by createdAt desc
    .filter(item => {
      if (filter === 'all') return true;
      return (item.serviceType && item.serviceType.toLowerCase().includes(filter)) ||
             (item.caption && item.caption.toLowerCase().includes(filter));
    });

  const displayImages = limit ? filteredImages.slice(0, limit) : filteredImages;

  const openLightbox = (image, index) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    setCurrentIndex(0);
  };

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(filteredImages[nextIndex]);
  };

  const prevImage = () => {
    const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setCurrentIndex(prevIndex);
    setSelectedImage(filteredImages[prevIndex]);
  };

  const handleKeyDown = (e) => {
    if (selectedImage) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, currentIndex]);

  const filterOptions = [
    { value: 'all', label: 'All Projects' },
    { value: 'interior', label: 'Interior' },
    { value: 'exterior', label: 'Exterior' },
    { value: 'residential', label: 'Residential' },
    { value: 'commercial', label: 'Commercial' }
  ];

  return (
    <div className="gallery-container">
      {showFilters && (
        <div className="gallery-header">
          <div className="gallery-filters">
            {filterOptions.map(option => (
              <button
                key={option.value}
                className={`filter-btn ${filter === option.value ? 'active' : ''}`}
                onClick={() => setFilter(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="gallery-grid">
        <AnimatePresence>
          {displayImages.map((item, index) => (
            <motion.div
              key={item._id || item.id}
              className="gallery-item"
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="gallery-image-container" onClick={() => openLightbox(item, index)}>
                <img
                  src={item.imageUrl}
                  alt={item.caption}
                  className="gallery-image"
                  loading="lazy"
                />
                {/* Show edit and delete buttons on image if authenticated */}
                {isAuthenticated && (
                  <div style={{ position: "absolute", top: 8, right: 8, zIndex: 2, display: "flex", gap: "8px" }}>
                    <button
                      className="gallery-admin-action-btn gallery-edit-btn"
                      title="Edit Image"
                      style={{
                        background: "rgba(40,167,69,0.9)",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "32px",
                        height: "32px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer"
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onEditImage) onEditImage(item);
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="gallery-admin-action-btn gallery-delete-btn"
                      title="Delete Image"
                      style={{
                        background: "rgba(220,53,69,0.9)",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "32px",
                        height: "32px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer"
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onDeleteImage) onDeleteImage(item._id || item.id);
                      }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {displayImages.length === 0 && (
        <div className="no-results">
          <h3>No projects found</h3>
          <p>Try adjusting your filter selection</p>
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeLightbox}
          >
            <motion.div
              className="lightbox-content"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="lightbox-close" onClick={closeLightbox}>
                <FaTimes />
              </button>

              <div className="lightbox-image-container">
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.caption}
                  className="lightbox-image"
                />
                {filteredImages.length > 1 && (
                  <>
                    <button className="lightbox-nav prev" onClick={prevImage}>
                      <FaChevronLeft />
                    </button>
                    <button className="lightbox-nav next" onClick={nextImage}>
                      <FaChevronRight />
                    </button>
                  </>
                )}
              </div>

              <div className="lightbox-counter">
                {currentIndex + 1} / {filteredImages.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;