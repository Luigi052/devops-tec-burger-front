/**
 * Products Service
 * 
 * Encapsula todas as chamadas à API relacionadas a produtos
 * Endpoints: /api/catalog/api/v1/products
 */

import apiClient from '../client';
import type {
    Product,
    CreateProductData,
    GetProductsParams,
    PaginatedResponse,
} from '@/lib/types/api';

// ============================================
// GET Products (List with Pagination)
// ============================================

/**
 * Lista produtos com paginação por cursor
 * 
 * @param params - Parâmetros de paginação e ordenação
 * @returns Resposta paginada com produtos
 * 
 * @example
 * const { data, meta } = await getProducts({ limit: 20, sort: 'created_at_desc' });
 */
export async function getProducts(
    params?: GetProductsParams
): Promise<PaginatedResponse<Product>> {
    const response = await apiClient.get<PaginatedResponse<Product>>(
        '/api/catalog/api/v1/products',
        {
            params: {
                limit: params?.limit || 20,
                cursor: params?.cursor || undefined,
                sort: params?.sort || 'created_at_desc',
            },
        }
    );

    return response.data;
}

// ============================================
// GET Product by ID
// ============================================

/**
 * Busca um produto específico por ID
 * 
 * @param productId - UUID do produto
 * @returns Produto encontrado
 * @throws 404 se produto não existir
 * 
 * @example
 * const product = await getProductById('de305d54-75b4-431b-adb2-eb6b9e546014');
 */
export async function getProductById(productId: string): Promise<Product> {
    const response = await apiClient.get<Product>(
        `/api/catalog/api/v1/products/${productId}`
    );

    return response.data;
}

// ============================================
// POST Create Product (Admin only)
// ============================================

/**
 * Cria um novo produto
 * 
 * **Nota:** Esta operação normalmente requer permissões de admin
 * 
 * @param data - Dados do produto (name, price)
 * @returns Produto criado
 * @throws 422 se dados inválidos
 * @throws 401 se não autenticado
 * @throws 403 se não autorizado
 * 
 * @example
 * const product = await createProduct({
 *   name: 'Hambúrguer Especial',
 *   price: '25.90'
 * });
 */
export async function createProduct(data: CreateProductData): Promise<Product> {
    const response = await apiClient.post<Product>(
        '/api/catalog/api/v1/products',
        data
    );

    return response.data;
}

// ============================================
// Helper Functions
// ============================================

/**
 * Formata preço de string Money para número
 * 
 * @param price - Preço no formato "25.90"
 * @returns Preço como número 25.90
 */
export function parseMoney(price: string): number {
    return parseFloat(price);
}

/**
 * Formata número para string Money
 * 
 * @param price - Preço como número 25.9
 * @returns Preço no formato "25.90"
 */
export function formatMoney(price: number): string {
    return price.toFixed(2);
}
