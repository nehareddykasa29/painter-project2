import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaChevronLeft, FaChevronRight, FaExpand } from 'react-icons/fa';
import './Gallery.css';

const Gallery = ({ showFilters = true, limit = null }) => {
  const [filter, setFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  // Sample gallery data - in production, this would come from API
  const galleryData = [
    {
      id: 1,
      title: 'Modern Living Room Transformation',
      description: 'Complete interior painting with accent wall',
      category: 'interior',
      serviceType: 'residential',
      image: '/api/placeholder/600/400',
      beforeImage: '/api/placeholder/300/200',
      afterImage: '/api/placeholder/300/200',
      tags: ['living room', 'modern', 'accent wall']
    },
    {
      id: 2,
      title: 'Commercial Office Building',
      description: 'Exterior painting and restoration',
      category: 'exterior',
      serviceType: 'commercial',
      image: '/api/placeholder/600/400',
      beforeImage: '/api/placeholder/300/200',
      afterImage: '/api/placeholder/300/200',
      tags: ['office', 'commercial', 'exterior']
    },
    {
      id: 3,
      title: 'Kitchen Cabinet Refinishing',
      description: 'Cabinet painting and hardware update',
      category: 'interior',
      serviceType: 'residential',
      image: '/api/placeholder/600/400',
      beforeImage: '/api/placeholder/300/200',
      afterImage: '/api/placeholder/300/200',
      tags: ['kitchen', 'cabinets', 'refinishing']
    },
    {
      id: 4,
      title: 'Victorian Home Exterior',
      description: 'Historic home exterior restoration',
      category: 'exterior',
      serviceType: 'residential',
      image: '/api/placeholder/600/400',
      beforeImage: '/api/placeholder/300/200',
      afterImage: '/api/placeholder/300/200',
      tags: ['historic', 'victorian', 'restoration']
    },
    {
      id: 5,
      title: 'Retail Store Interior',
      description: 'Brand-focused interior painting',
      category: 'interior',
      serviceType: 'commercial',
      image: '/api/placeholder/600/400',
      beforeImage: '/api/placeholder/300/200',
      afterImage: '/api/placeholder/300/200',
      tags: ['retail', 'branding', 'commercial']
    },
    {
      id: 6,
      title: 'Deck Staining Project',
      description: 'Deck cleaning and staining',
      category: 'exterior',
      serviceType: 'residential',
      image: '/api/placeholder/600/400',
      beforeImage: '/api/placeholder/300/200',
      afterImage: '/api/placeholder/300/200',
      tags: ['deck', 'staining', 'outdoor']
    }
  ];

  const filteredImages = galleryData.filter(item => {
    if (filter === 'all') return true;
    return item.category === filter || item.serviceType === filter;
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
      )}

      <div className="gallery-grid">
        <AnimatePresence>
          {displayImages.map((item, index) => (
            <motion.div
              key={item.id}
              className="gallery-item"
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              onClick={() => openLightbox(item, index)}
            >
              <div className="gallery-image-container">
                <img
                  src={item.image}
                  alt={item.title}
                  className="gallery-image"
                  loading="lazy"
                />
                <div className="gallery-overlay">
                  <div className="gallery-overlay-content">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <div className="gallery-tags">
                      {item.tags.map(tag => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button className="expand-btn">
                      <FaExpand />
                    </button>
                  </div>
                </div>
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
            onClick={closeLightbox}
          >
            <motion.div
              className="lightbox-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="lightbox-close" onClick={closeLightbox}>
                <FaTimes />
              </button>

              <div className="lightbox-image-container">
                <img
                  src={selectedImage.image}
                  alt={selectedImage.title}
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

              <div className="lightbox-info">
                <h3>{selectedImage.title}</h3>
                <p>{selectedImage.description}</p>
                
                {selectedImage.beforeImage && selectedImage.afterImage && (
                  <div className="before-after">
                    <div className="before-after-item">
                      <h4>Before</h4>
                      <img src={selectedImage.beforeImage} alt="Before" />
                    </div>
                    <div className="before-after-item">
                      <h4>After</h4>
                      <img src={selectedImage.afterImage} alt="After" />
                    </div>
                  </div>
                )}

                <div className="project-details">
                  <span className="detail-item">
                    <strong>Category:</strong> {selectedImage.category}
                  </span>
                  <span className="detail-item">
                    <strong>Service:</strong> {selectedImage.serviceType}
                  </span>
                </div>

                <div className="lightbox-tags">
                  {selectedImage.tags.map(tag => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
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