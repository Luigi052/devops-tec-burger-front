'use client';

import React from 'react';
import { formatCurrency } from '@/lib/utils/formatters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { CartItem } from '@/lib/types/cart';
import Image from 'next/image';

interface OrderSummaryProps {
  items: CartItem[];
  total: number;
}

export function OrderSummary({ items, total }: OrderSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo do Pedido</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Items List */}
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.productId} className="flex gap-3">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-100">
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-neutral-900 truncate">
                    {item.product.name}
                  </h4>
                  <p className="text-sm text-neutral-600">
                    Qtd: {item.quantity}
                  </p>
                </div>
                <div className="text-sm font-medium text-neutral-900">
                  {formatCurrency(item.subtotal)}
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-neutral-200" />

          {/* Subtotal */}
          <div className="flex justify-between text-neutral-700">
            <span>Subtotal</span>
            <span className="font-medium">{formatCurrency(total)}</span>
          </div>

          {/* Delivery Fee */}
          <div className="flex justify-between text-neutral-700">
            <span>Taxa de Entrega</span>
            <span className="font-medium text-primary-600">Grátis</span>
          </div>

          {/* Divider */}
          <div className="border-t border-neutral-200" />

          {/* Total */}
          <div className="flex justify-between text-lg font-bold text-neutral-900">
            <span>Total</span>
            <span className="text-primary-600">{formatCurrency(total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
