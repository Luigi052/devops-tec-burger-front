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
      className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg border border-neutral-200 hover:shadow-md transition-shadow"
      aria-label={`${item.product.name} no carrinho`}
    >
      {/* Product Image */}
      <div className="relative w-full sm:w-24 h-32 sm:h-24 flex-shrink-0 rounded-md overflow-hidden bg-neutral-100">
        <Image
          src={item.product.imageUrl}
          alt={`Imagem de ${item.product.name}`}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 96px"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-neutral-900 mb-1 line-clamp-2">
          {item.product.name}
        </h3>
        <p className="text-sm text-neutral-500 mb-2 line-clamp-2">
          {item.product.description}
        </p>
        <p className="text-sm font-medium text-neutral-700">
          {formatCurrency(item.product.price)} cada
        </p>
      </div>

      {/* Quantity Controls and Actions */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-between gap-4">
        <div className="flex items-center gap-2 bg-neutral-100 rounded-lg p-1" role="group" aria-label="Controles de quantidade">
          <button
            onClick={handleDecrease}
            disabled={item.quantity <= 1 || isUpdating}
            className="p-1.5 rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label={`Diminuir quantidade de ${item.product.name}`}
          >
            <Minus className="w-4 h-4 text-neutral-700" aria-hidden="true" />
          </button>
          <span className="w-8 text-center font-medium text-neutral-900" aria-label={`Quantidade: ${item.quantity}`}>
            {item.quantity}
          </span>
          <button
            onClick={handleIncrease}
            disabled={isUpdating}
            className="p-1.5 rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label={`Aumentar quantidade de ${item.product.name}`}
          >
            <Plus className="w-4 h-4 text-neutral-700" aria-hidden="true" />
          </button>
        </div>

        {/* Subtotal and Remove */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-lg font-bold text-primary-600" aria-label={`Subtotal: ${formatCurrency(item.subtotal)}`}>
              {formatCurrency(item.subtotal)}
            </p>
          </div>

          {/* Remove Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            disabled={isRemoving}
            loading={isRemoving}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
            aria-label={`Remover ${item.product.name} do carrinho`}
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </article>
  );
}
