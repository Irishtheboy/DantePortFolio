import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase';
import { Instagram, Twitter } from 'lucide-react';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Grid size options for masonry layout
  const gridSizes = ['small', 'medium', 'large', 'tall', 'square', 'medium-tall'];

  // Demo images as fallback
  const demoImages = [
    {
      id: 'demo-1',
      title: 'Portrait Session',
      category: 'Portrait',
      imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616c9c9b8d4?w=400&h=500&fit=crop',
      size: 'large'
    },
    {
      id: 'demo-2',
      title: 'Wedding Photography',
      category: 'Wedding',
      imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=600&fit=crop',
      size: 'medium'
    },
    {
      id: 'demo-3',
      title: 'Landscape Shot',
      category: 'Landscape',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=800&fit=crop',
      size: 'tall'
    },
    {
      id: 'demo-4',
      title: 'Event Coverage',
      category: 'Event',
      imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop',
      size: 'small'
    },
    {
      id: 'demo-5',
      title: 'Studio Session',
      category: 'Studio',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      size: 'square'
    },
    {
      id: 'demo-6',
      title: 'Fashion Photography',
      category: 'Fashion',
      imageUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=700&fit=crop',
      size: 'medium-tall'
    }
  ];

  useEffect(() => {
    const fetchImages = async () => {
      try {
        console.log('Fetching images from Firebase gallery...');
        // Fetch images from Firebase gallery collection
        const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
        const gallerySnapshot = await getDocs(q);
        
        console.log('Gallery snapshot size:', gallerySnapshot.size);
        
        if (!gallerySnapshot.empty) {
          const galleryImages = gallerySnapshot.docs.map((doc, index) => {
            const data = doc.data();
            console.log('Image data:', data);
            return {
              id: doc.id,
              ...data,
              // Assign grid sizes in a pattern for visual variety
              size: gridSizes[index % gridSizes.length],
              // Ensure we have the correct image URL property
              imageUrl: data.url || data.imageUrl || data.src
            };
          });
          
          console.log('Processed gallery images:', galleryImages);
          // Take only the first 12 images for the homepage
          setImages(galleryImages.slice(0, 12));
        } else {
          console.log('No images found in Firebase gallery, using demo images');
          // If no images in Firebase, use demo images
          setImages(demoImages);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
        console.log('Using demo images due to error');
        setImages(demoImages);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const handleImageClick = (image) => {
    // Navigate to gallery page with the selected image
    navigate('/gallery');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Main Content */}
      <main className="main-content">
        {/* Page Title */}
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="page-title">RECENT WORK</h1>
        </motion.div>

        {/* Portfolio Grid */}
        {images.length === 0 ? (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p>No images available. Upload images through the admin panel to showcase your work.</p>
          </motion.div>
        ) : (
          <motion.div
            className="portfolio-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                className={`portfolio-item ${image.size || 'medium'}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => handleImageClick(image)}
              >
                <div className="image-container">
                  <img
                    src={image.imageUrl}
                    alt={image.title || 'Gallery Image'}
                    className="portfolio-image"
                    loading="lazy"
                    onError={(e) => {
                      console.error('Image failed to load:', image.imageUrl);
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="image-overlay">
                    <div className="image-info">
                      <h3 className="image-title">{image.title || 'Untitled'}</h3>
                      <p className="image-category">{image.category || 'Photography'}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {/* Side Navigation */}
      <div className="side-nav left">
        <div className="side-nav-content">
          <span className="side-nav-text">BACK</span>
        </div>
      </div>

      <div className="side-nav right">
        <div className="side-nav-content">
          <span className="side-nav-text">NEXT</span>
          <div className="social-links">
            <a href="#" className="social-link" aria-label="Instagram">
              <Instagram size={16} />
            </a>
            <a href="#" className="social-link" aria-label="Twitter">
              <Twitter size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;