import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { MapPin, Clock, AlertCircle, CheckCircle, Camera, Video, Users, Heart } from 'lucide-react';
import './Booking.css';

const Booking = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    timeSlot: '',
    location: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Services data
  const services = [
    {
      id: 'portrait',
      name: 'Portrait Photography',
      description: 'Professional portrait sessions for individuals and families',
      duration: 2,
      icon: Camera
    },
    {
      id: 'wedding',
      name: 'Wedding Photography',
      description: 'Complete wedding day coverage with professional editing',
      duration: 8,
      icon: Heart
    },
    {
      id: 'event',
      name: 'Event Photography',
      description: 'Corporate events, parties, and special occasions',
      duration: 4,
      icon: Users
    },
    {
      id: 'video',
      name: 'Video Production',
      description: 'Professional video production and editing services',
      duration: 6,
      icon: Video
    }
  ];

  // Location options
  const locations = [
    'Studio (Kuilsriver)',
    'Client Location (Cape Town)',
    'Outdoor Location (Cape Town)',
    'Beach Location',
    'Mountain Location',
    'Urban Location',
    'Other (Specify in message)'
  ];

  // Time slots
  const timeSlots = [
    { id: '09:00', label: '9:00 AM', value: '09:00' },
    { id: '11:00', label: '11:00 AM', value: '11:00' },
    { id: '13:00', label: '1:00 PM', value: '13:00' },
    { id: '15:00', label: '3:00 PM', value: '15:00' },
    { id: '17:00', label: '5:00 PM', value: '17:00' }
  ];

  // Fetch available slots when date and service change
  const fetchAvailableSlots = useCallback(async (date, serviceId) => {
    setLoadingSlots(true);
    try {
      const q = query(
        collection(db, 'bookings'),
        where('date', '==', date),
        where('status', '!=', 'cancelled')
      );
      const snapshot = await getDocs(q);
      const bookedSlots = snapshot.docs.map(doc => doc.data().timeSlot);
      
      const service = services.find(s => s.id === serviceId);
      const serviceDuration = service?.duration || 1;
      
      const updatedSlots = timeSlots.map(slot => ({
        ...slot,
        disabled: isSlotUnavailable(slot.value, bookedSlots, serviceDuration)
      }));
      
      setAvailableSlots(updatedSlots);
    } catch (error) {
      console.error('Error fetching available slots:', error);
      setAvailableSlots(timeSlots.map(slot => ({ ...slot, disabled: false })));
    } finally {
      setLoadingSlots(false);
    }
  }, [services, timeSlots]);

  useEffect(() => {
    if (formData.date && formData.service) {
      fetchAvailableSlots(formData.date, formData.service);
    }
  }, [formData.date, formData.service, fetchAvailableSlots]);

  const isSlotUnavailable = (slotTime, bookedSlots, duration) => {
    // Check if this slot or any slots within the duration are booked
    const slotHour = parseInt(slotTime.split(':')[0]);
    for (let i = 0; i < duration; i += 2) { // Assuming 2-hour blocks
      const checkHour = slotHour + i;
      const checkTime = `${checkHour.toString().padStart(2, '0')}:00`;
      if (bookedSlots.includes(checkTime)) {
        return true;
      }
    }
    return false;
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3); // 3 months ahead
    return maxDate.toISOString().split('T')[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const openWhatsApp = (message) => {
    const phoneNumber = '+27691588938'; // Dante's WhatsApp number
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  const handleDirectWhatsApp = () => {
    const message = `Hi Dante! I'd like to book a ${formData.service ? services.find(s => s.id === formData.service)?.name : 'photography'} session. Here are my details:

Name: ${formData.name || '[Your Name]'}
Email: ${formData.email || '[Your Email]'}
Phone: ${formData.phone || '[Your Phone]'}
Preferred Date: ${formData.date || '[Date]'}
Location: ${formData.location || '[Location]'}
Message: ${formData.message || '[Additional details]'}

Please let me know your availability and pricing. Thanks!`;
    
    openWhatsApp(message);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const selectedService = services.find(s => s.id === formData.service);
      const bookingData = {
        ...formData,
        serviceName: selectedService?.name,
        serviceDuration: selectedService?.duration,
        createdAt: serverTimestamp(),
        status: 'pending'
      };
      
      await addDoc(collection(db, 'bookings'), bookingData);
      
      alert('Booking request sent successfully! We\'ll be in touch soon to confirm your session.');
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        date: '',
        timeSlot: '',
        location: '',
        message: ''
      });
      setAvailableSlots([]);
    } catch (error) {
      console.error('Error sending booking request:', error);
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
            className="services-section"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3>Services Available</h3>
            <div className="services-grid">
              {services.map((service) => (
                <div key={service.id} className="service-card glass">
                  <service.icon size={24} className="service-icon" />
                  <h4>{service.name}</h4>
                  <p className="service-description">{service.description}</p>
                  <div className="service-duration">
                    <Clock size={14} />
                    {service.duration > 0 ? `${service.duration} hour${service.duration > 1 ? 's' : ''}` : 'Flexible timing'}
                  </div>
                </div>
              ))}
            </div>
            <div className="pricing-info">
              <div className="custom-pricing-card glass">
                <h4>Custom Pricing</h4>
                <p>All services are quoted individually based on your specific needs, location, and requirements.</p>
                <button 
                  className="btn-primary whatsapp-btn"
                  onClick={() => openWhatsApp('Hi Dante! I\'d like to get a custom quote for your photography/videography services. Could you please provide pricing information?')}
                >
                  <span>💬</span>
                  Get Quote on WhatsApp
                </button>
              </div>
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
                        {service.name}
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
                    min={getMinDate()}
                    max={getMaxDate()}
                    required
                  />
                </div>
              </div>

              {/* Time Slot Selection */}
              {formData.service && formData.date && services.find(s => s.id === formData.service)?.duration > 0 && (
                <div className="form-group">
                  <label className="time-slot-label">
                    <Clock size={16} />
                    Available Time Slots
                    {loadingSlots && <span className="loading-text">Checking availability...</span>}
                    {!loadingSlots && availableSlots.length > 0 && (
                      <span className={`availability-summary ${
                        availableSlots.filter(slot => !slot.disabled).length === 0 ? 'no-slots' :
                        availableSlots.filter(slot => !slot.disabled).length <= 3 ? 'limited' : ''
                      }`}>
                        {availableSlots.filter(slot => !slot.disabled).length} of {availableSlots.length} slots available
                      </span>
                    )}
                  </label>
                  
                  {loadingSlots ? (
                    <div className="time-slots-loading">
                      <div className="loading-spinner"></div>
                      <span>Checking available times...</span>
                    </div>
                  ) : availableSlots.length > 0 ? (
                    <>
                      <div className="time-slots-grid">
                        {availableSlots.map(slot => (
                          <label 
                            key={slot.id} 
                            className={`time-slot-option ${slot.disabled ? 'disabled' : ''}`}
                          >
                            <input
                              type="radio"
                              name="timeSlot"
                              value={slot.value}
                              checked={formData.timeSlot === slot.value}
                              onChange={handleChange}
                              disabled={slot.disabled}
                              required
                            />
                            <span className={`time-slot-button ${slot.disabled ? 'disabled' : ''}`}>
                              {slot.label}
                              {slot.disabled && <span className="unavailable-text">Booked</span>}
                            </span>
                          </label>
                        ))}
                      </div>
                      
                      <div className="time-slots-legend">
                        <div className="legend-item">
                          <div className="legend-color available"></div>
                          <span>Available</span>
                        </div>
                        <div className="legend-item">
                          <div className="legend-color booked"></div>
                          <span>Already Booked</span>
                        </div>
                      </div>
                      
                      {availableSlots.filter(slot => !slot.disabled).length === 0 && (
                        <div className="fully-booked-day">
                          <AlertCircle size={20} />
                          <span>This date is fully booked. All time slots are unavailable.</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="no-slots-available">
                      <AlertCircle size={20} />
                      <span>No available time slots for this date. Please select another date.</span>
                    </div>
                  )}
                  
                  {formData.service && services.find(s => s.id === formData.service) && (
                    <div className="service-duration-info">
                      <CheckCircle size={16} />
                      <span>
                        Duration: {services.find(s => s.id === formData.service)?.duration} hour(s)
                        {services.find(s => s.id === formData.service)?.duration > 1 && 
                          ' - This will block consecutive time slots'
                        }
                      </span>
                    </div>
                  )}
                </div>
              )}

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
                {isSubmitting ? 'Sending...' : 'Book & Get Custom Quote'}
              </button>
              
              <div className="whatsapp-direct">
                <p>Or contact directly for immediate response:</p>
                <button 
                  type="button"
                  className="btn-secondary whatsapp-direct-btn"
                  onClick={handleDirectWhatsApp}
                >
                  <span>💬</span>
                  WhatsApp Dante
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Booking;