/**
 * API Client - Cliente HTTP configurado para Tec Burger API
 * 
 * Provê:
 * - Base URL configurável via env
 * - Bearer token authentication
 * - Interceptors para headers e erros
 * - Retry logic
 * - Request/Response logging (dev mode)
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiError, ApiHeaders } from '@/lib/types/api';

// ============================================
// Configuration
// ============================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000', 10);
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // ms

// ============================================
// Create Axios Instance
// ============================================

const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ============================================
// Request Interceptor
// ============================================

apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Add Bearer token if available
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Log request in dev mode
        if (process.env.NODE_ENV === 'development') {
            console.log('🚀 API Request:', {
                method: config.method?.toUpperCase(),
                url: config.url,
                headers: config.headers,
                data: config.data,
            });
        }

        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// ============================================
// Response Interceptor
// ============================================

apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        // Log response in dev mode
        if (process.env.NODE_ENV === 'development') {
            console.log('✅ API Response:', {
                status: response.status,
                url: response.config.url,
                data: response.data,
                headers: response.headers,
            });
        }

        return response;
    },
    async (error: AxiosError<ApiError>) => {
        // Log error in dev mode
        if (process.env.NODE_ENV === 'development') {
            console.error('❌ API Error:', {
                status: error.response?.status,
                url: error.config?.url,
                data: error.response?.data,
            });
        }

        // Handle specific error cases
        if (error.response) {
            const status = error.response.status;

            // 401 Unauthorized - Token inválido ou expirado
            if (status === 401) {
                handleUnauthorized();
            }

            // 403 Forbidden - Sem permissão
            if (status === 403) {
                console.warn('⚠️ Access forbidden:', error.response.data);
            }

            // 404 Not Found
            if (status === 404) {
                console.warn('⚠️ Resource not found:', error.config?.url);
            }

            // 422 Validation Error
            if (status === 422) {
                console.warn('⚠️ Validation error:', error.response.data);
            }

            // 409 Conflict (Idempotency key conflict)
            if (status === 409) {
                console.warn('⚠️ Idempotency conflict:', error.response.data);
            }
        }

        // Retry logic for network errors or 5xx errors
        if (shouldRetry(error)) {
            return retry(error);
        }

        return Promise.reject(error);
    }
);

// ============================================
// Helper Functions
// ============================================

/**
 * Recupera o token de autenticação do localStorage
 */
function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;

    try {
        return localStorage.getItem('tec-burger:auth-token');
    } catch {
        return null;
    }
}

/**
 * Armazena o token de autenticação
 */
export function setAuthToken(token: string): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem('tec-burger:auth-token', token);
    } catch (error) {
        console.error('Failed to store auth token:', error);
    }
}

/**
 * Remove o token de autenticação
 */
export function clearAuthToken(): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.removeItem('tec-burger:auth-token');
    } catch (error) {
        console.error('Failed to clear auth token:', error);
    }
}

/**
 * Lida com erro 401 (não autorizado)
 */
function handleUnauthorized(): void {
    console.warn('⚠️ Unauthorized - Clearing token and redirecting to login');
    clearAuthToken();

    // Redirecionar para login (se estiver no browser)
    if (typeof window !== 'undefined') {
        // TODO: Implementar redirect para página de login
        // window.location.href = '/login';
    }
}

/**
 * Verifica se a requisição deve ser retentada
 */
function shouldRetry(error: AxiosError): boolean {
    if (!error.config) return false;

    // Retry em erros de rede
    if (!error.response) return true;

    // Retry em erros 5xx (servidor)
    const status = error.response.status;
    return status >= 500 && status < 600;
}

/**
 * Implementa retry logic com exponential backoff
 */
async function retry(error: AxiosError): Promise<any> {
    const config = error.config as InternalAxiosRequestConfig & { retryCount?: number };

    if (!config) {
        return Promise.reject(error);
    }

    config.retryCount = config.retryCount || 0;

    if (config.retryCount >= MAX_RETRIES) {
        console.error(`❌ Max retries (${MAX_RETRIES}) exceeded for:`, config.url);
        return Promise.reject(error);
    }

    config.retryCount += 1;

    // Exponential backoff
    const delay = RETRY_DELAY * Math.pow(2, config.retryCount - 1);

    console.log(`🔄 Retrying request (${config.retryCount}/${MAX_RETRIES}) after ${delay}ms:`, config.url);

    await new Promise((resolve) => setTimeout(resolve, delay));

    return apiClient(config);
}

/**
 * Extrai mensagem de erro da resposta da API
 */
export function getApiErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as ApiError | undefined;

        if (apiError?.message) {
            return apiError.message;
        }

        // Fallback para mensagens genéricas
        if (error.response) {
            const status = error.response.status;

            switch (status) {
                case 400:
                    return 'Requisição inválida';
                case 401:
                    return 'Autenticação necessária';
                case 403:
                    return 'Acesso negado';
                case 404:
                    return 'Recurso não encontrado';
                case 422:
                    return 'Erro de validação';
                case 409:
                    return 'Conflito de dados';
                case 500:
                    return 'Erro interno do servidor';
                default:
                    return `Erro ${status}`;
            }
        }

        if (error.code === 'ECONNABORTED') {
            return 'Tempo de resposta excedido';
        }

        if (error.message) {
            return error.message;
        }
    }

    return 'Erro desconhecido';
}

/**
 * Verifica se um erro é de validação (422)
 */
export function isValidationError(error: unknown): boolean {
    return axios.isAxiosError(error) && error.response?.status === 422;
}

/**
 * Verifica se um erro é de não encontrado (404)
 */
export function isNotFoundError(error: unknown): boolean {
    return axios.isAxiosError(error) && error.response?.status === 404;
}

/**
 * Verifica se um erro é de conflito (409)
 */
export function isConflictError(error: unknown): boolean {
    return axios.isAxiosError(error) && error.response?.status === 409;
}

// ============================================
// Export
// ============================================

export default apiClient;
