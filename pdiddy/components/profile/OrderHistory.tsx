'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { Order } from '@/lib/types/order';
import { orderService } from '@/lib/services/orderService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { OrderDetail } from '@/components/profile/OrderDetail';

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

export const OrderHistory: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const userOrders = await orderService.getByUserId(user.id);
        setOrders(userOrders);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar pedidos');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [user]);

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

  if (selectedOrder) {
    return (
      <OrderDetail
        order={selectedOrder}
        onBack={() => setSelectedOrder(null)}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Pedidos</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-24 bg-neutral-100 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 text-neutral-500">
            <ShoppingBag size={48} className="mx-auto mb-3 text-neutral-300" />
            <p className="font-medium">Nenhum pedido realizado</p>
            <p className="text-sm mt-1">Seus pedidos aparecerão aqui</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-4 border border-neutral-200 rounded-lg hover:border-primary-300 transition-colors cursor-pointer"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-neutral-900">
                        Pedido #{order.id.slice(0, 8)}
                      </span>
                      <Badge variant={statusVariants[order.status]} size="sm">
                        {statusLabels[order.status]}
                      </Badge>
                    </div>
                    <p className="text-sm text-neutral-600">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <ChevronRight size={20} className="text-neutral-400" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-neutral-600">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                  </div>
                  <div className="font-semibold text-primary-600">
                    {formatCurrency(order.total)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
