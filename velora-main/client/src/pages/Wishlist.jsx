import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import useAuthStore from '../store/authStore';
import useWishlistStore from '../store/wishlistStore';
import { useReviewAverages } from '../hooks/useProducts';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const Wishlist = () => {
  const { isAuthenticated, token } = useAuthStore();
  const { items, fetchWishlist } = useWishlistStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const averages = useReviewAverages(products);

  useEffect(() => {
    if (isAuthenticated) fetchWishlist();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!items.length) { setProducts([]); setLoading(false); return; }
    setLoading(true);
    Promise.all(
      items.map(id =>
        fetch(`${API}/api/products/${id}`).then(r => r.ok ? r.json() : null)
      )
    ).then(results => {
      setProducts(results.filter(Boolean));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [items]);

  if (!isAuthenticated) return (
    <div style={{ paddingTop: '140px', textAlign: 'center', color: '#666', minHeight: '100vh' }} className="container">
      <h1 className="section-title gold-text">My Wishlist</h1>
      <p style={{ marginTop: '2rem' }}>Please log in to view your wishlist.</p>
    </div>
  );

  return (
    <div style={{ paddingTop: '120px', minHeight: '100vh' }} className="container">
      <h1 className="section-title gold-text">My Wishlist</h1>
      {loading ? (
        <p style={{ textAlign: 'center', color: '#555', padding: '4rem' }}>Loading…</p>
      ) : products.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#555', padding: '4rem' }}>Your wishlist is empty. Browse products and tap the heart icon to save favorites.</p>
      ) : (
        <div className="product-grid">
          {products.map(p => <ProductCard key={p._id} product={p} avgRating={averages[p._id] || 0} />)}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
