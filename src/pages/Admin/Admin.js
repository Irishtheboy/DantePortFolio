import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, addDoc, serverTimestamp, getDocs, orderBy, query, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { db, auth } from '../../firebase';
import { uploadToCloudinary } from '../../cloudinary';
import { Upload, Image, Video, Plus, LogOut, Mail, Calendar, Trash2, Package } from 'lucide-react';
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
  const [galleryItems, setGalleryItems] = useState([]);
  const [videoItems, setVideoItems] = useState([]);
  const [presetItems, setPresetItems] = useState([]);
  const [merchandiseItems, setMerchandiseItems] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    file: null,
    videoUrl: '',
    price: '',
    originalPrice: '',
    presetCount: '',
    clientName: '',
    location: '',
    dateTaken: '',
    name: '',
    sizes: '',
    colors: '',
    inStock: true
  });

  useEffect(() => {
    if (activeTab === 'messages') {
      fetchMessages();
    } else if (activeTab === 'bookings') {
      fetchBookings();
    } else if (activeTab === 'gallery') {
      fetchGalleryItems();
    } else if (activeTab === 'videos') {
      fetchVideoItems();
    } else if (activeTab === 'presets') {
      fetchPresetItems();
    } else if (activeTab === 'merchandise') {
      fetchMerchandiseItems();
    } else if (activeTab === 'orders') {
      fetchOrderItems();
    }
  }, [activeTab]);

  const fetchGalleryItems = async () => {
    try {
      const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const galleryData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setGalleryItems(galleryData);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
    }
  };

  const fetchVideoItems = async () => {
    try {
      const q = query(collection(db, 'videos'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const videoData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setVideoItems(videoData);
    } catch (error) {
      console.error('Error fetching video items:', error);
    }
  };

  const fetchPresetItems = async () => {
    try {
      const q = query(collection(db, 'presets'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const presetData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPresetItems(presetData);
    } catch (error) {
      console.error('Error fetching preset items:', error);
    }
  };

  const fetchMerchandiseItems = async () => {
    try {
      const q = query(collection(db, 'merchandise'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const merchData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMerchandiseItems(merchData);
    } catch (error) {
      console.error('Error fetching merchandise items:', error);
    }
  };

  const fetchOrderItems = async () => {
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const orderData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrderItems(orderData);
    } catch (error) {
      console.error('Error fetching order items:', error);
    }
  };

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
      const imageUrl = await uploadToCloudinary(formData.file);
        
      await addDoc(collection(db, 'gallery'), {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        url: imageUrl,
        clientName: formData.clientName,
        location: formData.location,
        dateTaken: formData.dateTaken,
        createdAt: serverTimestamp(),
        likes: 0
      });

      alert('Image uploaded successfully!');
      setFormData({ title: '', description: '', category: '', file: null, videoUrl: '', price: '', originalPrice: '', presetCount: '', clientName: '', location: '', dateTaken: '' });
      fetchGalleryItems();
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(`Error uploading image: ${error.message}`);
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
        thumbnailUrl = await uploadToCloudinary(formData.file);
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
      setFormData({ title: '', description: '', category: '', file: null, videoUrl: '', price: '', originalPrice: '', presetCount: '' });
      fetchVideoItems();
    } catch (error) {
      console.error('Error adding video:', error);
      alert('Error adding video. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const uploadPreset = async (e) => {
    e.preventDefault();
    if (!formData.file || !formData.title || !formData.price) return;

    setUploading(true);
    try {
      const fileUrl = await uploadToCloudinary(formData.file);

      await addDoc(collection(db, 'presets'), {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : parseFloat(formData.price),
        presetCount: parseInt(formData.presetCount) || 1,
        fileUrl: fileUrl,
        preview: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
        rating: 5.0,
        downloads: 0,
        fileSize: '2.5 MB',
        createdAt: serverTimestamp()
      });

      alert('Preset added successfully!');
      setFormData({ title: '', description: '', category: '', file: null, videoUrl: '', price: '', originalPrice: '', presetCount: '' });
      fetchPresetItems();
    } catch (error) {
      console.error('Error adding preset:', error);
      alert('Error adding preset. Please try again.');
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
            className={`tab-btn ${activeTab === 'presets' ? 'active' : ''}`}
            onClick={() => setActiveTab('presets')}
          >
            <Package size={20} />
            Presets
          </button>
          <button
            className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <Calendar size={20} />
            Bookings
          </button>
          <button
            className={`tab-btn ${activeTab === 'hero' ? 'active' : ''}`}
            onClick={() => setActiveTab('hero')}
          >
            <Image size={20} />
            Hero Image
          </button>
          <button
            className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            <Image size={20} />
            About Image
          </button>
          <button
            className={`tab-btn ${activeTab === 'logo' ? 'active' : ''}`}
            onClick={() => setActiveTab('logo')}
          >
            <Image size={20} />
            Logo
          </button>
          <button
            className={`tab-btn ${activeTab === 'merchandise' ? 'active' : ''}`}
            onClick={() => setActiveTab('merchandise')}
          >
            <Package size={20} />
            Merchandise
          </button>
          <button
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <Package size={20} />
            Orders
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
            <>
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
                <label>Client/Event Name (Optional)</label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., John & Sarah Wedding, Corporate Event 2024"
                />
              </div>

              <div className="form-group">
                <label>Location (Optional)</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., Cape Town, Johannesburg"
                />
              </div>

              <div className="form-group">
                <label>Date Taken (Optional)</label>
                <input
                  type="date"
                  name="dateTaken"
                  value={formData.dateTaken || ''}
                  onChange={handleInputChange}
                />
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
              
              <div className="content-list">
                <h3>Gallery Items ({galleryItems.length})</h3>
                <div className="items-grid">
                  {galleryItems.map(item => (
                    <div key={item.id} className="item-card">
                      <img src={item.url} alt={item.title} />
                      <div className="item-info">
                        <h4>{item.title}</h4>
                        <span className="item-category">{item.category}</span>
                        {item.clientName && <p className="item-client">{item.clientName}</p>}
                        {item.location && <p className="item-location">{item.location}</p>}
                      </div>
                      <button 
                        className="delete-item-btn"
                        onClick={async () => {
                          if (window.confirm('Delete this image?')) {
                            await deleteDoc(doc(db, 'gallery', item.id));
                            fetchGalleryItems();
                          }
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'videos' && (
            <>
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
              
              <div className="content-list">
                <h3>Video Items ({videoItems.length})</h3>
                <div className="items-grid">
                  {videoItems.map(item => (
                    <div key={item.id} className="item-card">
                      <img src={item.thumbnail || 'https://via.placeholder.com/300x200'} alt={item.title} />
                      <div className="item-info">
                        <h4>{item.title}</h4>
                        <span className="item-category">{item.category}</span>
                      </div>
                      <button 
                        className="delete-item-btn"
                        onClick={async () => {
                          if (window.confirm('Delete this video?')) {
                            await deleteDoc(doc(db, 'videos', item.id));
                            fetchVideoItems();
                          }
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'presets' && (
            <>
              <form className="upload-form glass" onSubmit={uploadPreset}>
                <h2>Add New Preset Pack</h2>
                
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
                    <option value="Portrait">Portrait</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Street">Street</option>
                    <option value="Landscape">Landscape</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Price (USD Base)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    required
                  />
                  <small>Enter price in USD - will auto-convert for users</small>
                </div>

                <div className="form-group">
                  <label>Original Price (USD) - Optional</label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    step="0.01"
                  />
                  <small>For discount display</small>
                </div>

                <div className="form-group">
                  <label>Number of Presets</label>
                  <input
                    type="number"
                    name="presetCount"
                    value={formData.presetCount}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Preset File (.zip)</label>
                  <input
                    type="file"
                    accept=".zip"
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
                      Add Preset Pack
                    </>
                  )}
                </button>
              </form>
              
              <div className="content-list">
                <h3>Preset Packs ({presetItems.length})</h3>
                <div className="items-grid">
                  {presetItems.map(item => (
                    <div key={item.id} className="item-card">
                      <img src={item.preview || 'https://via.placeholder.com/300x200'} alt={item.title} />
                      <div className="item-info">
                        <h4>{item.title}</h4>
                        <span className="item-category">{item.category}</span>
                        <div className="item-price">${item.price}</div>
                      </div>
                      <button 
                        className="delete-item-btn"
                        onClick={async () => {
                          if (window.confirm('Delete this preset pack?')) {
                            await deleteDoc(doc(db, 'presets', item.id));
                            fetchPresetItems();
                          }
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
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

          {activeTab === 'hero' && (
            <form className="upload-form glass" onSubmit={async (e) => {
              e.preventDefault();
              if (!formData.file) return;
              
              setUploading(true);
              try {
                const imageUrl = await uploadToCloudinary(formData.file);
                
                const heroCollection = collection(db, 'hero');
                const heroSnap = await getDocs(heroCollection);
                
                if (heroSnap.empty) {
                  await addDoc(heroCollection, { imageUrl });
                } else {
                  const heroDoc = heroSnap.docs[0];
                  await updateDoc(doc(db, 'hero', heroDoc.id), { imageUrl });
                }
                
                alert('Hero image updated successfully!');
                setFormData({ title: '', description: '', category: '', file: null, videoUrl: '', price: '', originalPrice: '', presetCount: '' });
              } catch (error) {
                alert('Error updating hero image.');
              } finally {
                setUploading(false);
              }
            }}>
              <h2>Update Hero Image</h2>
              
              <div className="form-group">
                <label>Hero Image</label>
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
                    <Upload size={16} />
                    Update Hero Image
                  </>
                )}
              </button>
            </form>
          )}

          {activeTab === 'about' && (
            <form className="upload-form glass" onSubmit={async (e) => {
              e.preventDefault();
              if (!formData.file) return;
              
              setUploading(true);
              try {
                const imageUrl = await uploadToCloudinary(formData.file);
                
                const aboutCollection = collection(db, 'about');
                const aboutSnap = await getDocs(aboutCollection);
                
                if (aboutSnap.empty) {
                  await addDoc(aboutCollection, { imageUrl });
                } else {
                  const aboutDoc = aboutSnap.docs[0];
                  await updateDoc(doc(db, 'about', aboutDoc.id), { imageUrl });
                }
                
                alert('About image updated successfully!');
                setFormData({ title: '', description: '', category: '', file: null, videoUrl: '', price: '', originalPrice: '', presetCount: '' });
              } catch (error) {
                alert('Error updating about image.');
              } finally {
                setUploading(false);
              }
            }}>
              <h2>Update About Image</h2>
              
              <div className="form-group">
                <label>About Page Image</label>
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
                    <Upload size={16} />
                    Update About Image
                  </>
                )}
              </button>
            </form>
          )}

          {activeTab === 'logo' && (
            <form className="upload-form glass" onSubmit={async (e) => {
              e.preventDefault();
              if (!formData.file) return;
              
              setUploading(true);
              try {
                const logoUrl = await uploadToCloudinary(formData.file);
                
                const logoCollection = collection(db, 'logo');
                const logoSnap = await getDocs(logoCollection);
                
                if (logoSnap.empty) {
                  await addDoc(logoCollection, { logoUrl });
                } else {
                  const logoDoc = logoSnap.docs[0];
                  await updateDoc(doc(db, 'logo', logoDoc.id), { logoUrl });
                }
                
                alert('Logo updated successfully!');
                setFormData({ title: '', description: '', category: '', file: null, videoUrl: '', price: '', originalPrice: '', presetCount: '' });
              } catch (error) {
                alert('Error updating logo.');
              } finally {
                setUploading(false);
              }
            }}>
              <h2>Update Logo</h2>
              
              <div className="form-group">
                <label>Logo Image (PNG recommended)</label>
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
                    <Upload size={16} />
                    Update Logo
                  </>
                )}
              </button>
            </form>
          )}

          {activeTab === 'merchandise' && (
            <>
            <form className="upload-form glass" onSubmit={async (e) => {
              e.preventDefault();
              if (!formData.file || !formData.name || !formData.price) return;
              
              setUploading(true);
              try {
                const imageUrl = await uploadToCloudinary(formData.file);
                
                await addDoc(collection(db, 'merchandise'), {
                  name: formData.name,
                  description: formData.description,
                  category: formData.category,
                  price: parseFloat(formData.price),
                  originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
                  image: imageUrl,
                  sizes: formData.sizes.split(',').map(s => s.trim()),
                  colors: formData.colors.split(',').map(c => c.trim()),
                  inStock: formData.inStock,
                  rating: 5.0,
                  reviews: 0,
                  createdAt: serverTimestamp()
                });
                
                alert('Product added successfully!');
                setFormData({ title: '', description: '', category: '', file: null, videoUrl: '', price: '', originalPrice: '', presetCount: '', clientName: '', location: '', dateTaken: '', name: '', sizes: '', colors: '', inStock: true });
              } catch (error) {
                alert('Error adding product.');
              } finally {
                setUploading(false);
              }
            }}>
              <h2>Add New Product</h2>
              
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
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
                  <option value="apparel">Apparel</option>
                  <option value="accessories">Accessories</option>
                  <option value="prints">Prints</option>
                  <option value="equipment">Equipment</option>
                </select>
              </div>

              <div className="form-group">
                <label>Price (ZAR)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label>Original Price (Optional)</label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label>Sizes (comma separated)</label>
                <input
                  type="text"
                  name="sizes"
                  value={formData.sizes}
                  onChange={handleInputChange}
                  placeholder="S, M, L, XL"
                  required
                />
              </div>

              <div className="form-group">
                <label>Colors (comma separated)</label>
                <input
                  type="text"
                  name="colors"
                  value={formData.colors}
                  onChange={handleInputChange}
                  placeholder="Black, White, Grey"
                  required
                />
              </div>

              <div className="form-group">
                <label>Product Image</label>
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
                    Add Product
                  </>
                )}
              </button>
            </form>
            
            <div className="content-list">
              <h3>Merchandise Items ({merchandiseItems.length})</h3>
              <div className="items-grid">
                {merchandiseItems.map(item => (
                  <div key={item.id} className="item-card">
                    <img src={item.image} alt={item.name} />
                    <div className="item-info">
                      <h4>{item.name}</h4>
                      <span className="item-category">{item.category}</span>
                      <div className="item-price">R{item.price}</div>
                    </div>
                    <button 
                      className="delete-item-btn"
                      onClick={async () => {
                        if (window.confirm('Delete this product?')) {
                          await deleteDoc(doc(db, 'merchandise', item.id));
                          fetchMerchandiseItems();
                        }
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            </>
          )}

          {activeTab === 'orders' && (
            <div className="orders-list">
              <h2>Store Orders ({orderItems.length})</h2>
              {orderItems.length === 0 ? (
                <p>No orders yet.</p>
              ) : (
                orderItems.map((order) => (
                  <div key={order.id} className="order-card glass">
                    <div className="order-header">
                      <h3>Order #{order.id.slice(-6)}</h3>
                      <span className="order-status">{order.status}</span>
                    </div>
                    <div className="order-items">
                      {order.items?.map((item, index) => (
                        <div key={index} className="order-item">
                          <span>{item.name} x{item.quantity}</span>
                          <span>R{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <div className="order-total">
                      <strong>Total: R{order.total}</strong>
                    </div>
                    <div className="order-date">
                      Ordered: {order.createdAt?.toDate().toLocaleDateString()}
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