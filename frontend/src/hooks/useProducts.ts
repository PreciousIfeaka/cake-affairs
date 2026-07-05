import { useState, useEffect, useCallback } from 'react';
import { getProducts, getCategories } from '../services/api';
import { Product, Filters, Pagination, CategoryInfo } from '../types';

export function useProducts(filters: Filters = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        getProducts(filters),
        getCategories(),
      ]);
      setProducts(productsRes.data.products);
      setPagination(productsRes.data.pagination);
      setCategories(categoriesRes.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, categories, loading, error, pagination, refetch: fetchProducts };
}
