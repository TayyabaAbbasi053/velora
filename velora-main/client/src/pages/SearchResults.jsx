import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { products, loading } = useProducts();

  const results = products.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.description?.toLowerCase().includes(query.toLowerCase()) ||
    p.category?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ paddingTop: '120px', paddingBottom: '60px', minHeight: '100vh', background: '#050505' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '2rem', color: '#f5f5f5',
          marginBottom: '8px'
        }}>
          Search Results
        </h2>
        <p style={{ color: '#666', marginBottom: '40px', fontSize: '0.9rem' }}>
          {loading ? 'Searching…' : `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`}
        </p>

        {!loading && results.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#444' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '8px' }}>No products found for "{query}"</p>
            <p style={{ fontSize: '0.85rem' }}>Try a different keyword</p>
          </div>
        )}

        <div className="products-grid">
          {results.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
