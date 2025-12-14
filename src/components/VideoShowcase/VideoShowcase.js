import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase';
import { Play, ExternalLink, Calendar } from 'lucide-react';
import './VideoShowcase.css';

const VideoShowcase = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const q = query(collection(db, 'videos'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const videoData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setVideos(videoData);
    } catch (error) {
      console.error('Error fetching videos:', error);
      // Fallback demo data
      setVideos([
        {
          id: 1,
          title: 'Wedding Highlight Reel',
          description: 'A beautiful wedding story captured in cinematic style',
          thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          duration: '3:45',
          category: 'Wedding',
          date: '2024-01-15'
        },
        {
          id: 2,
          title: 'Corporate Brand Video',
          description: 'Professional brand storytelling for modern businesses',
          thumbnail: 'https://images.unsplash.com/photo-1551818255-e6e10975cd17?w=800',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          duration: '2:30',
          category: 'Corporate',
          date: '2024-01-10'
        },
        {
          id: 3,
          title: 'Music Video Production',
          description: 'Creative music video with dynamic cinematography',
          thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          duration: '4:20',
          category: 'Music',
          date: '2024-01-05'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="video-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <section className="video-showcase">
      <div className="video-container">
        <motion.div
          className="video-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title gradient-text">Video Projects</h2>
          <p className="section-subtitle">
            Cinematic storytelling through motion and emotion
          </p>
        </motion.div>

        <div className="video-grid">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              className="video-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className="video-thumbnail">
                <img src={video.thumbnail} alt={video.title} />
                <div className="video-overlay">
                  <div className="play-button">
                    <Play size={32} fill="white" />
                  </div>
                  <div className="video-duration">{video.duration}</div>
                </div>
              </div>
              
              <div className="video-content">
                <div className="video-meta">
                  <span className="video-category">{video.category}</span>
                  <span className="video-date">
                    <Calendar size={14} />
                    {new Date(video.date).toLocaleDateString()}
                  </span>
                </div>
                
                <h3 className="video-title">{video.title}</h3>
                <p className="video-description">{video.description}</p>
                
                <div className="video-actions">
                  <a 
                    href={video.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    <Play size={16} />
                    Watch Video
                  </a>
                  <button className="btn-secondary">
                    <ExternalLink size={16} />
                    Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="video-cta"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3>Ready to create something amazing?</h3>
          <p>Let's bring your vision to life with professional video production</p>
          <a href="#contact" className="btn-primary">
            Start Your Project
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoShowcase;