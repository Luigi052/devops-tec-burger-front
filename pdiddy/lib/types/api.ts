/**
 * API Types - Baseado na especificação OpenAPI do Tec Burger
 * Estas interfaces correspondem aos schemas definidos em api.yaml
 */

// ============================================
// Base Types
// ============================================

/**
 * Valor monetário com 2 casas decimais (formato: "25.90")
 */
export type Money = string;

/**
 * Status do pedido
 */
export enum OrderStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    FAILED = 'failed'
}

// ============================================
// Product Types
// ============================================

/**
 * Schema do produto
 */
export interface Product {
    id: string; // UUID
    name: string;
    price: Money;
    createdAt: string; // ISO 8601 date-time
    updatedAt: string; // ISO 8601 date-time
}

/**
 * Dados para criar um novo produto
 */
export interface CreateProductData {
    name: string;
    price: Money;
}

/**
 * Parâmetros para listar produtos
 */
export interface GetProductsParams {
    limit?: number; // 1-100, default: 20
    cursor?: string | null;
    sort?: 'created_at_desc' | 'created_at_asc';
}

// ============================================
// Order Types
// ============================================

/**
 * Schema do pedido
 */
export interface Order {
    id: string; // UUID
    productId: string; // UUID
    quantity: number; // minimum: 1
    unitPrice: Money;
    status: OrderStatus;
    createdAt: string; // ISO 8601 date-time
    updatedAt: string; // ISO 8601 date-time
}

/**
 * Dados para criar um novo pedido
 */
export interface CreateOrderData {
    productId: string; // UUID
    quantity: number; // minimum: 1
}

/**
 * Resposta ao criar um pedido (202 Accepted)
 */
export interface CreateOrderResponse {
    orderId: string; // UUID
    status: OrderStatus;
}

/**
 * Parâmetros para listar pedidos
 */
export interface GetOrdersParams {
    limit?: number; // 1-100, default: 20
    cursor?: string | null;
}

// ============================================
// Pagination Types
// ============================================

/**
 * Metadados de paginação (cursor-based)
 */
export interface PageMeta {
    nextCursor: string | null; // null se não houver mais páginas
}

/**
 * Wrapper genérico para respostas paginadas
 */
export interface PaginatedResponse<T> {
    data: T[];
    meta: PageMeta;
}

// ============================================
// Error Types
// ============================================

/**
 * Schema de erro da API
 */
export interface ApiError {
    code: string; // ex: "not_found", "validation_error"
    message: string;
    details?: Record<string, unknown>;
}

/**
 * Tipos de erro conhecidos
 */
export enum ApiErrorCode {
    NOT_FOUND = 'not_found',
    VALIDATION_ERROR = 'validation_error',
    UNAUTHORIZED = 'unauthorized',
    FORBIDDEN = 'forbidden',
    CONFLICT = 'conflict',
    INTERNAL_SERVER_ERROR = 'internal_server_error'
}

// ============================================
// Request/Response Helpers
// ============================================

/**
 * Headers customizados da API
 */
export interface ApiHeaders {
    'X-Request-Id'?: string;
    'Idempotency-Key'?: string;
    Authorization?: string;
}

/**
 * Configuração de requisição
 */
export interface ApiRequestConfig {
    headers?: ApiHeaders;
    timeout?: number;
}
