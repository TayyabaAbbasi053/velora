import React from 'react';
import ProductCard from '../components/ProductCard';
import { useProducts, useReviewAverages } from '../hooks/useProducts';

const HealthAndSkinCare = () => {
  const { products, loading } = useProducts({ category: 'Health And Skin Care' });
  const averages = useReviewAverages(products);

  return (
    <div style={{ paddingTop:'120px' }} className="container">
      <h1 className="section-title gold-text">Health & Skin Care</h1>
      {loading ? <p style={{ textAlign:'center', color:'#555', padding:'4rem' }}>Loading…</p> : (
        <div className="product-grid">
          {products.map(p => <ProductCard key={p._id} product={p} avgRating={averages[p._id] || 0}/>)}
        </div>
      )}
    </div>
  );
};

export default HealthAndSkinCare;
