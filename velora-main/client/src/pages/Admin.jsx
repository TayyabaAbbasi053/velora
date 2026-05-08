// src/pages/Admin.jsx
// Drop this file into your existing React project.
// Also add this route in your router:  <Route path="/admin" element={<Admin />} />
// The VITE_API_URL env var should point to your backend, e.g. http://localhost:5000

import { useState, useEffect, useRef } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CATEGORIES = ['Women', 'Men', 'Hair care', 'Baby care', 'Health And Skin Care'];
const SUBCATEGORIES = {
  Women: ['Fragrance', 'Makeup'],
  Men: ['Fragrance', 'Grooming'],
  'Hair care': [],
  'Baby care': [],
  'Health And Skin Care': [],
};
const GROUPS = { Makeup: ['Eye', 'Face', 'Lip', 'Cheek'] };

const STATUS_COLORS = {
  pending:    { bg: 'rgba(255,200,80,0.12)', text: '#f5c842', border: 'rgba(245,200,66,0.3)' },
  processing: { bg: 'rgba(80,160,255,0.12)', text: '#5ab0ff', border: 'rgba(90,176,255,0.3)' },
  shipped:    { bg: 'rgba(160,100,255,0.12)', text: '#b47cff', border: 'rgba(180,124,255,0.3)' },
  delivered:  { bg: 'rgba(80,210,130,0.12)', text: '#4ecb85', border: 'rgba(78,203,133,0.3)' },
  cancelled:  { bg: 'rgba(255,80,80,0.12)',  text: '#ff6060', border: 'rgba(255,96,96,0.3)'  },
};

/* ─── tiny hook: fetch with auth header ─────────────────────────────────── */
function useApi() {
  const token = localStorage.getItem('adminToken');
  const headers = (extra = {}) => ({
    Authorization: `Bearer ${token}`,
    ...extra,
  });

  const get = (url) =>
    fetch(`${API}${url}`, { headers: headers() }).then((r) => r.json());

  const del = (url) =>
    fetch(`${API}${url}`, { method: 'DELETE', headers: headers() }).then((r) => r.json());

  const patch = (url, body) =>
    fetch(`${API}${url}`, {
      method: 'PATCH',
      headers: headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(body),
    }).then((r) => r.json());

  const post = (url, formData) =>
    fetch(`${API}${url}`, { method: 'POST', headers: headers(), body: formData }).then((r) => r.json());

  const put = (url, formData) =>
    fetch(`${API}${url}`, { method: 'PUT', headers: headers(), body: formData }).then((r) => r.json());

  return { get, del, patch, post, put };
}

