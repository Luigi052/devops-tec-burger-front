'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { CartItem as CartItemType } from '@/lib/types/cart';
import { formatCurrency } from '@/lib/utils/formatters';
import { Button } from '@/components/ui/Button';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number) => Promise<void>;
  onRemove: (productId: string) => Promise<void>;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleDecrease = async () => {
    if (item.quantity <= 1 || isUpdating) return;

    setIsUpdating(true);
    try {
      await onUpdateQuantity(item.productId, item.quantity - 1);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleIncrease = async () => {
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      await onUpdateQuantity(item.productId, item.quantity + 1);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (isRemoving) return;

    setIsRemoving(true);
    try {
      await onRemove(item.productId);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <article
      className="group flex flex-row gap-4 p-4 bg-white rounded-3xl border border-neutral-100 shadow-sm hover:shadow-md transition-all duration-300"
      aria-label={`${item.product.name} no carrinho`}
    >
      {/* Product Image */}
      <div className="relative w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden bg-neutral-50 border border-neutral-100">
        <Image
          src={item.product.imageUrl}
          alt={`Imagem de ${item.product.name}`}
          fill
          className="object-cover mix-blend-multiply p-2"
          sizes="96px"
        />
      </div>

      {/* Product Info & Controls */}
      <div className="flex-1 flex flex-col justify-between min-w-0 py-1">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h3 className="font-bold text-neutral-900 text-lg leading-tight mb-1 line-clamp-1">
              {item.product.name}
            </h3>
            <p className="text-sm text-neutral-500 line-clamp-1">
              {item.product.description}
            </p>
          </div>
          <button
            onClick={handleRemove}
            disabled={isRemoving}
            className="text-neutral-400 hover:text-red-500 transition-colors p-1 -mr-1"
            aria-label={`Remover ${item.product.name} do carrinho`}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-end justify-between mt-2">
          <span className="text-lg font-bold text-primary-600">
            {formatCurrency(item.product.price)}
          </span>

          {/* Quantity Controls */}
          <div className="flex items-center gap-3 bg-neutral-50 rounded-full p-1 border border-neutral-100">
            <button
              onClick={handleDecrease}
              disabled={item.quantity <= 1 || isUpdating}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-white text-neutral-600 shadow-sm disabled:opacity-50 hover:bg-neutral-100 transition-colors"
              aria-label="Diminuir"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-4 text-center font-semibold text-sm text-neutral-900">
              {item.quantity}
            </span>
            <button
              onClick={handleIncrease}
              disabled={isUpdating}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-neutral-900 text-white shadow-sm disabled:opacity-50 hover:bg-neutral-800 transition-colors"
              aria-label="Aumentar"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
