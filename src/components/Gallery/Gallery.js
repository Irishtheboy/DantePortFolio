import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs, orderBy, query, deleteDoc, doc, updateDoc, increment } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../../firebase';
import { Eye, Heart, Trash2, Search, Share2, Download, ZoomIn, Grid, List, X, Camera, Image as ImageIcon, Star } from 'lucide-react';
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
  const [stats, setStats] = useState({ total: 0, categories: 0, favorites: 0 });

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
      
      // Calculate stats
      const categories = [...new Set(imageData.map(img => img.category).filter(Boolean))];
      const totalFavorites = imageData.reduce((sum, img) => sum + (img.likes || 0), 0);
      
      setStats({
        total: imageData.length,
        categories: categories.length,
        favorites: totalFavorites
      });
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
    );

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
    return (
      <div className="gallery-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="gallery-page">
      {/* Left Content Section */}
      <motion.div
        className="gallery-content"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="gallery-header">
          <h1 className="gallery-title">
            PHOTOGRAPHY<span className="gradient-text">GALLERY</span>
          </h1>
          <p className="gallery-subtitle">Visual Stories & Creative Moments</p>
        </div>

        <div className="gallery-description">
          <p>
            Explore a curated collection of my finest work. Each image tells a unique story, 
            captured through my lens and crafted with passion for visual storytelling.
          </p>
        </div>

        <div className="gallery-stats">
          <div className="stat-item">
            <ImageIcon size={24} />
            <span>{stats.total} Images</span>
          </div>
          <div className="stat-item">
            <Camera size={24} />
            <span>{stats.categories} Categories</span>
          </div>
          <div className="stat-item">
            <Heart size={24} />
            <span>{stats.favorites} Likes</span>
          </div>
        </div>

        <div className="gallery-controls">
          <div className="search-container">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-tabs">
            {categories.map(category => (
              <button
                key={category}
                className={`filter-tab ${filter === category ? 'active' : ''}`}
                onClick={() => setFilter(category)}
              >
                {category.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right Visual Section */}
      <motion.div
        className="gallery-visual"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="gallery-grid-container">
          {filteredImages.length === 0 ? (
            <div className="empty-state">
              <ImageIcon size={48} />
              <p>No images found.</p>
              {user && <p>Upload images through the admin panel to get started.</p>}
            </div>
          ) : (
            <div className="gallery-grid">
              {filteredImages.slice(0, 9).map((image, index) => (
                <motion.div
                  key={image.id}
                  className="gallery-item"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="image-container">
                    <img
                      src={image.url || image.imageUrl}
                      alt={image.title}
                      className="gallery-image"
                      loading="lazy"
                      onError={(e) => {
                        console.error('Gallery image failed to load:', image.url || image.imageUrl);
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="image-overlay">
                      <div className="image-info">
                        <h3 className="image-title">{image.title}</h3>
                        {image.category && (
                          <p className="image-category">{image.category}</p>
                        )}
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
                </motion.div>
              ))}
            </div>
          )}
          
          {filteredImages.length > 9 && (
            <div className="view-all-btn">
              <button 
                className="btn-primary"
                onClick={() => {
                  // Show all images in lightbox or expand view
                  setSelectedImage(filteredImages[0]);
                }}
              >
                View All {filteredImages.length} Images
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Lightbox */}
      {selectedImage && (
        <div className="lightbox" onClick={() => setSelectedImage(null)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <img 
              src={selectedImage.url || selectedImage.imageUrl} 
              alt={selectedImage.title} 
              className="lightbox-image"
            />
            <div className="lightbox-info">
              <h3>{selectedImage.title}</h3>
              {selectedImage.description && <p>{selectedImage.description}</p>}
              <div className="lightbox-actions">
                <button 
                  className={`lightbox-btn ${favorites.has(selectedImage.id) ? 'favorited' : ''}`}
                  onClick={() => toggleFavorite(selectedImage.id)}
                >
                  <Heart size={16} fill={favorites.has(selectedImage.id) ? 'currentColor' : 'none'} />
                  {selectedImage.likes || 0}
                </button>
                <button 
                  className="lightbox-btn"
                  onClick={() => shareImage(selectedImage)}
                >
                  <Share2 size={16} /> Share
                </button>
                <a 
                  href={selectedImage.url || selectedImage.imageUrl} 
                  download 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="lightbox-btn"
                >
                  <Download size={16} /> Download
                </a>
              </div>
            </div>
            <button 
              className="lightbox-close"
              onClick={() => setSelectedImage(null)}
            >
              <X size={24} />
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
  );
};

export default Gallery;