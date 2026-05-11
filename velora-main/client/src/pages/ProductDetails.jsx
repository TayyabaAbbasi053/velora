import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import useWishlistStore from '../store/wishlistStore';
import StarRating from '../components/StarRating';
import { imgUrl } from '../hooks/useProducts';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const ProductDetails = () => {
  const { productId } = useParams();
  const addItem = useCartStore(state => state.addItem);
  const { isAuthenticated, getAuthHeader } = useAuthStore();
  const { isInWishlist, toggle } = useWishlistStore();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added,   setAdded]   = useState(false);

  // Reviews state
  const [reviews, setReviews]     = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError]     = useState('');
  const [submitting, setSubmitting]       = useState(false);

  useEffect(() => {
    fetch(`${API}/api/products/${productId}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { setProduct(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [productId]);

  // Fetch reviews
  useEffect(() => {
    fetch(`${API}/api/reviews/${productId}`)
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        setReviews(data);
        if (data.length) {
          const avg = data.reduce((s, r) => s + r.rating, 0) / data.length;
          setAvgRating(Math.round(avg * 10) / 10);
        }
      })
      .catch(() => {});
  }, [productId]);

  const handleAddToCart = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewRating) { setReviewError('Please select a rating'); return; }
    if (!reviewComment.trim()) { setReviewError('Please write a comment'); return; }
    setSubmitting(true);
    setReviewError('');
    try {
      const res = await fetch(`${API}/api/reviews/${productId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ rating: reviewRating, comment: reviewComment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setReviews(prev => [data, ...prev]);
      const newAll = [data, ...reviews];
      setAvgRating(Math.round(newAll.reduce((s, r) => s + r.rating, 0) / newAll.length * 10) / 10);
      setReviewRating(0);
      setReviewComment('');
    } catch (err) {
      setReviewError(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div style={{ paddingTop:'120px', textAlign:'center', color:'#555' }}>Loading…</div>
  );

  if (!product) return (
    <div style={{ paddingTop:'120px', textAlign:'center', color:'#a0a0a0' }}>Product not found</div>
  );

  const image = imgUrl(product.image);
  const wishlisted = isInWishlist(productId);

  return (
    <div style={{ paddingTop:'140px', minHeight:'100vh' }} className="container">
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4rem', alignItems:'start' }}>
        <div>
          {image
            ? <img src={image} alt={product.name} style={{ width:'100%', borderRadius:'20px', border:'1px solid rgba(200,169,107,0.3)' }}/>
            : <div style={{ width:'100%', aspectRatio:'1', borderRadius:'20px', background:'#111', border:'1px solid rgba(200,169,107,0.1)', display:'flex', alignItems:'center', justifyContent:'center', color:'#333' }}>No Image</div>
          }
        </div>
        <div>
          <p style={{ color:'#666', fontSize:'0.78rem', letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:'12px' }}>
            {[product.category, product.subcategory, product.group].filter(Boolean).join(' / ')}
          </p>
          <h1 style={{ fontSize:'3rem', color:'#c8a96b', marginBottom:'1rem', fontFamily:"'Cormorant Garamond', serif" }}>
            {product.name}
          </h1>

          {avgRating > 0 && (
            <div className="avg-rating-display" style={{ marginBottom: '1rem' }}>
              <StarRating rating={Math.round(avgRating)} size={20} />
              <span style={{ color: '#9ca88b', fontSize: '1rem', marginLeft: '8px', fontWeight: '600' }}>{avgRating.toFixed(1)}</span>
              <span style={{ color: '#666', fontSize: '0.85rem', marginLeft: '6px' }}>({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
            </div>
          )}

          <p style={{ fontSize:'2rem', marginBottom:'1rem', color:'#c8a96b', fontWeight:'600' }}>{product.price}</p>

          {product.stock === 0 ? (
            <p style={{ color:'#ff6060', fontSize:'0.85rem', marginBottom:'1.5rem', letterSpacing:'0.08em' }}>OUT OF STOCK</p>
          ) : product.stock < 10 ? (
            <p style={{ color:'#f5c842', fontSize:'0.85rem', marginBottom:'1.5rem', letterSpacing:'0.08em' }}>Only {product.stock} left</p>
          ) : null}

          <p style={{ lineHeight:'1.9', marginBottom:'2rem', color:'#ccc' }}>{product.description}</p>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="btn-primary"
              style={{ fontSize:'1rem', padding:'15px 50px', opacity: product.stock === 0 ? 0.4 : 1, cursor: product.stock === 0 ? 'not-allowed' : 'pointer' }}
            >
              {product.stock === 0 ? 'Out of Stock' : added ? 'Added to Cart ✓' : 'Add to Cart'}
            </button>

            {isAuthenticated && (
              <button
                onClick={() => toggle(productId)}
                className="wishlist-btn-detail"
                style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(156,168,139,0.3)',
                  borderRadius: '50%', width: '52px', height: '52px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.3s ease',
                }}
              >
                <Heart size={22} fill={wishlisted ? '#9ca88b' : 'transparent'} color={wishlisted ? '#9ca88b' : '#888'} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section" style={{ marginTop: '5rem', paddingBottom: '4rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Customer Reviews</h2>

        {isAuthenticated && (
          <div className="review-form" style={{
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(156,168,139,0.2)',
            borderRadius: '20px', padding: '2rem', marginBottom: '2.5rem',
          }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Write a Review</h3>
            {reviewError && (
              <div style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)', color: '#ff6060', borderRadius: '8px', padding: '10px 14px', fontSize: '0.82rem', marginBottom: '16px' }}>
                {reviewError}
              </div>
            )}
            <form onSubmit={handleSubmitReview}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ color: '#888', fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>Your Rating</label>
                <StarRating rating={reviewRating} onRate={setReviewRating} size={24} interactive />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ color: '#888', fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>Your Review</label>
                <textarea
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  placeholder="Share your experience with this product..."
                  maxLength={1000}
                  style={{
                    width: '100%', minHeight: '100px', background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(156,168,139,0.2)', borderRadius: '12px',
                    color: '#f5f5f5', padding: '12px 16px', fontSize: '0.9rem',
                    fontFamily: 'inherit', resize: 'vertical', outline: 'none',
                  }}
                />
              </div>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}

        {!isAuthenticated && (
          <p style={{ color: '#666', marginBottom: '2rem', fontSize: '0.9rem' }}>
            Please log in to leave a review.
          </p>
        )}

        {reviews.length === 0 ? (
          <p style={{ color: '#555', textAlign: 'center', padding: '2rem' }}>No reviews yet. Be the first!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {reviews.map(review => (
              <div key={review._id} className="review-card" style={{
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(156,168,139,0.15)',
                borderRadius: '16px', padding: '1.5rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div>
                    <span style={{ color: '#9ca88b', fontWeight: '600', fontSize: '0.95rem' }}>{review.user?.name || 'User'}</span>
                    <span style={{ color: '#555', fontSize: '0.8rem', marginLeft: '12px' }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <StarRating rating={review.rating} size={14} />
                </div>
                <p style={{ color: '#ccc', lineHeight: '1.7', fontSize: '0.9rem' }}>{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
