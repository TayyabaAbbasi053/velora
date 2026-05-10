import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';

const HairCare = () => {
  const { products, loading } = useProducts({ category: 'Hair care' });

  return (
    <div style={{ paddingTop:'120px' }} className="container">
      <h1 className="section-title gold-text">Hair Care Alchemy</h1>
      {loading ? <p style={{ textAlign:'center', color:'#555', padding:'4rem' }}>Loading…</p> : (
        <div className="product-grid">
          {products.map(p => <ProductCard key={p._id} product={p}/>)}
        </div>
      )}
    </div>
  );
};

export default HairCare;
