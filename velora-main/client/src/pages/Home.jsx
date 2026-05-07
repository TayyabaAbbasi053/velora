// src/pages/Home.jsx
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import { useEffect } from 'react';

const Home = () => {
  const featuredProducts = products.slice(0, 8);

  useEffect(() => {
    // Add animation class to body
    document.body.classList.add('page-transition-enter');
    setTimeout(() => {
      document.body.classList.remove('page-transition-enter');
    }, 100);
  }, []);

  return (
    <>
      <Hero />
      <section className="section container">
        <h2 className="section-title gold-text">Featured Selections</h2>
        <div className="product-grid">
          {featuredProducts.map((product, index) => (
            <div key={product.id} style={{ animationDelay: `${index * 0.1}s` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;