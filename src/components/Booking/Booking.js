import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { MapPin, Camera, Video, Clock } from 'lucide-react';
import './Booking.css';

const Booking = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    location: '',
    date: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const services = [
    { id: 'portrait', name: 'Portrait Photography', price: 'R1,500', duration: '2 hours', icon: Camera },
    { id: 'wedding', name: 'Wedding Photography', price: 'R8,000', duration: 'Full day', icon: Camera },
    { id: 'event', name: 'Event Photography', price: 'R3,500', duration: '4 hours', icon: Camera },
    { id: 'video-shoot', name: 'Video Production', price: 'R5,000', duration: '6 hours', icon: Video },
    { id: 'video-edit', name: 'Video Editing Only', price: 'R2,000', duration: '3-5 days', icon: Video }
  ];

  const locations = [
    'Kuilsriver (Base Location)',
    'Cape Town CBD',
    'Stellenbosch',
    'Paarl',
    'Somerset West',
    'Bellville',
    'Durbanville',
    'Other (Specify in message)'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const selectedService = services.find(s => s.id === formData.service);
      
      await addDoc(collection(db, 'bookings'), {
        ...formData,
        serviceName: selectedService?.name,
        servicePrice: selectedService?.price,
        createdAt: serverTimestamp(),
        status: 'pending'
      });
      
      alert('Booking request sent successfully! Dante will contact you within 24 hours.');
      setFormData({
        name: '', email: '', phone: '', service: '', location: '', date: '', message: ''
      });
    } catch (error) {
      alert('Error sending booking request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="booking" id="booking">
      <div className="booking-container">
        <motion.div
          className="booking-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title gradient-text">Book Your Session</h2>
          <p className="section-subtitle">
            Professional photography and videography services in Cape Town, South Africa
          </p>
          <div className="location-info">
            <MapPin size={16} />
            <span>Based in Kuilsriver, Cape Town</span>
          </div>
        </motion.div>

        <div className="booking-content">
          <motion.div
            className="pricing-section"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3>Services & Pricing</h3>
            <div className="services-grid">
              {services.map((service) => (
                <div key={service.id} className="service-card glass">
                  <service.icon size={24} className="service-icon" />
                  <h4>{service.name}</h4>
                  <div className="service-price">{service.price}</div>
                  <div className="service-duration">
                    <Clock size={14} />
                    {service.duration}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="booking-form-container"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <form className="booking-form glass" onSubmit={handleSubmit}>
              <h3>Request a Booking</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Service Required</label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Service</option>
                    {services.map(service => (
                      <option key={service.id} value={service.id}>
                        {service.name} - {service.price}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Preferred Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Shoot Location</label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Location</option>
                  {locations.map(location => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Additional Details</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Tell me about your vision, specific requirements, or any questions..."
                />
              </div>

              <button 
                type="submit" 
                className="btn-primary submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Request Booking'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Booking;