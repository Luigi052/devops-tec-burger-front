/**
 * Orders Hooks (React Query)
 * 
 * React Query hooks para gerenciar estado de pedidos
 * Inclui polling automático para pedidos pendentes
 */

'use client';

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { getOrders, getOrderById, createOrder, isOrderPending } from '@/lib/api/services/orders';
import type {
    Order,
    CreateOrderData,
    CreateOrderResponse,
    GetOrdersParams,
} from '@/lib/types/api';

// ============================================
// Query Keys
// ============================================

export const orderKeys = {
    all: ['orders'] as const,
    lists: () => [...orderKeys.all, 'list'] as const,
    list: (params?: GetOrdersParams) => [...orderKeys.lists(), params] as const,
    details: () => [...orderKeys.all, 'detail'] as const,
    detail: (id: string) => [...orderKeys.details(), id] as const,
};

// ============================================
// useOrdersQuery - Lista de pedidos
// ============================================

/**
 * Hook para listar pedidos com paginação
 * 
 * @param params - Parâmetros de paginação
 * @returns Query result com pedidos
 * 
 * @example
 * const { data, isLoading, error } = useOrdersQuery({ limit: 20 });
 */
export function useOrdersQuery(params?: GetOrdersParams) {
    return useQuery({
        queryKey: orderKeys.list(params),
        queryFn: () => getOrders(params),
        staleTime: 30 * 1000, // 30 segundos - pedidos mudam mais rápido
    });
}

// ============================================
// useInfiniteOrders - Scroll infinito
// ============================================

/**
 * Hook para lista de pedidos com paginação infinita
 * 
 * @param params - Parâmetros base (limit)
 * @returns Infinite query result
 * 
 * @example
 * const { data, fetchNextPage, hasNextPage } = useInfiniteOrders({ limit: 20 });
 */
export function useInfiniteOrders(params?: Omit<GetOrdersParams, 'cursor'>) {
    return useInfiniteQuery({
        queryKey: [...orderKeys.lists(), 'infinite', params],
        queryFn: ({ pageParam }) => getOrders({ ...params, cursor: pageParam }),
        getNextPageParam: (lastPage) => lastPage.meta.nextCursor,
        initialPageParam: null as string | null,
        staleTime: 30 * 1000,
    });
}

// ============================================
// useOrderQuery - Pedido individual com polling
// ============================================

/**
 * Hook para buscar pedido específico por ID
 * 
 * **IMPORTANTE:** Implementa polling automático para pedidos pendentes
 * - Pedidos "pending" ou "processing" são refetched a cada 5s
 * - Pedidos "completed" ou "failed" param de fazer polling
 * 
 * @param orderId - UUID do pedido
 * @param options - Opções adicionais
 * @returns Query result com pedido
 * 
 * @example
 * const { data: order, isLoading } = useOrderQuery('order-uuid');
 */
export function useOrderQuery(
    orderId: string | undefined,
    options?: {
        enabled?: boolean;
        enablePolling?: boolean; // Habilitar polling (default: true)
    }
) {
    return useQuery({
        queryKey: orderKeys.detail(orderId!),
        queryFn: () => getOrderById(orderId!),
        enabled: !!orderId && (options?.enabled ?? true),
        staleTime: 10 * 1000, // 10 segundos

        // Polling automático para pedidos pendentes
        refetchInterval: (query) => {
            // Desabilitar polling se opção for false
            if (options?.enablePolling === false) return false;

            const order = query.state.data as Order | undefined;

            // Se pedido ainda está pendente/processando, fazer polling a cada 5s
            if (order && isOrderPending(order)) {
                return 5000; // 5 segundos
            }

            // Caso contrário, não fazer polling
            return false;
        },
    });
}

// ============================================
// useCreateOrder - Criar pedido com idempotency
// ============================================

/**
 * Hook para criar novo pedido
 * 
 * **IMPORTANTE:**
 * - Gera idempotency key automaticamente
 * - Armazena key no localStorage
 * - Retorna 202 Accepted (operação assíncrona)
 * - Invalida cache de listas após criação
 * 
 * @param options - Callbacks de sucesso/erro
 * @returns Mutation result
 * 
 * @example
 * const createOrderMutation = useCreateOrder({
 *   onSuccess: ({ orderId }) => {
 *     console.log('Pedido criado:', orderId);
 *     router.push(`/pedido/${orderId}`);
 *   }
 * });
 * 
 * createOrderMutation.mutate({
 *   productId: 'product-uuid',
 *   quantity: 2
 * });
 */
