/**
 * Authentication Types for API
 * 
 * Tipos para autenticação JWT com a API do Tec Burger
 * Nota: A API não define endpoints de auth no OpenAPI spec,
 * então estamos assumindo endpoints padrão comuns
 */

// ============================================
// Request Types
// ============================================

/**
 * Credenciais de login
 */
export interface LoginRequest {
    email: string;
    password: string;
}

/**
 * Dados de registro
 */
export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    phone?: string;
}

/**
 * Request de refresh token
 */
export interface RefreshTokenRequest {
    refreshToken: string;
}

// ============================================
// Response Types
// ============================================

/**
 * Resposta de autenticação bem-sucedida
 */
export interface AuthResponse {
    user: AuthUser;
    token: string; // JWT Bearer token
    refreshToken?: string; // Optional refresh token
    expiresIn?: number; // Token expiration in seconds
}

/**
 * Informações do usuário autenticado
 */
export interface AuthUser {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: 'customer' | 'admin';
    createdAt: string;
}

/**
 * Resposta de refresh token
 */
export interface RefreshTokenResponse {
    token: string;
    expiresIn?: number;
}

// ============================================
// Storage Types
// ============================================

/**
 * Dados armazenados no localStorage
 */
export interface StoredAuthData {
    token: string;
    refreshToken?: string;
    user: AuthUser;
    expiresAt?: number; // Timestamp when token expires
}

// ============================================
// Error Types
// ============================================

/**
 * Erros específicos de autenticação
 */
export enum AuthErrorCode {
    INVALID_CREDENTIALS = 'invalid_credentials',
    EMAIL_ALREADY_EXISTS = 'email_already_exists',
    TOKEN_EXPIRED = 'token_expired',
    TOKEN_INVALID = 'token_invalid',
    UNAUTHORIZED = 'unauthorized',
    FORBIDDEN = 'forbidden',
}

export interface AuthError {
    code: AuthErrorCode;
    message: string;
}
