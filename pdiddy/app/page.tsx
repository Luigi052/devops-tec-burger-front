'use client';

import React, { useState, useMemo } from 'react';
import { CustomerLayout } from '@/components/layout';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductFilter } from '@/components/product/ProductFilter';
import { ProductDetail } from '@/components/product/ProductDetail';
import { Product } from '@/lib/types/product';
import { useCart } from '@/lib/context/CartContext';
import { useProducts } from '@/lib/hooks/useProducts';
import { Button } from '@/components/ui/Button';
import { Search } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { addItem } = useCart();
  const { products: initialProducts, isLoading, error } = useProducts();

  // Derived state for categories
  const categories = useMemo(() => {
    if (!initialProducts) return [];
    const uniqueCategories = new Set(initialProducts.map((p) => p.category));
    return Array.from(uniqueCategories);
  }, [initialProducts]);

  // Filter products
  const filteredProducts = useMemo(() => {
    if (!initialProducts) return [];
    return initialProducts.filter((product) => {
      const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [initialProducts, selectedCategory, searchQuery]);

  const addToCart = (product: Product) => {
    addItem(product);
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
  };

  return (
    <CustomerLayout>
      <main id="main-content" className="space-y-6">
        {/* Banner Section */}
        <section className="mb-12 relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white shadow-2xl shadow-primary-500/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-1/3 -translate-x-1/4 blur-2xl"></div>

          <div className="relative z-10 p-8 sm:p-12 flex items-center justify-between">
            <div className="max-w-lg">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold mb-6 border border-white/30 shadow-sm">
                <span className="bg-white text-black px-1.5 py-0.5 rounded-full text-[10px]">NOVO</span>
                <span className="text-black"  >Corra! Ganhe 20% de Desconto</span>
              </div>
              <h1 className="text-black text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight tracking-tight">
                O Melhor Hambúrguer
                <br />
                <span className="text-black">da Cidade</span>
              </h1>
              <p className="text-black mb-8 text-lg max-w-md font-medium">
                Ingredientes frescos, sabor inigualável e entrega rápida na sua porta.
              </p>
              <Button
                className="bg-black hover:bg-brown-600 text-white border-none rounded-full px-8 py-6 text-lg font-bold shadow-xl shadow-brown-500/30 hover:scale-105 transition-all"
              >
                Peça Agora
              </Button>
            </div>

            <div className="hidden md:block relative w-64 h-64 lg:w-80 lg:h-80 animate-in fade-in slide-in-from-right duration-700">
              <div className="text-[12rem] leading-none filter drop-shadow-2xl transform hover:rotate-12 transition-transform duration-500 cursor-pointer hover:scale-110">
                🍔
              </div>
            </div>
          </div>
        </section>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12 -mt-20 relative z-20 px-4">
          <div className="bg-white border-2 border-cream-300 p-2 rounded-2xl shadow-xl flex gap-2">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brown-400 group-focus-within:text-primary-500 transition-colors" />
              <input
                type="text"
                placeholder="O que você quer comer hoje?"
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-transparent border-none focus:ring-0 text-brown-900 placeholder-brown-400 font-medium outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button size="icon" className="h-12 w-12 rounded-xl bg-brown-500 hover:bg-primary-600 transition-colors shadow-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Categories & Products */}
        <ProductFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Just For You Section */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-brown-900">Só para você</h2>
            <button className="text-primary-600 text-sm font-medium hover:underline">Ver tudo</button>
          </div>

          {/* Horizontal Scroll for "Just for You" */}
          <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
            {filteredProducts.slice(0, 3).map(product => (
              <div key={product.id} className="min-w-[280px] sm:min-w-[300px]">
                <ProductCard
                  product={product}
                  onAddToCart={addToCart}
                  onViewDetails={handleViewDetails}
                />
              </div>
            ))}
          </div>
        </section>

        <h2 className="text-xl font-bold text-brown-900 mb-4">Itens Populares</h2>
        <ProductGrid
          products={filteredProducts}
          onAddToCart={addToCart}
          onViewDetails={handleViewDetails}
        />
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}
    </CustomerLayout>
  );
}
