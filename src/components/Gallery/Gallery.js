import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs, orderBy, query, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../../firebase';
import { Eye, Heart, Trash2 } from 'lucide-react';
import './Gallery.css';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchImages();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const fetchImages = async () => {
    try {
      const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const imageData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setImages(imageData);
    } catch (error) {
      console.error('Error fetching images:', error);
      // Fallback demo data
      setImages([
        {
          id: 1,
          url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800',
          title: 'Portrait Session',
          category: 'portrait',
          likes: 45
        },
        {
          id: 2,
          url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800',
          title: 'Wedding Moments',
          category: 'wedding',
          likes: 67
        },
        {
          id: 3,
          url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
          title: 'Nature Beauty',
          category: 'landscape',
          likes: 32
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    
    try {
      await deleteDoc(doc(db, 'gallery', imageId));
      setImages(images.filter(img => img.id !== imageId));
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const categories = ['all', 'portrait', 'wedding', 'landscape', 'event'];
  
  const filteredImages = filter === 'all' 
    ? images 
    : images.filter(img => img.category === filter);

  if (loading) {
    return (
      <div className="gallery-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <section className="gallery" id="portfolio-section">
      <div className="gallery-container">
        <motion.div
          className="gallery-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title gradient-text">Portfolio Gallery</h2>
          <p className="section-subtitle">
           This is a collection of street art with visual appeal ranging from professional settings to raw, underground environments.
          </p>
        </motion.div>

        <motion.div
          className="gallery-filters"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {categories.map(category => (
            <button
              key={category}
              className={`filter-btn ${filter === category ? 'active' : ''}`}
              onClick={() => setFilter(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </motion.div>

        {filteredImages.length === 0 ? (
          <motion.div
            className="empty-gallery"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p>No images found in this category.</p>
            {user && <p>Upload some images through the admin panel to get started!</p>}
          </motion.div>
        ) : (
          <motion.div
            className="gallery-grid"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                className="gallery-item"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                onClick={() => setSelectedImage(image)}
              >
                <div className="image-container">
                  <img src={image.url} alt={image.title} />
                  <div className="image-overlay">
                    <div className="image-info">
                      <h3>{image.title}</h3>
                      <div className="image-stats">
                        <span><Eye size={16} /> View</span>
                        <span><Heart size={16} /> {image.likes || 0}</span>
                      </div>
                    </div>
                    {user && (
                      <button 
                        className="delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteImage(image.id);
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {selectedImage && (
          <div className="lightbox" onClick={() => setSelectedImage(null)}>
            <div className="lightbox-content" onClick={e => e.stopPropagation()}>
              <img src={selectedImage.url} alt={selectedImage.title} />
              <button 
                className="lightbox-close"
                onClick={() => setSelectedImage(null)}
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;