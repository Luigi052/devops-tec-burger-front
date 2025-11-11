'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { useCart } from '@/lib/context/CartContext';

export function CartIcon() {
  const { cart } = useCart();
  const itemCount = cart.itemCount;

  return (
    <Link
      href="/carrinho"
      className="relative p-2 rounded-lg hover:bg-neutral-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
      aria-label={`Carrinho de compras com ${itemCount} ${itemCount === 1 ? 'item' : 'itens'}`}
    >
      <ShoppingCart className="w-6 h-6 text-neutral-700" />
      {itemCount > 0 && (
        <Badge
          variant="primary"
          size="sm"
          className="absolute -top-1 -right-1 min-w-[1.25rem] h-5"
        >
          {itemCount > 99 ? '99+' : itemCount}
        </Badge>
      )}
    </Link>
  );
}
