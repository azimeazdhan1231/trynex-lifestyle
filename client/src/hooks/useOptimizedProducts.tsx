import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";

interface UseOptimizedProductsProps {
  category?: string;
  searchTerm?: string;
  sortBy?: 'name' | 'price' | 'created_at';
  sortOrder?: 'asc' | 'desc';
  pageSize?: number;
}

export function useOptimizedProducts({
  category,
  searchTerm = '',
  sortBy = 'created_at',
  sortOrder = 'desc',
  pageSize = 16
}: UseOptimizedProductsProps = {}) {
  const [currentPage, setCurrentPage] = useState(1);

  // Ultra-fast products with browser caching
  const { data: allProducts = [], isLoading, error } = useQuery({
    queryKey: ['products-ultra-fast', category],
    queryFn: async () => {
      const CACHE_KEY = `products-cache-${category || 'all'}`;
      const CACHE_DURATION = 365 * 24 * 60 * 60 * 1000; // 1 year
      
      // Try browser cache first
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_DURATION) {
            console.log('⚡ Products loaded from browser cache');
            return data;
          }
        }
      } catch (e) {}
      
      // Fetch with aggressive optimization
      const url = category ? `/api/products?category=${category}` : '/api/products';
      const response = await fetch(url, {
        headers: {
          'Cache-Control': 'max-age=31536000', // 1 year
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Network error');
      
      const data = await response.json();
      
      // Cache immediately
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data,
          timestamp: Date.now()
        }));
      } catch (e) {}
      
      console.log('🚀 Products fetched and cached');
      return data;
    },
    staleTime: Infinity, // Never consider stale
    gcTime: Infinity, // Keep forever
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1
  });

  // Memoized filtered and sorted products
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts] as Product[];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((product: Product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort products
    filtered.sort((a: Product, b: Product) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = parseFloat(a.price.toString()) - parseFloat(b.price.toString());
          break;
        case 'created_at':
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          comparison = dateA - dateB;
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [allProducts, searchTerm, sortBy, sortOrder]);

  // Paginated products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return (filteredProducts as Product[]).slice(startIndex, endIndex);
  }, [filteredProducts, currentPage, pageSize]);

  // Total pages
  const totalPages = Math.ceil((filteredProducts as Product[]).length / pageSize);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [category, searchTerm, sortBy, sortOrder]);

  return {
    products: paginatedProducts,
    allProducts: filteredProducts,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalProducts: (filteredProducts as Product[]).length,
    setCurrentPage,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
}