// src/pages/Women.jsx
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';

const Women = () => {
  const fragranceProducts = products.filter(p => p.category === 'Women' && p.subcategory === 'Fragrance');
  const makeupProducts = products.filter(p => p.category === 'Women' && p.subcategory === 'Makeup');

  const eyeProducts = makeupProducts.filter(p => p.group === 'Eye');
  const faceProducts = makeupProducts.filter(p => p.group === 'Face');
  const lipProducts = makeupProducts.filter(p => p.group === 'Lip');
  const cheekProducts = makeupProducts.filter(p => p.group === 'Cheek');

  return (
    <div style={{ paddingTop: '120px' }} className="container">
      <h1 className="section-title">Women's Atelier</h1>
      
      {/* Fragrance Section */}
      <section style={{ marginBottom: '80px' }}>
        <h2 className="gold-text" style={{ fontSize: '2rem', marginBottom: '2rem', borderLeft: `3px solid var(--sage)`, paddingLeft: '20px' }}>Fragrance</h2>
        <div className="product-grid">
          {fragranceProducts.slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/women/fragrance" className="gold-text" style={{ borderBottom: '1px solid var(--sage)', paddingBottom: '5px' }}>View All Fragrance →</Link>
        </div>
      </section>

      {/* Makeup Section */}
      <section>
        <h2 className="gold-text" style={{ fontSize: '2rem', marginBottom: '2rem', borderLeft: `3px solid var(--sage)`, paddingLeft: '20px' }}>Makeup</h2>
        <div className="makeup-categories">
          <Link to="/women/makeup/eye" className="makeup-category-card">
            <h3>Eye</h3>
            <p>{eyeProducts.length} Products</p>
          </Link>
          <Link to="/women/makeup/face" className="makeup-category-card">
            <h3>Face</h3>
            <p>{faceProducts.length} Products</p>
          </Link>
          <Link to="/women/makeup/lip" className="makeup-category-card">
            <h3>Lip</h3>
            <p>{lipProducts.length} Products</p>
          </Link>
          <Link to="/women/makeup/cheek" className="makeup-category-card">
            <h3>Cheek</h3>
            <p>{cheekProducts.length} Products</p>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Women;