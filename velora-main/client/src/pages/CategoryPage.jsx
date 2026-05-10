import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';

const CategoryPage = () => {
  const { subcategory, group } = useParams();

  // Determine API filters and display labels from the URL params
  let filters = {};
  let pageTitle = '';
  let breadcrumb = '';

  if (group) {
    const displayGroup = group.charAt(0).toUpperCase() + group.slice(1);
    filters    = { category:'Women', subcategory:'Makeup', group: displayGroup };
    pageTitle  = `${displayGroup} | Makeup`;
    breadcrumb = `Women / Makeup / ${displayGroup}`;
  } else if (subcategory === 'fragrance') {
    filters    = { category:'Women', subcategory:'Fragrance' };
    pageTitle  = 'Fragrance Collection';
    breadcrumb = 'Women / Fragrance';
  } else if (subcategory === 'makeup') {
    filters    = { category:'Women', subcategory:'Makeup' };
    pageTitle  = 'All Makeup';
    breadcrumb = 'Women / Makeup';
  } else if (subcategory === 'men-fragrance') {
    filters    = { category:'Men', subcategory:'Fragrance' };
    pageTitle  = "Men's Fragrance";
    breadcrumb = 'Men / Fragrance';
  } else if (subcategory === 'men-grooming') {
    filters    = { category:'Men', subcategory:'Grooming' };
    pageTitle  = 'Grooming Collection';
    breadcrumb = 'Men / Grooming';
  } else {
    pageTitle  = subcategory ? subcategory.charAt(0).toUpperCase() + subcategory.slice(1) : 'Products';
    breadcrumb = pageTitle;
  }

  const { products, loading } = useProducts(filters);

  return (
    <div style={{ paddingTop:'120px' }} className="container">
      <div style={{ marginBottom:'2rem', fontSize:'0.9rem', color:'#a0a0a0' }}>
        <a href="/" style={{ color:'#c8a96b' }}>Home</a> / {breadcrumb}
      </div>
      <h1 className="section-title gold-text">{pageTitle}</h1>

      {loading ? (
        <p style={{ textAlign:'center', padding:'4rem', color:'#555' }}>Loading…</p>
      ) : products.length === 0 ? (
        <p style={{ textAlign:'center', padding:'4rem', color:'#a0a0a0' }}>No products found in this category.</p>
      ) : (
        <div className="product-grid">
          {products.map(p => <ProductCard key={p._id} product={p}/>)}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
