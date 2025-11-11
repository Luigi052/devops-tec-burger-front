'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/lib/types/product';
import { Modal, ModalFooter } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';

export interface ProductDetailProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setQuantity(1);
    onClose();
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="Detalhes do Produto">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Product Image */}
        <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-neutral-100">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Product Information */}
        <div className="flex flex-col">
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">
              {product.name}
            </h3>
            
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="primary">{product.category}</Badge>
              {product.available ? (
                <Badge variant="success">Disponível</Badge>
              ) : (
                <Badge variant="error">Indisponível</Badge>
              )}
            </div>

            <p className="text-neutral-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="mt-auto">
            <div className="mb-4">
              <span className="text-3xl font-bold text-primary-600">
                {formatCurrency(product.price)}
              </span>
            </div>

            {product.available && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Quantidade
                </label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    aria-label="Diminuir quantidade"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M20 12H4" />
                    </svg>
                  </Button>
                  
                  <span className="text-lg font-semibold w-12 text-center">
                    {quantity}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={incrementQuantity}
                    aria-label="Aumentar quantidade"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M12 4v16m8-8H4" />
                    </svg>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ModalFooter>
        <Button variant="outline" onClick={onClose}>
          Fechar
        </Button>
        <Button
          variant="primary"
          onClick={handleAddToCart}
          disabled={!product.available}
        >
          Adicionar ao Carrinho
        </Button>
      </ModalFooter>
    </Modal>
  );
};
