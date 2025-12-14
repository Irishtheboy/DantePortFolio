import React from 'react';
import { Camera, Heart } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <Camera size={24} />
              <span className="gradient-text">DANTEKILLSTORM</span>
            </div>
            <p>Creating visual stories that inspire and captivate.</p>
          </div>
          
          <div className="footer-links">
            <div className="footer-section">
              <h4>Services</h4>
              <ul>
                <li>Portrait Photography</li>
                <li>Wedding Photography</li>
                <li>Video Production</li>
                <li>Event Coverage</li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/portfolio">Portfolio</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>
            © 2024 DANTEKILLSTORM. Made with <Heart size={16} fill="#ff6b35" color="#ff6b35" /> for visual storytelling.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;