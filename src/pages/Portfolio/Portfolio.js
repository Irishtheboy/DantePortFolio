import React from 'react';
import Gallery from '../../components/Gallery/Gallery';
import VideoShowcase from '../../components/VideoShowcase/VideoShowcase';
import './Portfolio.css';

const Portfolio = () => {
  return (
    <div className="portfolio-page">
      <Gallery />
      <VideoShowcase />
    </div>
  );
};

export default Portfolio;