import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Camera, Heart, Star, MapPin } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ clients: 0, sessions: 0, experience: 5 });
  const [heroImage, setHeroImage] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [gallerySnap, videosSnap, bookingsSnap, heroSnap] = await Promise.all([
          getDocs(collection(db, 'gallery')),
          getDocs(collection(db, 'videos')),
          getDocs(collection(db, 'bookings')),
          getDocs(collection(db, 'hero'))
        ]);
        
        setStats({
          clients: Math.floor((gallerySnap.size + videosSnap.size) / 3), // Estimate clients
          sessions: gallerySnap.size + videosSnap.size,
          experience: 5
        });
        
        if (!heroSnap.empty) {
          const heroData = heroSnap.docs[0].data();
          setHeroImage(heroData.imageUrl);
        } else {
          setHeroImage('');
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        setHeroImage('');
      }
    };
    
    fetchStats();
  }, []);

  const handleBookSession = () => {
    navigate('/booking');
  };

  const handleViewWork = () => {
    navigate('/portfolio');
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <section className="hero">
      <div className="hero-overlay"></div>
      
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="hero-title">
          Creative Photography<br/>
          Studio
        </h1>
        
        <p className="hero-subtitle">
          Cum et labore appareat, te est nostrum eligendi adipisci. Tota quas habeo eu vel. Vel autem<br/>
          aperiam primis.
        </p>
        
        <div className="hero-buttons">
          <button className="btn-hero" onClick={handleBookSession}>
            Find More
          </button>
        </div>
      </motion.div>

      <motion.div
        className="hero-image-container"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        {!imageLoaded && (
          <div className="hero-image-loading">
            <div className="loading-spinner"></div>
          </div>
        )}
        {heroImage && (
          <img 
            src={heroImage} 
            alt="KillyDidShootIt Photography Studio" 
            className={`hero-image ${imageLoaded ? 'loaded' : ''}`}
            onLoad={handleImageLoad}
            style={{ opacity: imageLoaded ? 1 : 0 }}
          />
        )}
        <div className="hero-image-overlay"></div>
      </motion.div>

      {/* Navigation Arrows */}
      <button className="hero-nav hero-nav-prev" aria-label="Previous">
        <span>‹</span>
      </button>
      <button className="hero-nav hero-nav-next" aria-label="Next">
        <span>›</span>
      </button>
    </section>
  );
};

export default Hero;