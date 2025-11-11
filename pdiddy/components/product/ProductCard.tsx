'use client';

import React from 'react';
import Image from 'next/image';
import { Product } from '@/lib/types/product';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onViewDetails(product);
    }
  };

  return (
    <Card
      className="group cursor-pointer hover:shadow-lg transition-shadow duration-200 focus-within:ring-2 focus-within:ring-primary-500"
      onClick={() => onViewDetails(product)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="article"
      aria-label={`${product.name} - ${formatCurrency(product.price)}${!product.available ? ' - Indisponível' : ''}`}
      padding="none"
    >
      {/* Product Image */}
      <div className="relative w-full aspect-square overflow-hidden rounded-t-lg bg-neutral-100">
        <Image
          src={product.imageUrl}
          alt={`Imagem de ${product.name}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={false}
        />
        {!product.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center" aria-hidden="true">
            <span className="bg-white px-4 py-2 rounded-lg font-semibold text-neutral-900">
              Indisponível
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-neutral-900 mb-1 line-clamp-1">
          {product.name}
        </h3>
        
        <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between gap-2">
          <span className="text-xl font-bold text-primary-600" aria-label={`Preço: ${formatCurrency(product.price)}`}>
            {formatCurrency(product.price)}
          </span>

          <Button
            variant="primary"
            size="sm"
            onClick={handleAddToCart}
            disabled={!product.available}
            aria-label={`Adicionar ${product.name} ao carrinho`}
          >
            Adicionar
          </Button>
        </div>
      </div>
    </Card>
  );
};
