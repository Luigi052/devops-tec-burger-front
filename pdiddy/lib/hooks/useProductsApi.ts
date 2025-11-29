/**
 * Products Hooks (React Query)
 * 
 * React Query hooks para gerenciar estado de produtos via API
 * Provê cache automático, loading states e revalidação
 * 
 * MIGRAÇÃO: Este arquivo substitui o useProducts.ts anterior
 */

'use client';

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { getProducts, getProductById, createProduct } from '@/lib/api/services/products';
import type {
    Product,
    CreateProductData,
    GetProductsParams,
    PaginatedResponse
} from '@/lib/types/api';

// ============================================
// Query Keys
// ============================================

export const productKeys = {
    all: ['products'] as const,
    lists: () => [...productKeys.all, 'list'] as const,
    list: (params?: GetProductsParams) => [...productKeys.lists(), params] as const,
    details: () => [...productKeys.all, 'detail'] as const,
    detail: (id: string) => [...productKeys.details(), id] as const,
};

// ============================================
// useProductsQuery - Lista de produtos
// ============================================

/**
 * Hook para listar produtos com paginação
 * 
 * @param params - Parâmetros de paginação e ordenação
 * @param options - Opções adicionais da query
 * @returns Query result com produtos
 * 
 * @example
 * const { data, isLoading, error } = useProductsQuery({ limit: 20 });
 */
export function useProductsQuery(params?: GetProductsParams, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: productKeys.list(params),
        queryFn: () => getProducts(params),
        enabled: options?.enabled ?? true,
        staleTime: 2 * 60 * 1000, // 2 minutos
    });
}

// ============================================
// useInfiniteProducts - Scroll infinito
// ============================================

/**
 * Hook para lista de produtos com paginação infinita
 * 
 * @param params - Parâmetros base (limit, sort)
 * @returns Infinite query result
 * 
 * @example
 * const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteProducts({ limit: 20 });
 */
export function useInfiniteProducts(params?: Omit<GetProductsParams, 'cursor'>) {
    return useInfiniteQuery({
        queryKey: [...productKeys.lists(), 'infinite', params],
        queryFn: ({ pageParam }) => getProducts({ ...params, cursor: pageParam }),
        getNextPageParam: (lastPage) => lastPage.meta.nextCursor,
        initialPageParam: null as string | null,
        staleTime: 2 * 60 * 1000,
    });
}

// ============================================
// useProductQuery - Produto individual
// ============================================

/**
 * Hook para buscar produto específico por ID
 * 
 * @param productId - UUID do produto
 * @param options - Opções adicionais da query
 * @returns Query result com produto
 * 
 * @example
 * const { data: product, isLoading, error } = useProductQuery('product-uuid');
 */
export function useProductQuery(productId: string | undefined, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: productKeys.detail(productId!),
        queryFn: () => getProductById(productId!),
        enabled: !!productId && (options?.enabled ?? true),
        staleTime: 5 * 60 * 1000, // 5 minutos
    });
}

// ============================================
// useCreateProduct - Criar produto (Admin)
// ============================================

/**
 * Hook para criar novo produto
 * 
 * @returns Mutation result
 * 
 * @example
 * const createProductMutation = useCreateProduct({
 *   onSuccess: (product) => console.log('Criado:', product.id)
 * });
 * 
 * createProductMutation.mutate({ name: 'Novo Produto', price: '25.90' });
 */
export function useCreateProduct(options?: {
    onSuccess?: (product: Product) => void;
    onError?: (error: Error) => void;
}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createProduct,

        onSuccess: (data) => {
            // Invalidar cache de listas para recarregar com novo produto
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });

            // Adicionar produto ao cache individual
            queryClient.setQueryData(productKeys.detail(data.id), data);

            // Callback personalizado
            options?.onSuccess?.(data);
        },

        onError: options?.onError,
    });
}

// ============================================
// Prefetch Helpers
// ============================================

/**
 * Prefetch de produtos para melhor performance
 * Útil para pré-carregar dados antes de navegar
 * 
 * @example
 * const prefetch = usePrefetchProducts();
 * prefetch.products({ limit: 20 });
 */
export function usePrefetchProducts() {
    const queryClient = useQueryClient();

    return {
        products: (params?: GetProductsParams) => {
            return queryClient.prefetchQuery({
                queryKey: productKeys.list(params),
                queryFn: () => getProducts(params),
            });
        },

        product: (productId: string) => {
            return queryClient.prefetchQuery({
                queryKey: productKeys.detail(productId),
                queryFn: () => getProductById(productId),
            });
        },
    };
}

// ============================================
// Manual Cache Updates
// ============================================

/**
 * Atualizar manualmente o cache de um produto
 * Útil para optimistic updates
 */
export function useUpdateProductCache() {
    const queryClient = useQueryClient();

    return {
        updateProduct: (productId: string, data: Partial<Product>) => {
            queryClient.setQueryData<Product>(
                productKeys.detail(productId),
                (old) => (old ? { ...old, ...data } : old) as Product
            );
        },

        invalidateProduct: (productId: string) => {
            queryClient.invalidateQueries({ queryKey: productKeys.detail(productId) });
        },

        invalidateAllProducts: () => {
            queryClient.invalidateQueries({ queryKey: productKeys.all });
        },
    };
}
