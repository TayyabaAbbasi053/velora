// src/pages/HairCare.jsx
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';

const HairCare = () => {
  const hairProducts = products.filter(p => p.category === 'Hair care');

  return (
    <div style={{ paddingTop: '120px' }} className="container">
      <h1 className="section-title gold-text">Hair Care Alchemy</h1>
      <div className="product-grid">
        {hairProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default HairCare;