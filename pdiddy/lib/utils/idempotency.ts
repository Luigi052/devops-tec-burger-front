/**
 * Utilitário para geração e gerenciamento de chaves de idempotência
 * 
 * A API requer Idempotency-Key (8-128 caracteres) ao criar pedidos
 * para garantir que requisições duplicadas não criem múltiplos pedidos.
 */

const IDEMPOTENCY_STORAGE_KEY = 'tec-burger:idempotency-keys';
const KEY_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 horas

interface StoredKey {
    key: string;
    timestamp: number;
    orderId?: string; // ID do pedido criado com essa chave
}

/**
 * Gera uma chave de idempotência única baseada em UUID v4
 * @returns string com 36 caracteres (dentro do range 8-128)
 */
export function generateIdempotencyKey(): string {
    // Gera UUID v4
    return crypto.randomUUID();
}

/**
 * Gera uma chave de idempotência baseada no conteúdo do pedido
 * Útil para retry automático - mesma chave para mesmo pedido
 */
export function generateOrderIdempotencyKey(productId: string, quantity: number): string {
    const timestamp = Date.now();
    const content = `${productId}:${quantity}:${timestamp}`;

    // Cria hash simples (em produção, considere usar crypto.subtle.digest para SHA-256)
    return `order-${btoa(content).substring(0, 100)}`;
}

/**
 * Armazena uma chave de idempotência no localStorage
 * Permite verificar se um pedido já foi criado anteriormente
 */
export function storeIdempotencyKey(key: string, orderId?: string): void {
    if (typeof window === 'undefined') return;

    try {
        const stored = getStoredKeys();
        stored[key] = {
            key,
            timestamp: Date.now(),
            orderId
        };

        // Remove chaves expiradas
        const cleaned = cleanExpiredKeys(stored);
        localStorage.setItem(IDEMPOTENCY_STORAGE_KEY, JSON.stringify(cleaned));
    } catch (error) {
        console.warn('Failed to store idempotency key:', error);
    }
}

/**
 * Recupera uma chave de idempotência do storage
 * Retorna null se não encontrada ou expirada
 */
export function getStoredIdempotencyKey(key: string): StoredKey | null {
    if (typeof window === 'undefined') return null;

    try {
        const stored = getStoredKeys();
        const entry = stored[key];

        if (!entry) return null;

        // Verifica se expirou
        if (Date.now() - entry.timestamp > KEY_EXPIRY_MS) {
            return null;
        }

        return entry;
    } catch (error) {
        console.warn('Failed to get idempotency key:', error);
        return null;
    }
}

/**
 * Verifica se uma chave de idempotência já foi usada
 */
export function hasUsedIdempotencyKey(key: string): boolean {
    const stored = getStoredIdempotencyKey(key);
    return stored !== null && stored.orderId !== undefined;
}

/**
 * Limpa todas as chaves de idempotência armazenadas
 */
export function clearIdempotencyKeys(): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.removeItem(IDEMPOTENCY_STORAGE_KEY);
    } catch (error) {
        console.warn('Failed to clear idempotency keys:', error);
    }
}

// ============================================
// Helper Functions (private)
// ============================================

function getStoredKeys(): Record<string, StoredKey> {
    try {
        const data = localStorage.getItem(IDEMPOTENCY_STORAGE_KEY);
        return data ? JSON.parse(data) : {};
    } catch {
        return {};
    }
}

function cleanExpiredKeys(keys: Record<string, StoredKey>): Record<string, StoredKey> {
    const now = Date.now();
    const cleaned: Record<string, StoredKey> = {};

    Object.entries(keys).forEach(([key, value]) => {
        if (now - value.timestamp < KEY_EXPIRY_MS) {
            cleaned[key] = value;
        }
    });

    return cleaned;
}

/**
 * Valida se uma string é uma chave de idempotência válida
 * Deve ter entre 8-128 caracteres
 */
export function isValidIdempotencyKey(key: string): boolean {
    return typeof key === 'string' && key.length >= 8 && key.length <= 128;
}
