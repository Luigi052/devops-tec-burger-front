/**
 * Authentication Service
 * 
 * Serviço de autenticação integrado com a API
 * Gerencia JWT tokens, login, logout, e refresh
 * 
 * NOTA: Como a API não define endpoints de auth no OpenAPI spec,
 * assumimos endpoints padrão. Ajuste conforme necessário.
 */

import apiClient, { setAuthToken as setClientToken, clearAuthToken as clearClientToken } from '../client';
import type {
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    RefreshTokenRequest,
    RefreshTokenResponse,
    StoredAuthData,
    AuthUser,
} from '@/lib/types/auth';

// ============================================
// Constants
// ============================================

const AUTH_STORAGE_KEY = 'tec-burger:auth';
const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutos antes de expirar

// Endpoints assumidos (ajustar conforme a API real)
const AUTH_ENDPOINTS = {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    REFRESH: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
};

// ============================================
// Storage Management
// ============================================

/**
 * Salva dados de autenticação no localStorage
 */
export function saveAuthData(data: StoredAuthData): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
        // Também atualizar o token no API client
        setClientToken(data.token);
    } catch (error) {
        console.error('Failed to save auth data:', error);
    }
}

/**
 * Recupera dados de autenticação do localStorage
 */
export function getAuthData(): StoredAuthData | null {
    if (typeof window === 'undefined') return null;

    try {
        const data = localStorage.getItem(AUTH_STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Failed to get auth data:', error);
        return null;
    }
}

/**
 * Remove dados de autenticação do localStorage
 */
export function clearAuthData(): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        clearClientToken();
    } catch (error) {
        console.error('Failed to clear auth data:', error);
    }
}

/**
 * Verifica se o token está expirado
 */
export function isTokenExpired(authData: StoredAuthData | null): boolean {
    if (!authData || !authData.expiresAt) return true;
    return Date.now() >= authData.expiresAt;
}

/**
 * Verifica se o token precisa ser renovado em breve
 */
export function shouldRefreshToken(authData: StoredAuthData | null): boolean {
    if (!authData || !authData.expiresAt) return false;
    return Date.now() >= authData.expiresAt - TOKEN_REFRESH_THRESHOLD;
}

// ============================================
// Authentication API Calls
// ============================================

/**
 * Faz login do usuário
 * 
 * @param credentials - Email e senha
 * @returns Resposta com token e dados do usuário
 * 
 * @example
 * const { user, token } = await login({ email: 'user@example.com', password: '123456' });
 */
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
        AUTH_ENDPOINTS.LOGIN,
        credentials
    );

    const authData = response.data;

    // Calcular tempo de expiração
    const expiresAt = authData.expiresIn
        ? Date.now() + authData.expiresIn * 1000
        : undefined;

    // Salvar no localStorage
    saveAuthData({
        token: authData.token,
        refreshToken: authData.refreshToken,
        user: authData.user,
        expiresAt,
    });

    return authData;
}

/**
 * Registra um novo usuário
 * 
 * @param data - Dados de registro
 * @returns Resposta com token e dados do usuário
 * 
 * @example
 * const { user, token } = await register({
 *   name: 'João Silva',
 *   email: 'joao@example.com',
 *   password: 'senha123'
 * });
 */
export async function register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
        AUTH_ENDPOINTS.REGISTER,
        data
    );

    const authData = response.data;

    // Calcular tempo de expiração
    const expiresAt = authData.expiresIn
        ? Date.now() + authData.expiresIn * 1000
        : undefined;

    // Salvar no localStorage
    saveAuthData({
        token: authData.token,
        refreshToken: authData.refreshToken,
        user: authData.user,
        expiresAt,
    });

    return authData;
}

/**
 * Faz logout do usuário
 * 
 * **Nota:** Mesmo que a API falhe, limpamos o storage local
 */
export async function logout(): Promise<void> {
    try {
        // Tentar notificar a API
        await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
    } catch (error) {
        console.warn('Logout API call failed, but clearing local data anyway:', error);
    } finally {
        // Sempre limpar dados locais
        clearAuthData();
    }
}

/**
 * Renova o token usando refresh token
 * 
 * @param refreshToken - Refresh token
 * @returns Novo token
 */
export async function refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await apiClient.post<RefreshTokenResponse>(
        AUTH_ENDPOINTS.REFRESH,
        { refreshToken } as RefreshTokenRequest
    );

    const { token, expiresIn } = response.data;

    // Atualizar token no storage
    const authData = getAuthData();
    if (authData) {
        const expiresAt = expiresIn
            ? Date.now() + expiresIn * 1000
            : undefined;

        saveAuthData({
            ...authData,
            token,
            expiresAt,
        });
    }

    return response.data;
}

/**
 * Busca informações do usuário atual
 * 
 * @returns Dados do usuário autenticado
 */
export async function getCurrentUser(): Promise<AuthUser> {
    const response = await apiClient.get<AuthUser>(AUTH_ENDPOINTS.ME);
    return response.data;
}

// ============================================
// Auto-refresh Logic
// ============================================

/**
 * Inicia o auto-refresh de token
 * Verifica periodicamente se o token precisa ser renovado
 * 
 * @returns Função para cancelar o auto-refresh
 */
export function startTokenAutoRefresh(): () => void {
    const intervalId = setInterval(async () => {
        const authData = getAuthData();

        if (!authData || !authData.refreshToken) {
            return;
        }

        if (shouldRefreshToken(authData)) {
            try {
                console.log('🔄 Auto-refreshing token...');
                await refreshToken(authData.refreshToken);
                console.log('✅ Token refreshed successfully');
            } catch (error) {
                console.error('❌ Auto-refresh failed:', error);
                // Token expirou ou inválido - fazer logout
                clearAuthData();
                // Redirecionar para login se necessário
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
            }
        }
    }, 60 * 1000); // Verificar a cada 1 minuto

    // Retornar função para cancelar
    return () => clearInterval(intervalId);
}

// ============================================
// Helper Functions
// ============================================

/**
 * Verifica se o usuário está autenticado
 */
export function isAuthenticated(): boolean {
    const authData = getAuthData();
    return authData !== null && !isTokenExpired(authData);
}

/**
 * Obtém o usuário atual do storage
 */
export function getStoredUser(): AuthUser | null {
    const authData = getAuthData();
    return authData?.user || null;
}

/**
 * Obtém o token atual do storage
 */
export function getStoredToken(): string | null {
    const authData = getAuthData();
    return authData?.token || null;
}

/**
 * Verifica se o usuário é admin
 */
export function isAdmin(): boolean {
    const user = getStoredUser();
    return user?.role === 'admin';
}
