import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs, orderBy, query, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../../firebase';
import { Play, ExternalLink, Calendar, Trash2, X } from 'lucide-react';
import { VideoSkeleton } from '../LoadingSkeleton/LoadingSkeleton';
import './VideoShowcase.css';

const VideoShowcase = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    fetchVideos();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
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
          thumbnail: '',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          duration: '3:45',
          category: 'Wedding',
          date: '2024-01-15'
        },
        {
          id: 2,
          title: 'Corporate Brand Video',
          description: 'Professional brand storytelling for modern businesses',
          thumbnail: '',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          duration: '2:30',
          category: 'Corporate',
          date: '2024-01-10'
        },
        {
          id: 3,
          title: 'Music Video Production',
          description: 'Creative music video with dynamic cinematography',
          thumbnail: '',
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

  const deleteVideo = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    
    try {
      await deleteDoc(doc(db, 'videos', videoId));
      setVideos(videos.filter(video => video.id !== videoId));
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  const getEmbedUrl = (url) => {
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  if (loading) {
    return <VideoSkeleton />;
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
                  <div 
                    className="play-button"
                    onClick={() => setSelectedVideo(video)}
                  >
                    <Play size={32} fill="white" />
                  </div>
                  <div className="video-duration">{video.duration}</div>
                  {user && (
                    <button 
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteVideo(video.id);
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
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
                  <button 
                    className="btn-primary"
                    onClick={() => setSelectedVideo(video)}
                  >
                    <Play size={16} />
                    Watch Video
                  </button>
                  <a 
                    href={video.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-secondary"
                  >
                    <ExternalLink size={16} />
                    External Link
                  </a>
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

        {selectedVideo && (
          <div className="video-modal" onClick={() => setSelectedVideo(null)}>
            <div className="video-modal-content" onClick={e => e.stopPropagation()}>
              <button 
                className="video-modal-close"
                onClick={() => setSelectedVideo(null)}
              >
                <X size={24} />
              </button>
              <div className="video-player">
                <iframe
                  src={getEmbedUrl(selectedVideo.videoUrl)}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="video-modal-info">
                <h3>{selectedVideo.title}</h3>
                <p>{selectedVideo.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default VideoShowcase;