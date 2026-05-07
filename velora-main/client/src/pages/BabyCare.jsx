// src/pages/BabyCare.jsx
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';

const BabyCare = () => {
  const babyProducts = products.filter(p => p.category === 'Baby care');

  return (
    <div style={{ paddingTop: '120px' }} className="container">
      <h1 className="section-title gold-text">Baby Care Rituals</h1>
      <div className="product-grid">
        {babyProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default BabyCare;