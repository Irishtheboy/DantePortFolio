import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, Search, Plus, Minus, UserPlus, LogIn } from 'lucide-react';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import CustomerSignup from '../CustomerSignup/CustomerSignup';
import CustomerLogin from '../CustomerLogin/CustomerLogin';
import './MerchStore.css';

const MerchStore = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const categories = ['all', 'apparel', 'accessories', 'prints', 'equipment'];

  useEffect(() => {
    fetchProducts();
    loadCart();
  }, []);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'merchandise'));
      const productData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productData);
    } catch (error) {
      console.error('Error fetching products:', error);
      // No demo products - will load from Firebase
      setProducts([]);
    }
  };

  const loadCart = () => {
    const savedCart = localStorage.getItem('killydid_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const saveCart = (newCart) => {
    localStorage.setItem('killydid_cart', JSON.stringify(newCart));
    setCart(newCart);
  };

  const addToCart = (product, size, color, qty) => {
    const cartItem = {
      id: `${product.id}-${size}-${color}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size,
      color,
      quantity: qty
    };

    const existingItem = cart.find(item => item.id === cartItem.id);
    let newCart;

    if (existingItem) {
      newCart = cart.map(item =>
        item.id === cartItem.id
          ? { ...item, quantity: item.quantity + qty }
          : item
      );
    } else {
      newCart = [...cart, cartItem];
    }

    saveCart(newCart);
    alert('Added to cart!');
  };

  const removeFromCart = (itemId) => {
    const newCart = cart.filter(item => item.id !== itemId);
    saveCart(newCart);
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(itemId);
      return;
    }

    const newCart = cart.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    saveCart(newCart);
  };

  const toggleFavorite = (productId) => {
    const newFavorites = new Set(favorites);
    if (favorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  const filteredProducts = products
    .filter(product => selectedCategory === 'all' || product.category === selectedCategory)
    .filter(product =>
      searchTerm === '' ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = async () => {
    try {
      const orderData = {
        items: cart,
        total: getTotalPrice(),
        createdAt: serverTimestamp(),
        status: 'pending'
      };

      await addDoc(collection(db, 'orders'), orderData);
      
      // Here you would integrate with Stripe for payment
      alert('Order placed! Redirecting to payment...');
      
      // Clear cart after successful order
      saveCart([]);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order. Please try again.');
    }
  };

  return (
    <div className="merch-store">
      <div className="store-container">
        <motion.div
          className="store-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h1 className="gradient-text">KILLYDID STORE</h1>
          <p>Official merchandise and exclusive prints</p>
        </motion.div>

        <div className="store-controls">
          <div className="search-filter">
            <div className="search-bar">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="category-filters">
              {categories.map(category => (
                <button
                  key={category}
                  className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="cart-summary">
            <button className="cart-btn">
              <ShoppingCart size={20} />
              <span className="cart-count">{getTotalItems()}</span>
              <span>R{getTotalPrice()}</span>
            </button>
          </div>
        </div>

        <div className="auth-cta">
          <h3>KILLYDID Store Account</h3>
          <p>Sign in or create an account for faster checkout and exclusive offers</p>
          <div className="auth-buttons">
            <button 
              className="login-btn"
              onClick={() => setShowLogin(true)}
            >
              <LogIn size={16} />
              Sign In
            </button>
            <button 
              className="signup-btn"
              onClick={() => setShowSignup(true)}
            >
              <UserPlus size={16} />
              Create Account
            </button>
          </div>
        </div>

        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                className="product-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                onClick={() => setSelectedProduct(product)}
              >
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  <button
                    className={`favorite-btn ${favorites.has(product.id) ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(product.id);
                    }}
                  >
                    <Heart size={16} fill={favorites.has(product.id) ? 'currentColor' : 'none'} />
                  </button>
                  {product.originalPrice && (
                    <div className="sale-badge">SALE</div>
                  )}
                </div>
                
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <div className="product-rating">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < Math.floor(product.rating) ? '#ffd700' : 'none'}
                        color="#ffd700"
                      />
                    ))}
                    <span>({product.reviews})</span>
                  </div>
                  <div className="product-price">
                    <span className="current-price">R{product.price}</span>
                    {product.originalPrice && (
                      <span className="original-price">R{product.originalPrice}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="empty-store">
              <h3>Store Coming Soon</h3>
              <p>Products will be added through the admin panel</p>
            </div>
          )}
        </div>

        {/* Shopping Cart */}
        {cart.length > 0 && (
          <div className="cart-sidebar">
            <h3>Shopping Cart</h3>
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>{item.size} - {item.color}</p>
                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="item-price">R{item.price * item.quantity}</div>
                </div>
              ))}
            </div>
            <div className="cart-total">
              <strong>Total: R{getTotalPrice()}</strong>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        )}

        {/* Product Modal */}
        {selectedProduct && (
          <div className="product-modal" onClick={() => setSelectedProduct(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setSelectedProduct(null)}>×</button>
              
              <div className="modal-body">
                <div className="product-images">
                  <img src={selectedProduct.image} alt={selectedProduct.name} />
                </div>
                
                <div className="product-details">
                  <h2>{selectedProduct.name}</h2>
                  <div className="product-rating">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < Math.floor(selectedProduct.rating) ? '#ffd700' : 'none'}
                        color="#ffd700"
                      />
                    ))}
                    <span>({selectedProduct.reviews} reviews)</span>
                  </div>
                  
                  <div className="product-price">
                    <span className="current-price">R{selectedProduct.price}</span>
                    {selectedProduct.originalPrice && (
                      <span className="original-price">R{selectedProduct.originalPrice}</span>
                    )}
                  </div>
                  
                  <p>{selectedProduct.description}</p>
                  
                  <div className="product-options">
                    <div className="size-selector">
                      <label>Size:</label>
                      <div className="options">
                        {selectedProduct.sizes.map(size => (
                          <button
                            key={size}
                            className={`option-btn ${selectedSize === size ? 'selected' : ''}`}
                            onClick={() => setSelectedSize(size)}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="color-selector">
                      <label>Color:</label>
                      <div className="options">
                        {selectedProduct.colors.map(color => (
                          <button
                            key={color}
                            className={`option-btn ${selectedColor === color ? 'selected' : ''}`}
                            onClick={() => setSelectedColor(color)}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="quantity-selector">
                      <label>Quantity:</label>
                      <div className="quantity-controls">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                          <Minus size={16} />
                        </button>
                        <span>{quantity}</span>
                        <button onClick={() => setQuantity(quantity + 1)}>
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    className="add-to-cart-btn"
                    onClick={() => {
                      if (!selectedSize || !selectedColor) {
                        alert('Please select size and color');
                        return;
                      }
                      addToCart(selectedProduct, selectedSize, selectedColor, quantity);
                      setSelectedProduct(null);
                      setSelectedSize('');
                      setSelectedColor('');
                      setQuantity(1);
                    }}
                    disabled={!selectedSize || !selectedColor}
                  >
                    Add to Cart - R{selectedProduct.price * quantity}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Customer Login Modal */}
        {showLogin && (
          <div className="auth-modal" onClick={() => setShowLogin(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setShowLogin(false)}>×</button>
              <CustomerLogin 
                onClose={() => setShowLogin(false)}
                onSwitchToSignup={() => {
                  setShowLogin(false);
                  setShowSignup(true);
                }}
              />
            </div>
          </div>
        )}

        {/* Customer Signup Modal */}
        {showSignup && (
          <div className="auth-modal" onClick={() => setShowSignup(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setShowSignup(false)}>×</button>
              <CustomerSignup onClose={() => setShowSignup(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MerchStore;