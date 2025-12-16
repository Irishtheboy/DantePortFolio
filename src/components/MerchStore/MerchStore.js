import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, Filter, Search, Plus, Minus, UserPlus } from 'lucide-react';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import CustomerSignup from '../CustomerSignup/CustomerSignup';
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
      // Demo products
      setProducts([
        {
          id: 1,
          name: 'KILLYDID Signature Hoodie',
          price: 899,
          originalPrice: 1199,
          category: 'apparel',
          image: 'https://via.placeholder.com/400x400/000000/FFFFFF?text=KILLYDID+Hoodie',
          images: ['https://via.placeholder.com/400x400/000000/FFFFFF?text=KILLYDID+Hoodie'],
          description: 'Premium quality hoodie with embroidered KILLYDID logo',
          sizes: ['S', 'M', 'L', 'XL', 'XXL'],
          colors: ['Black', 'White', 'Grey'],
          rating: 4.8,
          reviews: 24,
          inStock: true
        },
        {
          id: 2,
          name: 'Street Photography Print Set',
          price: 450,
          category: 'prints',
          image: 'https://via.placeholder.com/400x400/333333/FFFFFF?text=Photo+Prints',
          images: ['https://via.placeholder.com/400x400/333333/FFFFFF?text=Photo+Prints'],
          description: 'Limited edition prints from the Broke Boys Collective era',
          sizes: ['A4', 'A3', 'A2'],
          colors: ['Original'],
          rating: 4.9,
          reviews: 18,
          inStock: true
        },
        {
          id: 3,
          name: 'KILLYDID Camera Strap',
          price: 299,
          category: 'accessories',
          image: 'https://via.placeholder.com/400x400/8B4513/FFFFFF?text=Camera+Strap',
          images: ['https://via.placeholder.com/400x400/8B4513/FFFFFF?text=Camera+Strap'],
          description: 'Custom leather camera strap with KILLYDID branding',
          sizes: ['One Size'],
          colors: ['Black', 'Brown'],
          rating: 4.7,
          reviews: 12,
          inStock: true
        },
        {
          id: 4,
          name: 'KILLYDID T-Shirt',
          price: 399,
          category: 'apparel',
          image: 'https://via.placeholder.com/400x400/FF6B35/FFFFFF?text=KILLYDID+Tee',
          images: ['https://via.placeholder.com/400x400/FF6B35/FFFFFF?text=KILLYDID+Tee'],
          description: 'Comfortable cotton t-shirt with street art design',
          sizes: ['S', 'M', 'L', 'XL'],
          colors: ['Black', 'White', 'Orange'],
          rating: 4.6,
          reviews: 31,
          inStock: true
        },
        {
          id: 5,
          name: 'Photography Equipment Bag',
          price: 1299,
          category: 'equipment',
          image: 'https://via.placeholder.com/400x400/2C2C2C/FFFFFF?text=Camera+Bag',
          images: ['https://via.placeholder.com/400x400/2C2C2C/FFFFFF?text=Camera+Bag'],
          description: 'Professional camera bag for street photography',
          sizes: ['One Size'],
          colors: ['Black', 'Grey'],
          rating: 4.9,
          reviews: 15,
          inStock: true
        },
        {
          id: 6,
          name: 'KILLYDID Snapback Cap',
          price: 249,
          category: 'accessories',
          image: 'https://via.placeholder.com/400x400/000000/FF6B35?text=KILLYDID+Cap',
          images: ['https://via.placeholder.com/400x400/000000/FF6B35?text=KILLYDID+Cap'],
          description: 'Embroidered snapback with KILLYDID logo',
          sizes: ['One Size'],
          colors: ['Black', 'White', 'Orange'],
          rating: 4.5,
          reviews: 22,
          inStock: true
        }
      ]);
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

        <div className="signup-cta">
          <h3>New to KILLYDID Store?</h3>
          <p>Create an account for faster checkout and exclusive offers</p>
          <button 
            className="signup-btn"
            onClick={() => setShowSignup(true)}
          >
            <UserPlus size={16} />
            Create Account
          </button>
        </div>

        <div className="products-grid">
          {filteredProducts.map((product, index) => (
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
          ))}
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

        {/* Customer Signup Modal */}
        {showSignup && (
          <div className="signup-modal" onClick={() => setShowSignup(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setShowSignup(false)}>×</button>
              <CustomerSignup />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MerchStore;