export function useCreateOrder(options?: {
    onSuccess?: (response: CreateOrderResponse) => void;
    onError?: (error: Error) => void;
    idempotencyKey?: string; // Chave customizada (opcional)
}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateOrderData) =>
            createOrder(data, options?.idempotencyKey),

        onSuccess: (response) => {
            // Invalidar cache de listas para recarregar
            queryClient.invalidateQueries({ queryKey: orderKeys.lists() });

            // Pré-popular cache do pedido individual (estado inicial)
            // Nota: Fazemos polling depois para pegar o estado atualizado
            queryClient.setQueryData(orderKeys.detail(response.orderId), {
                id: response.orderId,
                status: response.status,
                // Outros campos virão do polling
            });

            // Callback personalizado
            options?.onSuccess?.(response);
        },

        onError: options?.onError,
    });
}

// ============================================
// Prefetch Helpers
// ============================================

/**
 * Prefetch de pedidos para melhor performance
 * 
 * @example
 * const prefetch = usePrefetchOrders();
 * prefetch.orders({ limit: 20 });
 */
export function usePrefetchOrders() {
    const queryClient = useQueryClient();

    return {
        orders: (params?: GetOrdersParams) => {
            return queryClient.prefetchQuery({
                queryKey: orderKeys.list(params),
                queryFn: () => getOrders(params),
            });
        },

        order: (orderId: string) => {
            return queryClient.prefetchQuery({
                queryKey: orderKeys.detail(orderId),
                queryFn: () => getOrderById(orderId),
            });
        },
    };
}

// ============================================
// Manual Cache Updates
// ============================================

/**
 * Atualizar manualmente o cache de um pedido
 * Útil para optimistic updates ou atualização de status
 */
export function useUpdateOrderCache() {
    const queryClient = useQueryClient();

    return {
        updateOrder: (orderId: string, data: Partial<Order>) => {
            queryClient.setQueryData<Order>(
                orderKeys.detail(orderId),
                (old) => (old ? { ...old, ...data } : old) as Order
            );
        },

        invalidateOrder: (orderId: string) => {
            queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
        },

        invalidateAllOrders: () => {
            queryClient.invalidateQueries({ queryKey: orderKeys.all });
        },

        /**
         * Força refetch de um pedido (útil após criar)
         */
        refetchOrder: (orderId: string) => {
            return queryClient.refetchQueries({ queryKey: orderKeys.detail(orderId) });
        },
    };
}

// ============================================
// Custom Hook: Create Order with Cart
// ============================================

/**
 * Hook combinado para criar pedido a partir do carrinho
 * Simplifica o fluxo de checkout
 * 
 * @example
 * const { createOrderFromCart, isCreating } = useCreateOrderFromCart({
 *   onSuccess: (orderId) => router.push(`/pedido/${orderId}`)
 * });
 * 
 * // Criar pedido
 * createOrderFromCart([
 *   { productId: 'uuid-1', quantity: 2 },
 *   { productId: 'uuid-2', quantity: 1 }
 * ]);
 */
export function useCreateOrderFromCart(options?: {
    onSuccess?: (orderIds: string[]) => void;
    onError?: (error: Error) => void;
}) {
    const createOrderMutation = useCreateOrder();

    const createOrderFromCart = async (items: CreateOrderData[]) => {
        try {
            // Criar pedido para cada item
            // Nota: A API só aceita 1 produto por pedido
            const promises = items.map(item => createOrderMutation.mutateAsync(item));

            const results = await Promise.all(promises);
            const orderIds = results.map(r => r.orderId);

            options?.onSuccess?.(orderIds);

            return orderIds;
        } catch (error) {
            options?.onError?.(error as Error);
            throw error;
        }
    };

    return {
        createOrderFromCart,
        isCreating: createOrderMutation.isPending,
        error: createOrderMutation.error,
    };
}
