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
  const [aboutImage, setAboutImage] = useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop');

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
        const [gallerySnapshot, videosSnapshot, aboutSnapshot] = await Promise.all([
          getDocs(collection(db, 'gallery')),
          getDocs(collection(db, 'videos')),
          getDocs(collection(db, 'about'))
        ]);
        
        setCounts({
          photos: gallerySnapshot.size,
          videos: videosSnapshot.size
        });
        
        if (!aboutSnapshot.empty) {
          const aboutData = aboutSnapshot.docs[0].data();
          setAboutImage(aboutData.imageUrl);
        }
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
               Five years deep in the game, my visual language was forged in the streets with the Broke Boys Collective. That era taught me that you don’t need a budget to create art—you need vision, timing, and the hunger to capture the shot that everyone else misses.

Today, I bring that same indie energy and technical mastery to every project. Whether I'm documenting the raw emotion of a wedding, the fast-paced rhythm of a corporate event, or a stylized portrait session, I don’t just record what it looks like—I capture what it feels like.

I specialize in visual narratives that bleed authenticity. My work sits at the intersection of technical precision and street-level edge. If you are looking for traditional, posed perfection, look elsewhere. If you want the story told with grit, texture, and soul, let’s work.
                </p>
              </div>
            </div>
            <div className="about-image">
              <img 
                src={aboutImage} 
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
              "I believe the best images should feel lived-in, not staged. For me, the magic isn't in perfect poses, but in the texture of the moment—the grain, the shadows, and the unscripted energy. I don’t force the shot; I wait for the split-second when the vibe is authentic and the real story unfolds. It’s about creating visuals that don't just look good, but actually breathe."
            </blockquote>
            <cite>- DANTEKILLSTORM</cite>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default About;