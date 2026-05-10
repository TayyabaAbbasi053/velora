import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import { useState } from 'react';
import { imgUrl } from '../hooks/useProducts';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const addItem  = useCartStore(state => state.addItem);
  const [added, setAdded] = useState(false);

  // Support both MongoDB _id and legacy numeric id
  const id = product._id || product.id;

  const handleAddToCart = e => {
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const image = imgUrl(product.image);

  return (
    <div className="product-card" onClick={() => navigate(`/product/${id}`)}>
      <div className="image-wrapper">
        {image
          ? <img src={image} alt={product.name} />
          : <div style={{ width:'100%', height:'100%', background:'#1a1a1a', display:'flex', alignItems:'center', justifyContent:'center', color:'#333', fontSize:'0.8rem' }}>No Image</div>
        }
        <div className="overlay">
          <button className="quick-view" onClick={handleAddToCart}>
            {added ? 'Added ✓' : 'Add to Cart'}
          </button>
        </div>
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p>{product.description?.substring(0, 80)}…</p>
        <div className="product-price">{product.price}</div>
      </div>
    </div>
  );
};

export default ProductCard;
