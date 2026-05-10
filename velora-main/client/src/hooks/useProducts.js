import { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Returns the correct displayable image URL for a product
export function imgUrl(image) {
  if (!image) return null;
  if (image.startsWith('/uploads/')) return `${API}${image}`;
  return image; // Vite static asset path (/src/assets/...)
}

// Fetches products from the API with optional server-side filters
export function useProducts(filters = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const category    = filters.category    || '';
  const subcategory = filters.subcategory || '';
  const group       = filters.group       || '';

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category)    params.set('category',    category);
    if (subcategory) params.set('subcategory', subcategory);
    if (group)       params.set('group',       group);

    fetch(`${API}/api/products?${params}`)
      .then(r => r.json())
      .then(data => { setProducts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [category, subcategory, group]);

  return { products, loading, error };
}
