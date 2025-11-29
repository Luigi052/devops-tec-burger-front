'use client';

import React, { useState, useEffect } from 'react';
import { getProducts } from '@/lib/api/services/products';
import { createOrder, getOrderById } from '@/lib/api/services/orders';
import { Product, Order } from '@/lib/types/api';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils/formatters';

export default function TestBackendPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [orderResult, setOrderResult] = useState<{ orderId: string; status: string } | null>(null);
    const [orderDetails, setOrderDetails] = useState<Order | null>(null);
    const [polling, setPolling] = useState(false);

    // Fetch products on mount
    useEffect(() => {
        async function loadProducts() {
            try {
                const response = await getProducts({ limit: 10 });
                setProducts(response.data);
            } catch (err) {
                setError('Erro ao carregar produtos do Backend. O serviço de catálogo está rodando?');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadProducts();
    }, []);

    // Poll order status if created
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (polling && orderResult?.orderId) {
            interval = setInterval(async () => {
                try {
                    const order = await getOrderById(orderResult.orderId);
                    setOrderDetails(order);
                    if (order.status === 'completed' || order.status === 'failed') {
                        setPolling(false);
                    }
                } catch (err) {
                    console.error('Erro ao buscar status do pedido:', err);
                }
            }, 2000);
        }
        return () => clearInterval(interval);
    }, [polling, orderResult]);

    const handleCreateOrder = async () => {
        if (!selectedProduct) return;

        try {
            setLoading(true);
            setError(null);
            setOrderResult(null);
            setOrderDetails(null);

            const response = await createOrder({
                productId: selectedProduct,
                quantity: quantity,
            });

            setOrderResult(response);
            setPolling(true);
        } catch (err) {
            setError('Erro ao criar pedido no Backend. O serviço de pedidos está rodando?');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl font-bold text-neutral-900 mb-8">Teste de Integração Backend</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Product Selection */}
                    <Card>
                        <CardHeader>
                            <CardTitle>1. Selecione um Produto (Catalog Service)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading && !products.length ? (
                                <p>Carregando produtos...</p>
                            ) : error ? (
                                <p className="text-red-600">{error}</p>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid gap-2 max-h-60 overflow-y-auto">
                                        {products.map((product) => (
                                            <div
                                                key={product.id}
                                                onClick={() => setSelectedProduct(product.id)}
                                                className={`p-3 border rounded-lg cursor-pointer transition-colors ${selectedProduct === product.id
                                                        ? 'border-primary-500 bg-primary-50'
                                                        : 'border-neutral-200 hover:border-primary-300'
                                                    }`}
                                            >
                                                <div className="flex justify-between">
                                                    <span className="font-medium">{product.name}</span>
                                                    <span className="text-neutral-600">R$ {product.price}</span>
                                                </div>
                                                <p className="text-xs text-neutral-400 mt-1">ID: {product.id}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-4 mt-4">
                                        <label className="font-medium">Quantidade:</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={quantity}
                                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                                            className="border rounded p-2 w-20"
                                        />
                                    </div>

                                    <Button
                                        onClick={handleCreateOrder}
                                        disabled={!selectedProduct || loading}
                                        className="w-full mt-4"
                                    >
                                        {loading ? 'Processando...' : 'Criar Pedido no Backend'}
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Order Result */}
                    <Card>
                        <CardHeader>
                            <CardTitle>2. Resultado do Pedido (Order Service)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {!orderResult ? (
                                <p className="text-neutral-500">Nenhum pedido criado ainda.</p>
                            ) : (
                                <div className="space-y-4">
                                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <p className="font-bold text-green-800">Pedido Aceito! (202 Accepted)</p>
                                        <p className="text-sm text-green-700">ID: {orderResult.orderId}</p>
                                        <p className="text-sm text-green-700">Status Inicial: {orderResult.status}</p>
                                    </div>

                                    <div className="border-t pt-4">
                                        <h3 className="font-bold mb-2">Status Atualizado (Polling):</h3>
                                        {orderDetails ? (
                                            <div className="space-y-2">
                                                <p>
                                                    <span className="font-medium">Status:</span>{' '}
                                                    <span
                                                        className={`px-2 py-1 rounded text-xs font-bold ${orderDetails.status === 'completed'
                                                                ? 'bg-green-100 text-green-800'
                                                                : orderDetails.status === 'failed'
                                                                    ? 'bg-red-100 text-red-800'
                                                                    : 'bg-yellow-100 text-yellow-800'
                                                            }`}
                                                    >
                                                        {orderDetails.status.toUpperCase()}
                                                    </span>
                                                </p>
                                                <p>
                                                    <span className="font-medium">Produto ID:</span> {orderDetails.productId}
                                                </p>
                                                <p>
                                                    <span className="font-medium">Quantidade:</span> {orderDetails.quantity}
                                                </p>
                                                <p>
                                                    <span className="font-medium">Preço Unitário:</span> R$ {orderDetails.unitPrice}
                                                </p>
                                                <p className="text-xs text-neutral-400">
                                                    Criado em: {new Date(orderDetails.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="text-neutral-500 animate-pulse">Buscando detalhes...</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
