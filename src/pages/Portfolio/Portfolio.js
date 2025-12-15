import React from 'react';
import Gallery from '../../components/Gallery/Gallery';
import VideoShowcase from '../../components/VideoShowcase/VideoShowcase';
import CalendarBooking from '../../components/CalendarBooking/CalendarBooking';

const Portfolio = () => {
  return (
    <div className="portfolio-page">
      <div style={{ paddingTop: '6rem' }}>
        <Gallery />
        <VideoShowcase />
        <CalendarBooking />
      </div>
    </div>
  );
};

export default Portfolio;