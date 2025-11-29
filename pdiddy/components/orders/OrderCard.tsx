/**
 * Order Card Component
 * 
 * Card para exibir informações resumidas de um pedido
 * Usado em listas de pedidos
 */

'use client';

import React from 'react';
import { Order } from '@/lib/types/api';
import { OrderStatusBadge, OrderStatusIndicator } from './OrderStatusBadge';
import { calculateOrderTotal } from '@/lib/api/services/orders';
import { Button } from '@/components/ui/Button';
import { ChevronRight, Package } from 'lucide-react';

interface OrderCardProps {
    order: Order;
    onViewDetails?: (order: Order) => void;
    showActions?: boolean;
    productName?: string;
    imageUrl?: string;
}

export const OrderCard: React.FC<OrderCardProps> = ({
    order,
    onViewDetails,
    showActions = true,
    productName,
    imageUrl,
}) => {
    const total = calculateOrderTotal(order);
    const formattedDate = new Date(order.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });

    return (
        <div className="bg-white border border-cream-300 rounded-2xl p-6 hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-primary-100 rounded-xl p-3 overflow-hidden relative">
                        {imageUrl ? (
                            <img src={imageUrl} alt={productName || 'Produto'} className="w-6 h-6 object-cover" />
                        ) : (
                            <Package className="w-6 h-6 text-primary-600" />
                        )}
                    </div>
                    <div>
                        <p className="text-sm text-brown-600">Pedido #{order.id.slice(0, 8).toUpperCase()}</p>
                        {productName && (
                            <p className="font-bold text-brown-900">{productName}</p>
                        )}
                    </div>
                </div>
                <OrderStatusBadge status={order.status} />
            </div>

            {/* Divider */}
            <div className="border-t border-cream-200 my-4"></div>

            {/* Details */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-brown-600">Data do Pedido</span>
                    <span className="text-sm font-medium text-brown-900">{formattedDate}</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-sm text-brown-600">Quantidade</span>
                    <span className="text-sm font-medium text-brown-900">{order.quantity}x</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-sm text-brown-600">Preço Unitário</span>
                    <span className="text-sm font-medium text-brown-900">R$ {order.unitPrice}</span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-cream-200">
                    <span className="text-base font-bold text-brown-900">Total</span>
                    <span className="text-lg font-bold text-primary-600">
                        R$ {total.toFixed(2)}
                    </span>
                </div>
            </div>

            {/* Status Indicator */}
            <div className="mt-4 p-3 bg-cream-50 rounded-xl">
                <OrderStatusIndicator status={order.status} showLabel={true} />
            </div>

            {/* Actions */}
            {showActions && (
                <div className="mt-4 pt-4 border-t border-cream-200">
                    <Button
                        variant="outline"
                        className="w-full justify-between"
                        onClick={() => onViewDetails?.(order)}
                    >
                        Ver Detalhes
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            )}
        </div>
    );
};

/**
 * Compact Order Card - versão simplificada
 */
export const OrderCardCompact: React.FC<{
    order: Order;
    onClick?: () => void;
}> = ({ order, onClick }) => {
    const total = calculateOrderTotal(order);

    return (
        <button
            onClick={onClick}
            className="w-full bg-white border border-cream-300 rounded-xl p-4 hover:shadow-md transition-all text-left"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-primary-100 rounded-lg p-2">
                        <Package className="w-4 h-4 text-primary-600" />
                    </div>
                    <div>
                        <p className="text-xs text-brown-600">#{order.id.slice(0, 8).toUpperCase()}</p>
                        <p className="font-semibold text-brown-900">R$ {total.toFixed(2)}</p>
                    </div>
                </div>
                <OrderStatusIndicator status={order.status} showLabel={false} />
            </div>
        </button>
    );
};
