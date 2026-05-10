import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useCartStore from '../store/cartStore';
import { imgUrl } from '../hooks/useProducts';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ProductDetails = () => {
  const { productId } = useParams();
  const addItem = useCartStore(state => state.addItem);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added,   setAdded]   = useState(false);

  useEffect(() => {
    fetch(`${API}/api/products/${productId}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { setProduct(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [productId]);

  const handleAddToCart = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return (
    <div style={{ paddingTop:'120px', textAlign:'center', color:'#555' }}>Loading…</div>
  );

  if (!product) return (
    <div style={{ paddingTop:'120px', textAlign:'center', color:'#a0a0a0' }}>Product not found</div>
  );

  const image = imgUrl(product.image);

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
          <p style={{ fontSize:'2rem', marginBottom:'1rem', color:'#c8a96b', fontWeight:'600' }}>{product.price}</p>

          {/* Stock indicator */}
          {product.stock === 0 ? (
            <p style={{ color:'#ff6060', fontSize:'0.85rem', marginBottom:'1.5rem', letterSpacing:'0.08em' }}>OUT OF STOCK</p>
          ) : product.stock < 10 ? (
            <p style={{ color:'#f5c842', fontSize:'0.85rem', marginBottom:'1.5rem', letterSpacing:'0.08em' }}>Only {product.stock} left</p>
          ) : null}

          <p style={{ lineHeight:'1.9', marginBottom:'2rem', color:'#ccc' }}>{product.description}</p>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="btn-primary"
            style={{ fontSize:'1rem', padding:'15px 50px', opacity: product.stock === 0 ? 0.4 : 1, cursor: product.stock === 0 ? 'not-allowed' : 'pointer' }}
          >
            {product.stock === 0 ? 'Out of Stock' : added ? 'Added to Cart ✓' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
