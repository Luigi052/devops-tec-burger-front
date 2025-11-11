'use client';

import { useState, useEffect, useCallback } from 'react';
import { Product } from '../types/product';
import { productService } from '../services/productService';
import { ServiceError } from '../errors/ServiceError';

interface UseProductsState {
  products: Product[];
  isLoading: boolean;
  error: ServiceError | null;
}

export function useProducts(category?: string) {
  const [state, setState] = useState<UseProductsState>({
    products: [],
    isLoading: true,
    error: null,
  });

  const fetchProducts = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const products = category 
        ? await productService.getByCategory(category)
        : await productService.getAll();
      
      setState({ products, isLoading: false, error: null });
    } catch (error) {
      const serviceError = ServiceError.fromError(error);
      setState({ products: [], isLoading: false, error: serviceError });
    }
  }, [category]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const retry = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    ...state,
    retry,
  };
}

export function useProduct(id: string) {
  const [state, setState] = useState<{
    product: Product | null;
    isLoading: boolean;
    error: ServiceError | null;
  }>({
    product: null,
    isLoading: true,
    error: null,
  });

  const fetchProduct = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const product = await productService.getById(id);
      setState({ product, isLoading: false, error: null });
    } catch (error) {
      const serviceError = ServiceError.fromError(error);
      setState({ product: null, isLoading: false, error: serviceError });
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id, fetchProduct]);

  const retry = useCallback(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    ...state,
    retry,
  };
}
