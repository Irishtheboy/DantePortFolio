import React from 'react';
import { Heart, Instagram } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>KILLYDIDSHOOTIT</h3>
            <p>Creative Photography Studio</p>
          </div>
          
          <div className="footer-social">
            <a href="https://www.instagram.com/killydid/" target="_blank" rel="noopener noreferrer" className="social-link">
              <Instagram size={18} />
              @killydid
            </a>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2026 KillyDidShootIt. Made with <Heart size={14} fill="currentColor" /> for visual storytelling.</p>
          <p className="developer-credit">Developed by <strong>Franco Lukhele</strong></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;