'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Order } from '@/lib/types/order';
import { orderService } from '@/lib/services/orderService';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatCurrency, formatDateTime } from '@/lib/utils/formatters';
import { CheckCircle, Package, ShoppingBag } from 'lucide-react';
import Image from 'next/image';

function SuccessPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) {
        setError('ID do pedido não encontrado');
        setIsLoading(false);
        return;
      }

      try {
        const fetchedOrder = await orderService.getById(orderId);
        if (!fetchedOrder) {
          setError('Pedido não encontrado');
        } else {
          setOrder(fetchedOrder);
        }
      } catch (err) {
        setError('Erro ao carregar pedido');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4" />
          <p className="text-neutral-600">Carregando pedido...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <p className="text-red-600 mb-4">{error || 'Pedido não encontrado'}</p>
            <Button onClick={() => router.push('/')} variant="primary">
              Voltar às Compras
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <CheckCircle className="w-10 h-10 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Pedido Confirmado!
          </h1>
          <p className="text-neutral-600">
            Seu pedido foi realizado com sucesso e está sendo preparado.
          </p>
        </div>

        {/* Order Details Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Detalhes do Pedido
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Order Number and Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-neutral-200">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Número do Pedido</p>
                <p className="font-semibold text-neutral-900">#{order.id}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600 mb-1">Data do Pedido</p>
                <p className="font-semibold text-neutral-900">
                  {formatDateTime(order.createdAt)}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="font-semibold text-neutral-900 mb-3">Itens do Pedido</h3>
              <div className="space-y-3">
                {order.items.map((item) => (
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
                        Quantidade: {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-neutral-900">
                      {formatCurrency(item.subtotal)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="pt-4 border-t border-neutral-200">
              <h3 className="font-semibold text-neutral-900 mb-2">Endereço de Entrega</h3>
              <p className="text-sm text-neutral-700">
                {order.deliveryAddress.street}, {order.deliveryAddress.number}
                {order.deliveryAddress.complement && `, ${order.deliveryAddress.complement}`}
              </p>
              <p className="text-sm text-neutral-700">
                {order.deliveryAddress.neighborhood} - {order.deliveryAddress.city}/{order.deliveryAddress.state}
              </p>
              <p className="text-sm text-neutral-700">
                CEP: {order.deliveryAddress.zipCode}
              </p>
            </div>

            {/* Payment Method */}
            <div className="pt-4 border-t border-neutral-200">
              <h3 className="font-semibold text-neutral-900 mb-2">Forma de Pagamento</h3>
              <p className="text-sm text-neutral-700 capitalize">
                {order.paymentMethod.type === 'credit' && 'Cartão de Crédito'}
                {order.paymentMethod.type === 'debit' && 'Cartão de Débito'}
                {order.paymentMethod.type === 'pix' && 'PIX'}
                {order.paymentMethod.type === 'cash' && 'Dinheiro'}
              </p>
            </div>

            {/* Total */}
            <div className="pt-4 border-t border-neutral-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-neutral-900">Total</span>
                <span className="text-2xl font-bold text-primary-600">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            onClick={() => router.push('/perfil')}
            variant="outline"
            size="lg"
            className="w-full"
          >
            <Package className="w-5 h-5" />
            Ver Meus Pedidos
          </Button>
          <Button
            onClick={() => router.push('/')}
            variant="primary"
            size="lg"
            className="w-full"
          >
            <ShoppingBag className="w-5 h-5" />
            Voltar às Compras
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4" />
            <p className="text-neutral-600">Carregando...</p>
          </div>
        </div>
      }
    >
      <SuccessPageContent />
    </Suspense>
  );
}
