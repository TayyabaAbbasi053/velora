import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { useEffect } from 'react';

const Home = () => {
  const { products, loading } = useProducts();
  const featured = products.filter(p => p.featured).slice(0, 8);
  const display  = featured.length > 0 ? featured : products.slice(0, 8);

  useEffect(() => {
    document.body.classList.add('page-transition-enter');
    setTimeout(() => document.body.classList.remove('page-transition-enter'), 100);
  }, []);

  return (
    <>
      <Hero />
      <section className="section container">
        <h2 className="section-title gold-text">Featured Selections</h2>
        {loading ? (
          <p style={{ textAlign:'center', color:'#555', padding:'4rem' }}>Loading…</p>
        ) : (
          <div className="product-grid">
            {display.map((product, index) => (
              <div key={product._id || product.id} style={{ animationDelay:`${index * 0.1}s` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default Home;
