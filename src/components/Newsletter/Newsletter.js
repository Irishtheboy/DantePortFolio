import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { Mail, Gift, CheckCircle } from 'lucide-react';
import './Newsletter.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    
    try {
      await addDoc(collection(db, 'newsletter'), {
        email,
        createdAt: serverTimestamp(),
        status: 'active'
      });
      
      setStatus('success');
      setMessage('Welcome! Check your email for your free preset pack.');
      setEmail('');
      
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
      
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    }
  };

  return (
    <section className="newsletter">
      <div className="newsletter-container">
        <motion.div
          className="newsletter-content"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="newsletter-icon">
            <Gift size={40} />
          </div>
          
          <h2 className="newsletter-title">
            Get Free Starter Pack
          </h2>
          
          <p className="newsletter-subtitle">
            Subscribe to our newsletter and receive a free starter preset pack 
            plus exclusive photography tips and behind-the-scenes content.
          </p>

          <form className="newsletter-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <Mail className="form-icon" size={20} />
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === 'loading'}
              />
              <button 
                type="submit" 
                className="newsletter-btn"
                disabled={status === 'loading' || !email}
              >
                {status === 'loading' ? (
                  <div className="loading-spinner small"></div>
                ) : status === 'success' ? (
                  <CheckCircle size={20} />
                ) : (
                  'Get Free Pack'
                )}
              </button>
            </div>
            
            {message && (
              <motion.div
                className={`newsletter-message ${status}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {message}
              </motion.div>
            )}
          </form>

          <div className="newsletter-features">
            <div className="feature">
              <CheckCircle size={16} />
              <span>Free Starter Pack</span>
            </div>
            <div className="feature">
              <CheckCircle size={16} />
              <span>Weekly Photography Tips</span>
            </div>
            <div className="feature">
              <CheckCircle size={16} />
              <span>Exclusive Content</span>
            </div>
          </div>

          <p className="newsletter-privacy">
            No spam, unsubscribe at any time. Your email is safe with us.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;