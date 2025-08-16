import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaImages, FaTrash, FaPlus, FaUndo, FaTrashAlt, FaEdit } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { deleteImage, restoreImage, permanentlyDeleteImage, toggleJunkView, toggleUploadModal } from '../store/gallerySlice';
import ImageUploadModal from '../components/ImageUploadModal';
import './Gallery.css';



const Gallery = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  const { activeImages, deletedImages, showJunk, showUploadModal } = useSelector(state => state.gallery);
  const [lightboxIdx, setLightboxIdx] = useState(null);

  useEffect(() => {
    document.title = 'Project Gallery | The Painter Guys Pros';
    document.querySelector('meta[name="description"]')?.setAttribute('content', 
      'Browse our gallery of completed painting projects and transformations by The Painter Guys Pros.'
    );
  }, []);

  const handleDeleteImage = (imageId) => {
    // No functionality - button is just for display
  };

  const handleEditImage = (image) => {
    // No functionality - button is just for display
  };

  const handleRestoreImage = (imageId) => {
    // No functionality - button is just for display
  };

  const handlePermanentlyDeleteImage = (imageId) => {
    // No functionality - button is just for display
  };

  const handleToggleJunkView = () => {
    // No functionality - button is just for display
  };

  const handleToggleUploadModal = () => {
    // No functionality - button is just for display
  };

  return (
    <div className="gallery-page">
      <section className="hero-section">
        <div className="container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Project Gallery</h1>
            <p>See the difference! Explore our recent painting projects and transformations.</p>
          </motion.div>
        </div>
      </section>

      <section className="gallery-grid-section">
        {/* Admin Controls */}
        {isAuthenticated && (
          <div className="admin-gallery-controls">
            <button 
              className="upload-btn"
              onClick={handleToggleUploadModal}
            >
              <FaPlus /> Upload Image
            </button>
          </div>
        )}

        <div className="gallery-grid">
          {(showJunk ? deletedImages : activeImages).map((image, idx) => (
            <motion.div
              className="gallery-img-card"
              key={image.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
            >
              <img 
                src={image.url} 
                alt={image.alt} 
                className={`gallery-img ${showJunk ? 'deleted-image' : ''}`}
                onClick={() => setLightboxIdx(idx)}
                tabIndex={0}
                role="button"
                aria-label="View larger image"
              />
              
              {showJunk && image.deletedAt && (
                <div className="deleted-date">
                  Deleted: {new Date(image.deletedAt).toLocaleDateString()}
                </div>
              )}
              
              {/* Admin-only controls */}
              {isAuthenticated && (
                <div className="admin-image-controls">
                  {showJunk ? (
                    <>
                      <button 
                        className="admin-btn restore-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRestoreImage(image.id);
                        }}
                        title="Restore Image"
                      >
                        <FaUndo />
                      </button>
                      <button 
                        className="admin-btn permanent-delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePermanentlyDeleteImage(image.id);
                        }}
                        title="Permanently Delete Image"
                      >
                        <FaTrashAlt />
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        className="admin-btn edit-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditImage(image);
                        }}
                        title="Edit Image"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="admin-btn delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteImage(image.id);
                        }}
                        title="Delete Image"
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            className="lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIdx(null)}
          >
            <motion.img
              className="lightbox-img"
              src={(showJunk ? deletedImages : activeImages)[lightboxIdx]?.url}
              alt={`Large view of ${(showJunk ? deletedImages : activeImages)[lightboxIdx]?.alt || 'project'}`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            />
            <button className="lightbox-close" onClick={() => setLightboxIdx(null)} aria-label="Close image">×</button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Image Upload Modal */}
      <ImageUploadModal 
        isOpen={showUploadModal} 
        onClose={() => dispatch(toggleUploadModal())} 
      />
    </div>
  );
};

export default Gallery; 