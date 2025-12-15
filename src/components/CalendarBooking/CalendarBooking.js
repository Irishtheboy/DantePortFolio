import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Mail, Phone, MapPin, Camera, Video } from 'lucide-react';
import { collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { sendEmailNotification } from '../../utils/emailService';
import './CalendarBooking.css';

const CalendarBooking = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    location: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const services = [
    { id: 'portrait', name: 'Portrait Photography', duration: 2, price: 'R2160' },
    { id: 'wedding', name: 'Wedding Photography', duration: 8, price: 'R11520' },
    { id: 'event', name: 'Event Photography', duration: 4, price: 'R5040' },
    { id: 'video', name: 'Video Production', duration: 6, price: 'R7200' }
  ];

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  useEffect(() => {
    if (selectedDate) {
      fetchBookedSlots(selectedDate);
    }
  }, [selectedDate]);

  const fetchBookedSlots = async (date) => {
    try {
      const q = query(
        collection(db, 'bookings'),
        where('date', '==', date),
        where('status', '!=', 'cancelled')
      );
      const snapshot = await getDocs(q);
      const slots = snapshot.docs.map(doc => doc.data().time);
      setBookedSlots(slots);
    } catch (error) {
      console.error('Error fetching booked slots:', error);
    }
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    const today = new Date().toISOString().split('T')[0];
    
    if (date < today) {
      alert('Please select a future date');
      return;
    }
    
    setSelectedDate(date);
    setSelectedTime('');
  };

  const handleTimeSelect = (time) => {
    if (bookedSlots.includes(time)) {
      alert('This time slot is already booked');
      return;
    }
    setSelectedTime(time);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      alert('Please select date and time');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const selectedService = services.find(s => s.id === formData.service);
      const bookingData = {
        ...formData,
        date: selectedDate,
        time: selectedTime,
        serviceName: selectedService?.name,
        servicePrice: selectedService?.price,
        duration: selectedService?.duration,
        createdAt: serverTimestamp(),
        status: 'pending'
      };

      await addDoc(collection(db, 'bookings'), bookingData);
      await sendEmailNotification('booking', bookingData);
      
      alert('Booking request sent successfully! You will receive confirmation within 24 hours.');
      
      // Reset form
      setFormData({ name: '', email: '', phone: '', service: '', location: '', message: '' });
      setSelectedDate('');
      setSelectedTime('');
    } catch (error) {
      alert('Error sending booking request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isTimeSlotAvailable = (time) => {
    return !bookedSlots.includes(time);
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <section className="calendar-booking">
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
            Select your preferred date and time for a photography session
          </p>
        </motion.div>

        <div className="booking-content">
          <motion.div
            className="calendar-section"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="date-picker glass">
              <h3><Calendar size={20} /> Select Date</h3>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                min={getMinDate()}
                className="date-input"
              />
            </div>

            {selectedDate && (
              <div className="time-slots glass">
                <h3><Clock size={20} /> Available Times</h3>
                <div className="time-grid">
                  {timeSlots.map(time => (
                    <button
                      key={time}
                      className={`time-slot ${selectedTime === time ? 'selected' : ''} ${!isTimeSlotAvailable(time) ? 'booked' : ''}`}
                      onClick={() => handleTimeSelect(time)}
                      disabled={!isTimeSlotAvailable(time)}
                    >
                      {time}
                      {!isTimeSlotAvailable(time) && <span className="booked-label">Booked</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            className="booking-form-section"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <form className="booking-form glass" onSubmit={handleSubmit}>
              <h3>Booking Details</h3>
              
              <div className="form-group">
                <label><User size={16} /> Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label><Mail size={16} /> Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label><Phone size={16} /> Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label><Camera size={16} /> Service</label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Service</option>
                  {services.map(service => (
                    <option key={service.id} value={service.id}>
                      {service.name} - {service.price} ({service.duration}h)
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label><MapPin size={16} /> Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Shoot location"
                  required
                />
              </div>

              <div className="form-group">
                <label>Additional Details</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Tell me about your vision..."
                />
              </div>

              {selectedDate && selectedTime && (
                <div className="booking-summary">
                  <h4>Booking Summary</h4>
                  <p><strong>Date:</strong> {selectedDate}</p>
                  <p><strong>Time:</strong> {selectedTime}</p>
                  {formData.service && (
                    <p><strong>Service:</strong> {services.find(s => s.id === formData.service)?.name}</p>
                  )}
                </div>
              )}

              <button 
                type="submit" 
                className="btn-primary submit-btn"
                disabled={isSubmitting || !selectedDate || !selectedTime}
              >
                {isSubmitting ? 'Booking...' : 'Confirm Booking'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CalendarBooking;