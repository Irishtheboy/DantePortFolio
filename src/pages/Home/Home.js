import React from 'react';
import Hero from '../../components/Hero/Hero';
import Gallery from '../../components/Gallery/Gallery';
import VideoShowcase from '../../components/VideoShowcase/VideoShowcase';
import Testimonials from '../../components/Testimonials/Testimonials';
import Blog from '../../components/Blog/Blog';
import PresetStore from '../../components/PresetStore/PresetStore';
import Newsletter from '../../components/Newsletter/Newsletter';
import Booking from '../../components/Booking/Booking';
import Contact from '../../components/Contact/Contact';

const Home = () => {
  return (
    <div className="home">
      <Hero />
      <Gallery />
      <VideoShowcase />
      <Testimonials />
      <Blog />
      <PresetStore />
      <Newsletter />
      <Booking />
      <Contact />
    </div>
  );
};

export default Home;