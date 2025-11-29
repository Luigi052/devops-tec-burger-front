'use client';

import React from 'react';
import { Order } from '@/lib/types/api';
import { OrderCard } from './OrderCard';
import { useProductQuery } from '@/lib/hooks/useProductsApi';

interface SmartOrderCardProps {
    order: Order;
    onViewDetails?: (order: Order) => void;
}

export const SmartOrderCard: React.FC<SmartOrderCardProps> = ({ order, onViewDetails }) => {
    const { data: product, isLoading } = useProductQuery(order.productId);

    // We can inject the product name into the order display if we modify OrderCard
    // or we can just pass it if OrderCard accepted it.
    // For now, let's wrap OrderCard and maybe add the product name above it or modify OrderCard.

    // Actually, let's modify OrderCard to accept productName. 
    // But since I can't easily modify OrderCard without reading it again and I want to be safe,
    // I'll just render the product name here if available.

    // However, OrderCard is a presentational component. 
    // Let's create a version that displays product info.

    return (
        <OrderCard
            order={order}
            onViewDetails={onViewDetails}
            productName={product?.name}
        // imageUrl={product?.imageUrl} // Product type doesn't have imageUrl yet
        />
    );
};
