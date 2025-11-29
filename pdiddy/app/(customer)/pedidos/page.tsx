'use client';

import React from 'react';
import { useOrdersQuery } from '@/lib/hooks/useOrdersApi';
import { SmartOrderCard } from '@/components/orders/SmartOrderCard';
import { CustomerLayout } from '@/components/layout';
import { Button } from '@/components/ui/Button';
import { ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { OrderDetailModal } from '@/components/orders/OrderDetailModal';
import { useState } from 'react';

export default function PedidosPage() {
    const router = useRouter();
    const { data: ordersResponse, isLoading, error } = useOrdersQuery({ limit: 50 });
    const orders = ordersResponse?.data || [];
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

    return (
        <CustomerLayout>
            <div className="min-h-screen bg-neutral-50 py-8">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Meus Pedidos</h1>
                            <p className="text-neutral-600">Acompanhe o status dos seus pedidos recentes</p>
                        </div>
                        <Button onClick={() => router.push('/')} variant="outline">
                            Voltar ao Cardápio
                        </Button>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-64 bg-neutral-200 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    ) : error ? (
                        <div className="p-8 text-center bg-red-50 rounded-2xl border border-red-200">
                            <p className="text-red-800 mb-4">Erro ao carregar pedidos. Tente novamente mais tarde.</p>
                            <Button onClick={() => window.location.reload()} variant="outline" className="border-red-200 text-red-800 hover:bg-red-100">
                                Tentar Novamente
                            </Button>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-3xl border border-cream-200 shadow-sm">
                            <div className="w-20 h-20 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShoppingBag className="w-10 h-10 text-primary-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-brown-900 mb-2">Nenhum pedido encontrado</h2>
                            <p className="text-neutral-600 mb-8 max-w-md mx-auto">
                                Você ainda não realizou nenhum pedido. Que tal experimentar nossos deliciosos hambúrgueres?
                            </p>
                            <Button onClick={() => router.push('/')} variant="primary" size="lg">
                                Fazer meu primeiro pedido
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {orders.map((order) => (
                                <SmartOrderCard
                                    key={order.id}
                                    order={order}
                                    onViewDetails={(o) => setSelectedOrderId(o.id)}
                                />
                            ))}
                        </div>
                    )}

                    {selectedOrderId && (
                        <OrderDetailModal
                            orderId={selectedOrderId}
                            isOpen={!!selectedOrderId}
                            onClose={() => setSelectedOrderId(null)}
                        />
                    )}
                </div>
            </div>
        </CustomerLayout>
    );
}
