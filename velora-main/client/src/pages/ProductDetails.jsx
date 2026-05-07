// src/pages/ProductDetails.jsx
import { useParams } from 'react-router-dom';
import { products } from '../data/products';
import useCartStore from '../store/cartStore';
import { useState } from 'react';

const ProductDetails = () => {
  const { productId } = useParams();
  const product = products.find(p => p.id === parseInt(productId));
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  if (!product) {
    return <div style={{ paddingTop: '120px', textAlign: 'center' }}>Product not found</div>;
  }

  const handleAddToCart = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{ paddingTop: '140px', minHeight: '100vh' }} className="container">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
        <div>
          <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: '20px', border: '1px solid rgba(200,169,107,0.3)', filter: 'grayscale(0%)' }} />
        </div>
        <div>
          <h1 style={{ fontSize: '3rem', color: '#c8a96b', marginBottom: '1rem', fontFamily: "'Cormorant Garamond', serif" }}>{product.name}</h1>
          <p style={{ fontSize: '2rem', marginBottom: '2rem', color: '#c8a96b', fontWeight: '600' }}>{product.price}</p>
          <p style={{ lineHeight: '1.8', marginBottom: '2rem', color: '#ccc' }}>{product.description}</p>
          <button 
            onClick={handleAddToCart}
            className="btn-primary" 
            style={{ fontSize: '1rem', padding: '15px 50px' }}
          >
            {added ? 'Added to Cart ✓' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;