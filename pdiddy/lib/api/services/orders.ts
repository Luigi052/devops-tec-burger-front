/**
 * Orders Service
 * 
 * Encapsula todas as chamadas à API relacionadas a pedidos
 * Endpoints: /api/order/api/v1/orders
 */

import apiClient from '../client';
import type {
    Order,
    CreateOrderData,
    CreateOrderResponse,
    GetOrdersParams,
    PaginatedResponse,
} from '@/lib/types/api';
import { generateIdempotencyKey, storeIdempotencyKey } from '@/lib/utils/idempotency';

// ============================================
// GET Orders (List with Pagination)
// ============================================

/**
 * Lista pedidos com paginação por cursor
 * 
 * @param params - Parâmetros de paginação
 * @returns Resposta paginada com pedidos
 * 
 * @example
 * const { data, meta } = await getOrders({ limit: 20 });
 */
export async function getOrders(
    params?: GetOrdersParams
): Promise<PaginatedResponse<Order>> {
    const response = await apiClient.get<PaginatedResponse<Order>>(
        '/api/order/api/v1/orders',
        {
            params: {
                limit: params?.limit || 20,
                cursor: params?.cursor || undefined,
            },
        }
    );

    return response.data;
}

// ============================================
// GET Order by ID
// ============================================

/**
 * Busca um pedido específico por ID
 * 
 * @param orderId - UUID do pedido
 * @returns Pedido encontrado
 * @throws 404 se pedido não existir
 * 
 * @example
 * const order = await getOrderById('de305d54-75b4-431b-adb2-eb6b9e546014');
 */
export async function getOrderById(orderId: string): Promise<Order> {
    const response = await apiClient.get<Order>(
        `/api/order/api/v1/orders/${orderId}`
    );

    return response.data;
}

// ============================================
// POST Create Order (Async with Idempotency)
// ============================================

/**
 * Cria um novo pedido (operação assíncrona)
 * 
 * **IMPORTANTE:**
 * - Esta operação retorna 202 Accepted (não 201)
 * - O pedido é processado de forma assíncrona
 * - Requer Idempotency-Key obrigatória
 * - Se não fornecida, gera automaticamente
 * 
 * @param data - Dados do pedido (productId, quantity)
 * @param idempotencyKey - Chave única (opcional, gerada automaticamente)
 * @returns Resposta com orderId e status inicial
 * @throws 422 se dados inválidos
 * @throws 409 se idempotency key conflitar
 * 
 * @example
 * const { orderId, status } = await createOrder({
 *   productId: 'product-uuid',
 *   quantity: 2
 * });
 * 
 * // Com idempotency key customizada
 * const result = await createOrder(data, 'my-unique-key-123');
 */
export async function createOrder(
    data: CreateOrderData,
    idempotencyKey?: string
): Promise<CreateOrderResponse> {
    // Gerar idempotency key se não fornecida
    const key = idempotencyKey || generateIdempotencyKey();

    try {
        const response = await apiClient.post<CreateOrderResponse>(
            '/api/order/api/v1/orders',
            data,
            {
                headers: {
                    'Idempotency-Key': key,
                },
            }
        );

        // Armazenar idempotency key com orderId para futuras verificações
        storeIdempotencyKey(key, response.data.orderId);

        return response.data;
    } catch (error) {
        // Se erro 409 (conflito), a mesma chave foi usada com corpo diferente
        // Isso pode indicar uma tentativa de duplicação acidental
        throw error;
    }
}

// ============================================
// Helper Functions
// ============================================

/**
 * Verifica se um pedido está em estado final
 * (completed ou failed)
 */
export function isOrderFinalized(order: Order): boolean {
    return order.status === 'completed' || order.status === 'failed';
}

/**
 * Verifica se um pedido ainda está sendo processado
 * (pending ou processing)
 */
export function isOrderPending(order: Order): boolean {
    return order.status === 'pending' || order.status === 'processing';
}

/**
 * Calcula o total de um pedido baseado em quantidade e preço unitário
 */
export function calculateOrderTotal(order: Order): number {
    const unitPrice = parseFloat(order.unitPrice);
    return unitPrice * order.quantity;
}

/**
 * Formata o status do pedido para exibição
 */
export function formatOrderStatus(status: Order['status']): string {
    const statusMap: Record<Order['status'], string> = {
        pending: 'Pendente',
        processing: 'Em Processamento',
        completed: 'Concluído',
        failed: 'Falhou',
    };

    return statusMap[status] || status;
}

/**
 * Retorna a cor do badge para cada status
 */
export function getOrderStatusColor(status: Order['status']): string {
    const colorMap: Record<Order['status'], string> = {
        pending: 'yellow',
        processing: 'blue',
        completed: 'green',
        failed: 'red',
    };

    return colorMap[status] || 'gray';
}
