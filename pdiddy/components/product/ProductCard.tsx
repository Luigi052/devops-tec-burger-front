'use client';

import React from 'react';
import Image from 'next/image';
import { Product } from '@/lib/types/product';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils/formatters';
import { Heart, Plus } from 'lucide-react';

export interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onViewDetails,
}) => {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  return (
    <div
      className="group relative flex flex-col bg-white rounded-3xl p-3 shadow-sm hover:shadow-md transition-all duration-300 h-full border border-cream-300"
      role="article"
      aria-label={`${product.name} - ${formatCurrency(product.price)}`}
    >
      {/* Favorite Button */}
      <button
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm text-brown-400 hover:text-primary-500 transition-colors shadow-sm"
        aria-label="Adicionar aos favoritos"
        onClick={(e) => {
          e.stopPropagation();
          // Add favorite logic here
        }}
      >
        <Heart className="w-5 h-5" />
      </button>

      {/* Product Image */}
      <div
        className="relative w-full aspect-[4/3] mb-3 overflow-hidden rounded-2xl bg-cream-100 cursor-pointer"
        onClick={() => onViewDetails(product)}
      >
        <Image
          src={product.imageUrl}
          alt={`Imagem de ${product.name}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {!product.available && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm rounded-2xl">
            <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-brown-900 shadow-lg">
              Esgotado
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col gap-1 px-1">
        <h3
          className="text-lg font-bold text-brown-900 line-clamp-1 cursor-pointer hover:text-primary-600 transition-colors"
          onClick={() => onViewDetails(product)}
        >
          {product.name}
        </h3>

        <p className="text-sm text-brown-600 line-clamp-2 mb-2 flex-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-xs text-brown-400 font-medium">Preço</span>
            <span className="text-xl font-bold text-primary-600">
              {formatCurrency(product.price)}
            </span>
          </div>

          <Button
            size="icon"
            className="rounded-full w-10 h-10 bg-brown-500 hover:bg-primary-600 text-white shadow-lg shadow-brown-500/20 hover:shadow-primary-500/30 transition-all duration-300 flex items-center justify-center p-0"
            onClick={handleAddToCart}
            disabled={!product.available}
            aria-label={`Adicionar ${product.name} ao carrinho`}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
