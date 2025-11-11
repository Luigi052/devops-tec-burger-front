'use client';

import { useState, useEffect, useMemo } from 'react';
import { CustomerLayout } from "@/components/layout";
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductFilter } from '@/components/product/ProductFilter';
import { ProductDetail } from '@/components/product/ProductDetail';
import { Product } from '@/lib/types/product';
import { productService } from '@/lib/services/productService';
import { useCart } from '@/lib/context/CartContext';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { addItem } = useCart();

  // Load products and categories
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [productsData, categoriesData] = await Promise.all([
          productService.getAll(),
          productService.getCategories(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        setError('Erro ao carregar produtos. Tente novamente.');
        console.error('Error loading products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter products based on category and search query
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [products, selectedCategory, searchQuery]);

  const handleAddToCart = async (product: Product) => {
    try {
      await addItem(product, 1);
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  const handleAddToCartWithQuantity = async (product: Product, quantity: number) => {
    try {
      await addItem(product, quantity);
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <CustomerLayout>
      <main id="main-content" className="space-y-6">
        {/* Welcome Section */}
        <section className="text-center py-8" aria-labelledby="welcome-heading">
          <h1 id="welcome-heading" className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
            Bem-vindo ao Pdiddy! 🍔
          </h1>
          <p className="text-base sm:text-lg text-neutral-600">
            Sua plataforma de compras de comida online
          </p>
        </section>

        {/* Search Bar */}
        <section className="max-w-2xl mx-auto px-4" aria-label="Busca de produtos">
          <div className="relative">
            <label htmlFor="product-search" className="sr-only">
              Buscar produtos
            </label>
            <input
              id="product-search"
              type="search"
              placeholder="Buscar produtos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 border-2 border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              aria-label="Buscar produtos"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </section>

        {/* Category Filter */}
        {categories.length > 0 && (
          <ProductFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        )}

        {/* Loading State */}
        {isLoading && (
          <section className="text-center py-12" aria-live="polite" aria-busy="true">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" role="status" aria-label="Carregando"></div>
            <p className="mt-4 text-neutral-600">Carregando produtos...</p>
          </section>
        )}

        {/* Error State */}
        {error && (
          <section className="text-center py-12" role="alert" aria-live="assertive">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-primary-600 hover:text-primary-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg px-4 py-2"
            >
              Tentar novamente
            </button>
          </section>
        )}

        {/* Product Grid */}
        {!isLoading && !error && (
          <section aria-label="Lista de produtos" className="px-4 sm:px-0">
            <ProductGrid
              products={filteredProducts}
              onAddToCart={handleAddToCart}
              onViewDetails={handleViewDetails}
            />
          </section>
        )}

        {/* Product Detail Modal */}
        <ProductDetail
          product={selectedProduct}
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetail}
          onAddToCart={handleAddToCartWithQuantity}
        />
      </main>
    </CustomerLayout>
  );
}
