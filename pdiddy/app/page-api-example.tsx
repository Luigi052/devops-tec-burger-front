/**
 * Home Page (API Version)
 * 
 * Esta é uma versão exemplo da home page usando a API real
 * Demonstra como integrar os hooks do React Query
 * 
 * NOTA: Para usar esta versão, renomeie para page.tsx e
 * certifique-se de que a API está rodando em localhost:8080
 */

'use client';

import React, { useState, useMemo } from 'react';
import { CustomerLayout } from '@/components/layout';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductFilter } from '@/components/product/ProductFilter';
import { ProductDetail } from '@/components/product/ProductDetail';
import { Product } from '@/lib/types/product';
import { useCart } from '@/lib/context/CartContext';
import { useProductsQuery } from '@/lib/hooks/useProductsApi';
import { parseMoney } from '@/lib/api/services/products';
import { Button } from '@/components/ui/Button';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';

export default function HomePageApi() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const { addItem } = useCart();

    // Usar React Query hook para buscar produtos da API
    const { data, isLoading, error, refetch } = useProductsQuery({
        limit: 100, // Buscar muitos produtos para ter dados suficientes
        sort: 'created_at_desc'
    });

    // Converter produtos da API para o formato local
    const apiProducts: Product[] = useMemo(() => {
        if (!data?.data) return [];

        return data.data.map((apiProduct) => ({
            id: apiProduct.id,
            name: apiProduct.name,
            description: '', // API não tem descrição, adicionaremos placeholder
            price: parseMoney(apiProduct.price), // Converter string "25.90" para number 25.90
            category: 'Geral', // API não tem categoria, usar placeholder
            imageUrl: '/placeholder.jpg', // API não tem imagem
            available: true,
            createdAt: new Date(apiProduct.createdAt),
            updatedAt: new Date(apiProduct.updatedAt),
        }));
    }, [data]);

    // Derived state for categories
    const categories = useMemo(() => {
        if (!apiProducts) return [];
        const uniqueCategories = new Set(apiProducts.map((p) => p.category));
        return Array.from(uniqueCategories);
    }, [apiProducts]);

    // Filter products
    const filteredProducts = useMemo(() => {
        if (!apiProducts) return [];
        return apiProducts.filter((product) => {
            const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesCategory && matchesSearch;
        });
    }, [apiProducts, selectedCategory, searchQuery]);

    const addToCart = (product: Product) => {
        addItem(product);
    };

    const handleViewDetails = (product: Product) => {
        setSelectedProduct(product);
    };

    // Loading state
    if (isLoading) {
        return (
            <CustomerLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center space-y-4">
                        <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto" />
                        <p className="text-brown-600 font-medium">Carregando produtos...</p>
                    </div>
                </div>
            </CustomerLayout>
        );
    }

    // Error state
    if (error) {
        return (
            <CustomerLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center space-y-4 max-w-md">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                        <h2 className="text-xl font-bold text-brown-900">Erro ao carregar produtos</h2>
                        <p className="text-brown-600">
                            {error instanceof Error ? error.message : 'Erro desconhecido'}
                        </p>
                        <Button onClick={() => refetch()}>
                            Tentar Novamente
                        </Button>
                    </div>
                </div>
            </CustomerLayout>
        );
    }

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
                                <span className="text-black">Corra! Ganhe 20% de Desconto</span>
                            </div>
                            <h1 className="text-black text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight tracking-tight">
                                Tec Burger
                                <br />
                                <span className="text-black">Direto da API</span>
                            </h1>
                            <p className="text-black mb-8 text-lg max-w-md font-medium">
                                Produtos carregados diretamente da API. Total: {apiProducts.length} produtos
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

                    {/* Horizontal Scroll */}
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

                <h2 className="text-xl font-bold text-brown-900 mb-4">
                    Todos os Produtos ({filteredProducts.length})
                </h2>
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
