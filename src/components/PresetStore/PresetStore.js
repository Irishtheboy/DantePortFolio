import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase';
import { Download, Star, ShoppingCart, Eye, Package } from 'lucide-react';
import { detectUserCurrency, formatPrice, getAvailableCurrencies } from '../../utils/currency';
import './PresetStore.css';

const PresetStore = () => {
  const [presets, setPresets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [userCurrency, setUserCurrency] = useState('USD');

  useEffect(() => {
    fetchPresets();
    // Force ZAR for South Africa, otherwise detect
    const detected = detectUserCurrency();
    console.log('Detected currency:', detected, 'Timezone:', Intl.DateTimeFormat().resolvedOptions().timeZone);
    setUserCurrency('ZAR'); // Force ZAR for now
  }, []);

  const fetchPresets = async () => {
    try {
      const q = query(collection(db, 'presets'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const presetData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPresets(presetData);
    } catch (error) {
      console.error('Error fetching presets:', error);
      setPresets([
        {
          id: 1,
          title: 'Moody Portrait Pack',
          description: 'Dark and dramatic presets perfect for portrait photography',
          price: 25,
          originalPrice: 35,
          rating: 4.8,
          downloads: 1250,
          preview: '',
          category: 'Portrait',
          fileSize: '2.5 MB',
          presetCount: 12
        },
        {
          id: 2,
          title: 'Wedding Elegance',
          description: 'Soft and romantic presets for wedding photography',
          price: 30,
          originalPrice: 40,
          rating: 4.9,
          downloads: 890,
          preview: '',
          category: 'Wedding',
          fileSize: '3.1 MB',
          presetCount: 15
        },
        {
          id: 3,
          title: 'Urban Street Vibes',
          description: 'Gritty and bold presets for street photography',
          price: 20,
          originalPrice: 28,
          rating: 4.7,
          downloads: 2100,
          preview: '',
          category: 'Street',
          fileSize: '1.8 MB',
          presetCount: 10
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = (preset) => {
    // This would integrate with payment system
    alert(`Purchasing ${preset.title} for ${formatPrice(preset.price, userCurrency)}`);
  };

  if (loading) {
    return (
      <div className="preset-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <section className="preset-store">
      <div className="preset-container">
        <motion.div
          className="preset-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title gradient-text">Lightroom Presets</h2>
          <p className="section-subtitle">
            Professional presets to enhance your photography workflow
          </p>
          <div className="currency-selector">
            <label>Currency: </label>
            <select 
              value={userCurrency} 
              onChange={(e) => setUserCurrency(e.target.value)}
            >
              {getAvailableCurrencies().map(curr => (
                <option key={curr.code} value={curr.code}>
                  {curr.symbol} {curr.name}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        <div className="preset-grid">
          {presets.map((preset, index) => (
            <motion.div
              key={preset.id}
              className="preset-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className="preset-image">
                <img src={preset.preview} alt={preset.title} />
                <div className="preset-overlay">
                  <button 
                    className="preview-btn"
                    onClick={() => setSelectedPreset(preset)}
                  >
                    <Eye size={20} />
                    Preview
                  </button>
                </div>
                <div className="preset-badge">
                  {preset.originalPrice > preset.price && (
                    <span className="discount">
                      -{Math.round(((preset.originalPrice - preset.price) / preset.originalPrice) * 100)}%
                    </span>
                  )}
                </div>
              </div>

              <div className="preset-content">
                <div className="preset-category">{preset.category}</div>
                <h3 className="preset-title">{preset.title}</h3>
                <p className="preset-description">{preset.description}</p>
                
                <div className="preset-stats">
                  <div className="stat">
                    <Star size={14} fill="currentColor" />
                    <span>{preset.rating}</span>
                  </div>
                  <div className="stat">
                    <Download size={14} />
                    <span>{preset.downloads}</span>
                  </div>
                  <div className="stat">
                    <Package size={14} />
                    <span>{preset.presetCount} presets</span>
                  </div>
                </div>

                <div className="preset-pricing">
                  <div className="price">
                    <span className="current-price">{formatPrice(preset.price, userCurrency)}</span>
                    {preset.originalPrice > preset.price && (
                      <span className="original-price">{formatPrice(preset.originalPrice, userCurrency)}</span>
                    )}
                  </div>
                  <button 
                    className="buy-btn"
                    onClick={() => handlePurchase(preset)}
                  >
                    <ShoppingCart size={16} />
                    Buy Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {selectedPreset && (
          <div className="preset-modal" onClick={() => setSelectedPreset(null)}>
            <div className="preset-modal-content" onClick={e => e.stopPropagation()}>
              <img src={selectedPreset.preview} alt={selectedPreset.title} />
              <div className="preset-modal-info">
                <h3>{selectedPreset.title}</h3>
                <p>{selectedPreset.description}</p>
                <div className="preset-details">
                  <span>File Size: {selectedPreset.fileSize}</span>
                  <span>{selectedPreset.presetCount} Presets Included</span>
                  <span>Compatible with Lightroom CC & Classic</span>
                </div>
                <button 
                  className="modal-buy-btn"
                  onClick={() => handlePurchase(selectedPreset)}
                >
                  Buy for {formatPrice(selectedPreset.price, userCurrency)}
                </button>
              </div>
              <button 
                className="modal-close"
                onClick={() => setSelectedPreset(null)}
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PresetStore;