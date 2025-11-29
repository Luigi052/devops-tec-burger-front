/**
 * Order Status Badge Component
 * 
 * Badge visual para exibir status de pedidos
 * Cores dinâmicas baseadas no status
 */

'use client';

import React from 'react';
import { OrderStatus } from '@/lib/types/api';
import { formatOrderStatus, getOrderStatusColor } from '@/lib/api/services/orders';
import { Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';

interface OrderStatusBadgeProps {
    status: OrderStatus;
    showIcon?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
    status,
    showIcon = true,
    size = 'md',
    className = '',
}) => {
    const statusColor = getOrderStatusColor(status);
    const statusText = formatOrderStatus(status);

    // Mapear cores para classes Tailwind
    const colorClasses = {
        yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        blue: 'bg-blue-100 text-blue-800 border-blue-300',
        green: 'bg-green-100 text-green-800 border-green-300',
        red: 'bg-red-100 text-red-800 border-red-300',
        gray: 'bg-gray-100 text-gray-800 border-gray-300',
    };

    // Tamanhos
    const sizeClasses = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-3 py-1',
        lg: 'text-base px-4 py-1.5',
    };

    const iconSizes = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5',
    };

    // Ícones por status
    const StatusIcon = {
        pending: Clock,
        processing: Loader2,
        completed: CheckCircle,
        failed: XCircle,
    }[status];

    return (
        <span
            className={`
        inline-flex items-center gap-1.5 font-medium rounded-full border
        ${colorClasses[statusColor as keyof typeof colorClasses]}
        ${sizeClasses[size]}
        ${className}
      `}
        >
            {showIcon && StatusIcon && (
                <StatusIcon
                    className={`
            ${iconSizes[size]}
            ${status === 'processing' ? 'animate-spin' : ''}
          `}
                />
            )}
            {statusText}
        </span>
    );
};

/**
 * Order Status Indicator com animação
 * Versão mais visual com pulso para estados ativos
 */
export const OrderStatusIndicator: React.FC<{
    status: OrderStatus;
    showLabel?: boolean;
}> = ({ status, showLabel = true }) => {
    const isPending = status === 'pending' || status === 'processing';

    const dotColors = {
        pending: 'bg-yellow-400',
        processing: 'bg-blue-400',
        completed: 'bg-green-400',
        failed: 'bg-red-400',
    };

    return (
        <div className="flex items-center gap-2">
            <div className="relative flex h-3 w-3">
                {isPending && (
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dotColors[status]} opacity-75`}></span>
                )}
                <span className={`relative inline-flex rounded-full h-3 w-3 ${dotColors[status]}`}></span>
            </div>
            {showLabel && (
                <span className="text-sm font-medium text-brown-700">
                    {formatOrderStatus(status)}
                </span>
            )}
        </div>
    );
};
