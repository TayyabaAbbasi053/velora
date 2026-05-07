// src/pages/CategoryPage.jsx
import { useParams } from 'react-router-dom';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';

const CategoryPage = () => {
  const { subcategory, group } = useParams();
  
  let filteredProducts = [];
  let pageTitle = '';
  let breadcrumb = '';

  // Handle Women's makeup groups (Eye, Face, Lip, Cheek)
  if (group) {
    filteredProducts = products.filter(p => 
      p.category === 'Women' && 
      p.subcategory === 'Makeup' && 
      p.group && p.group.toLowerCase() === group.toLowerCase()
    );
    // Capitalize the group name for display
    const displayGroup = group.charAt(0).toUpperCase() + group.slice(1);
    pageTitle = `${displayGroup} | Makeup`;
    breadcrumb = `Women / Makeup / ${displayGroup}`;
  } 
  // Handle Women's fragrance
  else if (subcategory === 'fragrance') {
    filteredProducts = products.filter(p => p.category === 'Women' && p.subcategory === 'Fragrance');
    pageTitle = 'Fragrance Collection';
    breadcrumb = 'Women / Fragrance';
  }
  // Handle Women's all makeup (if someone goes to /women/makeup)
  else if (subcategory === 'makeup') {
    filteredProducts = products.filter(p => p.category === 'Women' && p.subcategory === 'Makeup');
    pageTitle = 'All Makeup';
    breadcrumb = 'Women / Makeup';
  }
  // Handle Men's fragrance
  else if (subcategory === 'men-fragrance') {
    filteredProducts = products.filter(p => p.category === 'Men' && p.subcategory === 'Fragrance');
    pageTitle = 'Men\'s Fragrance';
    breadcrumb = 'Men / Fragrance';
  }
  // Handle Men's grooming
  else if (subcategory === 'men-grooming') {
    filteredProducts = products.filter(p => p.category === 'Men' && p.subcategory === 'Grooming');
    pageTitle = 'Grooming Collection';
    breadcrumb = 'Men / Grooming';
  }
  // Default fallback
  else {
    filteredProducts = products.filter(p => p.subcategory === subcategory);
    pageTitle = subcategory ? subcategory.charAt(0).toUpperCase() + subcategory.slice(1) : 'Products';
    breadcrumb = pageTitle;
  }

  return (
    <div style={{ paddingTop: '120px' }} className="container">
      {/* Breadcrumb navigation */}
      <div style={{ marginBottom: '2rem', fontSize: '0.9rem', color: '#a0a0a0' }}>
        <a href="/" style={{ color: '#c8a96b' }}>Home</a> / {breadcrumb}
      </div>
      
      <h1 className="section-title gold-text">{pageTitle}</h1>
      
      {filteredProducts.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '4rem', color: '#a0a0a0' }}>
          No products found in this category. Coming soon.
        </p>
      ) : (
        <div className="product-grid">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;