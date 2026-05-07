// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search } from 'lucide-react';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import { useState } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const { getTotalItems } = useCartStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const totalItems = getTotalItems();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav style={{
        height: "85px",
        background: "rgba(5, 5, 5, 0.98)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(156, 168, 139, 0.3)",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: "0 60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        {/* Logo - Left Side */}
        <Link to="/" style={{ 
          fontSize: "1.8rem", 
          fontWeight: "700", 
          letterSpacing: "6px", 
          fontFamily: "'Playfair Display', serif",
          background: "linear-gradient(135deg, #b5c0a4 0%, #9ca88b 30%, #7a8768 70%, #9ca88b 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textDecoration: "none"
        }}>VELORA</Link>

        {/* Navigation Links - Right Side */}
        <div style={{ 
          display: "flex", 
          gap: "2.5rem", 
          alignItems: "center",
          marginLeft: "auto"
        }}>
          <div className="dropdown">
            <span className="dropdown-trigger" style={{ 
              color: "#f5f5f5", 
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: "500",
              letterSpacing: "1px",
              fontFamily: "'Inter', sans-serif",
              transition: "all 0.3s ease"
            }}>WOMEN</span>
            <div className="dropdown-menu">
              <Link to="/women/fragrance">Fragrance</Link>
              <div className="dropdown-divider"></div>
              <Link to="/women/makeup/eye">Makeup / Eye</Link>
              <Link to="/women/makeup/face">Makeup / Face</Link>
              <Link to="/women/makeup/lip">Makeup / Lip</Link>
              <Link to="/women/makeup/cheek">Makeup / Cheek</Link>
            </div>
          </div>

          <div className="dropdown">
            <span className="dropdown-trigger" style={{ 
              color: "#f5f5f5", 
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: "500",
              letterSpacing: "1px",
              fontFamily: "'Inter', sans-serif",
              transition: "all 0.3s ease"
            }}>MEN</span>
            <div className="dropdown-menu">
              <Link to="/men/fragrance">Fragrance</Link>
              <Link to="/men/grooming">Grooming</Link>
            </div>
          </div>

          <Link to="/health-and-skin-care" style={{ 
            color: "#f5f5f5", 
            textDecoration: "none",
            fontSize: "0.9rem",
            fontWeight: "500",
            letterSpacing: "1px",
            fontFamily: "'Inter', sans-serif",
            transition: "all 0.3s ease"
          }}>HEALTH</Link>
          
          <Link to="/hair-care" style={{ 
            color: "#f5f5f5", 
            textDecoration: "none",
            fontSize: "0.9rem",
            fontWeight: "500",
            letterSpacing: "1px",
            fontFamily: "'Inter', sans-serif",
            transition: "all 0.3s ease"
          }}>HAIR</Link>
          
          <Link to="/baby-care" style={{ 
            color: "#f5f5f5", 
            textDecoration: "none",
            fontSize: "0.9rem",
            fontWeight: "500",
            letterSpacing: "1px",
            fontFamily: "'Inter', sans-serif",
            transition: "all 0.3s ease"
          }}>BABY</Link>

          {/* Divider */}
          <div style={{ 
            width: "1px", 
            height: "30px", 
            background: "linear-gradient(180deg, transparent, rgba(156, 168, 139, 0.5), transparent)",
            margin: "0 0.5rem"
          }}></div>

          {/* Search Icon */}
          <Search size={18} style={{ 
            cursor: "pointer", 
            color: "#f5f5f5",
            transition: "all 0.3s ease"
          }} />

          {/* Cart Icon */}
          <div className="cart-badge" style={{ cursor: "pointer", position: "relative" }} onClick={() => setShowCart(true)}>
            <ShoppingCart size={18} style={{ color: "#f5f5f5" }} />
            {totalItems > 0 && (
              <span style={{
                position: "absolute",
                top: "-8px",
                right: "-12px",
                background: "linear-gradient(135deg, #9ca88b 0%, #7a8768 100%)",
                color: "#050505",
                fontSize: "0.65rem",
                fontWeight: "bold",
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>{totalItems}</span>
            )}
          </div>

          {/* User Icon */}
          <div className="dropdown">
            <User size={18} style={{ cursor: "pointer", color: "#f5f5f5" }} />
            <div className="dropdown-menu" style={{ right: 0, left: "auto" }}>
              {isAuthenticated ? (
                <>
                  <span className="dropdown-item" style={{ color: "#9ca88b" }}>Welcome, {user?.name}</span>
                  <div className="dropdown-divider"></div>
                  <Link to="/orders">My Orders</Link>
                  <button onClick={handleLogout} className="dropdown-item" style={{ 
                    background: "none", 
                    border: "none", 
                    width: "100%", 
                    textAlign: "left", 
                    cursor: "pointer",
                    color: "#f5f5f5"
                  }}>Logout</button>
                </>
              ) : (
                <>
                  <button onClick={() => setShowAuthModal("login")} className="dropdown-item" style={{ 
                    background: "none", 
                    border: "none", 
                    width: "100%", 
                    textAlign: "left", 
                    cursor: "pointer",
                    color: "#f5f5f5"
                  }}>Login</button>
                  <button onClick={() => setShowAuthModal("signup")} className="dropdown-item" style={{ 
                    background: "none", 
                    border: "none", 
                    width: "100%", 
                    textAlign: "left", 
                    cursor: "pointer",
                    color: "#f5f5f5"
                  }}>Sign Up</button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Cart Modal */}
      {showCart && <CartModal onClose={() => setShowCart(false)} />}
      
      {/* Auth Modal */}
      {showAuthModal && <AuthModal mode={showAuthModal} onClose={() => setShowAuthModal(false)} />}
    </>
  );
};

// Cart Modal Component
const CartModal = ({ onClose }) => {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const total = getTotalPrice();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "600px", maxHeight: "80vh", overflow: "auto" }}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2 style={{ marginBottom: "1.5rem", textAlign: "center", fontSize: "2rem" }}>Your Cart</h2>
        
        {items.length === 0 ? (
          <p style={{ textAlign: "center", padding: "3rem" }}>Your cart is empty</p>
        ) : (
          <>
            {items.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <div className="cart-item-price">{item.price}</div>
                </div>
                <div className="cart-item-quantity">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span style={{ fontWeight: "600" }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                <button onClick={() => removeItem(item.id)} style={{ background: "none", border: "none", color: "#9ca88b", cursor: "pointer", fontSize: "1.2rem" }}>×</button>
              </div>
            ))}
            <div style={{ padding: "1rem", borderTop: "1px solid rgba(156, 168, 139, 0.2)", marginTop: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem", fontSize: "1.2rem" }}>
                <strong>Total:</strong>
                <strong style={{ background: "linear-gradient(135deg, #b5c0a4 0%, #9ca88b 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>${total}</strong>
              </div>
              <button className="btn-primary" style={{ width: "100%" }}>Proceed to Checkout</button>
              <button onClick={clearCart} style={{ background: "none", border: "none", color: "#888", marginTop: "1rem", cursor: "pointer", width: "100%", textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "1px" }}>Clear Cart</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Auth Modal Component
const AuthModal = ({ mode, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { login, signup } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "login") {
      login(email, password);
    } else {
      signup(email, password, name);
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2 style={{ marginBottom: "1.5rem", textAlign: "center", fontSize: "2rem" }}>
          {mode === "login" ? "Login" : "Create Account"}
        </h2>
        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Enter your name" />
            </div>
          )}
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="hello@velora.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
          </div>
          <button type="submit" className="btn-primary" style={{ width: "100%" }}>
            {mode === "login" ? "Login" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Navbar;