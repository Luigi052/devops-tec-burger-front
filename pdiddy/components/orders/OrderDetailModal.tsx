'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { useOrderQuery } from '@/lib/hooks/useOrdersApi';
import { useProductQuery } from '@/lib/hooks/useProductsApi';
import { OrderStatusIndicator } from './OrderStatusBadge';
import { formatCurrency } from '@/lib/utils/formatters';
import { Package, Clock, MapPin, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface OrderDetailModalProps {
    orderId: string;
    isOpen: boolean;
    onClose: () => void;
}

export function OrderDetailModal({ orderId, isOpen, onClose }: OrderDetailModalProps) {
    const { data: order, isLoading: isOrderLoading } = useOrderQuery(orderId, {
        enablePolling: true,
        enabled: isOpen
    });

    const { data: product, isLoading: isProductLoading } = useProductQuery(order?.productId, {
        enabled: !!order?.productId && isOpen
    });

    const isLoading = isOrderLoading || (!!order && isProductLoading);

    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Detalhes do Pedido #${orderId.slice(0, 8).toUpperCase()}`}
            size="lg"
        >
            {isLoading && !order ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4" />
                    <p className="text-neutral-600">Carregando detalhes...</p>
                </div>
            ) : order ? (
                <div className="space-y-8">
                    {/* Status Banner */}
                    <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-100">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-neutral-500">Status Atual</span>
                            <span className="text-sm text-neutral-500">
                                Atualizado em: {new Date().toLocaleTimeString()}
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <OrderStatusIndicator status={order.status} showLabel={true} />
                        </div>
                        <p className="mt-4 text-sm text-neutral-600">
                            {order.status === 'pending' && 'Aguardando confirmação do restaurante...'}
                            {order.status === 'processing' && 'Seu pedido está sendo preparado com carinho!'}
                            {order.status === 'completed' && 'Pedido concluído com sucesso!'}
                            {order.status === 'failed' && 'Houve um problema com seu pedido.'}
                        </p>
                    </div>

                    {/* Product Details */}
                    <div>
                        <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                            <Package className="w-5 h-5 text-primary-600" />
                            Itens do Pedido
                        </h3>
                        <div className="bg-white border border-neutral-200 rounded-xl p-4 flex gap-4">
                            <div className="w-20 h-20 bg-neutral-100 rounded-lg flex-shrink-0 overflow-hidden">
                                {/* Placeholder since Product doesn't have imageUrl yet */}
                                <div className="w-full h-full flex items-center justify-center text-neutral-400">
                                    <Package className="w-8 h-8" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-neutral-900">{product?.name || 'Produto indisponível'}</h4>
                                <p className="text-sm text-neutral-500 mt-1">Quantidade: {order.quantity}x</p>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-sm text-neutral-600">Preço Unitário: {formatCurrency(parseFloat(order.unitPrice))}</span>
                                    <span className="font-bold text-primary-600">{formatCurrency(parseFloat(order.unitPrice) * order.quantity)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-bold text-neutral-900 mb-3 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-neutral-500" />
                                Data e Hora
                            </h3>
                            <p className="text-sm text-neutral-600">
                                {new Date(order.createdAt).toLocaleString('pt-BR')}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-neutral-900 mb-3 flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-neutral-500" />
                                Pagamento
                            </h3>
                            <p className="text-sm text-neutral-600">
                                Pagamento na entrega
                            </p>
                        </div>
                    </div>

                    {/* Total */}
                    <div className="border-t border-neutral-200 pt-6 flex justify-between items-center">
                        <span className="text-lg font-bold text-neutral-900">Total do Pedido</span>
                        <span className="text-2xl font-bold text-primary-600">
                            {formatCurrency(parseFloat(order.unitPrice) * order.quantity)}
                        </span>
                    </div>

                    <div className="flex justify-end">
                        <Button onClick={onClose} variant="outline">
                            Fechar
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 text-red-600">
                    Erro ao carregar pedido.
                </div>
            )}
        </Modal>
    );
}
