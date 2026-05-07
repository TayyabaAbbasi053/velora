// src/pages/HealthAndSkinCare.jsx
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';

const HealthAndSkinCare = () => {
  const healthProducts = products.filter(p => p.category === 'Health And Skin Care');

  return (
    <div style={{ paddingTop: '120px' }} className="container">
      <h1 className="section-title gold-text">Health & Skin Care</h1>
      <div className="product-grid">
        {healthProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default HealthAndSkinCare;