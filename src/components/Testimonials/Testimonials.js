import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase';
import { Star, Quote } from 'lucide-react';
import './Testimonials.css';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const testimonialData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTestimonials(testimonialData);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setTestimonials([
        {
          id: 1,
          name: 'Sarah Johnson',
          role: 'Bride',
          rating: 5,
          text: 'DANTEKILLSTORM captured our wedding day perfectly. Every moment was beautifully documented.',
          image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
        },
        {
          id: 2,
          name: 'Michael Chen',
          role: 'CEO, TechCorp',
          rating: 5,
          text: 'Professional, creative, and delivered beyond our expectations. Highly recommended!',
          image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
        }
      ]);
    }
  };

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (testimonials.length > 1) {
      const interval = setInterval(nextTestimonial, 5000);
      return () => clearInterval(interval);
    }
  }, [testimonials.length]);

  if (testimonials.length === 0) return null;

  return (
    <section className="testimonials">
      <div className="testimonials-container">
        <motion.div
          className="testimonials-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title gradient-text">What Clients Say</h2>
          <p className="section-subtitle">
            Real feedback from real clients who trusted us with their special moments
          </p>
        </motion.div>

        <motion.div
          className="testimonial-carousel"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="testimonial-card">
            <Quote className="quote-icon" size={40} />
            <div className="testimonial-content">
              <div className="rating">
                {[...Array(testimonials[currentIndex]?.rating || 5)].map((_, i) => (
                  <Star key={i} size={20} fill="currentColor" />
                ))}
              </div>
              <p className="testimonial-text">
                "{testimonials[currentIndex]?.text}"
              </p>
              <div className="testimonial-author">
                <img 
                  src={testimonials[currentIndex]?.image} 
                  alt={testimonials[currentIndex]?.name}
                />
                <div>
                  <h4>{testimonials[currentIndex]?.name}</h4>
                  <span>{testimonials[currentIndex]?.role}</span>
                </div>
              </div>
            </div>
          </div>

          {testimonials.length > 1 && (
            <div className="testimonial-nav">
              <button onClick={prevTestimonial}>‹</button>
              <div className="testimonial-dots">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`dot ${index === currentIndex ? 'active' : ''}`}
                    onClick={() => setCurrentIndex(index)}
                  />
                ))}
              </div>
              <button onClick={nextTestimonial}>›</button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;