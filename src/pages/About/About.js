import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Video, Award, Users } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import './About.css';

const About = () => {
  const [counts, setCounts] = useState({
    photos: 0,
    videos: 0
  });

  const skills = [
    'Portrait Photography',
    'Wedding Photography',
    'Event Coverage',
    'Video Production',
    'Video Editing',
    'Drone Photography',
    'Studio Lighting',
    'Post-Processing'
  ];

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [gallerySnapshot, videosSnapshot] = await Promise.all([
          getDocs(collection(db, 'gallery')),
          getDocs(collection(db, 'videos'))
        ]);
        
        setCounts({
          photos: gallerySnapshot.size,
          videos: videosSnapshot.size
        });
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    fetchCounts();
  }, []);

  const achievements = [
    { icon: Camera, number: counts.photos, label: 'Photos Captured' },
    { icon: Video, number: counts.videos, label: 'Videos Produced' }
  ];

  return (
    <div className="about-page">
      <div className="about-container">
        <motion.section
          className="about-hero"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="about-content">
            <div className="about-text">
              <h1 className="gradient-text">About DANTEKILLSTORM</h1>
              <p className="about-intro">
                Visual storyteller with a passion for capturing life's most precious moments
              </p>
              <div className="about-description">
                <p>
                  With over 5 years of experience in photography and videography, I specialize in 
                  creating compelling visual narratives that resonate with audiences. My work spans 
                  across weddings, portraits, corporate events, and creative projects.
                </p>
                <p>
                  I believe that every moment has a story to tell, and my mission is to capture 
                  those stories in their most authentic and beautiful form. Whether it's the joy 
                  of a wedding day, the professionalism of a corporate event, or the intimacy 
                  of a portrait session, I bring creativity and technical expertise to every project.
                </p>
              </div>
            </div>
            <div className="about-image">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop" 
                alt="DANTEKILLSTORM" 
              />
            </div>
          </div>
        </motion.section>

        <motion.section
          className="achievements"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2>Achievements</h2>
          <div className="achievements-grid">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                className="achievement-card glass"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <achievement.icon size={32} className="achievement-icon" />
                <h3>{achievement.number}</h3>
                <p>{achievement.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="skills"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2>Skills & Expertise</h2>
          <div className="skills-grid">
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                className="skill-tag"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {skill}
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="philosophy"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="philosophy-content glass">
            <h2>My Philosophy</h2>
            <blockquote>
              "Photography is not just about capturing what you see, but about revealing 
              what you feel. Every frame tells a story, every moment holds emotion, 
              and every project is an opportunity to create something extraordinary."
            </blockquote>
            <cite>- DANTEKILLSTORM</cite>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default About;