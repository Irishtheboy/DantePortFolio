import React, { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase';
import CarouselWrapper from '../CarouselWrapper/CarouselWrapper';
import { Play, Calendar } from 'lucide-react';
import './CompactVideo.css';

const CompactVideo = ({ onVideoClick }) => {
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
      // Limit to first 4 videos for carousel
      setVideos(videoData.slice(0, 4));
    } catch (error) {
      console.error('Error fetching videos:', error);
      // Fallback demo data
      setVideos([
        {
          id: 1,
          title: 'Wedding Highlight Reel',
          description: 'A beautiful wedding story captured in cinematic style',
          thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          duration: '3:45',
          category: 'Wedding',
          date: '2024-01-15'
        },
        {
          id: 2,
          title: 'Corporate Brand Video',
          description: 'Professional brand storytelling for modern businesses',
          thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=500',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          duration: '2:30',
          category: 'Corporate',
          date: '2024-01-10'
        },
        {
          id: 3,
          title: 'Music Video Production',
          description: 'Creative music video with dynamic cinematography',
          thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          duration: '4:20',
          category: 'Music',
          date: '2024-01-05'
        }
      ].slice(0, 4));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="compact-video-loading">
        <div className="loading-placeholder"></div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="compact-video-empty">
        <p>No videos available</p>
      </div>
    );
  }

  return (
    <div className="compact-video">
      <CarouselWrapper autoPlay={true} autoPlayInterval={5000}>
        {videos.map((video) => (
          <div 
            key={video.id} 
            className="compact-video-item"
            onClick={() => onVideoClick && onVideoClick(video)}
          >
            <div className="compact-video-thumbnail">
              <img src={video.thumbnail} alt={video.title} />
              <div className="compact-video-overlay">
                <div className="compact-play-button">
                  <Play size={24} fill="white" />
                </div>
                <div className="compact-video-duration">{video.duration}</div>
              </div>
            </div>
            
            <div className="compact-video-content">
              <div className="compact-video-meta">
                <span className="compact-video-category">{video.category}</span>
                <span className="compact-video-date">
                  <Calendar size={12} />
                  {new Date(video.date).toLocaleDateString()}
                </span>
              </div>
              
              <h3 className="compact-video-title">{video.title}</h3>
              <p className="compact-video-description">{video.description}</p>
            </div>
          </div>
        ))}
      </CarouselWrapper>
    </div>
  );
};

export default CompactVideo;