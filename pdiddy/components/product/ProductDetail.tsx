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
      <div className="flex flex-col h-full">
        <div className="grid md:grid-cols-2 gap-8 p-1">
          {/* Product Image */}
          <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-neutral-50 border border-neutral-100">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover mix-blend-multiply p-8 hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Product Information */}
          <div className="flex flex-col pt-2">
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-3xl font-bold text-neutral-900 leading-tight">
                  {product.name}
                </h3>
                <span className="text-2xl font-bold text-primary-600">
                  {formatCurrency(product.price)}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-8">
                <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-none px-4 py-1.5 rounded-full text-sm font-medium">
                  {product.category}
                </Badge>
                <div className="flex items-center gap-1 text-neutral-500 text-sm font-medium">
                  <span className="text-yellow-400">★</span>
                  <span className="text-neutral-900">4.8</span>
                  <span>(120+ reviews)</span>
                </div>
              </div>

              <div className="prose prose-sm text-neutral-600 mb-8">
                <h4 className="text-base font-bold text-neutral-900 mb-3">Descrição</h4>
                <p className="leading-relaxed text-base">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Actions */}
            {product.available ? (
              <div className="flex items-center gap-4 mt-auto pt-6 border-t border-neutral-50">
                <div className="flex items-center bg-neutral-50 rounded-full p-1 border border-neutral-100">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-neutral-900 shadow-sm disabled:opacity-50 hover:bg-neutral-50 transition-colors"
                    aria-label="Diminuir quantidade"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                    </svg>
                  </button>

                  <span className="w-12 text-center font-bold text-xl text-neutral-900">
                    {quantity}
                  </span>

                  <button
                    onClick={incrementQuantity}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-neutral-900 text-white shadow-sm hover:bg-neutral-800 transition-colors"
                    aria-label="Aumentar quantidade"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </button>
                </div>

                <Button
                  className="flex-1 rounded-full h-14 text-lg font-bold shadow-xl shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-[1.02] transition-all"
                  onClick={handleAddToCart}
                >
                  Adicionar ao Carrinho
                </Button>
              </div>
            ) : (
              <div className="mt-auto pt-6 border-t border-neutral-100">
                <Button variant="secondary" disabled className="w-full rounded-full h-14 text-lg font-bold">
                  Indisponível
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
