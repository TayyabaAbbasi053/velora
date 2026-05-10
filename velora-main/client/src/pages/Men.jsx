import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';

const Men = () => {
  const { products, loading } = useProducts({ category: 'Men' });
  const fragrance = products.filter(p => p.subcategory === 'Fragrance');
  const grooming  = products.filter(p => p.subcategory === 'Grooming');

  return (
    <div style={{ paddingTop:'120px' }} className="container">
      <h1 className="section-title gold-text">Men's Collection</h1>

      <section style={{ marginBottom:'80px' }}>
        <h2 className="gold-text" style={{ fontSize:'2rem', marginBottom:'2rem', borderLeft:'3px solid #c8a96b', paddingLeft:'20px' }}>Fragrance</h2>
        {loading ? <p style={{ color:'#555' }}>Loading…</p> : (
          <div className="product-grid">
            {fragrance.map(p => <ProductCard key={p._id} product={p}/>)}
          </div>
        )}
      </section>

      <section>
        <h2 className="gold-text" style={{ fontSize:'2rem', marginBottom:'2rem', borderLeft:'3px solid #c8a96b', paddingLeft:'20px' }}>Grooming</h2>
        {loading ? <p style={{ color:'#555' }}>Loading…</p> : (
          <div className="product-grid">
            {grooming.map(p => <ProductCard key={p._id} product={p}/>)}
          </div>
        )}
      </section>
    </div>
  );
};

export default Men;
