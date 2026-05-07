// src/components/ProductCard.jsx
import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import { useState } from 'react';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
      <div className="image-wrapper">
        <img src={product.image} alt={product.name} />
        <div className="overlay">
          <button className="quick-view" onClick={handleAddToCart}>
            {added ? 'Added ✓' : 'Add to Cart'}
          </button>
        </div>
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p>{product.description.substring(0, 80)}...</p>
        <div className="product-price">{product.price}</div>
      </div>
    </div>
  );
};

export default ProductCard;