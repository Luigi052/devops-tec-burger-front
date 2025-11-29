/**
 * Orders Page (API Version)
 * 
 * Página de listagem de pedidos usando a API
 * Demonstra paginação, polling e estados de loading
 * 
 * NOTA: Renomeie para app/pedidos/page.tsx quando API estiver pronta
 */

'use client';

import React, { useState } from 'react';
import { CustomerLayout } from '@/components/layout';
import { useOrdersQuery } from '@/lib/hooks/useOrdersApi';
import { OrderCard } from '@/components/orders/OrderCard';
import { Order } from '@/lib/types/api';
import { Button } from '@/components/ui/Button';
import { Loader2, AlertCircle, Package, RefreshCw } from 'lucide-react';

export default function OrdersPageApi() {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    // Buscar pedidos da API
    const { data, isLoading, error, refetch, isFetching } = useOrdersQuery({
        limit: 20
    });

    // Loading state
    if (isLoading) {
        return (
            <CustomerLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center space-y-4">
                        <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto" />
                        <p className="text-brown-600 font-medium">Carregando pedidos...</p>
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
                        <h2 className="text-xl font-bold text-brown-900">Erro ao carregar pedidos</h2>
                        <p className="text-brown-600">
                            {error instanceof Error ? error.message : 'Erro desconhecido'}
                        </p>
                        <Button onClick={() => refetch()}>
                            Tentar Novamente
                        </Button>
                    </div>
                </div>
            </CustomerLayout>
        );
    }

    const orders = data?.data || [];

    // Empty state
    if (orders.length === 0) {
        return (
            <CustomerLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center space-y-4 max-w-md">
                        <div className="bg-cream-100 rounded-full p-6 inline-block">
                            <Package className="w-16 h-16 text-brown-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-brown-900">Nenhum pedido ainda</h2>
                        <p className="text-brown-600">
                            Quando você fizer seu primeiro pedido, ele aparecerá aqui.
                        </p>
                        <Button onClick={() => window.location.href = '/'}>
                            Explorar Produtos
                        </Button>
                    </div>
                </div>
            </CustomerLayout>
        );
    }

    return (
        <CustomerLayout>
            <main id="main-content" className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-brown-900">Meus Pedidos</h1>
                        <p className="text-brown-600 mt-1">
                            Total de {orders.length} pedido{orders.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => refetch()}
                        disabled={isFetching}
                    >
                        {isFetching ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                Atualizando...
                            </>
                        ) : (
                            <>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Atualizar
                            </>
                        )}
                    </Button>
                </div>

                {/* Orders Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orders.map((order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            onViewDetails={setSelectedOrder}
                        />
                    ))}
                </div>

                {/* Pagination Info */}
                {data?.meta.nextCursor && (
                    <div className="text-center pt-4">
                        <p className="text-sm text-brown-600">
                            Há mais pedidos disponíveis.
                            {/* TODO: Implementar "Carregar mais" com paginação */}
                        </p>
                    </div>
                )}

                {/* Fetching indicator */}
                {isFetching && !isLoading && (
                    <div className="fixed bottom-4 right-4 bg-white border border-cream-300 rounded-full px-4 py-2 shadow-lg">
                        <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-primary-600" />
                            <span className="text-sm font-medium text-brown-900">Atualizando...</span>
                        </div>
                    </div>
                )}
            </main>

            {/* TODO: Modal de detalhes do pedido */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-lg w-full">
                        <h2 className="text-xl font-bold text-brown-900 mb-4">
                            Detalhes do Pedido
                        </h2>
                        <pre className="text-xs bg-cream-50 p-4 rounded-lg overflow-auto">
                            {JSON.stringify(selectedOrder, null, 2)}
                        </pre>
                        <Button
                            className="mt-4 w-full"
                            onClick={() => setSelectedOrder(null)}
                        >
                            Fechar
                        </Button>
                    </div>
                </div>
            )}
        </CustomerLayout>
    );
}
