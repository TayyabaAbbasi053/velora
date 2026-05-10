// src/pages/Admin.jsx
import { useState, useEffect, useRef } from 'react';
import { seedCatalog } from '../data/seedCatalog';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CATEGORIES   = ['Women', 'Men', 'Hair care', 'Baby care', 'Health And Skin Care'];
const SUBCATEGORIES = { Women: ['Fragrance', 'Makeup'], Men: ['Fragrance', 'Grooming'], 'Hair care': [], 'Baby care': [], 'Health And Skin Care': [] };
const GROUPS        = { Makeup: ['Eye', 'Face', 'Lip', 'Cheek'] };
const STATUS_COLORS = {
  pending:    { bg:'rgba(255,200,80,0.12)',  text:'#f5c842', border:'rgba(245,200,66,0.3)' },
  processing: { bg:'rgba(80,160,255,0.12)',  text:'#5ab0ff', border:'rgba(90,176,255,0.3)' },
  shipped:    { bg:'rgba(160,100,255,0.12)', text:'#b47cff', border:'rgba(180,124,255,0.3)' },
  delivered:  { bg:'rgba(80,210,130,0.12)',  text:'#4ecb85', border:'rgba(78,203,133,0.3)' },
  cancelled:  { bg:'rgba(255,80,80,0.12)',   text:'#ff6060', border:'rgba(255,96,96,0.3)'  },
};

function stockColor(s) {
  if (s === 0)   return { text:'#ff4444', bg:'rgba(255,68,68,0.12)',   border:'rgba(255,68,68,0.3)' };
  if (s < 10)    return { text:'#ff6060', bg:'rgba(255,96,96,0.12)',   border:'rgba(255,96,96,0.3)' };
  if (s < 25)    return { text:'#f5c842', bg:'rgba(245,200,66,0.12)',  border:'rgba(245,200,66,0.3)' };
  return           { text:'#4ecb85', bg:'rgba(78,203,133,0.12)',  border:'rgba(78,203,133,0.3)' };
}

/* ─── API hook ───────────────────────────────────────────────────────────── */
function useApi() {
  const token = localStorage.getItem('adminToken');
  const h = (extra = {}) => ({ Authorization: `Bearer ${token}`, ...extra });
  const get        = (url)        => fetch(`${API}${url}`, { headers: h() }).then(r => r.json());
  const del        = (url)        => fetch(`${API}${url}`, { method:'DELETE', headers: h() }).then(r => r.json());
  const patch      = (url, body)  => fetch(`${API}${url}`, { method:'PATCH',  headers: h({'Content-Type':'application/json'}), body: JSON.stringify(body) }).then(r => r.json());
  const post       = (url, fd)    => fetch(`${API}${url}`, { method:'POST',   headers: h(), body: fd }).then(r => r.json());
  const postJson   = (url, body)  => fetch(`${API}${url}`, { method:'POST',   headers: h({'Content-Type':'application/json'}), body: JSON.stringify(body) }).then(r => r.json());
  const put        = (url, fd)    => fetch(`${API}${url}`, { method:'PUT',    headers: h(), body: fd }).then(r => r.json());
  const patchStock = (id, stock)  => patch(`/api/products/${id}/stock`, { stock });
  return { get, del, patch, post, postJson, put, patchStock };
}

