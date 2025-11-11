'use client';

import React from 'react';
import { Order } from '@/lib/types/order';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, MapPin, CreditCard, Package } from 'lucide-react';

interface OrderDetailProps {
  order: Order;
  onBack: () => void;
}

const statusLabels: Record<Order['status'], string> = {
  pending: 'Pendente',
  confirmed: 'Confirmado',
  preparing: 'Preparando',
  delivering: 'Em entrega',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
};

const statusVariants: Record<Order['status'], 'default' | 'primary' | 'success' | 'warning' | 'error'> = {
  pending: 'warning',
  confirmed: 'primary',
  preparing: 'primary',
  delivering: 'primary',
  delivered: 'success',
  cancelled: 'error',
};

const paymentTypeLabels: Record<Order['paymentMethod']['type'], string> = {
  credit: 'Cartão de Crédito',
  debit: 'Cartão de Débito',
  pix: 'PIX',
  cash: 'Dinheiro',
};

export const OrderDetail: React.FC<OrderDetailProps> = ({ order, onBack }) => {
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const maskCardNumber = (cardNumber?: string): string => {
    if (!cardNumber) return '';
    return `**** **** **** ${cardNumber.slice(-4)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
        >
          <ArrowLeft size={20} />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-neutral-900">
              Pedido #{order.id.slice(0, 8)}
            </h2>
            <Badge variant={statusVariants[order.status]}>
              {statusLabels[order.status]}
            </Badge>
          </div>
          <p className="text-sm text-neutral-600 mt-1">
            Realizado em {formatDate(order.createdAt)}
          </p>
        </div>
      </div>

      {/* Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Package size={20} className="text-primary-500" />
            <CardTitle>Itens do Pedido</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-4 pb-4 border-b border-neutral-200 last:border-0 last:pb-0"
              >
                <div className="w-16 h-16 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-neutral-900 truncate">
                    {item.product.name}
                  </h4>
                  <p className="text-sm text-neutral-600">
                    Quantidade: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-neutral-600">
                    {formatCurrency(item.product.price)} cada
                  </p>
                  <p className="font-semibold text-neutral-900">
                    {formatCurrency(item.subtotal)}
                  </p>
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-neutral-200">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary-600">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Address */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MapPin size={20} className="text-primary-500" />
            <CardTitle>Endereço de Entrega</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-neutral-700">
            <p className="font-medium">
              {order.deliveryAddress.street}, {order.deliveryAddress.number}
            </p>
            {order.deliveryAddress.complement && (
              <p className="text-sm">{order.deliveryAddress.complement}</p>
            )}
            <p className="text-sm">
              {order.deliveryAddress.neighborhood}
            </p>
            <p className="text-sm">
              {order.deliveryAddress.city} - {order.deliveryAddress.state}
            </p>
            <p className="text-sm">
              CEP: {order.deliveryAddress.zipCode}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard size={20} className="text-primary-500" />
            <CardTitle>Forma de Pagamento</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-neutral-700">
            <p className="font-medium">
              {paymentTypeLabels[order.paymentMethod.type]}
            </p>
            {(order.paymentMethod.type === 'credit' || order.paymentMethod.type === 'debit') && 
             order.paymentMethod.cardNumber && (
              <p className="text-sm text-neutral-600 mt-1">
                {maskCardNumber(order.paymentMethod.cardNumber)}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
