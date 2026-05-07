// src/pages/Men.jsx
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard'; // IMPORT THIS

const Men = () => {
  const fragranceProducts = products.filter(p => p.category === 'Men' && p.subcategory === 'Fragrance');
  const groomingProducts = products.filter(p => p.category === 'Men' && p.subcategory === 'Grooming');

  return (
    <div style={{ paddingTop: '120px' }} className="container">
      <h1 className="section-title gold-text">Men's Collection</h1>
      
      <section style={{ marginBottom: '80px' }}>
        <h2 className="gold-text" style={{ fontSize: '2rem', marginBottom: '2rem', borderLeft: `3px solid #c8a96b`, paddingLeft: '20px' }}>Fragrance</h2>
        <div className="product-grid">
          {fragranceProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="gold-text" style={{ fontSize: '2rem', marginBottom: '2rem', borderLeft: `3px solid #c8a96b`, paddingLeft: '20px' }}>Grooming</h2>
        <div className="product-grid">
          {groomingProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Men;