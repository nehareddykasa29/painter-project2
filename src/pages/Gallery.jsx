import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaImages, FaPlus } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleUploadModal, fetchGalleryImages, deleteImage, editImage } from '../store/gallerySlice';
import ImageUploadModal from '../components/ImageUploadModal';
import GalleryComponent from '../components/Gallery';
import EditImageModal from '../components/EditImageModal';
import './Gallery.css';

const Gallery = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  const { activeImages, showUploadModal } = useSelector(state => state.gallery);
  const { token } = useSelector(state => state.auth);
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editImageData, setEditImageData] = useState(null);

  useEffect(() => {
    document.title = 'Project Gallery | The Painter Guys Pros';
    document.querySelector('meta[name="description"]')?.setAttribute('content', 
      'Browse our gallery of completed painting projects and transformations by The Painter Guys Pros.'
    );
    dispatch(fetchGalleryImages()); // Fetch images from backend
  }, [dispatch]);

  const handleToggleUploadModal = () => {
    if (isAuthenticated) {
      dispatch(toggleUploadModal());
    }
  };

  const handleDeleteImage = (id) => {
    if (isAuthenticated && token) {
      dispatch(deleteImage({ id, token }));
    }
  };

  const handleEditImage = (image) => {
    setEditImageData(image);
    setEditModalOpen(true);
  };

  const handleEditSubmit = (updates) => {
    if (isAuthenticated && token && editImageData?._id) {
      dispatch(editImage({ id: editImageData._id, updates, token }))
        .then(() => setEditModalOpen(false));
    }
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

        {/* Use GalleryComponent and pass images */}
        <GalleryComponent
          images={activeImages}
          isAuthenticated={isAuthenticated}
          onOpenUploadModal={handleToggleUploadModal}
          onDeleteImage={handleDeleteImage}
          onEditImage={handleEditImage}
        />
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
              src={activeImages[lightboxIdx]?.url}
              alt={`Large view of ${activeImages[lightboxIdx]?.alt || 'project'}`}
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

      {/* Edit Image Modal */}
      {editModalOpen && (
        <EditImageModal
          image={editImageData}
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSubmit={handleEditSubmit}
        />
      )}
    </div>
  );
};

export default Gallery;