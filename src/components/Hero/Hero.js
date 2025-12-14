import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Play, Camera, Video } from 'lucide-react';
import './Hero.css';

const Hero = () => {
  const scrollToPortfolio = () => {
    document.getElementById('portfolio-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero">
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="trend-label">Visual Storytelling</div>
        <h1 className="hero-title">
          Capture the<br/>
          <span className="gradient-text">Extraordinary</span><br/>
          Moments
        </h1>
        <p className="hero-description">
          Professional photography and videography services that bring your vision to life. 
          Creating compelling visual narratives that resonate with your audience.
        </p>
        <button className="btn-primary" onClick={scrollToPortfolio}>
          VIEW PORTFOLIO
        </button>
        
        <div className="deco-lines-bottom"></div>
      </motion.div>

      <motion.div
        className="hero-visual"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="pattern-dots hero-dots-bg"></div>
        <div className="deco-yellow-block"></div>
        <img 
          src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800" 
          alt="DANTEKILLSTORM Photography" 
          className="main-img"
        />
        <div className="deco-black-rect"></div>
      </motion.div>
    </section>
  );
};

export default Hero;