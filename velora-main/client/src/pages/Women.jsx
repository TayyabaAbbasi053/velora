import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useProducts, useReviewAverages } from '../hooks/useProducts';

const Women = () => {
  const { products, loading } = useProducts({ category: 'Women' });
  const averages = useReviewAverages(products);

  const fragrance  = products.filter(p => p.subcategory === 'Fragrance');
  const eyeProds   = products.filter(p => p.subcategory === 'Makeup' && p.group === 'Eye');
  const faceProds  = products.filter(p => p.subcategory === 'Makeup' && p.group === 'Face');
  const lipProds   = products.filter(p => p.subcategory === 'Makeup' && p.group === 'Lip');
  const cheekProds = products.filter(p => p.subcategory === 'Makeup' && p.group === 'Cheek');

  return (
    <div style={{ paddingTop:'120px' }} className="container">
      <h1 className="section-title">Women's Atelier</h1>

      {/* Fragrance */}
      <section style={{ marginBottom:'80px' }}>
        <h2 className="gold-text" style={{ fontSize:'2rem', marginBottom:'2rem', borderLeft:'3px solid var(--sage)', paddingLeft:'20px' }}>Fragrance</h2>
        {loading ? <p style={{ color:'#555' }}>Loading…</p> : (
          <div className="product-grid">
            {fragrance.slice(0, 4).map(p => <ProductCard key={p._id} product={p} avgRating={averages[p._id] || 0}/>)}
          </div>
        )}
        <div style={{ textAlign:'center', marginTop:'2rem' }}>
          <Link to="/women/fragrance" className="gold-text" style={{ borderBottom:'1px solid var(--sage)', paddingBottom:'5px' }}>View All Fragrance →</Link>
        </div>
      </section>

      {/* Makeup categories */}
      <section>
        <h2 className="gold-text" style={{ fontSize:'2rem', marginBottom:'2rem', borderLeft:'3px solid var(--sage)', paddingLeft:'20px' }}>Makeup</h2>
        <div className="makeup-categories">
          <Link to="/women/makeup/eye"   className="makeup-category-card"><h3>Eye</h3>  <p>{eyeProds.length} Products</p></Link>
          <Link to="/women/makeup/face"  className="makeup-category-card"><h3>Face</h3> <p>{faceProds.length} Products</p></Link>
          <Link to="/women/makeup/lip"   className="makeup-category-card"><h3>Lip</h3>  <p>{lipProds.length} Products</p></Link>
          <Link to="/women/makeup/cheek" className="makeup-category-card"><h3>Cheek</h3><p>{cheekProds.length} Products</p></Link>
        </div>
      </section>
    </div>
  );
};

export default Women;
