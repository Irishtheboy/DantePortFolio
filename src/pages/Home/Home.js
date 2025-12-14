import React from 'react';
import Hero from '../../components/Hero/Hero';
import Gallery from '../../components/Gallery/Gallery';
import VideoShowcase from '../../components/VideoShowcase/VideoShowcase';
import Booking from '../../components/Booking/Booking';
import Contact from '../../components/Contact/Contact';

const Home = () => {
  return (
    <div className="home">
      <Hero />
      <Gallery />
      <VideoShowcase />
      <Booking />
      <Contact />
    </div>
  );
};

export default Home;