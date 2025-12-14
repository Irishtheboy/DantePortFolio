import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Camera, Video, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import './Entry.css';

const Entry = () => {
  const [stats, setStats] = useState({ projects: 0, videos: 0, experience: 5 });
  const [heroImage, setHeroImage] = useState('https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&h=800&fit=crop');

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
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    
    fetchStats();
  }, []);

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
          <img 
            src={heroImage} 
            alt="DANTEKILLSTORM Photography" 
            className="entry-image"
          />
          <div className="visual-overlay"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default Entry;