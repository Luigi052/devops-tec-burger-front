'use client';

import React from 'react';
import { formatCurrency } from '@/lib/utils/formatters';

interface CartSummaryProps {
  subtotal: number;
  total: number;
}

export function CartSummary({ subtotal, total }: CartSummaryProps) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-cream-300 sticky top-24">
      <h2 className="text-xl font-bold text-brown-900 mb-6">Resumo do Pedido</h2>

      <div className="space-y-4">
        <div className="flex justify-between text-brown-600">
          <span>Subtotal</span>
          <span className="font-medium text-brown-900">{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex justify-between text-brown-600">
          <span>Entrega</span>
          <span className="font-medium text-brown-900">R$ 10,00</span>
        </div>

        <div className="flex justify-between text-green-600">
          <span>Desconto (20%)</span>
          <span className="font-medium">-R$ 30,00</span>
        </div>

        <div className="border-t border-dashed border-cream-300 my-4 pt-4">
          <div className="flex justify-between items-end">
            <span className="text-brown-900 font-bold">Total</span>
            <span className="text-3xl font-bold text-primary-600">{formatCurrency(total - 20)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
