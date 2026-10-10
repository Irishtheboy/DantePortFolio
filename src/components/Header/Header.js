import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Camera, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import './Header.css';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/', label: 'HOME', sectionId: 'top' },
    { path: '/', label: 'WORK', sectionId: 'work' },
    { path: '/', label: 'ABOUT', sectionId: 'about' },
    { path: '/', label: 'CONTACT', sectionId: 'contact' },
    { path: '/store', label: 'PRINTS' }
  ];

  const handleNavClick = (event, item) => {
    setIsOpen(false);
    if (!item.sectionId) return;

    event.preventDefault();
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: item.sectionId } });
      return;
    }

    document.getElementById(item.sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

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
              key={item.label}
              to={item.path}
              className={`nav-link ${location.pathname === item.path && item.sectionId === 'top' ? 'active' : ''}`}
              onClick={(event) => handleNavClick(event, item)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <button className="theme-toggle" onClick={toggleTheme} aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}>
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