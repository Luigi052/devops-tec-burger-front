'use client';

import React from 'react';
import { formatCurrency } from '@/lib/utils/formatters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface CartSummaryProps {
  subtotal: number;
  total: number;
}

export function CartSummary({ subtotal, total }: CartSummaryProps) {
  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle>Resumo do Pedido</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Subtotal */}
          <div className="flex justify-between text-neutral-700">
            <span>Subtotal</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>

          {/* Divider */}
          <div className="border-t border-neutral-200 my-3" />

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
