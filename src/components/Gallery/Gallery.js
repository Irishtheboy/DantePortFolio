import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs, orderBy, query, deleteDoc, doc, updateDoc, increment } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../../firebase';
import { Eye, Heart, Trash2, Search, Share2, Download, ZoomIn, Grid, List } from 'lucide-react';
import { GallerySkeleton } from '../LoadingSkeleton/LoadingSkeleton';
import './Gallery.css';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState(new Set());
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');

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
      setImages([]);
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
  
  const filteredImages = images
    .filter(img => filter === 'all' || img.category === filter)
    .filter(img => 
      searchTerm === '' || 
      img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      img.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch(sortBy) {
        case 'oldest': return new Date(a.createdAt?.toDate()) - new Date(b.createdAt?.toDate());
        case 'popular': return (b.likes || 0) - (a.likes || 0);
        case 'title': return a.title.localeCompare(b.title);
        default: return new Date(b.createdAt?.toDate()) - new Date(a.createdAt?.toDate());
      }
    });

  const toggleFavorite = async (imageId) => {
    const newFavorites = new Set(favorites);
    if (favorites.has(imageId)) {
      newFavorites.delete(imageId);
      await updateDoc(doc(db, 'gallery', imageId), {
        likes: increment(-1)
      });
    } else {
      newFavorites.add(imageId);
      await updateDoc(doc(db, 'gallery', imageId), {
        likes: increment(1)
      });
    }
    setFavorites(newFavorites);
    setImages(images.map(img => 
      img.id === imageId 
        ? { ...img, likes: (img.likes || 0) + (newFavorites.has(imageId) ? 1 : -1) }
        : img
    ));
  };

  const shareImage = async (image) => {
    if (navigator.share) {
      await navigator.share({
        title: image.title,
        text: image.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return <GallerySkeleton />;
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
          className="gallery-controls"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="gallery-filters">
            {categories.map(category => (
              <button
                key={category}
                className={`filter-btn ${filter === category ? 'active' : ''}`}
                onClick={() => setFilter(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
          
          <div className="view-controls">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
              <option value="title">Title A-Z</option>
            </select>
            
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={16} />
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={16} />
            </button>
          </div>
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
            className={`gallery-${viewMode}`}
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
                <div className="stack">
                  <div className="card">
                    <img src={image.url} alt={image.title} />
                    <div className="image-overlay">
                      <div className="image-info">
                        <h3>{image.title}</h3>
                        {image.clientName && <p className="image-client">{image.clientName}</p>}
                        {image.location && <p className="image-location">{image.location}</p>}
                        <div className="image-stats">
                          <span><Eye size={16} /> View</span>
                          <span><Heart size={16} /> {image.likes || 0}</span>
                        </div>
                      </div>
                      <div className="image-actions">
                        <button 
                          className={`action-btn ${favorites.has(image.id) ? 'favorited' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(image.id);
                          }}
                        >
                          <Heart size={16} fill={favorites.has(image.id) ? 'currentColor' : 'none'} />
                        </button>
                        <button 
                          className="action-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            shareImage(image);
                          }}
                        >
                          <Share2 size={16} />
                        </button>
                        <button 
                          className="action-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage(image);
                          }}
                        >
                          <ZoomIn size={16} />
                        </button>
                        {user && (
                          <button 
                            className="action-btn delete-btn"
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
              <div className="lightbox-info">
                <h3>{selectedImage.title}</h3>
                <p>{selectedImage.description}</p>
                <div className="lightbox-actions">
                  <button onClick={() => toggleFavorite(selectedImage.id)}>
                    <Heart size={16} fill={favorites.has(selectedImage.id) ? 'currentColor' : 'none'} />
                    {selectedImage.likes || 0}
                  </button>
                  <button onClick={() => shareImage(selectedImage)}>
                    <Share2 size={16} /> Share
                  </button>
                  <a href={selectedImage.url} download target="_blank" rel="noopener noreferrer">
                    <Download size={16} /> Download
                  </a>
                </div>
              </div>
              <button 
                className="lightbox-close"
                onClick={() => setSelectedImage(null)}
              >
                ×
              </button>
              <button 
                className="lightbox-nav prev"
                onClick={() => {
                  const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
                  const prevIndex = currentIndex > 0 ? currentIndex - 1 : filteredImages.length - 1;
                  setSelectedImage(filteredImages[prevIndex]);
                }}
              >
                ‹
              </button>
              <button 
                className="lightbox-nav next"
                onClick={() => {
                  const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
                  const nextIndex = currentIndex < filteredImages.length - 1 ? currentIndex + 1 : 0;
                  setSelectedImage(filteredImages[nextIndex]);
                }}
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;