/* ─── Login ──────────────────────────────────────────────────────────────── */
function LoginScreen({ onLogin }) {
  const [tab, setTab]                   = useState('login');
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [err, setErr]                   = useState('');
  const [loading, setLoading]           = useState(false);
  const [setupName, setSetupName]       = useState('');
  const [setupEmail, setSetupEmail]     = useState('');
  const [setupPw, setSetupPw]           = useState('');
  const [setupCfm, setSetupCfm]         = useState('');
  const [setupErr, setSetupErr]         = useState('');
  const [setupLoading, setSetupLoading] = useState(false);
  const [setupDone, setSetupDone]       = useState(false);

  const handleLogin = async () => {
    setLoading(true); setErr('');
    try {
      const res  = await fetch(`${API}/api/auth/login`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (!res.ok)          { setErr(data.message || 'Login failed'); return; }
      if (!data.user.isAdmin) { setErr('Not an admin account'); return; }
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser',  JSON.stringify(data.user));
      onLogin(data.user);
    } catch { setErr('Server unreachable'); }
    finally  { setLoading(false); }
  };

  const handleSetup = async () => {
    setSetupErr('');
    if (!setupName || !setupEmail || !setupPw) { setSetupErr('All fields required'); return; }
    if (setupPw !== setupCfm)  { setSetupErr('Passwords do not match'); return; }
    if (setupPw.length < 6)    { setSetupErr('Password must be ≥ 6 characters'); return; }
    setSetupLoading(true);
    try {
      const res  = await fetch(`${API}/api/auth/setup-admin`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name: setupName, email: setupEmail, password: setupPw }) });
      const data = await res.json();
      if (!res.ok) { setSetupErr(data.message || 'Setup failed'); return; }
      setSetupDone(true);
      setTimeout(() => { setEmail(setupEmail); setTab('login'); }, 1500);
    } catch { setSetupErr('Server unreachable'); }
    finally  { setSetupLoading(false); }
  };

  return (
    <div style={s.loginWrap}>
      <div style={s.loginCard}>
        <VeloraLogo size="lg" />
        <p style={s.loginSub}>Admin Console</p>

        <div style={s.tabSwitcher}>
          {['login','setup'].map(t => (
            <button key={t} style={{...s.tabBtn, ...(tab===t ? s.tabBtnActive : {})}}
              onClick={() => { setTab(t); setErr(''); setSetupErr(''); }}>
              {t === 'login' ? 'Sign In' : 'First-Time Setup'}
            </button>
          ))}
        </div>

        {tab === 'login' ? (
          <>
            {err && <Err msg={err}/>}
            <input style={s.input} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key==='Enter' && handleLogin()}/>
            <input style={s.input} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key==='Enter' && handleLogin()}/>
            <button style={s.btnGold} onClick={handleLogin} disabled={loading}>{loading ? 'Signing in…' : 'Sign In'}</button>
          </>
        ) : setupDone ? (
          <div style={{...s.errBadge, background:'rgba(80,210,130,0.1)', border:'1px solid rgba(78,203,133,0.3)', color:'#4ecb85'}}>
            ✓ Admin account created — redirecting to login…
          </div>
        ) : (
          <>
            {setupErr && <Err msg={setupErr}/>}
            <p style={{color:'#555', fontSize:'0.78rem', textAlign:'center', lineHeight:1.7, marginBottom:'16px'}}>
              Create the first admin account.<br/>This option disappears once an admin exists.
            </p>
            <input style={s.input} type="text"     placeholder="Your Name"           value={setupName}  onChange={e => setSetupName(e.target.value)}/>
            <input style={s.input} type="email"    placeholder="Admin Email"          value={setupEmail} onChange={e => setSetupEmail(e.target.value)}/>
            <input style={s.input} type="password" placeholder="Password (min 6)"     value={setupPw}    onChange={e => setSetupPw(e.target.value)}/>
            <input style={s.input} type="password" placeholder="Confirm Password"     value={setupCfm}   onChange={e => setSetupCfm(e.target.value)} onKeyDown={e => e.key==='Enter' && handleSetup()}/>
            <button style={s.btnGold} onClick={handleSetup} disabled={setupLoading}>{setupLoading ? 'Creating…' : 'Create Admin Account'}</button>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Shared micro-components ────────────────────────────────────────────── */
const Err = ({ msg }) => <div style={s.errBadge}>{msg}</div>;

function VeloraLogo({ size = 'sm' }) {
  const big = size === 'lg';
  return (
    <div style={{ display:'flex', alignItems:'center', gap: big ? '12px' : '10px', marginBottom: big ? '4px' : 0 }}>
      <svg width={big?36:28} height={big?36:28} viewBox="0 0 36 36" fill="none">
        <path d="M18 2L32 10V26L18 34L4 26V10L18 2Z" stroke="#c8a96b" strokeWidth="1.5" fill="none"/>
        <path d="M18 8L26 13V23L18 28L10 23V13L18 8Z" fill="rgba(200,169,107,0.15)" stroke="#c8a96b" strokeWidth="1"/>
        <circle cx="18" cy="18" r="3" fill="#c8a96b"/>
      </svg>
      <span style={{ color:'#c8a96b', fontFamily:"'Cormorant Garamond', serif", fontSize: big ? '1.7rem' : '1.2rem', letterSpacing:'0.2em' }}>VELORA</span>
    </div>
  );
}

/* ─── Dashboard Tab ──────────────────────────────────────────────────────── */
function DashboardTab() {
  const api = useApi();
  const [data, setData]     = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/api/products/stats'), api.get('/api/orders')]).then(([stats, ords]) => {
      setData(stats);
      setOrders(Array.isArray(ords) ? ords.slice(0, 6) : []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={s.emptyState}>Loading…</div>;

  const statCards = [
    { label:'Total Products', value: data?.total ?? 0,      icon:'⬡', color:'#c8a96b' },
    { label:'Low Stock',      value: data?.lowStock ?? 0,   icon:'◈', color:'#f5c842' },
    { label:'Out of Stock',   value: data?.outOfStock ?? 0, icon:'◇', color:'#ff6060' },
    { label:'Total Orders',   value: orders.length,          icon:'◉', color:'#5ab0ff' },
  ];

  const fmt = iso => new Date(iso).toLocaleDateString('en-US', { day:'numeric', month:'short' });

  return (
    <div>
      {/* Stat cards */}
      <div style={s.statGrid}>
        {statCards.map(c => (
          <div key={c.label} style={s.statCard}>
            <span style={{ fontSize:'1.6rem', color: c.color, opacity:0.7 }}>{c.icon}</span>
            <p style={{ fontSize:'2.4rem', fontWeight:700, color: c.color, margin:'8px 0 4px', fontFamily:"'Cormorant Garamond', serif" }}>{c.value}</p>
            <p style={{ color:'#555', fontSize:'0.78rem', letterSpacing:'0.08em', textTransform:'uppercase' }}>{c.label}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <h2 style={{ ...s.sectionTitle, marginTop:'36px' }}>Recent Orders</h2>
      {orders.length === 0 ? (
        <div style={s.emptyState}>No orders yet</div>
      ) : (
        <div style={s.recentTable}>
          <div style={s.tableHead}>
            {['Order ID','Customer','Date','Status','Total'].map(h => (
              <span key={h} style={s.tableHeadCell}>{h}</span>
            ))}
          </div>
          {orders.map(o => {
            const sc = STATUS_COLORS[o.status] || STATUS_COLORS.pending;
            return (
              <div key={o._id} style={s.tableRow}>
                <span style={{ color:'#c8a96b', fontWeight:600, fontSize:'0.82rem', letterSpacing:'0.08em' }}>
                  #{o._id.slice(-8).toUpperCase()}
                </span>
                <span style={{ color:'#aaa', fontSize:'0.85rem' }}>{o.user?.name || '—'}</span>
                <span style={{ color:'#555', fontSize:'0.82rem' }}>{fmt(o.createdAt)}</span>
                <span style={{ ...s.statusBadge, background: sc.bg, color: sc.text, border:`1px solid ${sc.border}` }}>
                  {o.status}
                </span>
                <span style={{ color:'#e8e0d5', fontWeight:500 }}>{o.total}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Product Modal (Add / Edit) ─────────────────────────────────────────── */
function ProductModal({ product, onClose, onSave }) {
  const api     = useApi();
  const fileRef = useRef();
  const [form, setForm] = useState({
    name:        product?.name        || '',
    price:       product?.price       || '',
    description: product?.description || '',
    category:    product?.category    || 'Women',
    subcategory: product?.subcategory || '',
    group:       product?.group       || '',
    featured:    product?.featured    || false,
    stock:       product?.stock       ?? 100,
  });
  const [file,    setFile]    = useState(null);
  const [preview, setPreview] = useState(product?.image ? `${API}${product.image}` : null);
  const [saving,  setSaving]  = useState(false);
  const [err,     setErr]     = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleFile = e => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category) { setErr('Name, price & category are required'); return; }
    setSaving(true); setErr('');
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append('image', file);
    try {
      const data = product
        ? await api.put(`/api/products/${product._id}`, fd)
        : await api.post('/api/products', fd);
      if (data._id) { onSave(data); onClose(); }
      else setErr(data.message || 'Save failed');
    } catch { setErr('Server error'); }
    finally  { setSaving(false); }
  };

  const subs   = SUBCATEGORIES[form.category] || [];
  const groups = GROUPS[form.subcategory]     || [];

  return (
    <div style={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={s.modal}>
        <div style={s.modalHeader}>
          <h2 style={s.modalTitle}>{product ? 'Edit Product' : 'New Product'}</h2>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>

        {err && <Err msg={err}/>}

        {/* Image upload */}
        <div style={s.imgUploadArea} onClick={() => fileRef.current.click()}>
          {preview
            ? <img src={preview} alt="preview" style={s.imgPreview}/>
            : <div style={s.imgPlaceholder}><span style={{fontSize:'2rem'}}>📷</span><br/>Click to upload image</div>
          }
          <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={handleFile}/>
        </div>

        <div style={s.formGrid}>
          <div style={s.formCol}>
            <label style={s.label}>Product Name</label>
            <input style={s.input} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Obsidian Rose EDP"/>

            <label style={s.label}>Price</label>
            <input style={s.input} value={form.price} onChange={e => set('price', e.target.value)} placeholder="e.g. $210"/>

            <label style={s.label}>Stock Units</label>
            <input style={s.input} type="number" min="0" value={form.stock}
              onChange={e => set('stock', Math.max(0, parseInt(e.target.value) || 0))}/>

            <label style={s.label}>Category</label>
            <select style={s.input} value={form.category}
              onChange={e => { set('category', e.target.value); set('subcategory',''); set('group',''); }}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div style={s.formCol}>
            {subs.length > 0 && (
              <>
                <label style={s.label}>Subcategory</label>
                <select style={s.input} value={form.subcategory}
                  onChange={e => { set('subcategory', e.target.value); set('group',''); }}>
                  <option value="">— None —</option>
                  {subs.map(sub => <option key={sub}>{sub}</option>)}
                </select>
              </>
            )}
            {groups.length > 0 && (
              <>
                <label style={s.label}>Group</label>
                <select style={s.input} value={form.group} onChange={e => set('group', e.target.value)}>
                  <option value="">— None —</option>
                  {groups.map(g => <option key={g}>{g}</option>)}
                </select>
              </>
            )}
            <label style={s.label}>Description</label>
            <textarea style={{...s.input, height:'130px', resize:'vertical'}}
              value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="Product description…"/>
            <label style={{...s.label, display:'flex', alignItems:'center', gap:'10px', cursor:'pointer', marginTop:'8px'}}>
              <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)}
                style={{accentColor:'#c8a96b', width:'16px', height:'16px'}}/>
              Featured on homepage
            </label>
          </div>
        </div>

        <div style={{display:'flex', gap:'12px', marginTop:'24px'}}>
          <button style={s.btnGold}  onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : product ? 'Save Changes' : 'Add Product'}</button>
          <button style={s.btnGhost} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Products Tab ───────────────────────────────────────────────────────── */
function ProductsTab() {
  const api = useApi();
  const [products,   setProducts]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [showModal,  setShowModal]  = useState(false);
  const [editing,    setEditing]    = useState(null);
  const [search,     setSearch]     = useState('');
  const [filterCat,  setFilterCat]  = useState('All');
  const [deleting,   setDeleting]   = useState(null);
  const [stockEdits, setStockEdits] = useState({});  // { id: value }
  const [seeding,    setSeeding]    = useState(false);
  const [seedMsg,    setSeedMsg]    = useState('');

  const load = async () => {
    setLoading(true);
    const data = await api.get('/api/products');
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handleDelete = async id => {
    if (!window.confirm('Delete this product permanently?')) return;
    setDeleting(id);
    await api.del(`/api/products/${id}`);
    setProducts(p => p.filter(x => x._id !== id));
    setDeleting(null);
  };

  const handleSave = saved => {
    setProducts(p => {
      const idx = p.findIndex(x => x._id === saved._id);
      if (idx >= 0) { const n = [...p]; n[idx] = saved; return n; }
      return [saved, ...p];
    });
  };

  const handleStockEdit = (id, val) => {
    setStockEdits(e => ({ ...e, [id]: val }));
  };

  const commitStock = async id => {
    const raw = stockEdits[id];
    if (raw === undefined || raw === '') return;
    const stock = Math.max(0, parseInt(raw) || 0);
    const updated = await api.patchStock(id, stock);
    if (updated._id) {
      setProducts(p => p.map(x => x._id === id ? updated : x));
      setStockEdits(e => { const n = {...e}; delete n[id]; return n; });
    }
  };

  const adjustStock = async (id, delta) => {
    const current = products.find(p => p._id === id)?.stock ?? 0;
    const next = Math.max(0, current + delta);
    const updated = await api.patchStock(id, next);
    if (updated._id) setProducts(p => p.map(x => x._id === id ? updated : x));
  };

  const handleSeed = async () => {
    if (!window.confirm(`Import ${seedCatalog.length} catalog products into the database?\n\nExisting products with the same name will be skipped.`)) return;
    setSeeding(true); setSeedMsg('');
    try {
      const res = await api.postJson('/api/products/seed-bulk', seedCatalog);
      setSeedMsg(`✓ ${res.created} added, ${res.skipped} already existed.`);
      load();
    } catch { setSeedMsg('✗ Seed failed — check server connection.'); }
    finally  { setSeeding(false); }
  };

  const filtered = products
    .filter(p => filterCat === 'All' || p.category === filterCat)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      {/* Toolbar */}
      <div style={s.tabHeader}>
        <div style={s.tabHeaderLeft}>
          <span style={s.tabCount}>{filtered.length} of {products.length} products</span>
          <input style={{...s.input, width:'220px', margin:0}} placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)}/>
          <select style={{...s.input, width:'170px', margin:0}} value={filterCat} onChange={e => setFilterCat(e.target.value)}>
            <option>All</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div style={{display:'flex', gap:'10px', alignItems:'center', flexWrap:'wrap'}}>
          {seedMsg && <span style={{fontSize:'0.78rem', color: seedMsg.startsWith('✓') ? '#4ecb85' : '#ff6060'}}>{seedMsg}</span>}
          <button style={s.btnSeed} onClick={handleSeed} disabled={seeding}>
            {seeding ? 'Seeding…' : '⬇ Seed Catalog'}
          </button>
          <button style={s.btnGold} onClick={() => { setEditing(null); setShowModal(true); }}>+ Add Product</button>
        </div>
      </div>

      {loading ? (
        <div style={s.emptyState}>Loading…</div>
      ) : filtered.length === 0 ? (
        <div style={s.emptyState}>No products found. Try seeding the catalog or adding one manually.</div>
      ) : (
        <div style={s.productGrid}>
          {filtered.map(p => {
            const sc    = stockColor(p.stock ?? 0);
            const editVal = stockEdits[p._id];
            const isDirty = editVal !== undefined;
            return (
              <div key={p._id} style={s.productCard}>
                {/* Image */}
                <div style={s.productImgWrap}>
                  {p.image
                    ? <img src={`${API}${p.image}`} alt={p.name} style={s.productImg}/>
                    : <div style={s.noImg}>No Image</div>
                  }
                  {p.featured && <span style={s.featuredBadge}>★ Featured</span>}
                  {/* Stock badge */}
                  <span style={{...s.stockBadge, background: sc.bg, color: sc.text, border:`1px solid ${sc.border}`}}>
                    {p.stock === 0 ? 'OUT OF STOCK' : p.stock < 10 ? `LOW: ${p.stock}` : p.stock < 25 ? `${p.stock} left` : `${p.stock} in stock`}
                  </span>
                </div>

                {/* Info */}
                <div style={s.productInfo}>
                  <p style={s.productName}>{p.name}</p>
                  <p style={s.productPrice}>{p.price}</p>
                  <p style={s.productCat}>{[p.category, p.subcategory, p.group].filter(Boolean).join(' › ')}</p>
                </div>

                {/* Stock editor */}
                <div style={s.stockRow}>
                  <button style={s.stockBtn} onClick={() => adjustStock(p._id, -1)}>−</button>
                  <input
                    style={s.stockInput}
                    type="number" min="0"
                    value={isDirty ? editVal : (p.stock ?? 0)}
                    onChange={e => handleStockEdit(p._id, e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && commitStock(p._id)}
                  />
                  <button style={s.stockBtn} onClick={() => adjustStock(p._id, +1)}>+</button>
                  {isDirty && (
                    <button style={s.stockSave} onClick={() => commitStock(p._id)}>✓</button>
                  )}
                </div>

                {/* Actions */}
                <div style={s.productActions}>
                  <button style={s.btnEdit} onClick={() => { setEditing(p); setShowModal(true); }}>Edit</button>
                  <button style={{...s.btnDel, opacity: deleting===p._id ? 0.5 : 1}}
                    onClick={() => handleDelete(p._id)} disabled={deleting===p._id}>
                    {deleting===p._id ? '…' : 'Delete'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <ProductModal product={editing} onClose={() => setShowModal(false)} onSave={handleSave}/>
      )}
    </div>
  );
}

/* ─── Orders Tab ─────────────────────────────────────────────────────────── */
function OrdersTab() {
  const api = useApi();
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
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
    setOrders(o => o.map(x => x._id === id ? updated : x));
  };

  const fmt = iso => new Date(iso).toLocaleDateString('en-US', { day:'numeric', month:'short', year:'numeric' });

  return (
    <div>
      <div style={s.tabHeader}>
        <span style={s.tabCount}>{orders.length} orders</span>
      </div>

      {loading ? (
        <div style={s.emptyState}>Loading…</div>
      ) : orders.length === 0 ? (
        <div style={s.emptyState}>No orders yet</div>
      ) : (
        <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
          {orders.map(order => {
            const sc     = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
            const isOpen = expanded === order._id;
            return (
              <div key={order._id} style={s.orderCard}>
                <div style={s.orderRow} onClick={() => setExpanded(isOpen ? null : order._id)}>
                  <div>
                    <span style={s.orderId}>#{order._id.slice(-8).toUpperCase()}</span>
                    <span style={s.orderCustomer}>{order.user?.name || 'Unknown'} · {order.user?.email}</span>
                  </div>
                  <div style={s.orderMeta}>
                    <span style={s.orderDate}>{fmt(order.createdAt)}</span>
                    <span style={{...s.statusBadge, background: sc.bg, color: sc.text, border:`1px solid ${sc.border}`}}>
                      {order.status}
                    </span>
                    <select style={s.statusSelect} value={order.status}
                      onChange={e => { e.stopPropagation(); handleStatus(order._id, e.target.value); }}
                      onClick={e => e.stopPropagation()}>
                      {Object.keys(STATUS_COLORS).map(st => <option key={st}>{st}</option>)}
                    </select>
                    <span style={s.orderChevron}>{isOpen ? '▲' : '▼'}</span>
                  </div>
                </div>

                {isOpen && (
                  <div style={s.orderDetails}>
                    <div style={s.orderItems}>
                      {order.items?.map((item, i) => (
                        <div key={i} style={s.orderItem}>
                          {item.image && <img src={`${API}${item.image}`} alt={item.name} style={s.orderItemImg}/>}
                          <div>
                            <p style={{color:'#e8e0d5', fontWeight:500, margin:0}}>{item.name}</p>
                            <p style={{color:'#c8a96b', fontSize:'0.85rem', margin:'2px 0 0'}}>{item.price} × {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {order.shippingAddress && (
                      <div style={s.shippingBox}>
                        <p style={{color:'#a0a0a0', fontSize:'0.75rem', marginBottom:'6px', letterSpacing:'0.1em'}}>SHIPPING TO</p>
                        <p style={{color:'#ccc', margin:0}}>{order.shippingAddress.fullName}</p>
                        <p style={{color:'#a0a0a0', margin:'2px 0 0'}}>{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                        <p style={{color:'#a0a0a0', margin:'2px 0 0'}}>{order.shippingAddress.phone}</p>
                      </div>
                    )}
                    <p style={{color:'#c8a96b', fontWeight:600, fontSize:'1rem', marginTop:'14px'}}>Total: {order.total}</p>
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

/* ─── Main Admin Shell ───────────────────────────────────────────────────── */
export default function Admin() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('adminUser')); } catch { return null; }
  });
  const [tab, setTab] = useState('dashboard');

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setUser(null);
  };

  if (!user) return <LoginScreen onLogin={setUser}/>;

  const navItems = [
    { key:'dashboard', icon:'◈', label:'Dashboard' },
    { key:'products',  icon:'⬡', label:'Products'  },
    { key:'orders',    icon:'◉', label:'Orders'    },
  ];

  const pageTitles = { dashboard:'Dashboard', products:'Products', orders:'Orders' };

  return (
    <div style={s.shell}>
      {/* Sidebar */}
      <aside style={s.sidebar}>
        <VeloraLogo size="sm"/>
        <p style={{color:'#333', fontSize:'0.68rem', letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:'32px', marginTop:'4px', paddingLeft:'2px'}}>
          ADMIN CONSOLE
        </p>

        {navItems.map(({ key, icon, label }) => (
          <button key={key} style={{...s.navItem, ...(tab===key ? s.navItemActive : {})}} onClick={() => setTab(key)}>
            <span style={{fontSize:'1rem'}}>{icon}</span>
            {label}
          </button>
        ))}

        <div style={s.sidebarBottom}>
          <div style={{marginBottom:'14px'}}>
            <p style={{color:'#a0a0a0', fontSize:'0.85rem', margin:0}}>{user.name}</p>
            <p style={{color:'#444', fontSize:'0.72rem', margin:'3px 0 0'}}>{user.email}</p>
          </div>
          <button style={s.btnGhost} onClick={logout}>Sign Out</button>
        </div>
      </aside>

      {/* Main */}
      <main style={s.main}>
        <div style={s.mainHeader}>
          <h1 style={s.pageTitle}>{pageTitles[tab]}</h1>
        </div>
        <div style={s.content}>
          {tab === 'dashboard' && <DashboardTab/>}
          {tab === 'products'  && <ProductsTab/>}
          {tab === 'orders'    && <OrdersTab/>}
        </div>
      </main>
    </div>
  );
}

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const s = {
  shell: { display:'flex', minHeight:'100vh', background:'#0a0a0a', fontFamily:"'Gill Sans','Optima','Segoe UI',sans-serif", color:'#e8e0d5' },
  sidebar: { width:'220px', minWidth:'220px', background:'#0d0d0d', borderRight:'1px solid rgba(200,169,107,0.08)', padding:'32px 20px', display:'flex', flexDirection:'column', position:'sticky', top:0, height:'100vh' },
  navItem: { display:'flex', alignItems:'center', gap:'12px', width:'100%', padding:'12px 16px', background:'transparent', border:'none', cursor:'pointer', color:'#555', fontSize:'0.88rem', letterSpacing:'0.04em', borderRadius:'8px', transition:'all 0.2s', textAlign:'left', marginBottom:'4px', fontFamily:'inherit' },
  navItemActive: { color:'#c8a96b', background:'rgba(200,169,107,0.08)', borderLeft:'2px solid #c8a96b' },
  sidebarBottom: { marginTop:'auto' },
  main: { flex:1, display:'flex', flexDirection:'column', minWidth:0 },
  mainHeader: { padding:'28px 36px 20px', borderBottom:'1px solid rgba(200,169,107,0.07)' },
  pageTitle: { fontFamily:"'Cormorant Garamond',serif", fontSize:'2rem', color:'#c8a96b', fontWeight:400, margin:0, letterSpacing:'0.05em' },
  content: { padding:'28px 36px', flex:1 },

  // Dashboard
  statGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(180px,1fr))', gap:'16px' },
  statCard: { background:'#111', border:'1px solid rgba(200,169,107,0.1)', borderRadius:'14px', padding:'24px 20px', display:'flex', flexDirection:'column', alignItems:'flex-start' },
  sectionTitle: { fontFamily:"'Cormorant Garamond',serif", fontSize:'1.3rem', color:'#c8a96b', fontWeight:400, margin:'0 0 16px' },
  recentTable: { background:'#111', border:'1px solid rgba(200,169,107,0.08)', borderRadius:'12px', overflow:'hidden' },
  tableHead: { display:'grid', gridTemplateColumns:'1fr 1fr 100px 120px 100px', gap:'16px', padding:'12px 20px', borderBottom:'1px solid rgba(255,255,255,0.05)', background:'rgba(255,255,255,0.02)' },
  tableHeadCell: { color:'#444', fontSize:'0.7rem', letterSpacing:'0.12em', textTransform:'uppercase' },
  tableRow: { display:'grid', gridTemplateColumns:'1fr 1fr 100px 120px 100px', gap:'16px', padding:'14px 20px', borderBottom:'1px solid rgba(255,255,255,0.03)', alignItems:'center' },

  // Products
  tabHeader: { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px', flexWrap:'wrap', gap:'12px' },
  tabHeaderLeft: { display:'flex', alignItems:'center', gap:'12px', flexWrap:'wrap' },
  tabCount: { color:'#444', fontSize:'0.85rem' },
  productGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(210px,1fr))', gap:'16px' },
  productCard: { background:'#111', border:'1px solid rgba(200,169,107,0.08)', borderRadius:'12px', overflow:'hidden', transition:'border-color 0.2s' },
  productImgWrap: { position:'relative' },
  productImg: { width:'100%', height:'160px', objectFit:'cover', display:'block' },
  noImg: { width:'100%', height:'160px', display:'flex', alignItems:'center', justifyContent:'center', background:'#1a1a1a', color:'#2a2a2a', fontSize:'0.8rem' },
  featuredBadge: { position:'absolute', top:'8px', right:'8px', background:'rgba(200,169,107,0.9)', color:'#0a0a0a', fontSize:'0.62rem', fontWeight:600, padding:'3px 8px', borderRadius:'20px', letterSpacing:'0.05em' },
  stockBadge: { position:'absolute', bottom:'8px', left:'8px', fontSize:'0.6rem', fontWeight:600, padding:'3px 8px', borderRadius:'20px', letterSpacing:'0.07em', textTransform:'uppercase' },
  productInfo: { padding:'12px 14px 8px' },
  productName: { color:'#e8e0d5', fontWeight:500, fontSize:'0.88rem', margin:'0 0 4px' },
  productPrice: { color:'#c8a96b', fontSize:'0.85rem', margin:'0 0 3px' },
  productCat: { color:'#444', fontSize:'0.7rem', margin:0 },

  // Stock controls
  stockRow: { display:'flex', alignItems:'center', gap:'6px', padding:'8px 14px', borderTop:'1px solid rgba(255,255,255,0.04)' },
  stockBtn: { width:'28px', height:'28px', background:'rgba(200,169,107,0.08)', border:'1px solid rgba(200,169,107,0.15)', color:'#c8a96b', borderRadius:'6px', cursor:'pointer', fontSize:'1rem', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'inherit', padding:0 },
  stockInput: { flex:1, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(200,169,107,0.1)', borderRadius:'6px', color:'#e8e0d5', padding:'5px 8px', fontSize:'0.82rem', textAlign:'center', outline:'none', fontFamily:'inherit' },
  stockSave: { width:'28px', height:'28px', background:'rgba(78,203,133,0.15)', border:'1px solid rgba(78,203,133,0.3)', color:'#4ecb85', borderRadius:'6px', cursor:'pointer', fontSize:'0.85rem', fontFamily:'inherit', padding:0 },
  productActions: { display:'flex', gap:'8px', padding:'10px 14px', borderTop:'1px solid rgba(255,255,255,0.04)' },

  // Orders
  orderCard: { background:'#111', border:'1px solid rgba(200,169,107,0.08)', borderRadius:'12px', overflow:'hidden' },
  orderRow: { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 20px', cursor:'pointer' },
  orderId: { color:'#c8a96b', fontWeight:600, fontSize:'0.82rem', letterSpacing:'0.1em', display:'block', marginBottom:'4px' },
  orderCustomer: { color:'#777', fontSize:'0.82rem' },
  orderMeta: { display:'flex', alignItems:'center', gap:'12px', flexWrap:'wrap' },
  orderDate: { color:'#444', fontSize:'0.8rem' },
  statusBadge: { padding:'3px 10px', borderRadius:'20px', fontSize:'0.7rem', fontWeight:500, letterSpacing:'0.08em', textTransform:'uppercase' },
  statusSelect: { background:'#1a1a1a', border:'1px solid rgba(200,169,107,0.15)', color:'#c8a96b', padding:'4px 8px', borderRadius:'6px', fontSize:'0.78rem', cursor:'pointer' },
  orderChevron: { color:'#333', fontSize:'0.7rem' },
  orderDetails: { padding:'16px 20px 20px', borderTop:'1px solid rgba(255,255,255,0.04)' },
  orderItems: { display:'flex', flexDirection:'column', gap:'10px', marginBottom:'16px' },
  orderItem: { display:'flex', alignItems:'center', gap:'12px' },
  orderItemImg: { width:'48px', height:'48px', objectFit:'cover', borderRadius:'6px', border:'1px solid rgba(200,169,107,0.12)' },
  shippingBox: { background:'rgba(255,255,255,0.02)', borderRadius:'8px', padding:'12px 14px', border:'1px solid rgba(255,255,255,0.04)' },

  // Modal
  overlay: { position:'fixed', inset:0, background:'rgba(0,0,0,0.88)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:'20px' },
  modal: { background:'#111', border:'1px solid rgba(200,169,107,0.18)', borderRadius:'16px', padding:'32px', width:'100%', maxWidth:'760px', maxHeight:'90vh', overflowY:'auto' },
  modalHeader: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' },
  modalTitle: { fontFamily:"'Cormorant Garamond',serif", fontSize:'1.6rem', color:'#c8a96b', fontWeight:400, margin:0 },
  closeBtn: { background:'none', border:'none', color:'#444', fontSize:'1.2rem', cursor:'pointer', padding:'4px 8px', lineHeight:1 },
  imgUploadArea: { border:'1px dashed rgba(200,169,107,0.25)', borderRadius:'12px', overflow:'hidden', cursor:'pointer', marginBottom:'24px', height:'190px', display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(200,169,107,0.02)' },
  imgPreview: { width:'100%', height:'100%', objectFit:'cover', display:'block' },
  imgPlaceholder: { color:'#444', textAlign:'center', lineHeight:2.5 },
  formGrid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px' },
  formCol: { display:'flex', flexDirection:'column' },

  // Login
  loginWrap: { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0a0a0a' },
  loginCard: { width:'360px', background:'#111', border:'1px solid rgba(200,169,107,0.12)', borderRadius:'20px', padding:'44px 36px', display:'flex', flexDirection:'column', alignItems:'center' },
  loginSub: { color:'#333', fontSize:'0.7rem', letterSpacing:'0.25em', textTransform:'uppercase', marginBottom:'32px' },
  tabSwitcher: { display:'flex', width:'100%', background:'rgba(255,255,255,0.03)', borderRadius:'8px', padding:'3px', marginBottom:'20px', gap:'3px' },
  tabBtn: { flex:1, padding:'8px', border:'none', borderRadius:'6px', background:'transparent', color:'#444', cursor:'pointer', fontSize:'0.78rem', letterSpacing:'0.04em', fontFamily:'inherit', transition:'all 0.2s' },
  tabBtnActive: { background:'rgba(200,169,107,0.12)', color:'#c8a96b' },

  // Shared inputs & buttons
  input: { width:'100%', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(200,169,107,0.12)', borderRadius:'8px', color:'#e8e0d5', padding:'11px 14px', fontSize:'0.88rem', outline:'none', boxSizing:'border-box', marginBottom:'14px', fontFamily:'inherit' },
  label: { color:'#555', fontSize:'0.72rem', letterSpacing:'0.1em', marginBottom:'6px', display:'block' },
  btnGold: { background:'linear-gradient(135deg,#c8a96b 0%,#b8904a 100%)', color:'#0a0a0a', border:'none', borderRadius:'8px', padding:'11px 24px', cursor:'pointer', fontWeight:600, fontSize:'0.85rem', letterSpacing:'0.05em', fontFamily:'inherit', transition:'opacity 0.2s' },
  btnGhost: { background:'transparent', border:'1px solid rgba(200,169,107,0.2)', color:'#666', borderRadius:'8px', padding:'11px 24px', cursor:'pointer', fontSize:'0.85rem', fontFamily:'inherit', transition:'all 0.2s' },
  btnSeed: { background:'rgba(200,169,107,0.1)', border:'1px solid rgba(200,169,107,0.25)', color:'#c8a96b', borderRadius:'8px', padding:'11px 20px', cursor:'pointer', fontSize:'0.82rem', fontFamily:'inherit', transition:'all 0.2s', letterSpacing:'0.03em' },
  btnEdit: { flex:1, background:'rgba(200,169,107,0.07)', border:'1px solid rgba(200,169,107,0.15)', color:'#c8a96b', borderRadius:'6px', padding:'7px', cursor:'pointer', fontSize:'0.78rem', fontFamily:'inherit' },
  btnDel:  { flex:1, background:'rgba(255,80,80,0.07)',   border:'1px solid rgba(255,80,80,0.15)',   color:'#ff6060', borderRadius:'6px', padding:'7px', cursor:'pointer', fontSize:'0.78rem', fontFamily:'inherit' },
  errBadge: { background:'rgba(255,80,80,0.08)', border:'1px solid rgba(255,80,80,0.25)', color:'#ff6060', borderRadius:'8px', padding:'10px 14px', fontSize:'0.82rem', marginBottom:'16px', width:'100%', boxSizing:'border-box' },
  emptyState: { textAlign:'center', padding:'60px', color:'#2a2a2a', fontSize:'0.9rem' },
};
