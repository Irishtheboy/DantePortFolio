import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Camera, Video, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import './Entry.css';

const Entry = () => {
  const [stats, setStats] = useState({ projects: 0, videos: 0, experience: 5 });
  const [heroImage, setHeroImage] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [gallerySnap, videosSnap, heroSnap] = await Promise.all([
          getDocs(collection(db, 'gallery')),
          getDocs(collection(db, 'videos')),
          getDocs(collection(db, 'hero'))
        ]);
        
        setStats({
          projects: gallerySnap.size,
          videos: videosSnap.size,
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

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className="entry-page">
      <motion.div
        className="entry-content"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="entry-header">
          <h1 className="entry-title">
            DANTE<span className="gradient-text">KILLSTORM</span>
          </h1>
          <p className="entry-subtitle">Visual Storyteller & Creative Director</p>
        </div>

        <div className="entry-description">
          <p>
            Welcome to my creative universe. I capture extraordinary moments through 
            photography and videography, creating compelling visual narratives that 
            resonate with audiences worldwide.
          </p>
        </div>

        <div className="entry-stats">
          <div className="stat-item">
            <Camera size={24} />
            <span>{stats.projects}+ Projects</span>
          </div>
          <div className="stat-item">
            <Video size={24} />
            <span>{stats.videos}+ Videos</span>
          </div>
          <div className="stat-item">
            <Star size={24} />
            <span>{stats.experience} Years Experience</span>
          </div>
        </div>

        <div className="entry-actions">
          <Link to="/home" className="btn-primary">
            Enter Portfolio <ArrowRight size={18} />
          </Link>
          <Link to="/about" className="btn-secondary">
            About Me
          </Link>
        </div>
      </motion.div>

      <motion.div
        className="entry-visual"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="visual-container">
          {!imageLoaded && (
            <div className="image-loading">
              <div className="loading-spinner"></div>
            </div>
          )}
          {heroImage && (
            <img 
              src={heroImage} 
              alt="DANTEKILLSTORM Photography" 
              className={`entry-image ${imageLoaded ? 'loaded' : ''}`}
              onLoad={handleImageLoad}
              style={{ opacity: imageLoaded ? 1 : 0 }}
            />
          )}
          <div className="visual-overlay"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default Entry;