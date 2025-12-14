import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, addDoc, serverTimestamp, getDocs, orderBy, query } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { db, auth, storage } from '../../firebase';
import { Upload, Image, Video, Plus, LogOut, Mail, Calendar } from 'lucide-react';
import Login from '../../components/Login/Login';
import './Admin.css';

const Admin = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  const [activeTab, setActiveTab] = useState('gallery');
  const [uploading, setUploading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    file: null,
    videoUrl: ''
  });

  useEffect(() => {
    if (activeTab === 'messages') {
      fetchMessages();
    } else if (activeTab === 'bookings') {
      fetchBookings();
    }
  }, [activeTab]);

  if (loading) return <div className="admin-loading">Loading...</div>;
  if (!user) return <Login onLogin={() => setUser(auth.currentUser)} />;

  const fetchMessages = async () => {
    try {
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const messageData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messageData);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const bookingData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBookings(bookingData);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      file: e.target.files[0]
    }));
  };

  const uploadToGallery = async (e) => {
    e.preventDefault();
    if (!formData.file || !formData.title) return;

    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', formData.file);
      formDataUpload.append('upload_preset', 'dante_portfolio');

      const response = await fetch('https://api.cloudinary.com/v1_1/dlrxspk2c/image/upload', {
        method: 'POST',
        body: formDataUpload
      });
      
      const result = await response.json();
      const imageUrl = result.secure_url;

      await addDoc(collection(db, 'gallery'), {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        url: imageUrl,
        createdAt: serverTimestamp(),
        likes: 0
      });

      alert('Image uploaded successfully!');
      setFormData({ title: '', description: '', category: '', file: null });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const uploadVideo = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.videoUrl) return;

    setUploading(true);
    try {
      let thumbnailUrl = '';
      
      // Upload thumbnail if provided
      if (formData.file) {
        const thumbnailRef = ref(storage, `thumbnails/${Date.now()}_${formData.file.name}`);
        const snapshot = await uploadBytes(thumbnailRef, formData.file);
        thumbnailUrl = await getDownloadURL(snapshot.ref);
      }

      // Add to Firestore
      await addDoc(collection(db, 'videos'), {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        videoUrl: formData.videoUrl,
        thumbnail: thumbnailUrl,
        createdAt: serverTimestamp(),
        duration: '0:00' // You can add duration calculation logic
      });

      alert('Video added successfully!');
      setFormData({ title: '', description: '', category: '', file: null, videoUrl: '' });
    } catch (error) {
      console.error('Error adding video:', error);
      alert('Error adding video. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin">
      <div className="admin-container">
        <motion.div
          className="admin-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="admin-header-content">
            <div>
              <h1 className="gradient-text">Admin Panel</h1>
              <p>Manage your portfolio content</p>
            </div>
            <button className="btn-secondary" onClick={handleLogout}>
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </motion.div>

        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            <Image size={20} />
            Gallery
          </button>
          <button
            className={`tab-btn ${activeTab === 'videos' ? 'active' : ''}`}
            onClick={() => setActiveTab('videos')}
          >
            <Video size={20} />
            Videos
          </button>
          <button
            className={`tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            <Mail size={20} />
            Messages
          </button>
          <button
            className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <Calendar size={20} />
            Bookings
          </button>
        </div>

        <motion.div
          className="admin-content"
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          {activeTab === 'gallery' && (
            <form className="upload-form glass" onSubmit={uploadToGallery}>
              <h2>Add New Image</h2>
              
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="portrait">Portrait</option>
                  <option value="wedding">Wedding</option>
                  <option value="landscape">Landscape</option>
                  <option value="event">Event</option>
                </select>
              </div>

              <div className="form-group">
                <label>Image File</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
              </div>

              <button type="submit" className="btn-primary" disabled={uploading}>
                {uploading ? (
                  <div className="loading-spinner small"></div>
                ) : (
                  <>
                    <Plus size={16} />
                    Add Image
                  </>
                )}
              </button>
            </form>
          )}

          {activeTab === 'videos' && (
            <form className="upload-form glass" onSubmit={uploadVideo}>
              <h2>Add New Video</h2>
              
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Music">Music</option>
                  <option value="Event">Event</option>
                </select>
              </div>

              <div className="form-group">
                <label>Video URL</label>
                <input
                  type="url"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleInputChange}
                  placeholder="https://youtube.com/watch?v=..."
                  required
                />
              </div>

              <div className="form-group">
                <label>Thumbnail (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              <button type="submit" className="btn-primary" disabled={uploading}>
                {uploading ? (
                  <div className="loading-spinner small"></div>
                ) : (
                  <>
                    <Plus size={16} />
                    Add Video
                  </>
                )}
              </button>
            </form>
          )}

          {activeTab === 'messages' && (
            <div className="messages-list">
              <h2>Contact Messages</h2>
              {messages.length === 0 ? (
                <p>No messages yet.</p>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className="message-card glass">
                    <div className="message-header">
                      <h3>{message.subject}</h3>
                      <span className="message-date">
                        {message.createdAt?.toDate().toLocaleDateString()}
                      </span>
                    </div>
                    <div className="message-info">
                      <p><strong>From:</strong> {message.name} ({message.email})</p>
                    </div>
                    <div className="message-content">
                      <p>{message.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="bookings-list">
              <h2>Booking Requests</h2>
              {bookings.length === 0 ? (
                <p>No booking requests yet.</p>
              ) : (
                bookings.map((booking) => (
                  <div key={booking.id} className="booking-card glass">
                    <div className="booking-header">
                      <h3>{booking.serviceName}</h3>
                      <span className="booking-price">{booking.servicePrice}</span>
                    </div>
                    <div className="booking-info">
                      <p><strong>Client:</strong> {booking.name}</p>
                      <p><strong>Email:</strong> {booking.email}</p>
                      <p><strong>Phone:</strong> {booking.phone}</p>
                      <p><strong>Date:</strong> {booking.date}</p>
                      <p><strong>Location:</strong> {booking.location}</p>
                    </div>
                    {booking.message && (
                      <div className="booking-message">
                        <p><strong>Details:</strong> {booking.message}</p>
                      </div>
                    )}
                    <div className="booking-date">
                      Requested: {booking.createdAt?.toDate().toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;