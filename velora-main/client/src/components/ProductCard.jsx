import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import useWishlistStore from '../store/wishlistStore';
import StarRating from './StarRating';
import { useState } from 'react';
import { imgUrl } from '../hooks/useProducts';

const ProductCard = ({ product, avgRating }) => {
  const navigate = useNavigate();
  const addItem  = useCartStore(state => state.addItem);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const { isInWishlist, toggle } = useWishlistStore();
  const [added, setAdded] = useState(false);

  const id = product._id || product.id;
  const wishlisted = isInWishlist(id);

  const handleAddToCart = e => {
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = e => {
    e.stopPropagation();
    if (!isAuthenticated) return;
    toggle(id);
  };

  const image = imgUrl(product.image);

  return (
    <div className="product-card" onClick={() => navigate(`/product/${id}`)}>
      <div className="image-wrapper">
        {image
          ? <img src={image} alt={product.name} />
          : <div style={{ width:'100%', height:'100%', background:'#1a1a1a', display:'flex', alignItems:'center', justifyContent:'center', color:'#333', fontSize:'0.8rem' }}>No Image</div>
        }
        {isAuthenticated && (
          <button className="wishlist-btn" onClick={handleWishlist} title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}>
            <Heart size={20} fill={wishlisted ? '#9ca88b' : 'transparent'} color={wishlisted ? '#9ca88b' : '#fff'} />
          </button>
        )}
        <div className="overlay">
          <button className="quick-view" onClick={handleAddToCart}>
            {added ? 'Added ✓' : 'Add to Cart'}
          </button>
        </div>
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        {avgRating > 0 && (
          <div className="product-rating">
            <StarRating rating={Math.round(avgRating)} size={14} />
            <span style={{ color: '#888', fontSize: '0.8rem', marginLeft: '6px' }}>{avgRating.toFixed(1)}</span>
          </div>
        )}
        <p>{product.description?.substring(0, 80)}…</p>
        <div className="product-price">{product.price}</div>
      </div>
    </div>
  );
};

export default ProductCard;
