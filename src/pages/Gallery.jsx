import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaImages } from 'react-icons/fa';
import './Gallery.css';

const galleryImages = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1523413363574-c30aa1c2a516?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
];

const Gallery = () => {
  const [lightboxIdx, setLightboxIdx] = useState(null);

  useEffect(() => {
    document.title = 'Project Gallery | The Painter Guys Pros';
    document.querySelector('meta[name="description"]')?.setAttribute('content', 
      'Browse our gallery of completed painting projects and transformations by The Painter Guys Pros.'
    );
  }, []);

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
        <div className="gallery-grid">
          {galleryImages.map((src, idx) => (
            <motion.div
              className="gallery-img-card"
              key={src}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              onClick={() => setLightboxIdx(idx)}
              tabIndex={0}
              role="button"
              aria-label="View larger image"
            >
              <img src={src} alt={`Project ${idx + 1}`} className="gallery-img" />
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
              src={galleryImages[lightboxIdx]}
              alt={`Large view of project ${lightboxIdx + 1}`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            />
            <button className="lightbox-close" onClick={() => setLightboxIdx(null)} aria-label="Close image">×</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery; 