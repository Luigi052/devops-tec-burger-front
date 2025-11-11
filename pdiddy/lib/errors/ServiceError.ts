/**
 * Custom error class for service layer errors
 */
export class ServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ServiceError';
    
    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ServiceError);
    }
  }

  /**
   * Check if error is a ServiceError
   */
  static isServiceError(error: unknown): error is ServiceError {
    return error instanceof ServiceError;
  }

  /**
   * Create a network error
   */
  static networkError(message = 'Erro de conexão. Verifique sua internet.'): ServiceError {
    return new ServiceError(message, 'NETWORK_ERROR', 0);
  }

  /**
   * Create a validation error
   */
  static validationError(message = 'Dados inválidos.', details?: unknown): ServiceError {
    return new ServiceError(message, 'VALIDATION_ERROR', 400, details);
  }

  /**
   * Create a not found error
   */
  static notFound(message = 'Recurso não encontrado.'): ServiceError {
    return new ServiceError(message, 'NOT_FOUND', 404);
  }

  /**
   * Create an unauthorized error
   */
  static unauthorized(message = 'Você não tem permissão para esta ação.'): ServiceError {
    return new ServiceError(message, 'UNAUTHORIZED', 401);
  }

  /**
   * Create a server error
   */
  static serverError(message = 'Erro interno do servidor.'): ServiceError {
    return new ServiceError(message, 'SERVER_ERROR', 500);
  }

  /**
   * Convert unknown error to ServiceError
   */
  static fromError(error: unknown): ServiceError {
    if (ServiceError.isServiceError(error)) {
      return error;
    }

    if (error instanceof Error) {
      return new ServiceError(error.message, 'UNKNOWN_ERROR', 500);
    }

    return new ServiceError('Ocorreu um erro desconhecido.', 'UNKNOWN_ERROR', 500);
  }
}
