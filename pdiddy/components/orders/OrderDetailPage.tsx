/**
 * Order Detail Page (API Version)
 * 
 * Página de detalhes de um pedido específico
 * Implementa polling automático para pedidos pendentes
 * 
 * NOTA: Criar em app/pedido/[id]/page.tsx quando API estiver pronta
 */

'use client';

import React from 'react';
import { CustomerLayout } from '@/components/layout';
import { useOrderQuery } from '@/lib/hooks/useOrdersApi';
import { OrderStatusBadge, OrderStatusIndicator } from '@/components/orders/OrderStatusBadge';
import { calculateOrderTotal, isOrderPending } from '@/lib/api/services/orders';
import { Button } from '@/components/ui/Button';
import {
    Loader2,
    AlertCircle,
    ArrowLeft,
    Package,
    Calendar,
    Hash,
    DollarSign,
    ShoppingCart
} from 'lucide-react';

interface OrderDetailPageProps {
    orderId: string; // Recebido via params em Next.js App Router
}

export default function OrderDetailPage({ orderId }: OrderDetailPageProps) {
    // Hook com polling automático para pedidos pendentes
    const { data: order, isLoading, error, refetch } = useOrderQuery(orderId, {
        enablePolling: true, // Ativar polling automático
    });

    // Loading state
    if (isLoading) {
        return (
            <CustomerLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center space-y-4">
                        <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto" />
                        <p className="text-brown-600 font-medium">Carregando detalhes do pedido...</p>
                    </div>
                </div>
            </CustomerLayout>
        );
    }

    // Error state
    if (error) {
        return (
            <CustomerLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center space-y-4 max-w-md">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                        <h2 className="text-xl font-bold text-brown-900">Erro ao carregar pedido</h2>
                        <p className="text-brown-600">
                            {error instanceof Error ? error.message : 'Pedido não encontrado'}
                        </p>
                        <div className="flex gap-3 justify-center">
                            <Button variant="outline" onClick={() => window.history.back()}>
                                Voltar
                            </Button>
                            <Button onClick={() => refetch()}>
                                Tentar Novamente
                            </Button>
                        </div>
                    </div>
                </div>
            </CustomerLayout>
        );
    }

    if (!order) {
        return null;
    }

    const total = calculateOrderTotal(order);
    const isPending = isOrderPending(order);
    const formattedDate = new Date(order.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <CustomerLayout>
            <main id="main-content" className="max-w-3xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.history.back()}
                        className="mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar
                    </Button>
                    <h1 className="text-3xl font-bold text-brown-900">Detalhes do Pedido</h1>
                </div>

                {/* Polling Indicator */}
                {isPending && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                            <div>
                                <p className="font-medium text-blue-900">Atualizando automaticamente...</p>
                                <p className="text-sm text-blue-700">
                                    Este pedido está sendo processado. A página atualiza a cada 5 segundos.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Card */}
                <div className="bg-white border border-cream-300 rounded-2xl overflow-hidden">
                    {/* Status Header */}
                    <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                                    <Package className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-white/80 text-sm">Pedido</p>
                                    <p className="text-2xl font-bold">#{order.id.slice(0, 8).toUpperCase()}</p>
                                </div>
                            </div>
                            <OrderStatusBadge status={order.status} size="lg" />
                        </div>
                    </div>

                    {/* Details */}
                    <div className="p-6 space-y-6">
                        {/* Status Timeline */}
                        <div className="bg-cream-50 rounded-xl p-4">
                            <OrderStatusIndicator status={order.status} showLabel={true} />
                        </div>

                        {/* Information Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Order ID */}
                            <div className="flex items-start gap-3">
                                <div className="bg-primary-100 rounded-lg p-2">
                                    <Hash className="w-5 h-5 text-primary-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-brown-600">ID do Pedido</p>
                                    <p className="font-mono text-sm font-medium text-brown-900">{order.id}</p>
                                </div>
                            </div>

                            {/* Date */}
                            <div className="flex items-start gap-3">
                                <div className="bg-primary-100 rounded-lg p-2">
                                    <Calendar className="w-5 h-5 text-primary-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-brown-600">Data do Pedido</p>
                                    <p className="font-medium text-brown-900">{formattedDate}</p>
                                </div>
                            </div>

                            {/* Product ID */}
                            <div className="flex items-start gap-3">
                                <div className="bg-primary-100 rounded-lg p-2">
                                    <ShoppingCart className="w-5 h-5 text-primary-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-brown-600">ID do Produto</p>
                                    <p className="font-mono text-sm font-medium text-brown-900">
                                        {order.productId.slice(0, 8)}...
                                    </p>
                                </div>
                            </div>

                            {/* Quantity */}
                            <div className="flex items-start gap-3">
                                <div className="bg-primary-100 rounded-lg p-2">
                                    <Package className="w-5 h-5 text-primary-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-brown-600">Quantidade</p>
                                    <p className="font-medium text-brown-900">{order.quantity}x</p>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-cream-200"></div>

                        {/* Price Breakdown */}
                        <div className="space-y-3">
                            <h3 className="font-bold text-brown-900">Resumo do Pedido</h3>

                            <div className="flex justify-between items-center">
                                <span className="text-brown-600">Preço Unitário</span>
                                <span className="font-medium text-brown-900">R$ {order.unitPrice}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-brown-600">Quantidade</span>
                                <span className="font-medium text-brown-900">{order.quantity}x</span>
                            </div>

                            <div className="border-t border-cream-200 pt-3 flex justify-between items-center">
                                <span className="text-lg font-bold text-brown-900">Total</span>
                                <div className="text-right">
                                    <div className="bg-primary-100 rounded-lg px-4 py-2">
                                        <span className="text-2xl font-bold text-primary-600">
                                            R$ {total.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Updated At */}
                        <div className="text-sm text-brown-600 text-center pt-4 border-t border-cream-200">
                            Última atualização: {new Date(order.updatedAt).toLocaleString('pt-BR')}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => window.history.back()}
                    >
                        Voltar aos Pedidos
                    </Button>
                    {order.status === 'completed' && (
                        <Button className="flex-1">
                            Fazer Pedido Novamente
                        </Button>
                    )}
                </div>
            </main>
        </CustomerLayout>
    );
}

/**
 * Exemplo de uso em Next.js App Router:
 * 
 * // app/pedido/[id]/page.tsx
 * export default function Page({ params }: { params: { id: string } }) {
 *   return <OrderDetailPage orderId={params.id} />;
 * }
 */
