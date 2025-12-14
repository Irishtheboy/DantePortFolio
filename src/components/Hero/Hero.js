import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Play, Camera, Video } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import './Hero.css';

const Hero = () => {
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
          setHeroImage('https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800');
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        setHeroImage('https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800');
      }
    };
    
    fetchStats();
  }, []);

  const scrollToPortfolio = () => {
    document.getElementById('portfolio-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <section className="hero">
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="trend-label">KillyDidIt</div>
        <h1 className="hero-title">
          DANTEKILLSTORM<br/>
          <span className="gradient-text">Visual Storyteller</span><br/>
          & Creative Director
        </h1>
        <p className="hero-description">
          Welcome to my creative universe. I capture extraordinary moments through photography 
          and videography, creating compelling visual narratives that resonate with audiences worldwide.
        </p>
        
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-number">{stats.projects}+</span>
            <span className="stat-label">Projects</span>
          </div>
          <div className="stat">
            <span className="stat-number">{stats.videos}+</span>
            <span className="stat-label">Videos</span>
          </div>
          <div className="stat">
            <span className="stat-number">{stats.experience}</span>
            <span className="stat-label">Years Experience</span>
          </div>
        </div>
        
        <button className="btn-primary" onClick={scrollToPortfolio}>
          VIEW PORTFOLIO
        </button>
        
        <div className="deco-lines-bottom"></div>
      </motion.div>

      <motion.div
        className="hero-visual"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="pattern-dots hero-dots-bg"></div>
        <div className="deco-yellow-block"></div>
        {!imageLoaded && (
          <div className="hero-image-loading">
            <div className="loading-spinner"></div>
          </div>
        )}
        {heroImage && (
          <img 
            src={heroImage} 
            alt="DANTEKILLSTORM Photography" 
            className={`main-img ${imageLoaded ? 'loaded' : ''}`}
            onLoad={handleImageLoad}
            style={{ opacity: imageLoaded ? 1 : 0 }}
          />
        )}
        <div className="deco-black-rect"></div>
      </motion.div>
    </section>
  );
};

export default Hero;