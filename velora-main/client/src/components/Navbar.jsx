// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search } from 'lucide-react';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import { useState } from 'react';
import { imgUrl } from '../hooks/useProducts';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Navbar = () => {
  const navigate = useNavigate();
  const { getTotalItems } = useCartStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const totalItems = getTotalItems();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    setShowSearch(false);
    setSearchTerm('');
  };

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
        top: 0, left: 0, right: 0,
        zIndex: 1000,
        padding: "0 60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <Link to="/" style={{ 
          fontSize: "1.8rem", fontWeight: "700", letterSpacing: "6px", 
          fontFamily: "'Playfair Display', serif",
          background: "linear-gradient(135deg, #b5c0a4 0%, #9ca88b 30%, #7a8768 70%, #9ca88b 100%)",
          WebkitBackgroundClip: "text", backgroundClip: "text",
          WebkitTextFillColor: "transparent", textDecoration: "none"
        }}>VELORA</Link>

        <div style={{ display: "flex", gap: "2.5rem", alignItems: "center", marginLeft: "auto" }}>
          <div className="dropdown">
            <span className="dropdown-trigger" style={{ color: "#f5f5f5", cursor: "pointer", fontSize: "0.9rem", fontWeight: "500", letterSpacing: "1px", fontFamily: "'Inter', sans-serif" }}>WOMEN</span>
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
            <span className="dropdown-trigger" style={{ color: "#f5f5f5", cursor: "pointer", fontSize: "0.9rem", fontWeight: "500", letterSpacing: "1px", fontFamily: "'Inter', sans-serif" }}>MEN</span>
            <div className="dropdown-menu">
              <Link to="/men/fragrance">Fragrance</Link>
              <Link to="/men/grooming">Grooming</Link>
            </div>
          </div>

          <Link to="/health-and-skin-care" style={{ color: "#f5f5f5", textDecoration: "none", fontSize: "0.9rem", fontWeight: "500", letterSpacing: "1px" }}>HEALTH</Link>
          <Link to="/hair-care"            style={{ color: "#f5f5f5", textDecoration: "none", fontSize: "0.9rem", fontWeight: "500", letterSpacing: "1px" }}>HAIR</Link>
          <Link to="/baby-care"            style={{ color: "#f5f5f5", textDecoration: "none", fontSize: "0.9rem", fontWeight: "500", letterSpacing: "1px" }}>BABY</Link>

          <div style={{ width: "1px", height: "30px", background: "linear-gradient(180deg, transparent, rgba(156,168,139,0.5), transparent)", margin: "0 0.5rem" }}></div>

          {showSearch ? (
            <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                autoFocus
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onKeyDown={e => e.key === 'Escape' && setShowSearch(false)}
                placeholder="Search products..."
                style={{
                  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(156,168,139,0.4)',
                  borderRadius: '6px', color: '#f5f5f5', padding: '5px 12px',
                  fontSize: '0.85rem', outline: 'none', width: '200px'
                }}
              />
              <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <Search size={16} style={{ color: '#9ca88b' }} />
              </button>
              <button type="button" onClick={() => { setShowSearch(false); setSearchTerm(''); }}
                style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.1rem', padding: 0 }}>×</button>
            </form>
          ) : (
            <Search size={18} style={{ cursor: "pointer", color: "#f5f5f5" }} onClick={() => setShowSearch(true)} />
          )}

          <div className="cart-badge" style={{ cursor: "pointer", position: "relative" }} onClick={() => setShowCart(true)}>
            <ShoppingCart size={18} style={{ color: "#f5f5f5" }} />
            {totalItems > 0 && (
              <span style={{
                position: "absolute", top: "-8px", right: "-12px",
                background: "linear-gradient(135deg, #9ca88b 0%, #7a8768 100%)",
                color: "#050505", fontSize: "0.65rem", fontWeight: "bold",
                width: "18px", height: "18px", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>{totalItems}</span>
            )}
          </div>

          <div className="dropdown">
            <User size={18} style={{ cursor: "pointer", color: "#f5f5f5" }} />
            <div className="dropdown-menu" style={{ right: 0, left: "auto" }}>
              {isAuthenticated ? (
                <>
                  <span className="dropdown-item" style={{ color: "#9ca88b" }}>Welcome, {user?.name}</span>
                  <div className="dropdown-divider"></div>
                  <Link to="/orders">My Orders</Link>
                  <button onClick={handleLogout} className="dropdown-item" style={{ background: "none", border: "none", width: "100%", textAlign: "left", cursor: "pointer", color: "#f5f5f5" }}>Logout</button>
                </>
              ) : (
                <>
                  <button onClick={() => setShowAuthModal("login")}  className="dropdown-item" style={{ background: "none", border: "none", width: "100%", textAlign: "left", cursor: "pointer", color: "#f5f5f5" }}>Login</button>
                  <button onClick={() => setShowAuthModal("signup")} className="dropdown-item" style={{ background: "none", border: "none", width: "100%", textAlign: "left", cursor: "pointer", color: "#f5f5f5" }}>Sign Up</button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {showCart && <CartModal onClose={() => setShowCart(false)} />}
      {showAuthModal && <AuthModal mode={showAuthModal} onClose={() => setShowAuthModal(false)} />}
    </>
  );
};

/* ─── Cart Modal ─────────────────────────────────────────────────────────── */
const CartModal = ({ onClose }) => {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const [screen, setScreen] = useState('cart'); // 'cart' | 'checkout' | 'confirm'
  const [orderNum, setOrderNum] = useState('');
  const [loading, setLoading]  = useState(false);
  const [err, setErr]          = useState('');
  const [form, setForm]        = useState({ fullName: '', email: '', phone: '', address: '', city: '' });
  const total = getTotalPrice();

  const setField = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handlePlaceOrder = async () => {
    if (!form.fullName || !form.email || !form.phone || !form.address || !form.city) {
      setErr('Please fill in all fields');
      return;
    }
    setLoading(true);
    setErr('');

    const num = 'VLR-' + Date.now().toString().slice(-6);

    try {
      const res = await fetch(`${API}/api/orders/guest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: num,
          items: items.map(i => ({
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
          })),
          total: `$${total}`,
          shippingAddress: {
            fullName: form.fullName,
            email: form.email,
            phone: form.phone,
            address: form.address,
            city: form.city,
          },
        }),
      });

      // ── FIX: properly handle non-ok responses and set loading false before returning ──
      if (!res.ok) {
        let message = `Server error (${res.status})`;
        try {
          const data = await res.json();
          message = data.message || message;
        } catch {
          // response body wasn't JSON, keep the status-based message
        }
        setErr(message);
        setLoading(false); // ← was missing: loading spinner never stopped on error
        return;
      }

      // Success — order is confirmed in DB
      setOrderNum(num); // set AFTER success so confirm screen always shows a real order number
      clearCart();
      setScreen('confirm');
    } catch (networkErr) {
      // fetch itself threw — server unreachable / CORS / network down
      setErr('Could not reach server. Make sure the backend is running and VITE_API_URL is set correctly.');
    } finally {
      setLoading(false);
    }
  };

  const iStyle = {
    width: '100%', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(156,168,139,0.25)', borderRadius: '8px',
    color: '#f5f5f5', padding: '10px 14px', fontSize: '0.88rem',
    outline: 'none', boxSizing: 'border-box', marginBottom: '12px',
    fontFamily: 'inherit',
  };
  const lStyle = { color: '#888', fontSize: '0.75rem', letterSpacing: '0.08em', display: 'block', marginBottom: '5px' };

  return (
    <div className="modal-overlay" onClick={screen !== 'confirm' ? onClose : undefined}>
      <div className="modal-content" onClick={e => e.stopPropagation()}
        style={{ maxWidth: '580px', maxHeight: '88vh', overflowY: 'auto' }}>

        {/* ── CART ── */}
        {screen === 'cart' && (
          <>
            <button className="modal-close" onClick={onClose}>×</button>
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', fontSize: '2rem' }}>Your Cart</h2>

            {items.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>Your cart is empty</p>
            ) : (
              <>
                {items.map(item => (
                  <div key={item._id || item.id} className="cart-item">
                    <img src={imgUrl(item.image)} alt={item.name} />
                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      <div className="cart-item-price">{item.price}</div>
                    </div>
                    <div className="cart-item-quantity">
                      <button onClick={() => updateQuantity(item._id || item.id, item.quantity - 1)}>-</button>
                      <span style={{ fontWeight: '600' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id || item.id, item.quantity + 1)}>+</button>
                    </div>
                    <button onClick={() => removeItem(item._id || item.id)} style={{ background: 'none', border: 'none', color: '#9ca88b', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
                  </div>
                ))}
                <div style={{ padding: '1rem', borderTop: '1px solid rgba(156,168,139,0.2)', marginTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.2rem' }}>
                    <strong>Total:</strong>
                    <strong style={{ background: 'linear-gradient(135deg, #b5c0a4 0%, #9ca88b 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>${total}</strong>
                  </div>
                  <button className="btn-primary" style={{ width: '100%' }} onClick={() => { setErr(''); setScreen('checkout'); }}>
                    Proceed to Checkout
                  </button>
                  <button onClick={clearCart} style={{ background: 'none', border: 'none', color: '#888', marginTop: '1rem', cursor: 'pointer', width: '100%', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>
                    Clear Cart
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {/* ── CHECKOUT ── */}
        {screen === 'checkout' && (
          <>
            <button className="modal-close" onClick={onClose}>×</button>
            <button onClick={() => { setScreen('cart'); setErr(''); }} style={{ background: 'none', border: 'none', color: '#9ca88b', cursor: 'pointer', fontSize: '0.85rem', marginBottom: '16px', padding: 0 }}>
              ← Back to Cart
            </button>
            <h2 style={{ marginBottom: '6px', textAlign: 'center', fontSize: '2rem' }}>Checkout</h2>
            <p style={{ textAlign: 'center', color: '#666', fontSize: '0.82rem', marginBottom: '24px' }}>
              Fill in your details and we'll confirm your order.
            </p>

            {err && (
              <div style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)', color: '#ff6060', borderRadius: '8px', padding: '10px 14px', fontSize: '0.82rem', marginBottom: '16px' }}>
                {err}
              </div>
            )}

            <label style={lStyle}>Full Name</label>
            <input style={iStyle} placeholder="Ayesha Khan" value={form.fullName} onChange={e => setField('fullName', e.target.value)} />

            <label style={lStyle}>Email</label>
            <input style={iStyle} type="email" placeholder="ayesha@email.com" value={form.email} onChange={e => setField('email', e.target.value)} />

            <label style={lStyle}>Phone</label>
            <input style={iStyle} placeholder="+92 300 0000000" value={form.phone} onChange={e => setField('phone', e.target.value)} />

            <label style={lStyle}>Address</label>
            <input style={iStyle} placeholder="House #, Street, Area" value={form.address} onChange={e => setField('address', e.target.value)} />

            <label style={lStyle}>City</label>
            <input style={iStyle} placeholder="Islamabad" value={form.city} onChange={e => setField('city', e.target.value)} />

            {/* Summary */}
            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '10px', padding: '14px', border: '1px solid rgba(156,168,139,0.1)', marginBottom: '20px' }}>
              <p style={{ color: '#555', fontSize: '0.72rem', letterSpacing: '0.12em', marginBottom: '10px' }}>ORDER SUMMARY</p>
              {items.map(item => (
                <div key={item._id || item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#ccc', fontSize: '0.85rem' }}>{item.name} × {item.quantity}</span>
                  <span style={{ color: '#9ca88b', fontSize: '0.85rem' }}>{item.price}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid rgba(156,168,139,0.15)', marginTop: '10px', paddingTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ color: '#f5f5f5' }}>Total</strong>
                <strong style={{ color: '#9ca88b' }}>${total}</strong>
              </div>
            </div>

            <button className="btn-primary" style={{ width: '100%' }} onClick={handlePlaceOrder} disabled={loading}>
              {loading ? 'Placing Order…' : 'Place Order'}
            </button>
          </>
        )}

        {/* ── CONFIRMATION ── */}
        {screen === 'confirm' && (
          <div style={{ textAlign: 'center', padding: '24px 10px' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>✓</div>
            <h2 style={{ fontSize: '1.8rem', color: '#9ca88b', marginBottom: '8px', fontFamily: "'Playfair Display', serif" }}>
              Order Placed!
            </h2>
            <p style={{ color: '#888', marginBottom: '24px', lineHeight: 1.7 }}>
              Thank you, {form.fullName}. Your order number is:
            </p>
            <div style={{ background: 'rgba(156,168,139,0.08)', border: '1px solid rgba(156,168,139,0.25)', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
              <p style={{ color: '#555', fontSize: '0.72rem', letterSpacing: '0.15em', marginBottom: '8px' }}>ORDER NUMBER</p>
              <p style={{ color: '#b5c0a4', fontSize: '1.8rem', fontWeight: '700', letterSpacing: '0.1em', fontFamily: "'Playfair Display', serif" }}>
                {orderNum}
              </p>
            </div>
            <p style={{ color: '#666', fontSize: '0.85rem', lineHeight: 1.9, marginBottom: '28px' }}>
              Save this number and email it to<br />
              <span style={{ color: '#9ca88b' }}>orders@velora.com</span><br />
              to check your order status.
            </p>
            <button className="btn-primary" onClick={onClose} style={{ minWidth: '160px' }}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Auth Modal ─────────────────────────────────────────────────────────── */
const AuthModal = ({ mode, onClose }) => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [name, setName]         = useState('');
  const { login, signup }       = useAuthStore();

  const handleSubmit = e => {
    e.preventDefault();
    if (mode === 'login') login(email, password);
    else signup(email, password, name);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', fontSize: '2rem' }}>
          {mode === 'login' ? 'Login' : 'Create Account'}
        </h2>
        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Enter your name" />
            </div>
          )}
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="hello@velora.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            {mode === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Navbar;