/* ─── Login Screen ───────────────────────────────────────────────────────── */
function LoginScreen({ onLogin }) {
  const [tab, setTab] = useState('login'); // 'login' | 'setup'

  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  // Setup state
  const [setupName, setSetupName] = useState('');
  const [setupEmail, setSetupEmail] = useState('');
  const [setupPassword, setSetupPassword] = useState('');
  const [setupConfirm, setSetupConfirm] = useState('');
  const [setupErr, setSetupErr] = useState('');
  const [setupLoading, setSetupLoading] = useState(false);
  const [setupDone, setSetupDone] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setErr('');
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setErr(data.message || 'Login failed'); return; }
      if (!data.user.isAdmin) { setErr('Not an admin account'); return; }
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.user));
      onLogin(data.user);
    } catch {
      setErr('Server unreachable');
    } finally {
      setLoading(false);
    }
  };

  const handleSetup = async () => {
    setSetupErr('');
    if (!setupName || !setupEmail || !setupPassword) { setSetupErr('All fields are required'); return; }
    if (setupPassword !== setupConfirm) { setSetupErr('Passwords do not match'); return; }
    if (setupPassword.length < 6) { setSetupErr('Password must be at least 6 characters'); return; }
    setSetupLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/setup-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: setupName, email: setupEmail, password: setupPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setSetupErr(data.message || 'Setup failed'); return; }
      setSetupDone(true);
      // Auto switch to login after 1.5s
      setTimeout(() => {
        setEmail(setupEmail);
        setTab('login');
      }, 1500);
    } catch {
      setSetupErr('Server unreachable');
    } finally {
      setSetupLoading(false);
    }
  };

  const Logo = () => (
    <>
      <div style={styles.loginLogo}>
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <path d="M18 2L32 10V26L18 34L4 26V10L18 2Z" stroke="#c8a96b" strokeWidth="1.5" fill="none"/>
          <path d="M18 8L26 13V23L18 28L10 23V13L18 8Z" fill="rgba(200,169,107,0.15)" stroke="#c8a96b" strokeWidth="1"/>
          <circle cx="18" cy="18" r="3" fill="#c8a96b"/>
        </svg>
        <span style={styles.loginBrand}>VELORA</span>
      </div>
      <p style={styles.loginSub}>Admin Console</p>
    </>
  );

  // Tab switcher
  const Tabs = () => (
    <div style={styles.tabSwitcher}>
      <button style={{...styles.tabBtn, ...(tab === 'login' ? styles.tabBtnActive : {})}} onClick={() => { setTab('login'); setErr(''); }}>
        Sign In
      </button>
      <button style={{...styles.tabBtn, ...(tab === 'setup' ? styles.tabBtnActive : {})}} onClick={() => { setTab('setup'); setSetupErr(''); }}>
        First Time Setup
      </button>
    </div>
  );

  return (
    <div style={styles.loginWrap}>
      <div style={styles.loginCard}>
        <Logo />
        <Tabs />

        {tab === 'login' ? (
          <>
            {err && <div style={styles.errBadge}>{err}</div>}
            <input style={styles.input} type="email" placeholder="Email" value={email}
              onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()}/>
            <input style={styles.input} type="password" placeholder="Password" value={password}
              onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()}/>
            <button style={styles.btnGold} onClick={handleLogin} disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </>
        ) : (
          <>
            {setupDone ? (
              <div style={{...styles.errBadge, background:'rgba(80,210,130,0.1)', border:'1px solid rgba(78,203,133,0.3)', color:'#4ecb85'}}>
                ✓ Admin account created! Redirecting to login…
              </div>
            ) : (
              <>
                {setupErr && <div style={styles.errBadge}>{setupErr}</div>}
                <p style={{color:'#555', fontSize:'0.78rem', marginBottom:'16px', textAlign:'center', lineHeight:1.6}}>
                  Create the first admin account.<br/>This option disappears once an admin exists.
                </p>
                <input style={styles.input} type="text" placeholder="Your Name" value={setupName}
                  onChange={(e) => setSetupName(e.target.value)}/>
                <input style={styles.input} type="email" placeholder="Admin Email" value={setupEmail}
                  onChange={(e) => setSetupEmail(e.target.value)}/>
                <input style={styles.input} type="password" placeholder="Password (min 6 chars)" value={setupPassword}
                  onChange={(e) => setSetupPassword(e.target.value)}/>
                <input style={styles.input} type="password" placeholder="Confirm Password" value={setupConfirm}
                  onChange={(e) => setSetupConfirm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSetup()}/>
                <button style={styles.btnGold} onClick={handleSetup} disabled={setupLoading}>
                  {setupLoading ? 'Creating…' : 'Create Admin Account'}
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Product Form Modal ─────────────────────────────────────────────────── */
function ProductModal({ product, onClose, onSave }) {
  const api = useApi();
  const fileRef = useRef();
  const [form, setForm] = useState({
    name: product?.name || '',
    price: product?.price || '',
    description: product?.description || '',
    category: product?.category || 'Women',
    subcategory: product?.subcategory || '',
    group: product?.group || '',
    featured: product?.featured || false,
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(product?.image ? `${API}${product.image}` : null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category) { setErr('Name, price & category required'); return; }
    setSaving(true);
    setErr('');
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append('image', file);

    try {
      let data;
      if (product) {
        data = await api.put(`/api/products/${product._id}`, fd);
      } else {
        data = await api.post('/api/products', fd);
      }
      if (data._id) { onSave(data); onClose(); }
      else setErr(data.message || 'Save failed');
    } catch {
      setErr('Server error');
    } finally {
      setSaving(false);
    }
  };

  const subs = SUBCATEGORIES[form.category] || [];
  const groups = GROUPS[form.subcategory] || [];

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>{product ? 'Edit Product' : 'New Product'}</h2>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {err && <div style={styles.errBadge}>{err}</div>}

        {/* Image upload */}
        <div style={styles.imgUploadArea} onClick={() => fileRef.current.click()}>
          {preview
            ? <img src={preview} alt="preview" style={styles.imgPreview}/>
            : <div style={styles.imgPlaceholder}><span style={{fontSize:'2rem'}}>📷</span><br/>Click to upload image</div>
          }
          <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={handleFile}/>
        </div>

        <div style={styles.formGrid}>
          <div style={styles.formCol}>
            <label style={styles.label}>Product Name</label>
            <input style={styles.input} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Midnight Rose Perfume"/>

            <label style={styles.label}>Price</label>
            <input style={styles.input} value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="e.g. PKR 2,500"/>

            <label style={styles.label}>Category</label>
            <select style={styles.input} value={form.category} onChange={(e) => { set('category', e.target.value); set('subcategory', ''); set('group', ''); }}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div style={styles.formCol}>
            {subs.length > 0 && (
              <>
                <label style={styles.label}>Subcategory</label>
                <select style={styles.input} value={form.subcategory} onChange={(e) => { set('subcategory', e.target.value); set('group', ''); }}>
                  <option value="">— None —</option>
                  {subs.map(s => <option key={s}>{s}</option>)}
                </select>
              </>
            )}

            {groups.length > 0 && (
              <>
                <label style={styles.label}>Group</label>
                <select style={styles.input} value={form.group} onChange={(e) => set('group', e.target.value)}>
                  <option value="">— None —</option>
                  {groups.map(g => <option key={g}>{g}</option>)}
                </select>
              </>
            )}

            <label style={styles.label}>Description</label>
            <textarea style={{...styles.input, height:'100px', resize:'vertical'}}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Product description…"
            />

            <label style={{...styles.label, display:'flex', alignItems:'center', gap:'10px', cursor:'pointer', marginTop:'8px'}}>
              <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} style={{accentColor:'#c8a96b', width:'16px', height:'16px'}}/>
              Featured on homepage
            </label>
          </div>
        </div>

        <div style={{display:'flex', gap:'12px', marginTop:'24px'}}>
          <button style={styles.btnGold} onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : product ? 'Save Changes' : 'Add Product'}
          </button>
          <button style={styles.btnGhost} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Products Tab ───────────────────────────────────────────────────────── */
function ProductsTab() {
  const api = useApi();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [deleting, setDeleting] = useState(null);

  const load = async () => {
    setLoading(true);
    const data = await api.get('/api/products');
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    setDeleting(id);
    await api.del(`/api/products/${id}`);
    setProducts((p) => p.filter((x) => x._id !== id));
    setDeleting(null);
  };

  const handleSave = (saved) => {
    setProducts((p) => {
      const idx = p.findIndex((x) => x._id === saved._id);
      if (idx >= 0) { const n = [...p]; n[idx] = saved; return n; }
      return [saved, ...p];
    });
  };

  const filtered = products
    .filter((p) => filterCat === 'All' || p.category === filterCat)
    .filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={styles.tabHeader}>
        <div style={styles.tabHeaderLeft}>
          <span style={styles.tabCount}>{filtered.length} products</span>
          <input style={{...styles.input, width:'220px', margin:0}} placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)}/>
          <select style={{...styles.input, width:'160px', margin:0}} value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
            <option>All</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <button style={styles.btnGold} onClick={() => { setEditing(null); setShowModal(true); }}>+ Add Product</button>
      </div>

      {loading ? (
        <div style={styles.emptyState}>Loading…</div>
      ) : filtered.length === 0 ? (
        <div style={styles.emptyState}>No products found</div>
      ) : (
        <div style={styles.productGrid}>
          {filtered.map((p) => (
            <div key={p._id} style={styles.productCard}>
              <div style={styles.productImgWrap}>
                {p.image
                  ? <img src={`${API}${p.image}`} alt={p.name} style={styles.productImg}/>
                  : <div style={styles.noImg}>No Image</div>
                }
                {p.featured && <span style={styles.featuredBadge}>★ Featured</span>}
              </div>
              <div style={styles.productInfo}>
                <p style={styles.productName}>{p.name}</p>
                <p style={styles.productPrice}>{p.price}</p>
                <p style={styles.productCat}>{[p.category, p.subcategory, p.group].filter(Boolean).join(' › ')}</p>
              </div>
              <div style={styles.productActions}>
                <button style={styles.btnEdit} onClick={() => { setEditing(p); setShowModal(true); }}>Edit</button>
                <button style={{...styles.btnDel, opacity: deleting === p._id ? 0.5 : 1}}
                  onClick={() => handleDelete(p._id)} disabled={deleting === p._id}>
                  {deleting === p._id ? '…' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <ProductModal
          product={editing}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

/* ─── Orders Tab ─────────────────────────────────────────────────────────── */
function OrdersTab() {
  const api = useApi();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const load = async () => {
    setLoading(true);
    const data = await api.get('/api/orders');
    setOrders(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleStatus = async (id, status) => {
    const updated = await api.patch(`/api/orders/${id}/status`, { status });
    setOrders((o) => o.map((x) => x._id === id ? updated : x));
  };

  const fmt = (iso) => new Date(iso).toLocaleDateString('en-PK', { day:'numeric', month:'short', year:'numeric' });

  return (
    <div>
      <div style={styles.tabHeader}>
        <span style={styles.tabCount}>{orders.length} orders</span>
      </div>

      {loading ? (
        <div style={styles.emptyState}>Loading…</div>
      ) : orders.length === 0 ? (
        <div style={styles.emptyState}>No orders yet</div>
      ) : (
        <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
          {orders.map((order) => {
            const sc = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
            const isOpen = expanded === order._id;
            return (
              <div key={order._id} style={styles.orderCard}>
                <div style={styles.orderRow} onClick={() => setExpanded(isOpen ? null : order._id)}>
                  <div>
                    <span style={styles.orderId}>#{order._id.slice(-8).toUpperCase()}</span>
                    <span style={styles.orderCustomer}>{order.user?.name || 'Unknown'} · {order.user?.email}</span>
                  </div>
                  <div style={styles.orderMeta}>
                    <span style={styles.orderDate}>{fmt(order.createdAt)}</span>
                    <span style={{...styles.statusBadge, background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`}}>
                      {order.status}
                    </span>
                    <select
                      style={styles.statusSelect}
                      value={order.status}
                      onChange={(e) => { e.stopPropagation(); handleStatus(order._id, e.target.value); }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {Object.keys(STATUS_COLORS).map(s => <option key={s}>{s}</option>)}
                    </select>
                    <span style={styles.orderChevron}>{isOpen ? '▲' : '▼'}</span>
                  </div>
                </div>

                {isOpen && (
                  <div style={styles.orderDetails}>
                    <div style={styles.orderItems}>
                      {order.items.map((item, i) => (
                        <div key={i} style={styles.orderItem}>
                          {item.image && <img src={`${API}${item.image}`} alt={item.name} style={styles.orderItemImg}/>}
                          <div>
                            <p style={{color:'#e8e0d5', fontWeight:500}}>{item.name}</p>
                            <p style={{color:'#c8a96b', fontSize:'0.85rem'}}>{item.price} × {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {order.shippingAddress && (
                      <div style={styles.shippingBox}>
                        <p style={{color:'#a0a0a0', fontSize:'0.78rem', marginBottom:'6px', letterSpacing:'0.1em'}}>SHIPPING</p>
                        <p style={{color:'#ccc'}}>{order.shippingAddress.fullName}</p>
                        <p style={{color:'#a0a0a0'}}>{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                        <p style={{color:'#a0a0a0'}}>{order.shippingAddress.phone}</p>
                      </div>
                    )}
                    <p style={{color:'#c8a96b', fontWeight:600, fontSize:'1rem', marginTop:'12px'}}>Total: {order.total}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Main Admin Component ───────────────────────────────────────────────── */
export default function Admin() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('adminUser')); } catch { return null; }
  });
  const [tab, setTab] = useState('products');

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setUser(null);
  };

  if (!user) return <LoginScreen onLogin={setUser}/>;

  return (
    <div style={styles.shell}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarLogo}>
          <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
            <path d="M18 2L32 10V26L18 34L4 26V10L18 2Z" stroke="#c8a96b" strokeWidth="1.5" fill="none"/>
            <circle cx="18" cy="18" r="4" fill="#c8a96b"/>
          </svg>
          <span style={{color:'#c8a96b', fontFamily:"'Cormorant Garamond', serif", fontSize:'1.2rem', letterSpacing:'0.15em'}}>AURUM</span>
        </div>
        <p style={{color:'#555', fontSize:'0.7rem', letterSpacing:'0.15em', marginBottom:'32px', paddingLeft:'4px'}}>ADMIN CONSOLE</p>

        {[
          { key:'products', icon:'⬡', label:'Products' },
          { key:'orders',   icon:'◈', label:'Orders' },
        ].map(({ key, icon, label }) => (
          <button key={key} style={{...styles.navItem, ...(tab === key ? styles.navItemActive : {})}}
            onClick={() => setTab(key)}>
            <span style={{fontSize:'1rem'}}>{icon}</span>
            {label}
          </button>
        ))}

        <div style={styles.sidebarBottom}>
          <div style={{color:'#666', fontSize:'0.8rem', marginBottom:'12px'}}>
            <p style={{color:'#a0a0a0'}}>{user.name}</p>
            <p style={{color:'#555', fontSize:'0.72rem'}}>{user.email}</p>
          </div>
          <button style={styles.btnGhost} onClick={logout}>Sign Out</button>
        </div>
      </aside>

      {/* Main */}
      <main style={styles.main}>
        <div style={styles.mainHeader}>
          <h1 style={styles.pageTitle}>
            {tab === 'products' ? 'Products' : 'Orders'}
          </h1>
        </div>
        <div style={styles.content}>
          {tab === 'products' ? <ProductsTab/> : <OrdersTab/>}
        </div>
      </main>
    </div>
  );
}

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const styles = {
  shell: {
    display:'flex', minHeight:'100vh',
    background:'#0a0a0a',
    fontFamily:"'Gill Sans', 'Optima', 'Segoe UI', sans-serif",
    color:'#e8e0d5',
  },
  sidebar: {
    width:'220px', minWidth:'220px',
    background:'#0f0f0f',
    borderRight:'1px solid rgba(200,169,107,0.1)',
    padding:'32px 20px',
    display:'flex', flexDirection:'column',
    position:'sticky', top:0, height:'100vh',
  },
  sidebarLogo: {
    display:'flex', alignItems:'center', gap:'10px',
    marginBottom:'6px',
  },
  navItem: {
    display:'flex', alignItems:'center', gap:'12px',
    width:'100%', padding:'12px 16px',
    background:'transparent', border:'none', cursor:'pointer',
    color:'#666', fontSize:'0.9rem', letterSpacing:'0.05em',
    borderRadius:'8px', transition:'all 0.2s', textAlign:'left',
    marginBottom:'4px',
  },
  navItemActive: {
    color:'#c8a96b',
    background:'rgba(200,169,107,0.08)',
    borderLeft:'2px solid #c8a96b',
  },
  sidebarBottom: {
    marginTop:'auto',
  },
  main: {
    flex:1, display:'flex', flexDirection:'column',
    minWidth:0,
  },
  mainHeader: {
    padding:'28px 36px 0',
    borderBottom:'1px solid rgba(200,169,107,0.08)',
    paddingBottom:'20px',
  },
  pageTitle: {
    fontFamily:"'Cormorant Garamond', serif",
    fontSize:'2rem', color:'#c8a96b', fontWeight:400, margin:0,
    letterSpacing:'0.05em',
  },
  content: {
    padding:'28px 36px',
    flex:1,
  },
  tabHeader: {
    display:'flex', alignItems:'center', justifyContent:'space-between',
    marginBottom:'24px', flexWrap:'wrap', gap:'12px',
  },
  tabHeaderLeft: {
    display:'flex', alignItems:'center', gap:'12px', flexWrap:'wrap',
  },
  tabCount: {
    color:'#555', fontSize:'0.85rem',
  },

  /* product grid */
  productGrid: {
    display:'grid',
    gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))',
    gap:'16px',
  },
  productCard: {
    background:'#111',
    border:'1px solid rgba(200,169,107,0.1)',
    borderRadius:'12px', overflow:'hidden',
    transition:'border-color 0.2s',
  },
  productImgWrap: { position:'relative' },
  productImg: { width:'100%', height:'160px', objectFit:'cover', display:'block' },
  noImg: {
    width:'100%', height:'160px', display:'flex', alignItems:'center', justifyContent:'center',
    background:'#1a1a1a', color:'#333', fontSize:'0.8rem',
  },
  featuredBadge: {
    position:'absolute', top:'8px', right:'8px',
    background:'rgba(200,169,107,0.9)', color:'#0a0a0a',
    fontSize:'0.65rem', fontWeight:600, padding:'3px 8px', borderRadius:'20px',
    letterSpacing:'0.05em',
  },
  productInfo: { padding:'12px 14px' },
  productName: { color:'#e8e0d5', fontWeight:500, fontSize:'0.9rem', marginBottom:'4px', margin:'0 0 4px' },
  productPrice: { color:'#c8a96b', fontSize:'0.85rem', margin:'0 0 4px' },
  productCat: { color:'#555', fontSize:'0.72rem', margin:0 },
  productActions: {
    display:'flex', gap:'8px', padding:'10px 14px',
    borderTop:'1px solid rgba(255,255,255,0.05)',
  },

  /* orders */
  orderCard: {
    background:'#111',
    border:'1px solid rgba(200,169,107,0.1)',
    borderRadius:'12px', overflow:'hidden',
  },
  orderRow: {
    display:'flex', justifyContent:'space-between', alignItems:'center',
    padding:'16px 20px', cursor:'pointer',
    transition:'background 0.15s',
  },
  orderId: {
    color:'#c8a96b', fontWeight:600, fontSize:'0.85rem',
    letterSpacing:'0.1em', display:'block', marginBottom:'4px',
  },
  orderCustomer: { color:'#888', fontSize:'0.82rem' },
  orderMeta: { display:'flex', alignItems:'center', gap:'12px', flexWrap:'wrap' },
  orderDate: { color:'#555', fontSize:'0.8rem' },
  statusBadge: {
    padding:'3px 10px', borderRadius:'20px',
    fontSize:'0.72rem', fontWeight:500, letterSpacing:'0.08em', textTransform:'uppercase',
  },
  statusSelect: {
    background:'#1a1a1a', border:'1px solid rgba(200,169,107,0.2)',
    color:'#c8a96b', padding:'4px 8px', borderRadius:'6px',
    fontSize:'0.78rem', cursor:'pointer',
  },
  orderChevron: { color:'#444', fontSize:'0.7rem' },
  orderDetails: {
    padding:'0 20px 20px',
    borderTop:'1px solid rgba(255,255,255,0.05)',
    paddingTop:'16px',
  },
  orderItems: { display:'flex', flexDirection:'column', gap:'10px', marginBottom:'16px' },
  orderItem: { display:'flex', alignItems:'center', gap:'12px' },
  orderItemImg: { width:'48px', height:'48px', objectFit:'cover', borderRadius:'6px', border:'1px solid rgba(200,169,107,0.15)' },
  shippingBox: {
    background:'rgba(255,255,255,0.02)', borderRadius:'8px',
    padding:'12px 14px', border:'1px solid rgba(255,255,255,0.05)',
  },

  /* modal */
  overlay: {
    position:'fixed', inset:0,
    background:'rgba(0,0,0,0.85)', backdropFilter:'blur(4px)',
    display:'flex', alignItems:'center', justifyContent:'center',
    zIndex:1000, padding:'20px',
  },
  modal: {
    background:'#111', border:'1px solid rgba(200,169,107,0.2)',
    borderRadius:'16px', padding:'32px',
    width:'100%', maxWidth:'760px', maxHeight:'90vh', overflowY:'auto',
  },
  modalHeader: {
    display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px',
  },
  modalTitle: {
    fontFamily:"'Cormorant Garamond', serif",
    fontSize:'1.6rem', color:'#c8a96b', fontWeight:400, margin:0,
  },
  closeBtn: {
    background:'none', border:'none', color:'#555', fontSize:'1.2rem',
    cursor:'pointer', padding:'4px 8px', lineHeight:1,
  },
  imgUploadArea: {
    border:'1px dashed rgba(200,169,107,0.3)',
    borderRadius:'12px', overflow:'hidden', cursor:'pointer',
    marginBottom:'24px', height:'200px',
    display:'flex', alignItems:'center', justifyContent:'center',
    background:'rgba(200,169,107,0.03)', transition:'border-color 0.2s',
  },
  imgPreview: { width:'100%', height:'100%', objectFit:'cover', display:'block' },
  imgPlaceholder: { color:'#555', textAlign:'center', lineHeight:2 },
  formGrid: {
    display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px',
  },
  formCol: { display:'flex', flexDirection:'column', gap:'0' },

  /* login */
  loginWrap: {
    minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
    background:'#0a0a0a',
  },
  loginCard: {
    width:'360px', background:'#111',
    border:'1px solid rgba(200,169,107,0.15)',
    borderRadius:'20px', padding:'44px 36px',
    display:'flex', flexDirection:'column', alignItems:'center',
  },
  loginLogo: {
    display:'flex', alignItems:'center', gap:'10px', marginBottom:'4px',
  },
  loginBrand: {
    fontFamily:"'Cormorant Garamond', serif",
    fontSize:'1.6rem', color:'#c8a96b', letterSpacing:'0.25em',
  },
  loginSub: {
    color:'#444', fontSize:'0.72rem', letterSpacing:'0.2em',
    textTransform:'uppercase', marginBottom:'32px',
  },

  /* shared inputs */
  input: {
    width:'100%', background:'rgba(255,255,255,0.03)',
    border:'1px solid rgba(200,169,107,0.15)', borderRadius:'8px',
    color:'#e8e0d5', padding:'11px 14px', fontSize:'0.88rem',
    outline:'none', boxSizing:'border-box',
    marginBottom:'14px', fontFamily:'inherit',
    transition:'border-color 0.2s',
  },
  label: { color:'#666', fontSize:'0.75rem', letterSpacing:'0.1em', marginBottom:'6px', display:'block' },

  /* buttons */
  btnGold: {
    background:'linear-gradient(135deg, #c8a96b 0%, #b8904a 100%)',
    color:'#0a0a0a', border:'none', borderRadius:'8px',
    padding:'11px 24px', cursor:'pointer', fontWeight:600,
    fontSize:'0.85rem', letterSpacing:'0.05em', fontFamily:'inherit',
    transition:'opacity 0.2s',
  },
  btnGhost: {
    background:'transparent',
    border:'1px solid rgba(200,169,107,0.25)', color:'#888',
    borderRadius:'8px', padding:'11px 24px', cursor:'pointer',
    fontSize:'0.85rem', fontFamily:'inherit', transition:'all 0.2s',
  },
  btnEdit: {
    flex:1, background:'rgba(200,169,107,0.1)',
    border:'1px solid rgba(200,169,107,0.2)', color:'#c8a96b',
    borderRadius:'6px', padding:'7px', cursor:'pointer',
    fontSize:'0.78rem', fontFamily:'inherit',
  },
  btnDel: {
    flex:1, background:'rgba(255,80,80,0.08)',
    border:'1px solid rgba(255,80,80,0.2)', color:'#ff6060',
    borderRadius:'6px', padding:'7px', cursor:'pointer',
    fontSize:'0.78rem', fontFamily:'inherit',
  },
  errBadge: {
    background:'rgba(255,80,80,0.1)', border:'1px solid rgba(255,80,80,0.3)',
    color:'#ff6060', borderRadius:'8px', padding:'10px 14px',
    fontSize:'0.82rem', marginBottom:'16px', width:'100%', boxSizing:'border-box',
  },
  tabSwitcher: {
    display:'flex', width:'100%',
    background:'rgba(255,255,255,0.03)',
    borderRadius:'8px', padding:'3px',
    marginBottom:'20px', gap:'3px',
  },
  tabBtn: {
    flex:1, padding:'8px', border:'none', borderRadius:'6px',
    background:'transparent', color:'#555', cursor:'pointer',
    fontSize:'0.78rem', letterSpacing:'0.05em', fontFamily:'inherit',
    transition:'all 0.2s',
  },
  tabBtnActive: {
    background:'rgba(200,169,107,0.15)',
    color:'#c8a96b',
  },
  emptyState: {
    textAlign:'center', padding:'60px', color:'#333', fontSize:'0.9rem',
  },
};