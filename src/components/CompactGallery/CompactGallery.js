import React, { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase';
import CarouselWrapper from '../CarouselWrapper/CarouselWrapper';
import { Eye, Heart } from 'lucide-react';
import './CompactGallery.css';

const CompactGallery = ({ onImageClick }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const imageData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Limit to first 6 images for carousel
      setImages(imageData.slice(0, 6));
    } catch (error) {
      console.error('Error fetching images:', error);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="compact-gallery-loading">
        <div className="loading-placeholder"></div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="compact-gallery-empty">
        <p>No images available</p>
      </div>
    );
  }

  return (
    <div className="compact-gallery">
      <CarouselWrapper autoPlay={true} autoPlayInterval={4000}>
        {images.map((image) => (
          <div 
            key={image.id} 
            className="compact-gallery-item"
            onClick={() => onImageClick && onImageClick(image)}
          >
            <img src={image.url} alt={image.title} />
            <div className="compact-image-overlay">
              <div className="compact-image-info">
                <h3>{image.title}</h3>
                {image.clientName && <p className="compact-client">{image.clientName}</p>}
                <div className="compact-image-stats">
                  <span><Eye size={14} /> View</span>
                  <span><Heart size={14} /> {image.likes || 0}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CarouselWrapper>
    </div>
  );
};

export default CompactGallery;