import React from 'react';
import { Camera, Heart, Instagram } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="DANTEKILLSTORM" className="logo-image" />
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
            
            <div className="footer-section">
              <h4>Follow Me</h4>
              <div className="social-links">
                <a href="https://www.instagram.com/killydid/" target="_blank" rel="noopener noreferrer" className="social-link">
                  <Instagram size={20} />
                  @killydid
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>
            © 2026 DANTEKILLSTORM. Made with <Heart size={16} fill="#ff6b35" color="#ff6b35" /> for visual storytelling.
          </p>
          <p className="developer-credit">
            Website developed by <strong>Franco Lukhele</strong> at <strong>AlchemyStudio</strong>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;