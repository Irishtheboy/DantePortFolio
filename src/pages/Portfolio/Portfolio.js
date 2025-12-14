import React from 'react';
import Gallery from '../../components/Gallery/Gallery';
import VideoShowcase from '../../components/VideoShowcase/VideoShowcase';

const Portfolio = () => {
  return (
    <div className="portfolio-page">
      <div style={{ paddingTop: '6rem' }}>
        <Gallery />
        <VideoShowcase />
      </div>
    </div>
  );
};

export default Portfolio;