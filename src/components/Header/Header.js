import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Camera, Moon, Sun, Facebook, Twitter, Instagram, Maximize2, Grid3X3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useTheme } from '../../contexts/ThemeContext';
import './Header.css';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoUrl, setLogoUrl] = useState(null);
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const logoSnap = await getDocs(collection(db, 'logo'));
        if (!logoSnap.empty) {
          const logoData = logoSnap.docs[0].data();
          setLogoUrl(logoData.logoUrl);
        }
      } catch (error) {
        console.error('Error fetching logo:', error);
      }
    };
    
    fetchLogo();
  }, []);

  const navItems = [
    { path: '/', label: 'HOME' },
    { path: '/store', label: 'PRINTS' },
    { path: '/portfolio', label: 'GALLERY' },
    
    { path: '/booking', label: 'BOOKING' },
    
  ];

  return (
    <motion.header 
      className={`header ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="header-container">
        <Link to="/" className="logo">
          <div className="logo-icon">
            <Camera size={24} />
          </div>
        </Link>

        <nav className={`nav ${isOpen ? 'nav-open' : ''}`}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <button className="action-btn" aria-label="Fullscreen">
            <Maximize2 size={18} />
          </button>
          <button className="action-btn" aria-label="Grid View">
            <Grid3X3 size={18} />
          </button>
          <button className="theme-toggle" onClick={toggleTheme}>
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <button 
          className="menu-toggle"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </motion.header>
  );
};

export default Header;